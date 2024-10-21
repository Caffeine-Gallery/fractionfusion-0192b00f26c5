import { backend } from 'declarations/backend';

let fraction = { numerator: 1, denominator: 4 };
let userGuess = 0.5;
let score = null;
let animationStep = 0;
let animationInterval;

async function generateFraction() {
    try {
        return await backend.generateFraction();
    } catch (error) {
        console.error("Error generating fraction:", error);
        return { numerator: 1, denominator: 4 };
    }
}

async function startNewRound() {
    fraction = await generateFraction();
    userGuess = 0.5;
    score = null;
    animationStep = 0;
    document.getElementById('guess-slider').value = 0.5;
    document.getElementById('fraction-display').textContent = `Where does ${fraction.numerator}/${fraction.denominator} go on the line?`;
    document.getElementById('result').style.display = 'none';
    clearInterval(animationInterval);
    renderFractionVisual();
}

async function checkGuess() {
    try {
        score = await backend.checkGuess(fraction, userGuess);
        const actualValue = fraction.numerator / fraction.denominator;
        
        document.getElementById('user-guess').textContent = `Your guess: ${userGuess.toFixed(2)}`;
        document.getElementById('correct-answer').textContent = `Correct answer: ${actualValue.toFixed(2)}`;
        document.getElementById('score').textContent = `Score: ${score}`;
        document.getElementById('result').style.display = 'block';
        
        animateFractionVisualization();
    } catch (error) {
        console.error("Error checking guess:", error);
    }
}

function animateFractionVisualization() {
    clearInterval(animationInterval);
    animationStep = 0;
    animationInterval = setInterval(() => {
        animationStep++;
        renderFractionVisual();
        if (animationStep >= fraction.denominator + fraction.numerator) {
            clearInterval(animationInterval);
        }
    }, 333); // 1/3 second pause
}

function renderFractionVisual() {
    const ticksContainer = document.getElementById('fraction-ticks');
    const fillsContainer = document.getElementById('fraction-fills');
    ticksContainer.innerHTML = '';
    fillsContainer.innerHTML = '';

    for (let i = 0; i <= fraction.denominator; i++) {
        if (i <= animationStep) {
            const tick = document.createElement('div');
            tick.className = 'fraction-tick';
            tick.style.left = `${(i / fraction.denominator) * 100}%`;
            ticksContainer.appendChild(tick);
        }
    }

    for (let i = 0; i < fraction.numerator; i++) {
        if (i + fraction.denominator < animationStep) {
            const fill = document.createElement('div');
            fill.className = 'fraction-fill';
            fill.style.left = `${(i / fraction.denominator) * 100}%`;
            fill.style.width = `${(1 / fraction.denominator) * 100}%`;
            fillsContainer.appendChild(fill);
        }
    }

    document.getElementById('user-guess-line').style.left = `${userGuess * 100}%`;
}

document.getElementById('guess-slider').addEventListener('input', function(event) {
    userGuess = parseFloat(event.target.value);
});

document.getElementById('check-guess').addEventListener('click', checkGuess);
document.getElementById('new-fraction').addEventListener('click', startNewRound);

startNewRound();
