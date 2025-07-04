// --- Game State Variables ---
const foodItems = ["pizza"]; // Only pizza for now!
let currentCustomerOrder = {}; // Stores the current order, e.g., { "pizza": { numerator: 1, denominator: 2 } }
let playerServing = {}; // Stores what the player has currently prepared, e.g., { "pizza": { numerator: 1, denominator: 2 } }

// --- DOM Elements ---
const orderTextElement = document.getElementById("order-text");
const serveButton = document.getElementById("serve-button");
const feedbackMessageElement = document.getElementById("feedback-message");
const pizzaContainer = document.getElementById("pizza-container");
const pizzaImage = document.getElementById("pizza-img");
const currentServingArea = document.getElementById("current-serving");
const customFractionInput = document.getElementById("custom-fraction-input");
const cutCustomButton = document.getElementById("cut-custom-button");

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
    // Ensure inputs are positive for GCD calculation
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        [a, b] = [b, a % b];
    }
    return a;
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
        denominator: fraction.denominator / commonDivisor
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
    customFractionInput.value = ""; // Clear custom input field

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

/**
 * Function to handle "cutting" a pizza and adding the cut piece to the serving area.
 * @param {number} numerator - The numerator of the slice to add.
 * @param {number} denominator - The denominator of the slice to add.
 */
function cutAndAddToServing(numerator, denominator) {
    const item = "pizza"; // Always pizza now

    const cutPiece = { numerator: numerator, denominator: denominator };

    // Basic validation for the piece being cut
    if (numerator <= 0 || denominator <= 0) {
        feedbackMessageElement.textContent = "Cannot cut a non-positive fraction.";
        return;
    }


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

// Function to handle custom fraction input
function handleCustomCut() {
    const inputString = customFractionInput.value.trim(); // Get value and remove whitespace
    if (!inputString) {
        feedbackMessageElement.textContent = "Please enter a fraction (e.g., 1/2 or 3/4).";
        return;
    }

    const parts = inputString.split('/');

    let numerator, denominator;

    if (parts.length === 2) {
        // It's a fraction like "1/2"
        numerator = parseInt(parts[0], 10);
        denominator = parseInt(parts[1], 10);
    } else if (parts.length === 1) {
        // It's a whole number like "1" (meaning 1/1)
        numerator = parseInt(parts[0], 10);
        denominator = 1;
    } else {
        feedbackMessageElement.textContent = "Invalid fraction format. Use 'N/D' or a whole number.";
        return;
    }

    // Basic validation
    if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
        feedbackMessageElement.textContent = "Invalid numbers for fraction. Please use valid digits and a non-zero denominator.";
        return;
    }
    if (numerator < 0) { // Keep fractions positive for now
         feedbackMessageElement.textContent = "Please enter positive numerators.";
        return;
    }
    // You might want to enforce positive denominators here as well, if that fits your game rules.

    cutAndAddToServing(numerator, denominator); // Use the existing function
    customFractionInput.value = ""; // Clear the input field
}


// --- Event Listeners ---
document.addEventListener("DOMContentLoaded", () => {
    // Attach listeners to the "Cut" buttons.
    pizzaContainer.querySelector("#cut-pizza-half").addEventListener("click", () => {
        cutAndAddToServing(1, 2); // Pass numerator 1, denominator 2
    });

    pizzaContainer.querySelector("#cut-pizza-thirds").addEventListener("click", () => {
        cutAndAddToServing(1, 3); // Pass numerator 1, denominator 3
    });

    const cutPizzaQuartersButton = document.createElement('button');
    cutPizzaQuartersButton.id = 'cut-pizza-quarters';
    cutPizzaQuartersButton.textContent = 'Cut in Quarters';
    pizzaContainer.appendChild(cutPizzaQuartersButton);

    cutPizzaQuartersButton.addEventListener("click", () => {
        cutAndAddToServing(1, 4); // Pass numerator 1, denominator 4
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

    // Add event listener for the custom cut button
    cutCustomButton.addEventListener("click", handleCustomCut);

    // Optional: Allow pressing Enter in the input field to trigger the cut
    customFractionInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            handleCustomCut();
        }
    });

    // --- Initial Game Setup ---
    generateCustomerOrder(); // Generate the first order when the page loads
});
