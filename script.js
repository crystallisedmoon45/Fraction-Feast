// --- Game State Variables ---
const foodItems = ["pizza", "fries", "burger", "salad", "cake"];
let currentCustomerOrder = {}; // Stores the current order, e.g., { "pizza": { numerator: 1, denominator: 2 } }

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
    return `${fraction.numerator}/${fraction.denominator}`;
}

// --- Core Game Logic Functions ---

function generateCustomerOrder() {
    currentCustomerOrder = {}; // Clear previous order
    feedbackMessageElement.textContent = ""; // Clear feedback

    const numItems = Math.floor(Math.random() * 2) + 1; // 1 or 2 items for simplicity
    const itemsChosen = [];

    for (let i = 0; i < numItems; i++) {
        let item = foodItems[Math.floor(Math.random() * foodItems.length)];
        // Ensure unique items for multi-item orders
        while (itemsChosen.includes(item)) {
            item = foodItems[Math.floor(Math.random() * foodItems.length)];
        }
        itemsChosen.push(item);

        const fraction = generateRandomFraction();
        currentCustomerOrder[item] = fraction;
    }

    displayCustomerOrder();
}

function displayCustomerOrder() {
    let orderString = "";
    for (const item in currentCustomerOrder) {
        const fraction = currentCustomerOrder[item];
        orderString += `${fractionToString(fraction)} of a ${item}. `;
    }
    orderTextElement.textContent = `Customer wants: ${orderString}`;
}

// --- Player Actions (Basic Example) ---

// This will be simplified for now. In a real game, you'd visually cut the pizza.
// For demonstration, let's assume we can add a 'portion' to the serving area.
let playerServing = {}; // To store what the player has currently prepared

function addPortionToServing(item, numerator, denominator) {
    // For now, let's just assume we add it directly.
    // Later, you'd add visual elements for each portion.

    // If the item is already in serving, we might need to add fractions
    if (playerServing[item]) {
        // Simple addition for demonstration (requires finding common denominator later)
        // This is where fraction math comes in!
        feedbackMessageElement.textContent = "Cannot add more than one type of portion yet!";
        return;
    }
    playerServing[item] = { numerator: numerator, denominator: denominator };
    currentServingArea.innerHTML = `<p>Currently serving: ${fractionToString(playerServing[item])} of a ${item}</p>`;
    feedbackMessageElement.textContent = `Added ${fractionToString(playerServing[item])} of a ${item} to serving.`;
}

function serveOrder() {
    // This is a very basic validation.
    // We'll need robust fraction comparison later (e.g., 1/2 == 2/4)

    let allCorrect = true;
    let feedback = "";

    // Check if player has served something for each item in the order
    for (const item in currentCustomerOrder) {
        if (!playerServing[item]) {
            feedback += `Missing ${fractionToString(currentCustomerOrder[item])} of a ${item}. `;
            allCorrect = false;
        } else {
            // Very simple comparison for now: direct match.
            // This is where fraction equivalence logic needs to go!
            const orderedFraction = currentCustomerOrder[item];
            const servedFraction = playerServing[item];

            if (orderedFraction.numerator === servedFraction.numerator &&
                orderedFraction.denominator === servedFraction.denominator) {
                feedback += `Correctly served ${fractionToString(orderedFraction)} of a ${item}! `;
            } else {
                feedback += `Incorrect portion for ${item}. Expected ${fractionToString(orderedFraction)}, got ${fractionToString(servedFraction)}. `;
                allCorrect = false;
            }
        }
    }

    if (allCorrect && Object.keys(playerServing).length === Object.keys(currentCustomerOrder).length) {
        feedbackMessageElement.textContent = "Order served correctly! Great job!";
        // Reset game for next order after a short delay
        setTimeout(() => {
            playerServing = {}; // Reset serving
            currentServingArea.innerHTML = "<p>Drag and drop items here, or select portions.</p>";
            generateCustomerOrder();
        }, 2000);
    } else {
        feedbackMessageElement.textContent = `Order incorrect: ${feedback}Try again!`;
    }
}


// --- Event Listeners ---

// Add a generic listener for the cut buttons on the pizza
// We'll need to make these buttons dynamic or use event delegation
pizzaContainer.querySelector("#cut-pizza-half").addEventListener("click", () => {
    addPortionToServing("pizza", 1, 2);
});

pizzaContainer.querySelector("#cut-pizza-thirds").addEventListener("click", () => {
    addPortionToServing("pizza", 1, 3); // Example
});


serveButton.addEventListener("click", serveOrder);

// --- Initial Game Setup ---
document.addEventListener("DOMContentLoaded", () => {
    generateCustomerOrder(); // Generate the first order when the page loads
});
