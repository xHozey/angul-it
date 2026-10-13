import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

const STORAGE_KEYS = [
  'current_stage',
  'current_succeded_stage',
  'first_stage_retries',
  'second_stage_retries',
  'third_stage_retries',
] as const;

@Component({
  imports: [],
  selector: 'app-result-component',
  styleUrl: './result-component.css',
  templateUrl: './result-component.html',
})
export class ResultComponent implements OnInit {
  constructor(private readonly router: Router) {}

  firstStageTries = 1;
  secondStageTries = 1;
  thirdStageTries = 1;
  score = 100;

  ngOnInit(): void {
    this.loadResults();
  }

  restart(): void {
    try {
      STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    } catch {}

    this.router.navigate(['/captcha']);
  }

  private loadResults(): void {
    const retries = STORAGE_KEYS.slice(2).map((key) => this.readRetryCount(key));

    this.firstStageTries = retries[0] + 1;
    this.secondStageTries = retries[1] + 1;
    this.thirdStageTries = retries[2] + 1;
    this.score = Math.max(0, 100 - retries.reduce((total, count) => total + count, 0) * 10);
  }

  private readRetryCount(key: string): number {
    if (typeof localStorage === 'undefined') {
      return 0;
    }

    const value = Number(localStorage.getItem(key));
    return Number.isInteger(value) && value >= 0 ? value : 0;
  }
}
