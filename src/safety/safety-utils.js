import safetyConfig from './SafetyConfig';

// This is really lazy, should be a method in the store but need to adjust config too so
// quantiles only get defined once
const quantiles = safetyConfig.filters.find(
  f => f.name === 'risk_score').params.quantiles;

export const getQuantile = value => {
  for(let i=0; i < quantiles.length; i++){
    if(value < quantiles[i].max){
      return quantiles[i];
    }
  }
  return ''
}