// --- Game State Variables ---
const foodItems = ["pizza", "fries", "burger", "salad", "cake"];
let currentCustomerOrder = {}; // Stores the current order, e.g., { "pizza": { numerator: 1, denominator: 2 } }
let playerServing = {}; // Stores what the player has currently prepared, e.g., { "pizza": { numerator: 1, denominator: 2 } }
let availableIngredients = { // What whole ingredients the player has to cut from
    "pizza": { numerator: 1, denominator: 1 } // Represents a whole pizza (1/1)
    // Add other ingredients here as needed, e.g., "fries": { numerator: 1, denominator: 1 }
};

// --- DOM Elements ---
const orderTextElement = document.getElementById("order-text");
const serveButton = document.getElementById("serve-button");
const feedbackMessageElement = document.getElementById("feedback-message");
const pizzaContainer = document.getElementById("pizza-container"); // Reference to the pizza ingredient area
const pizzaImage = document.getElementById("pizza-img");
const currentServingArea = document.getElementById("current-serving");


// --- Utility Functions ---

/**
 * Generates a random fraction.
 * @returns {object} An object with numerator and denominator.
 */
function generateRandomFraction() {
    const denominators = [2, 3, 4, 5, 8, 10];
    const denominator = denominators[Math.floor(Math.random() * denominators.length)];
    let numerator = Math.floor(Math.random() * (denominator - 1)) + 1; // 1 to denominator-1
    return { numerator: numerator, denominator: denominator };
}

/**
 * Converts a fraction object to a string format (e.g., "1/2").
 * @param {object} fraction - {numerator, denominator}
 * @returns {string}
 */
function fractionToString(fraction) {
    // Handle cases where fraction might be 0/X (meaning empty)
    if (fraction.numerator === 0) return "0";
    // Handle whole numbers
    if (fraction.denominator === 1) return `${fraction.numerator}`;
    return `${fraction.numerator}/${fraction.denominator}`;
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


// --- Core Game Logic Functions ---

function generateCustomerOrder() {
    currentCustomerOrder = {}; // Clear previous order
    playerServing = {}; // Reset player's serving for new order
    feedbackMessageElement.textContent = ""; // Clear feedback
    currentServingArea.innerHTML = "<p>Drag and drop items here, or select portions.</p>"; // Reset serving display
    
    // Reset available ingredients to whole for each new order
    availableIngredients = {
        "pizza": { numerator: 1, denominator: 1 }
        // Add other starting ingredients here
    };

    const numItems = Math.floor(Math.random() * 2) + 1; // 1 or 2 items
    const itemsChosen = [];

    for (let i = 0; i < numItems; i++) {
        let item = foodItems[Math.floor(Math.random() * foodItems.length)];
        while (itemsChosen.includes(item)) {
            item = foodItems[Math.floor(Math.random() * foodItems.length)];
        }
        itemsChosen.push(item);

        const fraction = generateRandomFraction();
        currentCustomerOrder[item] = fraction;
    }

    displayCustomerOrder();
    updateAvailableIngredientsDisplay(); // New: Update display for available ingredients
}

function displayCustomerOrder() {
    let orderString = "";
    for (const item in currentCustomerOrder) {
        const fraction = currentCustomerOrder[item];
        orderString += `${fractionToString(fraction)} of a ${item}. `;
    }
    orderTextElement.textContent = `Customer wants: ${orderString}`;
}

function updateAvailableIngredientsDisplay() {
    // This function would visually update the ingredients
    // For now, it's a placeholder, but imagine updating the pizza image to show slices
    // or maybe adding visual "pieces" that can be clicked/dragged.

    // Example: You might hide the cut buttons if an ingredient is "used up"
    // Or change the appearance of the whole pizza to reflect remaining portions (more complex)
}


// --- Player Actions ---

// Function to handle "cutting" an ingredient and adding the cut piece to the serving area.
function cutAndAddToServing(item, targetDenominator) {
    // Check if we have the whole ingredient to cut from (or enough of it)
    if (!availableIngredients[item] || availableIngredients[item].numerator === 0) {
        feedbackMessageElement.textContent = `No ${item} left to cut!`;
        return;
    }

    // Determine the size of one cut piece (e.g., 1/2, 1/3)
    const cutPiece = { numerator: 1, denominator: targetDenominator };

    // You would eventually need to model *remaining* pieces of the ingredient.
    // For simplicity right now, let's assume we cut a portion off a virtual "infinite" supply
    // or that each button represents taking a specific cut *from a new whole*.
    // The current setup simply adds the specified fraction to the player's serving.

    // If the playerServing already has this item, add the fractions
    if (playerServing[item]) {
        playerServing[item] = addFractions(playerServing[item], cutPiece);
    } else {
        playerServing[item] = cutPiece;
    }

    updateServingDisplay();
    feedbackMessageElement.textContent = `Added ${fractionToString(cutPiece)} of a ${item} to your serving. Total ${fractionToString(playerServing[item])} of a ${item}.`;
}

function updateServingDisplay() {
    let servingString = "";
    for (const item in playerServing) {
        servingString += `<div class="serving-item">${fractionToString(playerServing[item])} ${item}</div>`;
    }
    if (servingString === "") {
        currentServingArea.innerHTML = "<p>Drag and drop items here, or select portions.</p>";
    } else {
        currentServingArea.innerHTML = servingString;
    }
}


function serveOrder() {
    let allCorrect = true;
    let feedback = "";
    let matchedItems = new Set(); // To track which ordered items were matched

    // Check if player has served something for each item in the order AND if it's correct
    for (const orderedItem in currentCustomerOrder) {
        const orderedFraction = currentCustomerOrder[orderedItem];

        if (playerServing[orderedItem]) {
            const servedFraction = playerServing[orderedItem];
            if (areFractionsEquivalent(orderedFraction, servedFraction)) {
                feedback += `Correctly served ${fractionToString(orderedFraction)} of a ${orderedItem}! `;
                matchedItems.add(orderedItem);
            } else {
                feedback += `Incorrect portion for ${orderedItem}. Expected ${fractionToString(orderedFraction)}, got ${fractionToString(servedFraction)}. `;
                allCorrect = false;
            }
        } else {
            feedback += `Missing ${fractionToString(orderedFraction)} of a ${orderedItem}. `;
            allCorrect = false;
        }
    }

    // Check for extra items served that weren't ordered
    for (const servedItem in playerServing) {
        if (!currentCustomerOrder[servedItem]) {
            feedback += `Served extra ${fractionToString(playerServing[servedItem])} of a ${servedItem}. `;
            allCorrect = false;
        }
    }
    
    // Final check for overall correctness and complete order fulfillment
    if (allCorrect && Object.keys(currentCustomerOrder).length === matchedItems.size) {
        feedbackMessageElement.textContent = "Order served correctly! Great job!";
        // Reset game for next order after a short delay
        setTimeout(() => {
            generateCustomerOrder();
        }, 2000);
    } else {
        feedbackMessageElement.textContent = `Order incorrect: ${feedback}Please adjust your serving.`;
    }
}


// --- Event Listeners ---

// Attach listeners to the "Cut" buttons.
// Note: We'll need to update these if you have more dynamic ingredient displays.
pizzaContainer.querySelector("#cut-pizza-half").addEventListener("click", () => {
    cutAndAddToServing("pizza", 2); // Cut into 1/2 and add that piece to serving
});

pizzaContainer.querySelector("#cut-pizza-thirds").addEventListener("click", () => {
    cutAndAddToServing("pizza", 3); // Cut into 1/3 and add that piece to serving
});

serveButton.addEventListener("click", serveOrder);

// --- Initial Game Setup ---
document.addEventListener("DOMContentLoaded", () => {
    generateCustomerOrder(); // Generate the first order when the page loads
});
