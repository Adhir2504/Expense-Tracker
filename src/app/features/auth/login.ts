import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loading = false;
  error: string | null = null;

  form: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      remember: [true]
    });
  }

  async submit() {
    this.error = null;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const { email, password } = this.form.value as { email: string; password: string };

    await new Promise(r => setTimeout(r, 300));

    const ok = this.auth.login(email, password);
    this.loading = false;
    if (!ok) { this.error = 'Invalid credentials'; return; }

    const url = new URL(window.location.href);
    const returnUrl = url.searchParams.get('returnUrl') || '/';
    this.router.navigateByUrl(returnUrl);
  }
}
