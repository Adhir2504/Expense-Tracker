import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { ExpenseStore } from '../../core/services/expense.store';
import { CategoryService } from '../../core/services/category.service';
import { ToastService } from '../../core/services/toast.service';
import { AutofocusDirective } from '../../shared/directives/autofocus.directive';
import { DateUtils } from '../../core/utils/date.utils';

@Component({
  selector: 'edit-expense',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ReactiveFormsModule, AutofocusDirective],
  templateUrl: '../add-expense/add-expense.html',
  styleUrl: '../add-expense/add-expense.css'
})
export class EditExpense implements OnInit {
  form: FormGroup;
  private expenseId: string | null = null;

  constructor(
    private fb: FormBuilder,
    public store: ExpenseStore,
    public cats: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
      category: ['Food', Validators.required],
      note: [''],
      date: [DateUtils.todayISO(), Validators.required]
    });
  }

  ngOnInit() {
    this.expenseId = this.route.snapshot.paramMap.get('id');

    // If the store already has the editing signal set (from dashboard), use it.
    const editing = this.store.editing();
    if (editing && editing.id === this.expenseId) {
      this.patchForm(editing);
      return;
    }

    // Otherwise try to find the expense in the store list.
    const item = this.store.expenses().find(e => e.id === this.expenseId);
    if (item) {
      this.store.beginEdit(item);
      this.patchForm(item);
      return;
    }

    // If we don't have the item locally, show an error and navigate back.
    this.toast.show({ text: 'Expense not found', type: 'danger' });
    this.router.navigateByUrl('/');
  }

  private patchForm(item: any) {
    this.form.patchValue({
      amount: item.amount,
      category: item.category,
      note: item.note || '',
      date: item.date
    });
  }

  async submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;

    const payload = {
      id: this.expenseId!,
      amount: Number(v.amount),
      category: v.category as any,
      note: v.note || undefined,
      date: v.date!,
      createdAt: this.store.editing()?.createdAt ?? new Date().toISOString()
    };

    try {
      await this.store.saveEdit(payload as any);
      this.toast.show({ text: 'Expense updated', type: 'success' });
      this.store.editing.set(null);
      this.router.navigateByUrl('/');
    } catch (err: any) {
      this.toast.show({ text: err?.message ?? 'Failed to update expense', type: 'danger' });
    }
  }

  // Clear edit state and navigate back to the dashboard without saving
  cancel() {
    this.store.editing.set(null);
    this.router.navigateByUrl('/');
  }
}
