// --- Game State Variables ---
const foodItems = ["pizza"]; // Only pizza for now!
let currentCustomerOrder = {}; // Stores the current order, e.g., { "pizza": { numerator: 1, denominator: 2 } }
let playerServing = {}; // Stores what the player has currently prepared, e.g., { "pizza": { numerator: 1, denominator: 2 } }
// In a real game, you might track individual cut pieces, but for now, we'll accumulate them
// For simplicity, let's assume cutting always results in a portion being added to playerServing.

// --- DOM Elements ---
const orderTextElement = document.getElementById("order-text");
const serveButton = document.getElementById("serve-button");
const feedbackMessageElement = document.getElementById("feedback-message");
const pizzaContainer = document.getElementById("pizza-container");
const pizzaImage = document.getElementById("pizza-img");
const currentServingArea = document.getElementById("current-serving");


// --- Utility Functions ---

/**
 * Generates a random fraction for pizza (common denominators for pizza slices).
 * @returns {object} An object with numerator and denominator.
 */
function generateRandomPizzaFraction() {
    // Pizza specific denominators: halves, thirds, quarters, eighths
    const denominators = [2, 3, 4, 6, 8];
    const denominator = denominators[Math.floor(Math.random() * denominators.length)];
    let numerator = Math.floor(Math.random() * (denominator - 1)) + 1; // 1 to denominator-1
    return { numerator: numerator, denominator: denominator };
}

/**
 * Finds the greatest common divisor (GCD) using Euclidean algorithm.
 */
function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

/**
 * Simplifies a fraction.
 * @param {object} fraction - {numerator, denominator}
 * @returns {object} Simplified fraction.
 */
function simplifyFraction(fraction) {
    if (fraction.numerator === 0) return { numerator: 0, denominator: 1 };
    const commonDivisor = gcd(fraction.numerator, fraction.denominator);
    return {
        numerator: fraction.numerator / commonDivisor,
        denominator: fraction.denominator / commonDivor
    };
}

/**
 * Adds two fractions.
 * @param {object} f1 - First fraction {numerator, denominator}
 * @param {object} f2 - Second fraction {numerator, denominator}
 * @returns {object} Sum of fractions, simplified.
 */
function addFractions(f1, f2) {
    const commonDenominator = f1.denominator * f2.denominator;
    const newNumerator1 = f1.numerator * f2.denominator;
    const newNumerator2 = f2.numerator * f1.denominator;
    const sumNumerator = newNumerator1 + newNumerator2;
    return simplifyFraction({ numerator: sumNumerator, denominator: commonDenominator });
}

/**
 * Compares two fractions for equality, considering equivalence (e.g., 1/2 == 2/4).
 * @param {object} f1 - First fraction {numerator, denominator}
 * @param {object} f2 - Second fraction {numerator, denominator}
 * @returns {boolean} True if fractions are equivalent, false otherwise.
 */
function areFractionsEquivalent(f1, f2) {
    const sF1 = simplifyFraction(f1);
    const sF2 = simplifyFraction(f2);
    return sF1.numerator === sF2.numerator && sF1.denominator === sF2.denominator;
}

/**
 * Converts a fraction object to a string format (e.g., "1/2").
 * @param {object} fraction - {numerator, denominator}
 * @returns {string}
 */
function fractionToString(fraction) {
    if (fraction.numerator === 0) return "0";
    if (fraction.denominator === 1) return `${fraction.numerator}`; // Display whole numbers
    return `${fraction.numerator}/${fraction.denominator}`;
}


// --- Core Game Logic Functions ---

function generateCustomerOrder() {
    currentCustomerOrder = {}; // Clear previous order
    playerServing = {}; // Reset player's serving for new order
    feedbackMessageElement.textContent = ""; // Clear feedback
    currentServingArea.innerHTML = "<p>Click 'Cut' buttons to add pizza slices!</p>"; // Reset serving display

    // Always generate an order for pizza only
    const fraction = generateRandomPizzaFraction();
    currentCustomerOrder["pizza"] = fraction;

    displayCustomerOrder();
    updatePizzaDisplay(); // Update display for pizza
}

function displayCustomerOrder() {
    const fraction = currentCustomerOrder["pizza"];
    orderTextElement.textContent = `Customer wants: ${fractionToString(fraction)} of a pizza.`;
}

function updatePizzaDisplay() {
    // This is where you would visually update the pizza based on cuts
    // For now, it's a placeholder.
    // We will develop this part next to show the pizza being "cut" visually.
}


// --- Player Actions ---

// Function to handle "cutting" a pizza and adding the cut piece to the serving area.
function cutAndAddToServing(targetDenominator) {
    const item = "pizza"; // Always pizza now

    // Determine the size of one cut piece (e.g., 1/2, 1/3)
    const cutPiece = { numerator: 1, denominator: targetDenominator };

    // If the playerServing already has pizza, add the new slice to it
    if (playerServing[item]) {
        playerServing[item] = addFractions(playerServing[item], cutPiece);
    } else {
        playerServing[item] = cutPiece;
    }

    updateServingDisplay();
    feedbackMessageElement.textContent = `Added ${fractionToString(cutPiece)} of a pizza to your serving. Total: ${fractionToString(playerServing[item])} of a pizza.`;
}

function updateServingDisplay() {
    let servingString = "";
    if (playerServing["pizza"]) {
        servingString = `<div class="serving-item">You are preparing: ${fractionToString(playerServing["pizza"])} of a pizza</div>`;
    }
    
    if (servingString === "") {
        currentServingArea.innerHTML = "<p>Click 'Cut' buttons to add pizza slices!</p>";
    } else {
        currentServingArea.innerHTML = servingString;
    }
}


function serveOrder() {
    const orderedItem = "pizza";
    const orderedFraction = currentCustomerOrder[orderedItem];
    let feedback = "";
    let allCorrect = true;

    if (playerServing[orderedItem]) {
        const servedFraction = playerServing[orderedItem];
        if (areFractionsEquivalent(orderedFraction, servedFraction)) {
            feedback = `Correctly served ${fractionToString(orderedFraction)} of a pizza!`;
        } else {
            feedback = `Incorrect portion for pizza. Expected ${fractionToString(orderedFraction)}, but you prepared ${fractionToString(servedFraction)}.`;
            allCorrect = false;
        }
    } else {
        feedback = `Missing pizza! Customer wants ${fractionToString(orderedFraction)} of a pizza.`;
        allCorrect = false;
    }
    
    // Check if player served more than just pizza (not possible with current setup, but good for future)
    for (const servedItem in playerServing) {
        if (servedItem !== "pizza") {
            feedback += ` You prepared an extra ${servedItem} which wasn't ordered.`;
            allCorrect = false;
        }
    }


    if (allCorrect) {
        feedbackMessageElement.textContent = feedback + " Great job!";
        // Reset game for next order after a short delay
        setTimeout(() => {
            generateCustomerOrder();
        }, 2000);
    } else {
        feedbackMessageElement.textContent = `Order incorrect: ${feedback} Please adjust your serving.`;
    }
}


// --- Event Listeners ---

// We'll create buttons for various cut sizes dynamically later or keep fixed ones
// For now, let's assume we have specific buttons for common pizza cuts
pizzaContainer.querySelector("#cut-pizza-half").addEventListener("click", () => {
    cutAndAddToServing(2); // Cut into 1/2 and add that piece to serving
});

pizzaContainer.querySelector("#cut-pizza-thirds").addEventListener("click", () => {
    cutAndAddToServing(3); // Cut into 1/3 and add that piece to serving
});

// Let's add a button to cut into quarters too, as it's common for pizza
const cutPizzaQuartersButton = document.createElement('button');
cutPizzaQuartersButton.id = 'cut-pizza-quarters';
cutPizzaQuartersButton.textContent = 'Cut in Quarters';
pizzaContainer.appendChild(cutPizzaQuquartersButton); // Add it to the container

cutPizzaQuartersButton.addEventListener("click", () => {
    cutAndAddToServing(4); // Cut into 1/4 and add that piece to serving
});

// A button to clear the current serving (useful for corrections)
const clearServingButton = document.createElement('button');
clearServingButton.id = 'clear-serving';
clearServingButton.textContent = 'Clear Serving';
pizzaContainer.appendChild(clearServingButton); // Or place it near the serving area

clearServingButton.addEventListener("click", () => {
    playerServing = {};
    updateServingDisplay();
    feedbackMessageElement.textContent = "Serving cleared. Start fresh!";
});


serveButton.addEventListener("click", serveOrder);

// --- Initial Game Setup ---
document.addEventListener("DOMContentLoaded", () => {
    generateCustomerOrder(); // Generate the first order when the page loads
});
