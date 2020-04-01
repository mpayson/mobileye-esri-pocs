export function tryParse(jsonLike) {
  if (typeof(jsonLike) === 'object') {
    return jsonLike;
  }
  if (typeof(jsonLike) === 'string') {
    if (jsonLike.includes("'")) {
      jsonLike = jsonLike.replace(/'/g, '"');
    }
    try {
      return JSON.parse(jsonLike);
    } catch (error) {
      return {};
    }
  }
  return jsonLike;
}