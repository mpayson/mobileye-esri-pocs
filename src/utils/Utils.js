const getMinMaxWhere = (field, min, max) => {
  const isMin = min || min === 0;
  const isMax = max || max === 0;
  let where = null;
  if(isMin && isMax){
    where = field + " <= " + max + " AND " + field + " >= " + min;
  } else if(isMax){
    where = field + " <= " + max;
  } else if(isMin){
    where = field + " >= " + min;
  }
  return where;
}

const getMultiSelectWhere = (field, values) => {
  if(!values || values.length < 1) return null;
  const wstr = values.join("','");
  return `${field} IN ('${wstr}')`;
}

const getSelectWhere = (field, value) => {
  if(!value) return null;
  return typeof value === 'number'
    ? `${field} = ${value}`
    : `${field} = '${value}'`;
}

export {getMinMaxWhere, getMultiSelectWhere, getSelectWhere};