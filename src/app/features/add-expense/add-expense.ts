import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { ExpenseStore } from '../../core/services/expense.store';
import { CategoryService } from '../../core/services/category.service';
import { ToastService } from '../../core/services/toast.service';
import { AutofocusDirective } from '../../shared/directives/autofocus.directive';
import { DateUtils } from '../../core/utils/date.utils';

/**
 * Component used to add a new expense. Uses Reactive Forms for validation.
 * The form produces a simple object which `ExpenseStore.add` augments with
 * `id` and `createdAt` before inserting into the store.
 */
@Component({
  selector: 'add-expense',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ReactiveFormsModule, AutofocusDirective], // 👈 include NgFor here
  templateUrl: './add-expense.html',
  styleUrl: './add-expense.css'
})
export class AddExpense {
  form: FormGroup;

  ngOnInit() {
    // Ensure we're not accidentally left in edit mode when opening the Add view
    this.store.editing.set(null);
  }

  constructor(
    private fb: FormBuilder,
    public store: ExpenseStore,
    public cats: CategoryService,
    private router: Router,
    private toast: ToastService
  ) {
    // Build the form with defaults and validators. `DateUtils.todayISO()`
    // returns a yyyy-mm-dd string suitable for the form control.
    this.form = this.fb.group({
      amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
      category: ['Food', Validators.required],
      note: [''],
      date: [DateUtils.todayISO(), Validators.required]
    });
  }

  // Called when the user submits the form. If valid, we convert types
  // where necessary and delegate to the store, then navigate back to the
  // dashboard.
  async submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;

    // Make the payload explicit so it's easy to see the data shape.
    const payload = {
      amount: Number(v.amount),
      category: v.category as any,
      note: v.note || undefined,
      date: v.date!
    };

    try {
      const created = await this.store.add(payload);
      this.toast.show({ text: 'Expense added', type: 'success' });
      this.router.navigateByUrl('/');
    } catch (err: any) {
      this.toast.show({ text: err?.message ?? 'Failed to add expense', type: 'danger' });
    }
  }

  // Called by the template Cancel button. Clears any edit state and navigates home.
  cancel() {
    this.store.editing.set(null);
    this.router.navigateByUrl('/');
  }
}
