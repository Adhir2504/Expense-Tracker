// Lightweight date helpers. The app stores dates as yyyy-mm-dd strings
// to avoid timezone issues when only the date (not time) matters.
export class DateUtils {
  // Return today's date in ISO yyyy-mm-dd format.
  static todayISO(): string { return new Date().toISOString().slice(0,10); }

  // Check whether an ISO date string falls within an inclusive from/to range.
  // Strings compare lexicographically for yyyy-mm-dd so direct >=/<= works.
  static isInRange(iso: string, from?: string, to?: string): boolean {
    if (!from && !to) return true;
    return (!from || iso >= from) && (!to || iso <= to);
  }
}
