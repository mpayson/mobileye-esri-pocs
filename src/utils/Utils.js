const getDomainMap = (domain) => {
  if(!domain) return new Map();
  return domain.codedValues.reduce((p, cv) => {
    p.set(cv.code, cv.name);
    return p;
  }, new Map());
}

const transformQueryToRechartSeries = (queryResults, xField, yField) => {
  if(!queryResults || queryResults.features.length < 1) return [];
  return queryResults.features.map(f => ({
    [xField]: f.attributes[xField],
    [yField]: f.attributes[yField]
  }));
}

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
  if (value === -100) return "2=2";
  let where = null;
  where = (fieldType === 'string')
    ? `${field} = '${value}'` :
    `${field} = ${value}`;
  return where
}

const getMaxQuery = (field) => ({
  onStatisticField: field,
  outStatisticField: `MAX_${field}`,
  statisticType: 'max'
})

const getMinQuery = (field) => ({
  onStatisticField: field,
  outStatisticField: `MIN_${field}`,
  statisticType: 'min'
})

const combineNullableWheres = (wheres, operator='AND') => {
  const where = wheres
    .filter(w => !!w)
    .join(` ${operator} `)
  return where ? where : null;
}

const getRange = (min, max) => 
  (new Array(max - min + 1)).fill(undefined).map((_, i) => i + min);

const reverse = (map) => {
  const reversed = new Map();
  for (const [k, v] of map.entries()) {
      if (!reversed.has(v)) {
        reversed.set(v, [])
      }
      reversed.get(v).push(k);
  }
  return reversed;
}

const sum = (values) => values.reduce((a,v) => a + v);

const average = (values, weights) => {
  switch(typeof(values[0])) {
    case 'number':
      return sum(values.map((val, i) => val * weights[i])) / sum(weights);
    case 'string':
      return average(values.map(parseFloat), weights);
    case 'object':
      return Object.keys(values[0]).reduce((acc, key) => {
        acc[key] = average(values.map(val => val[key]), weights);
        return acc;
      }, {});
    default:
      return null;
  }
};

export {
  getMinMaxWhere,
  getMultiSelectWhere,
  getSelectWhere,
  getMaxQuery,
  getMinQuery,
  getDomainMap,
  transformQueryToRechartSeries,
  getRange,
  combineNullableWheres,
  reverse,
  average
};