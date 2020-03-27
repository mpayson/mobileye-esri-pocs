import Store from '../stores/Store';

export function moveWidgetsWithPanel(view, offset, defer=true) {
  const container = view.ui._positionNameToContainerLookup['bottom-left'];
  if (container) {
    const update = () => container.style.transform = (offset 
      ? `translateX(${offset}px)` : 'none');
    defer ? requestAnimationFrame(update) : update();
  }
}

export function findColor(store, graphic) {
  const attrs = graphic.attributes;
  const renderer = store.renderers[store.rendererField];
  const value = attrs[renderer.field];
  const valueInfo = Store._findValueInfo(renderer, value);

  let color;
  const overrideColor = store._findVisVarOverrides(
    graphic.sourceLayer.renderer, 'color', value);
  if (overrideColor) {
    color = overrideColor;
  } else {
    color = valueInfo && valueInfo.symbol && valueInfo.symbol.color;
  }
  return color;
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