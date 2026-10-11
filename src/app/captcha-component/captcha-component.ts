import { Component, OnInit } from '@angular/core';
import captchaPuzzles from '../data/captcha-puzzles.json';

const STORAGE_KEYS = [
  'current_stage',
  'current_succeded_stage',
  'first_stage_retries',
  'second_stage_retries',
  'third_stage_retries',
] as const;

@Component({
  imports: [],
  selector: 'app-captcha-component',
  styleUrl: './captcha-component.css',
  templateUrl: './captcha-component.html',
})
export class CaptchaComponent implements OnInit {  
  readonly puzzles = captchaPuzzles.stages
    currentStage = 1
    currectSuccededStage = 1
    firstStageRetries = 0
    secondStageRetries = 0
    thirdStageRetries = 0

    get currentPuzzle() {
      return this.puzzles.find((puzzle) => puzzle.number === this.currentStage) ?? this.puzzles[0]
    }

    ngOnInit(): void {
      this.restoreState()
    }

    private restoreState(): void {
      if (typeof localStorage === 'undefined') {
        return
      }

      try {
        const values = STORAGE_KEYS.map((key) => localStorage.getItem(key))
        if (values.some((value) => value === null)) {
          throw new Error('Incomplete captcha state')
        }

        const numbers = values.map((value) => Number(value))
        if (numbers.some((value) => !Number.isInteger(value) || value < 0)) {
          throw new Error('Invalid captcha state')
        }

        [
          this.currentStage,
          this.currectSuccededStage,
          this.firstStageRetries,
          this.secondStageRetries,
          this.thirdStageRetries,
        ] = numbers
      } catch {
        this.resetState()
      }
    }

    private resetState(): void {
      this.currentStage = 1
      this.currectSuccededStage = 1
      this.firstStageRetries = 0
      this.secondStageRetries = 0
      this.thirdStageRetries = 0

      try {
        STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))
      } catch {
      }

    }

    
}
