import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toolbar } from './shared/components/toolbar/toolbar';
import { Toaster } from './shared/components/toaster/toaster';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Toolbar, Toaster],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
