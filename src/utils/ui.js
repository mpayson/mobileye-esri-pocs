
export function moveWidgetsWithPanel(view, offset, defer=true) {
  const container = view.ui._positionNameToContainerLookup['bottom-left'];
  if (container) {
    const update = () => container.style.transform = (offset 
      ? `translateX(${offset}px)` : 'none');
    defer ? requestAnimationFrame(update) : update();
  }
}
