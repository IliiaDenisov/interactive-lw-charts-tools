import { CanvasRenderingTarget2D } from "fancy-canvas";
import type {
  Coordinate,
  DataChangedScope,
  ISeriesPrimitive,
  IPrimitivePaneRenderer,
  IPrimitivePaneView,
  SeriesAttachedParameter,
  SeriesDataItemTypeMap,
  SeriesType,
  Time,
} from "lightweight-charts";
import { ChartInstrumentBase } from "../chart-instrument-base.ts";
import { BollingerBandsData, calculateBollingerBands, extractPrice, SMAData } from "./indicator-helper.ts";
import { cloneReadonly } from "../../helpers/simple-clone.ts";
import { ClosestTimeIndexFinder } from "../../helpers/closest-index.ts";

interface BandRendererData {
  x: Coordinate | number;
  average: Coordinate | number;
  upperBand: Coordinate | number;
  lowerBand: Coordinate | number;
}

class BandsIndicatorPaneRenderer implements IPrimitivePaneRenderer {
  _viewData: BandViewData;
  constructor(data: BandViewData) {
    this._viewData = data;
  }
  draw() {}
  drawBackground(target: CanvasRenderingTarget2D) {
    const points: BandRendererData[] = this._viewData.data;
    target.useBitmapCoordinateSpace((scope) => {
      const ctx = scope.context;
      ctx.scale(scope.horizontalPixelRatio, scope.verticalPixelRatio);

      ctx.lineWidth = this._viewData.options.lineWidth;
      ctx.beginPath();
      const linesAvg = new Path2D();
      linesAvg.moveTo(points[0].x, points[0].average);
      for (const point of points) {
        linesAvg.lineTo(point.x, point.average);
      }

      // drawing down lines
      ctx.lineWidth = this._viewData.options.lineWidth;
      ctx.strokeStyle = this._viewData.options.lineAverageColor;
      ctx.stroke(linesAvg);

      ctx.lineWidth = this._viewData.options.lineWidth;
      ctx.beginPath();
      const region = new Path2D();
      const linesUp = new Path2D();
      const linesDown = new Path2D();
      region.moveTo(points[0].x, points[0].upperBand);
      linesUp.moveTo(points[0].x, points[0].upperBand);
      for (const point of points) {
        region.lineTo(point.x, point.upperBand);
        linesUp.lineTo(point.x, point.upperBand);
      }
      const end = points.length - 1;
      region.lineTo(points[end].x, points[end].lowerBand);
      for (let i = points.length - 2; i >= 0; i--) {
        region.lineTo(points[i].x, points[i].lowerBand);
        linesDown.lineTo(points[i].x, points[i].lowerBand);
      }
      region.lineTo(points[0].x, points[0].upperBand);
      region.closePath();

      // drawing up lines
      ctx.strokeStyle = this._viewData.options.lineUpColor;
      ctx.stroke(linesUp);

      // drawing down lines
      ctx.strokeStyle = this._viewData.options.lineDownColor;
      ctx.stroke(linesDown);
      
	  ctx.fillStyle = this._viewData.options.fillColor;
      ctx.fill(region);
    });
  }
}

interface BandViewData {
  data: BandRendererData[];
  options: Required<BandsIndicatorOptions>;
}

class BandsIndicatorPaneView implements IPrimitivePaneView {
  _source: BandsIndicator;
  _data: BandViewData;

  constructor(source: BandsIndicator) {
    this._source = source;
    this._data = {
      data: [],
      options: this._source._options,
    };
  }

  update() {
    const series = this._source.series;
    const timeScale = this._source.chart.timeScale();
    this._data.data = this._source._bandsData.map((d) => {
      return {
        x: timeScale.timeToCoordinate(d.time) ?? -100,
		average: series.priceToCoordinate(d.average) ?? -100, 
        upperBand: series.priceToCoordinate(d.upperBand) ?? -100,
        lowerBand: series.priceToCoordinate(d.lowerBand) ?? -100,
      };
    });
  }

  renderer() {
    return new BandsIndicatorPaneRenderer(this._data);
  }
}

export interface BandsIndicatorOptions {
  lineAverageColor?: string;
  lineUpColor?: string;
  lineDownColor?: string;
  fillColor?: string;
  lineWidth?: number;
}

const defaults: Required<BandsIndicatorOptions> = {
  lineAverageColor: "rgba(255, 255, 0, 0.96)",
  lineUpColor: "rgb(200, 25, 25)",
  lineDownColor: "rgb(25, 200, 100)",
  fillColor: "rgba(8, 236, 244, 0.36)",
  lineWidth: 3,
};

export class BandsIndicator
  extends ChartInstrumentBase
  implements ISeriesPrimitive<Time>
{
  _paneViews: BandsIndicatorPaneView[];
  _seriesData: SeriesDataItemTypeMap[SeriesType][] = [];
  _bandsData: BollingerBandsData[] = [];
  _options: Required<BandsIndicatorOptions>;
  _timeIndices: ClosestTimeIndexFinder<{ time: number }>;
  _depth: number = 50;

  constructor(options: BandsIndicatorOptions = {}) {
    super();
    this._options = { ...defaults, ...options };
    this._paneViews = [new BandsIndicatorPaneView(this)];
    this._timeIndices = new ClosestTimeIndexFinder([]);
  }

  updateAllViews() {
    this._paneViews.forEach((pw) => pw.update());
  }

  paneViews() {
    return this._paneViews;
  }

  attached(p: SeriesAttachedParameter<Time>): void {
    super.attached(p);
    this.dataUpdated("full");
  }

  dataUpdated(scope: DataChangedScope) {
    this._seriesData = cloneReadonly(this.series.data());
    this._bandsData = calculateBollingerBands(this._seriesData, this._depth);
    if (scope === "full") {
      this._timeIndices = new ClosestTimeIndexFinder(
        this._seriesData as { time: number }[]
      );
    }
  }
}
