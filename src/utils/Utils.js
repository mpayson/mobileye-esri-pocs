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
  console.log("ORK hmm", where)
  return where;
}

const getMultiSelectWhere = (field, values, fieldType) => {
  if(!values || values.length < 1) return null;
  let where = null;
  if(fieldType === 'string') {
    const wstr = values.join("','");
    where = `${field} IN ('${wstr}')`;
  } else {
    const wstr = values.join(",");
    where =  `${field} IN (${wstr})`;
  }
  return where;
}

const getSelectWhere = (field, value, fieldType) => {
  if(!value) return null;
  let where = null;
  where = (fieldType === 'string')
    ? `${field} = '${value}'` :
    `${field} = ${value}`;
  return where
}

export {getMinMaxWhere, getMultiSelectWhere, getSelectWhere};