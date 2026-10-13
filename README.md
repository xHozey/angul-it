# Human Check

A small Angular CAPTCHA-style challenge. Users complete three puzzles in order, see how many attempts each stage took, and receive a score out of 100 when they finish.

## Features

- Visual recognition: select all matching cat images.
- Image text recognition: read the public CAPTCHA image and enter `ECOMMERCE`.
- Quick calculation: solve `18 + 27`.
- Stages unlock progressively; future stages cannot be opened early.
- Completed stages can be revisited, but their inputs are disabled.
- Retry counts and progress persist in `localStorage`.
- The result page shows attempts per stage and a retry-based score.
- Restart clears the saved challenge state and starts a new attempt.

## Tech Stack

- Angular 22
- TypeScript
- Tailwind CSS 4
- Angular Router
- Vitest through the Angular test runner

## Getting Started

### Requirements

- Node.js and npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm start
```

Open `http://localhost:4200/` in a browser. The app contains these routes:

| Route | Description |
| --- | --- |
| `/` | Welcome screen |
| `/captcha` | Three-stage challenge |
| `/result` | Completion score and attempt summary |

Incomplete visits to `/result` redirect back to `/captcha`.

## Available Scripts

```bash
npm start       # Start the development server
npm run build   # Create a production build in dist/
npm test        # Run unit tests
npm run watch   # Build continuously in development mode
```

## Challenge Flow

The puzzle definitions live in [src/app/data/captcha-puzzles.json](src/app/data/captcha-puzzles.json). Images for the visual stage are stored in `public/cats/`, and the stage-two CAPTCHA image is `public/captcha_puzzle.jpg`.

Each failed submission increments that stage's retry count. A successful first attempt counts as one try. The score is calculated as:

```text
max(0, 100 - total retries * 10)
```

The challenge stores progress under these localStorage keys:

- `current_stage`
- `current_succeded_stage`
- `first_stage_retries`
- `second_stage_retries`
- `third_stage_retries`
- `challenge_completed`

The restart action removes all of these keys.

## Project Structure

```text
src/app/
├── captcha-component/   # Challenge UI and validation flow
├── data/                # Puzzle definitions
├── home-component/      # Welcome screen
└── result-component/    # Score and retry summary
public/
├── cats/                # Stage-one image choices
└── captcha_puzzle.jpg   # Stage-two CAPTCHA image
```
