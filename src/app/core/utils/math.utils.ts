export class MathUtils {
  static sum(nums: number[]) { return nums.reduce((a,b)=>a+b,0); }
  static round2(n: number) { return Math.round(n * 100) / 100; }
}
