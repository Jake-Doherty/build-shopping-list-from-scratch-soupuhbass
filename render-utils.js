import { displayGroceryItem, fetchData, shoppingList } from './app.js';
import { deleteSingleItem } from './fetch-utils.js';

let error = null;

export function renderGroceryItem(item) {
    const listButtCont = document.createElement('div');
    listButtCont.classList.add('grocery-item');

    const li = document.createElement('li');

    const button = document.createElement('button');
    button.classList.add('delete-single-item');
    button.textContent = 'Remove Item';

    const p = document.createElement('p');
    p.textContent = `${item.quantity} ${item.item}`;

    button.addEventListener('click', async () => {
        const response = await deleteSingleItem(item.id);

        error = response.error;

        if (error) {
            error = error.message;
        } else {
            li.parentNode.remove();

            await fetchData();
            displayGroceryItem();
        }
    });

    listButtCont.append(li, button);

    li.append(p);

    return listButtCont;
}
