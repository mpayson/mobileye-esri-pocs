export const CAT_CODE_TO_QUERY_FIELD = [
  'traffic_sign_category_l3',
  'tfl_category_l3',
  'road_marking_category_l3',
  'pole_category_l3',
  'manhole_category_l3',
];

export function findLabel(layer, fieldName, value) {
  const field = layer.fields.find(f => f.name === fieldName);
  if (field) {
    const description = field.domain.codedValues.find(v => v.code === value);
    if (description) {
      return description.name;
    }
  }
  return null;
}