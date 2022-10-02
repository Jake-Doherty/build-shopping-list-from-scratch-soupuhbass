import { displayGroceryItem } from './app.js';
import { deleteSingleItem } from './fetch-utils.js';

let error = null;

export function renderGroceryItem(item) {
    const li = document.createElement('li');

    const button = document.createElement('button');
    button.classList.add('delete-single-item');
    button.textContent = 'Remove Item';

    button.addEventListener('click', async () => {
        const response = await deleteSingleItem(item.id);

        error = response.error;

        if (error) {
            error = error.message;
        } else {
            displayGroceryItem();
        }
    });

    const p = document.createElement('p');
    p.textContent = `${item.quantity} ${item.item}`;

    li.append(p, button);

    return li;
}
