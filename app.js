/* Imports */
// this will check if we have a user and set signout link if it exists
import './auth/user.js';
import {
    createGroceryItem,
    deleteGrabbed,
    deleteGroceryList,
    getGroceryItem,
    updateGroceryItem,
} from './fetch-utils.js';
import { renderGroceryItem } from './render-utils.js';

/* Get DOM Elements */
const createGroceryItemInputForm = document.getElementById('grocery-item-input-form');
const errorDisplay = document.getElementById('error-display');
const shoppingList = document.getElementById('shopping-list');
const deleteAll = document.getElementById('delete-list');
const deleteCompleted = document.getElementById('delete-completed');

/* State */
let items = [];
let error = null;

/* Events */
window.addEventListener('load', async () => {
    const response = await getGroceryItem();

    error = response.error;
    items = response.data;

    if (error) {
        displayError();
    } else {
        displayGroceryItem();
    }
});

createGroceryItemInputForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(createGroceryItemInputForm);

    const newItem = {
        quantity: formData.get('quantity'),
        item: formData.get('item'),
    };

    const response = await createGroceryItem(newItem);
    error = response.error;
    const item = response.data;

    if (error) {
        displayError();
    } else {
        items.push(item);
        displayGroceryItem();
        createGroceryItemInputForm.reset();
    }
});

deleteAll.addEventListener('click', async () => {
    const response = await deleteGroceryList();

    error = response.error;

    if (error) {
        error = error.message;
    } else {
        items = [];
        displayGroceryItem();
    }
});

deleteCompleted.addEventListener('click', async () => {
    const response = await deleteGrabbed();

    const stillNeed = [];
    for (const item of items) {
        if (item.bought === false) {
            stillNeed.push(item);
        }
    }

    items = stillNeed;

    error = response.error;

    if (error) {
        error = error.message;
    } else {
        displayGroceryItem();
    }
});

/* Display Functions */
function displayError() {
    // eslint-disable-next-line no-console
    console.error(error);
    errorDisplay.textContent = error.message;
}

export function displayGroceryItem() {
    shoppingList.innerHTML = '';
    for (const item of items) {
        const itemEl = renderGroceryItem(item);
        shoppingList.append(itemEl);

        if (item.bought === true) {
            itemEl.classList.add('purchased');
        }

        itemEl.addEventListener('click', async () => {
            const response = await updateGroceryItem(item.id);

            error = response.error;
            const updatedItem = response.data;

            if (item.bought === true) {
                return;
            }

            if (error) {
                displayError();
            } else {
                const index = items.indexOf(item);
                items[index] = updatedItem;
                displayGroceryItem();
            }
        });
    }
}
