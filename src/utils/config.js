
export function getClassBreakInfos({stops, labels, colors, width, type = "simple-line"}) {
  return stops.slice(0, -1).map((_, i) => ({
    minValue: stops[i],
    maxValue: stops[i+1],
    symbol: {
      type, 
      width: Array.isArray(width) ? width[i] : width, 
      color: colors[i]
    },
    label: labels[i],
  }));
}
