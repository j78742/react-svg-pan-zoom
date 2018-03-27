"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mapRange;
function mapRange(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}