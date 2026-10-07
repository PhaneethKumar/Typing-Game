// all of our quotes
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

// page elements
const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');
const startButton = document.getElementById('start');

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
    typedValueElement.disabled = false;
    typedValueElement.value = '';
    typedValueElement.focus();

    // start the timer
    startTime = Date.now();
});

typedValueElement.addEventListener('input', () => {
    // ignore input if a game isn't running
    if (words.length === 0) return;

    const currentWord = words[wordIndex];
    const typedValue = typedValueElement.value;

    if (typedValue === currentWord && wordIndex === words.length - 1) {
        // end of the quote
        const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
        messageElement.textContent = `Congratulations! You finished in ${elapsedSeconds} seconds.`;

        highlightWord(-1);
        setError(false);
        typedValueElement.disabled = true;
        // keep keyboard focus somewhere useful
        startButton.focus();
    } else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) {
        // end of a word: clear the input and move on
        typedValueElement.value = '';
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