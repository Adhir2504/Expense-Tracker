export class DateUtils {
  static todayISO(): string { return new Date().toISOString().slice(0,10); }
  static isInRange(iso: string, from?: string, to?: string): boolean {
    if (!from && !to) return true;
    return (!from || iso >= from) && (!to || iso <= to);
  }
}
