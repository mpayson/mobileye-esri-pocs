
export function moveWidgetsWithPanel(view, offset, defer=true) {
  const container = view.ui._positionNameToContainerLookup['bottom-left'];
  if (container) {
    const update = () => container.style.transform = (offset 
      ? `translateX(${offset}px)` : 'none');
    defer ? requestAnimationFrame(update) : update();
  }
}

export function stringifyColor(color) {
  if (color instanceof(Object)) {
    const maybeColor = ['r', 'g', 'b', 'a']
      .filter(k => color.hasOwnProperty(k))
      .map(k => Math.round(color[k]));

    if (maybeColor.length) {
      color = maybeColor;
    }
  }
  if (Array.isArray(color)) {
    const type = color.length > 3 ? 'rgba' : 'rgb';
    color = `${type}(${color.join(',')})`;
  }
  return color;
}