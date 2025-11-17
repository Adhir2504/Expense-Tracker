// Small math helpers used across the app for sums and rounding to 2 decimals.
export class MathUtils {
  // Sum an array of numbers (safe to call with empty array)
  static sum(nums: number[]) { return nums.reduce((a,b)=>a+b,0); }

  // Round a number to 2 decimal places (typical for currency display)
  static round2(n: number) { return Math.round(n * 100) / 100; }
}
