// src/lib/market/chart-calculations.ts
import type { CandlestickPoint } from "@/lib/market/contracts";

export type TpoLevel = {
  price: number;
  count: number;
  letters: string;
  isPointOfControl: boolean;
};

export type PointAndFigureBox = {
  column: number;
  price: number;
  direction: "up" | "down";
};

export function calculateSimpleMovingAverage(
  points: CandlestickPoint[],
  period: number,
) {
  return points.map((point, index) => {
    if (index + 1 < period) {
      return null;
    }

    const windowPoints = points.slice(index - period + 1, index + 1);
    const total = windowPoints.reduce((sum, windowPoint) => sum + windowPoint.close, 0);
    return Number((total / period).toFixed(8));
  });
}

export function calculateExponentialMovingAverage(
  points: CandlestickPoint[],
  period: number,
) {
  const smoothing = 2 / (period + 1);
  let previousAverage: number | null = null;

  return points.map((point, index) => {
    if (index + 1 < period) {
      return null;
    }

    if (previousAverage === null) {
      const windowPoints = points.slice(index - period + 1, index + 1);
      previousAverage =
        windowPoints.reduce((sum, windowPoint) => sum + windowPoint.close, 0) / period;
    } else {
      previousAverage = point.close * smoothing + previousAverage * (1 - smoothing);
    }

    return Number(previousAverage.toFixed(8));
  });
}

export function calculateHeikinAshi(points: CandlestickPoint[]) {
  return points.reduce<CandlestickPoint[]>((heikinAshiPoints, point, index) => {
    const close = (point.open + point.high + point.low + point.close) / 4;
    const previousPoint = heikinAshiPoints[index - 1];
    const open = previousPoint
      ? (previousPoint.open + previousPoint.close) / 2
      : (point.open + point.close) / 2;

    heikinAshiPoints.push({
      timestamp: point.timestamp,
      open: Number(open.toFixed(8)),
      high: Number(Math.max(point.high, open, close).toFixed(8)),
      low: Number(Math.min(point.low, open, close).toFixed(8)),
      close: Number(close.toFixed(8)),
    });

    return heikinAshiPoints;
  }, []);
}

function calculateAverageTrueRange(points: CandlestickPoint[], period = 14) {
  if (points.length < 2) {
    return 0;
  }

  const trueRanges = points.slice(1).map((point, index) => {
    const previousClose = points[index].close;
    return Math.max(
      point.high - point.low,
      Math.abs(point.high - previousClose),
      Math.abs(point.low - previousClose),
    );
  });
  const sample = trueRanges.slice(-period);

  return sample.reduce((sum, value) => sum + value, 0) / sample.length;
}

export function calculateRenko(points: CandlestickPoint[]) {
  if (!points.length) {
    return [];
  }

  const range = Math.max(
    ...points.map((point) => point.high),
  ) - Math.min(...points.map((point) => point.low));
  const atr = calculateAverageTrueRange(points);
  const brickSize = Math.max(atr || range / 42, Math.abs(points[0].close) * 0.001);
  const bricks: CandlestickPoint[] = [];
  let referenceClose = points[0].close;

  for (const point of points.slice(1)) {
    const direction = point.close >= referenceClose ? 1 : -1;
    const requiredBricks = Math.floor(Math.abs(point.close - referenceClose) / brickSize);

    for (let brickIndex = 0; brickIndex < requiredBricks; brickIndex += 1) {
      const open = referenceClose;
      const close = open + direction * brickSize;
      bricks.push({
        timestamp: point.timestamp,
        open: Number(open.toFixed(8)),
        high: Number(Math.max(open, close).toFixed(8)),
        low: Number(Math.min(open, close).toFixed(8)),
        close: Number(close.toFixed(8)),
      });
      referenceClose = close;
    }
  }

  return bricks;
}

export function calculateRangeBars(points: CandlestickPoint[]) {
  if (!points.length) {
    return [];
  }

  const range = Math.max(...points.map((point) => point.high)) - Math.min(...points.map((point) => point.low));
  const targetRange = Math.max(
    calculateAverageTrueRange(points) || range / 36,
    Math.abs(points[0].close) * 0.001,
  );
  const rangeBars: CandlestickPoint[] = [];
  let currentOpen = points[0].open;
  let currentHigh = points[0].high;
  let currentLow = points[0].low;

  for (const point of points) {
    currentHigh = Math.max(currentHigh, point.high);
    currentLow = Math.min(currentLow, point.low);

    if (currentHigh - currentLow >= targetRange) {
      rangeBars.push({
        timestamp: point.timestamp,
        open: Number(currentOpen.toFixed(8)),
        high: Number(currentHigh.toFixed(8)),
        low: Number(currentLow.toFixed(8)),
        close: Number(point.close.toFixed(8)),
      });
      currentOpen = point.close;
      currentHigh = point.close;
      currentLow = point.close;
    }
  }

  return rangeBars.length ? rangeBars : points.slice(-1);
}

export function calculatePointAndFigure(points: CandlestickPoint[]) {
  if (!points.length) {
    return [];
  }

  const range = Math.max(...points.map((point) => point.high)) - Math.min(...points.map((point) => point.low));
  const boxSize = Math.max(
    calculateAverageTrueRange(points) || range / 40,
    Math.abs(points[0].close) * 0.001,
  );
  const reversalBoxes = 3;
  const boxes: PointAndFigureBox[] = [];
  let column = 0;
  let direction: "up" | "down" | null = null;
  let referencePrice = points[0].close;

  for (const point of points.slice(1)) {
    const priceDifference = point.close - referencePrice;

    if (direction === null) {
      if (Math.abs(priceDifference) < boxSize) {
        continue;
      }

      direction = priceDifference > 0 ? "up" : "down";
    }

    if (direction === "up") {
      const upBoxes = Math.floor((point.close - referencePrice) / boxSize);
      if (upBoxes > 0) {
        for (let boxIndex = 0; boxIndex < upBoxes; boxIndex += 1) {
          referencePrice += boxSize;
          boxes.push({ column, price: Number(referencePrice.toFixed(8)), direction: "up" });
        }
        continue;
      }

      const reversal = Math.floor((referencePrice - point.close) / boxSize);
      if (reversal >= reversalBoxes) {
        column += 1;
        direction = "down";
        for (let boxIndex = 0; boxIndex < reversal; boxIndex += 1) {
          referencePrice -= boxSize;
          boxes.push({ column, price: Number(referencePrice.toFixed(8)), direction: "down" });
        }
      }
      continue;
    }

    const downBoxes = Math.floor((referencePrice - point.close) / boxSize);
    if (downBoxes > 0) {
      for (let boxIndex = 0; boxIndex < downBoxes; boxIndex += 1) {
        referencePrice -= boxSize;
        boxes.push({ column, price: Number(referencePrice.toFixed(8)), direction: "down" });
      }
      continue;
    }

    const reversal = Math.floor((point.close - referencePrice) / boxSize);
    if (reversal >= reversalBoxes) {
      column += 1;
      direction = "up";
      for (let boxIndex = 0; boxIndex < reversal; boxIndex += 1) {
        referencePrice += boxSize;
        boxes.push({ column, price: Number(referencePrice.toFixed(8)), direction: "up" });
      }
    }
  }

  return boxes;
}

export function calculateTpoLevels(points: CandlestickPoint[], numberOfLevels = 24) {
  if (!points.length) {
    return [];
  }

  const minimumPrice = Math.min(...points.map((point) => point.low));
  const maximumPrice = Math.max(...points.map((point) => point.high));
  const tickSize = Math.max((maximumPrice - minimumPrice) / numberOfLevels, Number.EPSILON);
  const counts = Array.from({ length: numberOfLevels }, () => 0);
  const letters = Array.from({ length: numberOfLevels }, () => "");

  points.forEach((point, pointIndex) => {
    const startLevel = Math.max(0, Math.floor((point.low - minimumPrice) / tickSize));
    const endLevel = Math.min(
      numberOfLevels - 1,
      Math.floor((point.high - minimumPrice) / tickSize),
    );
    const tpoLetter = String.fromCharCode(65 + (pointIndex % 26));

    for (let levelIndex = startLevel; levelIndex <= endLevel; levelIndex += 1) {
      counts[levelIndex] += 1;
      if (letters[levelIndex].length < 12) {
        letters[levelIndex] += tpoLetter;
      }
    }
  });

  const pointOfControlCount = Math.max(...counts);

  return counts
    .map<TpoLevel>((count, index) => ({
      price: Number((minimumPrice + (index + 0.5) * tickSize).toFixed(8)),
      count,
      letters: letters[index] || "—",
      isPointOfControl: count === pointOfControlCount,
    }))
    .reverse();
}

export function calculateRangeActivity(points: CandlestickPoint[]) {
  return points.map((point) =>
    Number((Math.abs(point.high - point.low) / Math.max(Math.abs(point.close), Number.EPSILON) * 100).toFixed(4)),
  );
}
