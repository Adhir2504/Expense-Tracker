import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';   // 👈 add NgFor
import { ExpenseStore } from '../../core/services/expense.store';
import { CategoryService } from '../../core/services/category.service';
import { AutofocusDirective } from '../../shared/directives/autofocus.directive';
import { DateUtils } from '../../core/utils/date.utils';

@Component({
  selector: 'add-expense',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, AutofocusDirective], // 👈 include NgFor here
  templateUrl: './add-expense.html',
  styleUrl: './add-expense.css'
})
export class AddExpense {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: ExpenseStore,
    public cats: CategoryService,
    private router: Router
  ) {
    this.form = this.fb.group({
      amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
      category: ['Food', Validators.required],
      note: [''],
      date: [DateUtils.todayISO(), Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;
    this.store.add({
      amount: Number(v.amount),
      category: v.category as any,
      note: v.note || undefined,
      date: v.date!
    });
    this.router.navigateByUrl('/');
  }
}
