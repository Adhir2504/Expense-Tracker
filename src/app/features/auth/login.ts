import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

/**
 * Simple login component used by the demo app. It validates the form,
 * performs a fake delay (to simulate a real request) and calls
 * `AuthService.login`. On success it navigates back to the requested
 * URL provided via the `returnUrl` query param.
 */
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
    // Build form with basic client-side validation rules
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      remember: [true]
    });
  }

  // Called when the user submits the login form
  async submit() {
    this.error = null;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;

    // Extract credentials clearly so newcomers see the shape
    const values = this.form.value as { email: string; password: string };
    const email = values.email;
    const password = values.password;

    // Small artificial delay to mimic a network request
    await new Promise(res => setTimeout(res, 300));

    const success = this.auth.login(email, password);
    this.loading = false;
    if (!success) { this.error = 'Invalid credentials'; return; }

    // Read returnUrl from current location query params and navigate there
    const returnUrl = new URL(window.location.href).searchParams.get('returnUrl') || '/';
    this.router.navigateByUrl(returnUrl);
  }
}
