/* Imports */
// this will check if we have a user and set signout link if it exists
import './auth/user.js';
import { createGroceryItem } from './fetch-utils.js';

/* Get DOM Elements */
const createGroceryItemInputForm = document.getElementById('grocery-item-input-form');
const errorDisplay = document.getElementById('error-display');

/* State */
let items = [];
let error = null;

/* Events */
createGroceryItemInputForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(createGroceryItemInputForm);

    const newItem = {
        quantity: formData.get('quantity'),
        item: formData.get('item'),
    };

    console.log(newItem);

    const response = await createGroceryItem(newItem);
    error = response.error;
    const item = response.data;

    if (error) {
        displayError();
    } else {
        items.push(item);
    }

    createGroceryItemInputForm.reset();
});

/* Display Functions */
function displayError() {
    // eslint-disable-next-line no-console
    console.error(error);
    errorDisplay.textContent = error.message;
}
