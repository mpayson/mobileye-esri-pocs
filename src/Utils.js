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

export {getMinMaxWhere};