/**
 * Creates a sorted array range from the given index to the specified length
 * @param {number} start index where the range should start
 * @param {number} length range length or size
 */
module.exports.range = (start, length) => {

  const sign = Math.sign(length);

  return Array.from(
    { length: Math.abs(length) },
    (_, i) => start + (i * sign)
  );
}
