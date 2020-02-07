/**
 * Converts filter expression into number of hours
 * @param {string} strExpression - filter expression like 'CURRENT_TIMESTAMP - 0.041666666666666664'
 * @returns {string}
 */
export function parseExpirationHours(strExpression) {
  const daysBack = strExpression.match(/(\d+.?\d*)$/);
  return daysBack && daysBack[0] ? Math.round(daysBack[0] * 24).toString() : '0';
}
