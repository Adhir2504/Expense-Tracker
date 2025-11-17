import { Component, computed, AfterViewInit, OnDestroy, ViewChild, ElementRef, effect } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { ExpenseStore } from '../../core/services/expense.store';
import { AmountFormatPipe } from '../../shared/pipes/amount-format.pipe';
import { CategoryService } from '../../core/services/category.service';
import { CurrencyService } from '../../core/services/currency.service';

/**
 * Summary view: shows aggregated totals grouped by category. It reuses
 * the `totalsByCategory` computed value from the store and formats amounts
 * with `AmountFormatPipe`.
 */
@Component({
  selector: 'summary',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, AmountFormatPipe],
  templateUrl: './summary.html',
  styleUrl: './summary.css'
})
export class Summary {
  constructor(
    public store: ExpenseStore,
    public cats: CategoryService,
    public curr: CurrencyService
  ) {}

  // Helper for template iteration: convert Map -> Array<[category, amount]>
  entries = computed(() => Array.from(this.store.totalsByCategory().entries()));

  // Reference to the canvas element in the template
  @ViewChild('spendingChart', { static: false })
  chartRef!: ElementRef<HTMLCanvasElement>;

  // Chart instance (Chart.js) reference
  private chart: any;

  // Compute monthly totals for the last 12 months. Returns an array of
  // { key: 'YYYY-MM', label: 'Mon YY', total: number } in ascending order.
  monthlyTotals = computed(() => {
    const expenses = this.store.expenses();
    const map = new Map<string, number>();

    for (const e of expenses) {
      // expense.date stored as 'YYYY-MM-DD' — take YYYY-MM as month key
      const key = e.date?.slice(0, 7) ?? '';
      if (!key) continue;
      map.set(key, (map.get(key) || 0) + (Number(e.amount) || 0));
    }

    // Build last 12 months keys (oldest -> newest)
    const months: Array<{ key: string; label: string; total: number }> = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toISOString().slice(0, 7);
      const label = d.toLocaleString(undefined, { month: 'short', year: '2-digit' });
      months.push({ key, label, total: map.get(key) || 0 });
    }

    return months;
  });

  // Initialize Chart.js after view is available and update when data changes
  ngAfterViewInit(): void {
    // Chart constructor is available via the global Chart (in the included CDN script)
    const ChartCtor = (window as any).Chart;
    if (!ChartCtor) return;

    const ctx = this.chartRef.nativeElement.getContext('2d');
    const data = this.monthlyTotals();

    this.chart = new ChartCtor(ctx, {
      type: 'line',
      data: {
        labels: data.map((m) => m.label),
        datasets: [
          {
            label: 'Spending',
            data: data.map((m) => m.total),
            borderColor: '#4e73df',
            backgroundColor: 'rgba(78,115,223,0.12)',
            tension: 0.25,
            pointRadius: 3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0 } },
        },
      },
    });

    // Keep the chart in sync with store changes
    effect(() => {
      const updated = this.monthlyTotals();
      if (!this.chart) return;
      this.chart.data.labels = updated.map((m) => m.label);
      this.chart.data.datasets[0].data = updated.map((m) => m.total);
      this.chart.update();
    });
  }

  ngOnDestroy(): void {
    try {
      this.chart?.destroy();
    } catch (e) {
      /* ignore */
    }
  }
}
