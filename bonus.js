/**
 * @param {string} s
 * @return {number}
 */
var romanToInt = function (s) {
  const values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };

  const length = s.length;

  const lastCharVal = values[s[length - 1]];

  let total = lastCharVal;
  for (let i = length - 2; i >= 0; --i) {
    const currentCharVal = values[s[i]];
    const nextCharVal = values[s[i + 1]];

    if (currentCharVal >= nextCharVal) {
      total += currentCharVal;
    } else {
      total -= currentCharVal;
    }
  }

  return total;
};
