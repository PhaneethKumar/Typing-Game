# Typing Game

A simple, accessible typing practice game built with vanilla HTML, CSS, and
JavaScript. Type quotes from Sherlock Holmes, track your performance, and
improve your speed and accuracy as the difficulty increases.

## Play online

Play the deployed game here: [Typing Game](https://typing-game-pi-bice.vercel.app/)

## Features

- Three quote difficulties: Easy, Medium, and Hard
- Random quote selection without immediately repeating the previous quote
- Live words-per-minute (WPM) and accuracy calculations
- Best speed, best accuracy, and completed-quote counters
- Three-step performance streak indicator
- Automatic difficulty progression after three successful quotes
- Error highlighting while typing
- Responsive layout with dark-mode and reduced-motion support based on system
  preferences
- Keyboard-friendly controls and screen-reader status updates

## How to play

1. Choose a difficulty level.
2. Select **Start**.
3. Type the displayed quote exactly as shown. A word is completed by entering
   its trailing space.
4. Review your WPM, accuracy, and streak when the quote is complete.
5. Reach at least **95% accuracy** and the required WPM for the selected level
   to build your streak:
   - Easy: 25 WPM
   - Medium: 35 WPM
   - Hard: 45 WPM

After three successful quotes, the game advances to the next difficulty. A
missed performance resets the streak.

## Run locally

This is a static website and does not require a package manager or build step.

1. Clone or download the repository.
2. Open `index.html` directly in a browser, or serve the project with any
   local static server.

For example, with Python installed:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000> in your browser.

## Project structure

```text
.
├── index.html   # Page structure and accessible controls
├── style.css    # Layout, responsive styling, themes, and animations
├── script.js    # Quotes, game state, scoring, and progression logic
└── README.md   # Project documentation
```

## Technologies

- HTML5
- CSS3
- JavaScript (ES6+)

No external libraries or runtime dependencies are required.
