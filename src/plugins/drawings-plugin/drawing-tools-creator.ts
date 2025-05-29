import { IChartApi, ISeriesApi, ISeriesPrimitive, SeriesType } from "lightweight-charts";
import { TrendLineDrawingTool } from "./trend-line";
import { TimeLineDrawingTool } from "./time-line";
import { TriangleDrawingTool } from "./triangle";
import { PolylineDrawingTool } from "./polyline";
import { CurveDrawingTool } from "./curve";
import { FibWedgeDrawingTool } from "./fibonacci-wedge";
import { FibSpiralDrawingTool } from "./fibonacci-spiral";
import { FibChannelDrawingTool } from "./fibonacci-channel";
import { RectangleDrawingTool } from "./rectangle";


export enum DrawingTypes {
    TrendLine,
    TimeLine,
    Triangle,
    Rectangle,
    FibonacciChannel,
    FibonacciSpiral,
    FibonacciWedge,
    Curve,
    Polyline,
}

export function createDrawingTool(drawingType: DrawingTypes, chart: IChartApi, series: ISeriesApi<SeriesType>) {
    let drawingTool;

    switch (drawingType) {
        case DrawingTypes.TrendLine:
            drawingTool = new TrendLineDrawingTool(chart, series, {});
            break;
        case DrawingTypes.TimeLine:
            drawingTool = new TimeLineDrawingTool(chart, series, {});
            break;
        case DrawingTypes.Triangle:
            drawingTool = new TriangleDrawingTool(chart, series, {});
            break;
        case DrawingTypes.Rectangle:
            drawingTool = new RectangleDrawingTool(chart, series, {});
            break;
        case DrawingTypes.FibonacciChannel:
            drawingTool = new FibChannelDrawingTool(chart, series, {});
            break;
        case DrawingTypes.FibonacciSpiral:
            drawingTool = new FibSpiralDrawingTool(chart, series, {});
            break;
        case DrawingTypes.FibonacciWedge:
            drawingTool = new FibWedgeDrawingTool(chart, series, {});
            break;
        case DrawingTypes.Curve:
            drawingTool = new CurveDrawingTool(chart, series, {});
            break;
        case DrawingTypes.Polyline:
            drawingTool = new PolylineDrawingTool(chart, series, {});
            break;
    }

    series.attachPrimitive(drawingTool as ISeriesPrimitive);
}