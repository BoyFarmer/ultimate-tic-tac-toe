import { Component } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.html',
  styleUrl: './waiting.scss',
  imports: [
    MatProgressBar,
    MatProgressSpinner
  ]
})
export class Waiting {
}
