export function tryParse(jsonLike) {
  if (jsonLike.includes("'")) {
    jsonLike = jsonLike.replace(/'/g, '"');
  }
  try {
    return JSON.parse(jsonLike);
  } catch (error) {
    return {};
  }
}