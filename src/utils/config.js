
export function getClassBreakInfos({stops, labels, colors, width, ...other}) {
  return stops.slice(0, -1).map((_, i) => ({
    minValue: stops[i],
    maxValue: stops[i+1],
    symbol: {
      type: 'simple-line',
      width: Array.isArray(width) ? width[i] : width, 
      color: colors[i],
      ...other, 
    },
    label: labels[i],
  }));
}
