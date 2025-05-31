import {
  BarData,
  LineData,
  SeriesDataItemTypeMap,
  SeriesType,
  Time,
} from "lightweight-charts";

export interface SMAData {
  time: Time;
  average: number;
}

export interface BollingerBandsData {
  time: Time;
  average: number;
  upperBand: number;
  lowerBand: number;
}

export function extractPrice(
  dataPoint: SeriesDataItemTypeMap[SeriesType]
): number | undefined {
  if ((dataPoint as BarData).close) return (dataPoint as BarData).close;
  if ((dataPoint as LineData).value) return (dataPoint as LineData).value;
  return undefined;
}

export function calculateSMA(
  seriesData: SeriesDataItemTypeMap[SeriesType][],
  smaDepth: number
): SMAData[] {
  const smaData: SMAData[] = new Array<SMAData>(seriesData.length - smaDepth);
  const seriesDataPriceCache: number[] = new Array(seriesData.length);
  let index = 0;

  seriesData.forEach((d) => {
    const price = extractPrice(d);
    if (price === undefined) return;

    seriesDataPriceCache[index] = price;

    if (index >= smaDepth) {
      let avgPrice: number = 0;
      for (let i = index - 1; i > index - smaDepth; i--) {
        avgPrice += seriesDataPriceCache[i];
      }
      avgPrice /= smaDepth == 0 ? 1.0 : smaDepth;

      smaData[index - smaDepth] = {
        average: avgPrice,
        time: d.time,
      };
    }
    index += 1;
  });
  smaData.length = Math.max(0, index - smaDepth);
  return smaData;
}

export function calculateBollingerBands(
  seriesData: SeriesDataItemTypeMap[SeriesType][],
  smaDepth: number
) {
  const bandsData: BollingerBandsData[] = new Array<BollingerBandsData>(seriesData.length - smaDepth);
  const seriesDataPriceCache: number[] = new Array(seriesData.length);
  let index = 0;
  const k: number = 2.0;

  seriesData.forEach((d) => {
    const price = extractPrice(d);
    if (price === undefined) return;

    seriesDataPriceCache[index] = price;

    if (index >= smaDepth) {
      let avgPrice: number = 0;
      for (let i = index - 1; i > index - smaDepth; i--) {
        avgPrice += seriesDataPriceCache[i];
      }
      avgPrice /= smaDepth == 0 ? 1.0 : smaDepth;

      let std: number = 0;
      for (let i = index - 1; i > index - smaDepth; i--) {
        std += (seriesDataPriceCache[i] - avgPrice) * (seriesDataPriceCache[i] - avgPrice);
      }
      std /= smaDepth == 0 ? 1.0 : smaDepth;
      std = Math.sqrt(std);

      bandsData[index - smaDepth] = {
        average: avgPrice,
        lowerBand: avgPrice - k * std,
        upperBand: avgPrice + k * std,
        time: d.time,
      };
    }
    index += 1;
  });
  bandsData.length = Math.max(0, index - smaDepth);
  return bandsData;
}
