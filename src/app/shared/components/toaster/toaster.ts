import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './toaster.html',
  styleUrl: './toaster.css'
})
export class Toaster {
  constructor(public toast: ToastService) {}
}
