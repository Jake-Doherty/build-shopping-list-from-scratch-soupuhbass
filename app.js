/* Imports */
// this will check if we have a user and set signout link if it exists
import './auth/user.js';
import {
    createGroceryItem,
    deleteGrabbed,
    deleteGroceryList,
    deleteSingleItem,
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
export let items = [];
let error = null;

export async function fetchData() {
    const response = await getGroceryItem();

    error = response.error;
    items = response.data;
}

/* Events */
window.addEventListener('load', async () => {
    await fetchData();

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

export async function displayGroceryItem() {
    await fetchData();
    shoppingList.innerHTML = '';
    for (const item of items) {
        const itemEl = renderGroceryItem(item);

        const listButtCont = document.createElement('div');
        listButtCont.classList.add('grocery-item');

        const button = document.createElement('button');
        button.classList.add('delete-single-item');
        button.textContent = 'Remove Item';

        listButtCont.append(itemEl, button);
        shoppingList.append(listButtCont);

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

        button.addEventListener('click', async () => {
            const response = await deleteSingleItem(item.id);

            error = response.error;

            if (error) {
                error = error.message;
            } else {
                button.parentNode.remove();

                await fetchData();
                displayGroceryItem();
            }
        });
    }
}
