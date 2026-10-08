// all available quotes
const quotes = [
    'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
    'There is nothing more deceptive than an obvious fact.',
    'I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.',
    'I never make exceptions. An exception disproves the rule.',
    'What one man can invent another can discover.',
    'Nothing clears up a case so much as stating it to another person.',
    'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
];

// game state
let words = [];
let wordElements = [];
let wordIndex = 0;
let startTime = 0;
// typing statistics
let totalKeystrokes = 0;
let correctKeystrokes = 0;
let previousValue = '';
let statsTimer = null;

// page elements
const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');
const startButton = document.getElementById('start');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');

// Helper Functions
// Highlight one word (pass -1 to clear all highlights)
function highlightWord(index) {
    wordElements.forEach((element, i) => {
        const isCurrent = i === index;
        element.classList.toggle('highlight', isCurrent);
        if (isCurrent) {
            element.setAttribute('aria-current', 'true');
        } else {
            element.removeAttribute('aria-current');
        }
    });
}
// Show or clear the error state on the input
function setError(isError) {
    typedValueElement.classList.toggle('error', isError);
    typedValueElement.setAttribute('aria-invalid', String(isError));
}
// Words per minute, using the standard "5 characters = 1 word" rule
function calculateWpm(characters, elapsedMs) {
    const minutes = elapsedMs / 60000;
    if (!Number.isFinite(minutes) || minutes <= 0) return 0;
    return Math.round(characters / 5 / minutes);
}
// Accuracy as a percentage (100 when nothing has been typed yet)
function calculateAccuracy(correct, total) {
    if (total <= 0) return 100;
    return Math.round((correct / total) * 100);
}
// Characters in all fully typed words (plus spaces) and the current partial word
function typedCharacterCount() {
    const completed = words.slice(0, wordIndex).join(' ').length + (wordIndex > 0 ? 1 : 0);
    return completed + typedValueElement.value.trim().length;
}

function updateStatsDisplay(characters = typedCharacterCount()) {
    try {
        const elapsed = Date.now() - startTime;
        wpmElement.textContent = calculateWpm(characters, elapsed);
        accuracyElement.textContent = calculateAccuracy(correctKeystrokes, totalKeystrokes);
    } catch (error) {
        console.error('Could not update stats:', error);
    }
}

function resetStats() {
    totalKeystrokes = 0;
    correctKeystrokes = 0;
    previousValue = '';
    wpmElement.textContent = '0';
    accuracyElement.textContent = '100';
}

function stopStatsTimer() {
    clearInterval(statsTimer);
    statsTimer = null;
}


// Working of game
startButton.addEventListener('click', () => {
    // get a quote
    const quote = quotes[Math.floor(Math.random() * quotes.length)];

    // put the quote into an array of words
    words = quote.split(' ');
    wordIndex = 0;

    // build one span per word (no innerHTML needed)
    wordElements = words.map((word) => {
        const span = document.createElement('span');
        span.textContent = `${word} `;
        return span;
    });
    quoteElement.replaceChildren(...wordElements);
    highlightWord(0);

    // reset the UI
    messageElement.textContent = '';
    setError(false);
    resetStats();
    stopStatsTimer();
    typedValueElement.disabled = false;
    typedValueElement.value = '';
    typedValueElement.focus();

    // start the timer
    startTime = Date.now();
    statsTimer = setInterval(updateStatsDisplay, 500);
});

typedValueElement.addEventListener('input', () => {
    // ignore input if a game isn't running
    if (words.length === 0) return;

    const currentWord = words[wordIndex];
    const typedValue = typedValueElement.value;

    // Count only newly added characters (backspace/deletion is not a keystroke)
    if (typedValue.length > previousValue.length && typedValue.startsWith(previousValue)) {
        const added = typedValue.slice(previousValue.length);
        for (const char of added) {
            totalKeystrokes++;
            const candidate = previousValue + char;
            // a space after a correct word is the correct way to finish it
            const isCorrect =
                currentWord.startsWith(candidate) ||
                (char === ' ' && previousValue === currentWord);
            if (isCorrect) correctKeystrokes++;
            previousValue = candidate;
        }
    }
    previousValue = typedValue;

    if (typedValue === currentWord && wordIndex === words.length - 1) {
        // end of the quote
        stopStatsTimer();
        const elapsedMs = Date.now() - startTime;
        const elapsedSeconds = (elapsedMs / 1000).toFixed(2);
        const finalWpm = calculateWpm(words.join(' ').length, elapsedMs);
        const finalAccuracy = calculateAccuracy(correctKeystrokes, totalKeystrokes);

        wpmElement.textContent = finalWpm;
        accuracyElement.textContent = finalAccuracy;
        messageElement.textContent =
            `Congratulations! You finished in ${elapsedSeconds} seconds ` +
            `at ${finalWpm} words per minute with ${finalAccuracy}% accuracy.`;

        highlightWord(-1);
        setError(false);
        typedValueElement.disabled = true;
        // keep keyboard focus somewhere useful
        startButton.focus();
    } else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) {
        // end of a word: clear the input and move on
        typedValueElement.value = '';
        previousValue = '';
        setError(false);
        wordIndex++;
        highlightWord(wordIndex);
    } else if (currentWord.startsWith(typedValue)) {
        // correct so far
        setError(false);
    } else {
        // mistake
        setError(true);
    }
});