// Select elements from the DOM
const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");

let cards;
let interval;
let firstCard = null;
let secondCard = null;
let disableDeck = false;

// Array of items with names and image paths
const items = [
    { name: "bee", image: "bee.jpg" },
    { name: "lion", image: "lion.jpg" },
    { name: "horse", image: "horse.jpg" },
    { name: "deer", image: "deer.jpg" },
    { name: "tiger", image: "tiger.jpg" },
    { name: "penguin", image: "penguin.jpg" },
    { name: "parrot", image: "parrot.jpg" },
    { name: "panda", image: "panda.jpg" },
    { name: "cat", image: "cat.jpg" },
    { name: "dog", image: "dog.jpg" },
];

// Timer variables
let seconds = 0,
    minutes = 0;

// Game state variables
let movesCount = 0;
let winCount = 0;
let score = 0; 

// Function to update the timer display
const timeGenerator = () => {
    seconds += 1;

    if (seconds >= 60) {
        minutes += 1;
        seconds = 0;
    }

    // Correct use of template literals and assignment
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    timeValue.innerHTML = `<span>Time:</span> ${minutesValue}:${secondsValue}`;
};

// Function to update the move counter display
const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
};

// Function to generate random card values
const generateRandom = (size = 4) => {
    let tempArray = [...items];
    let cardValues = [];
    size = (size * size) / 2;
    for (let i = 0; i < size; i++) {
        // Correct use of Math.random()
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        tempArray.splice(randomIndex, 1);
    }
    return cardValues;
};

// Function to create the game board matrix
const matrixGenerator = (cardValues, size = 4) => {
    gameContainer.innerHTML = ""; 
    cardValues = [...cardValues, ...cardValues]; 
    cardValues.sort(() => Math.random() - 0.5); 

    // Create HTML for each card
    for (let i = 0; i < size * size; i++) {
        gameContainer.innerHTML += `
            <div class="card-container" data-card-value="${cardValues[i].name}">
                <div class="card-before">?</div>
                <div class="card-after">
                    <img src="${cardValues[i].image}" class="image">
                </div>
            </div>`;
    }

    // Set grid style correctly
    gameContainer.style.gridTemplateColumns = `repeat(${size}, auto)`;

    // Add event listeners to each card
    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            if (!card.classList.contains("matched") && !card.classList.contains("flipped") && !disableDeck) {
                card.classList.add("flipped");
                if (!firstCard) {
                    firstCard = card;
                } else {
                    secondCard = card;
                    disableDeck = true; // Disable the deck to prevent further clicks
                    movesCounter(); // Increment moves

                    if (firstCard.getAttribute("data-card-value") === secondCard.getAttribute("data-card-value")) {
                        // Match found
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");
                        firstCard = null;
                        secondCard = null;
                        winCount += 1;
                        disableDeck = false; // Enable deck after matching

                        // Check for win condition
                        if (winCount === cardValues.length / 2) {
                            clearInterval(interval);
                            score = calculateScore(movesCount, minutes, seconds); // Calculate score
                            result.innerHTML = `<span>You Win!</span> Moves: ${movesCount}, Time: ${minutes}:${seconds}, Score: ${score}`;
                        }
                    } else {
                        // No match
                        setTimeout(() => {
                            firstCard.classList.remove("flipped");
                            secondCard.classList.remove("flipped");
                            firstCard = null;
                            secondCard = null;
                            disableDeck = false; // Enable deck after cards flip back
                        }, 1000);
                    }
                }
            }
        });
    });
};

// Function to calculate the total score
const calculateScore = (moves, minutes, seconds) => {
    // Simple scoring system: fewer moves and less time give a higher score
    let timePenalty = minutes * 60 + seconds;
    return Math.max(0, 1000 - moves * 10 - timePenalty * 2);
};

// Initializer function to start the game
const initializer = () => {
    result.innerText = ""; 
    winCount = 0; 
    movesCount = 0; 
    seconds = 0;
    minutes = 0;
    movesCounter(); // Display initial moves count
    timeValue.innerHTML = `<span>Time:</span> 00:00`;
    clearInterval(interval);
    interval = setInterval(timeGenerator, 1000); // Start the timer

    let cardValues = generateRandom(); 
    console.log(cardValues); 
    matrixGenerator(cardValues);
};

// Add event listeners to start and stop buttons
startButton.addEventListener("click", () => {
    controls.classList.add("hide");
    initializer();
});

stopButton.addEventListener("click", () => {
    controls.classList.remove("hide");
    clearInterval(interval);
    gameContainer.innerHTML = "";
    result.innerHTML = `<span>Game Stopped</span>`;
});

// Start the game on page load
initializer();
