/**
 * Create a new number range.
 * @param {number} start Number where the range should start
 * @param {number} length Amount of numbers to create (sign determines direction)
 */
module.exports.range = function (start, length) {
  const sign = Math.sign(length);
  return Array.from({ length: Math.abs(length) }, (_, i) => start + (i * sign));
}
