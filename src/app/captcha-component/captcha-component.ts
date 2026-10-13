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
  readonly puzzles = captchaPuzzles.stages;
  currentStage = 1;
  currectSuccededStage = 1;
  firstStageRetries = 0;
  secondStageRetries = 0;
  thirdStageRetries = 0;
  selectedImages: number[] = [];
  wordAnswer = '';
  mathAnswer = '';
  feedbackMessage = '';
  feedbackIsError = false;

  onImageChange(event: Event, imageId: number): void {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      this.selectedImages.push(imageId);
    } else {
      this.selectedImages = this.selectedImages.filter((id) => id !== imageId);
    }
  }

  onWordInput(event: Event): void {
    this.wordAnswer = (event.target as HTMLInputElement).value;
  }

  onMathInput(event: Event): void {
    this.mathAnswer = (event.target as HTMLInputElement).value;
  }

  navigateToStage(stageNumber: number): void {
    if (stageNumber <= this.currectSuccededStage) {
      this.currentStage = stageNumber;
      this.feedbackMessage = '';
    }
  }

  submitCurrentStage(): void {
    if (this.currentStage < this.currectSuccededStage) {
      this.currentStage += 1;
      this.feedbackIsError = false;
      this.feedbackMessage = 'Moving to the next unlocked stage.';
      this.saveState();
      return;
    }

    const isCorrect = this.isCurrentStageCorrect();

    if (!isCorrect) {
      this.recordRetry();
      this.feedbackIsError = true;
      this.feedbackMessage = 'That answer is not quite right. Try again.';
      this.saveState();
      return;
    }

    this.feedbackIsError = false;
    this.feedbackMessage = this.currentStage === this.puzzles.length
      ? 'All stages complete.'
      : 'Correct. The next stage is unlocked.';

    if (this.currentStage < this.puzzles.length) {
      this.currectSuccededStage = Math.max(this.currectSuccededStage, this.currentStage + 1);
      this.currentStage += 1;
      this.selectedImages = [];
      this.wordAnswer = '';
      this.mathAnswer = '';
    }

    this.saveState();
  }

  private isCurrentStageCorrect(): boolean {
    if (this.currentStage === 1) {
      const answerIds = this.puzzles[0].answerIds ?? [];
      return answerIds.length === this.selectedImages.length &&
        answerIds.every((id) => this.selectedImages.includes(id));
    }

    if (this.currentStage === 2) {
      const answer = this.puzzles[1].answer ?? '';
      return this.wordAnswer.trim().toLowerCase() === String(answer).toLowerCase();
    }

    const answer = this.puzzles[2].answer;
    return this.mathAnswer.trim() !== '' && Number(this.mathAnswer) === answer;
  }

  private recordRetry(): void {
    if (this.currentStage === 1) {
      this.firstStageRetries += 1;
    } else if (this.currentStage === 2) {
      this.secondStageRetries += 1;
    } else {
      this.thirdStageRetries += 1;
    }
  }

  get currentPuzzle() {
    return this.puzzles.find((puzzle) => puzzle.number === this.currentStage) ?? this.puzzles[0];
  }

  ngOnInit(): void {
    this.restoreState();
  }

  private restoreState(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      const values = STORAGE_KEYS.map((key) => localStorage.getItem(key));
      if (values.some((value) => value === null)) {
        throw new Error('Incomplete captcha state');
      }

      const numbers = values.map((value) => Number(value));
      if (numbers.some((value) => !Number.isInteger(value) || value < 0) ||
        numbers[0] < 1 || numbers[0] > this.puzzles.length ||
        numbers[1] < 1 || numbers[1] > this.puzzles.length ||
        numbers[0] > numbers[1]) {
        throw new Error('Invalid captcha state');
      }

      [
        this.currentStage,
        this.currectSuccededStage,
        this.firstStageRetries,
        this.secondStageRetries,
        this.thirdStageRetries,
      ] = numbers;
    } catch {
      this.resetState();
    }
  }

  private resetState(): void {
    this.currentStage = 1;
    this.currectSuccededStage = 1;
    this.firstStageRetries = 0;
    this.secondStageRetries = 0;
    this.thirdStageRetries = 0;

    try {
      STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    } catch {}
  }

  private saveState(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const values = [
      this.currentStage,
      this.currectSuccededStage,
      this.firstStageRetries,
      this.secondStageRetries,
      this.thirdStageRetries,
    ];

    try {
      STORAGE_KEYS.forEach((key, index) => localStorage.setItem(key, String(values[index])));
    } catch {}
  }
}
