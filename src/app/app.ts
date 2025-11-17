import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toolbar } from './shared/components/toolbar/toolbar';
import { Toaster } from './shared/components/toaster/toaster';

// Root application component. Uses standalone component model so it can be
// bootstrapped directly without an NgModule. The template (`app.html`)
// contains a `RouterOutlet` where routed feature components are rendered.
// Global UI components like `Toolbar` and `Toaster` are included here so
// they appear on every page.
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Toolbar, Toaster],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
