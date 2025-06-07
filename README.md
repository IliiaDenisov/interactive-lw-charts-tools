# TypeScript library with modern drawing tools and technical indicators :chart_with_upwards_trend:
**interactive-lw-charts-tools** offers a collection of drawing tools and technical indicators built on top of the [Lightweight-Charts](https://www.tradingview.com/lightweight-charts/) library.
**interactive-lw-charts-tools** includes the following drawing tools:

| Tool        | Names                                                                                            |
| :---------------------- | :------------------------------------------------------------------------------------------------|
| Drawing tools          | **Trend line**, **Time line**, **Polyline**, **Curve**, **Fibonacci Spiral**, **Fibonacci Retracement**, **Fibonacci Wedge** |
| Indicators             | **Bollinger Bands**, **Simple Moving Average**                                                           |


# Contacts :mailbox_with_mail:
You can contact the author using the following methods:
- E-mail: iliia_denisov@outlook.de
- LinkedIn: https://www.linkedin.com/in/iliia-denisov-14a87a205/

# Installation :hammer:
npm install interactive-lw-charts-tools

# Usage :pushpin:
You can create any of the drawing tools present in the library as shown in the example below:
```typescript
import type { FibSpiralDrawingTool } from "interactive-lw-charts-tools";
let fibSpiralTool = new FibSpiralDrawingTool(chart, series);
series.attachPrimitive(tool);

// activating drawing process for the FibSpiralDrawingTool instrument
fibSpiralTool.startDrawing();

// if for some reason the drawing process is to be canceled, the function below can be called
fibSpiralTool.stopDrawing();
```
It is also possible to create an indicator as follows:
```typescript
import type { BandsIndicator } from "interactive-lw-charts-tools";
const bandsIndicator = new BandsIndicator();
series.attachPrimitive(bandsIndicator);
chart.timeScale().fitContent(); 
```
# Examples
Collection of drawing tools of **interactive-lw-charts-tools** library added on a chart:

![Drawing tools](https://github.com/IliiaDenisov/interactive-lw-charts-tools/blob/main/readme_src/DrawingTools.png?raw=true)

Simple Moving Average indicator:

![Drawing tools](https://github.com/IliiaDenisov/interactive-lw-charts-tools/blob/main/readme_src/SMA.png?raw=true)

Bollinger Bands indicator:

![Drawing tools](https://github.com/IliiaDenisov/interactive-lw-charts-tools/blob/main/readme_src/BollingerBands.png?raw=true)
