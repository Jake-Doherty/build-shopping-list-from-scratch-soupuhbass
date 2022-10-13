export function renderGroceryItem(item) {
    const li = document.createElement('li');

    const p = document.createElement('p');
    p.textContent = `${item.quantity} ${item.item}`;

    li.append(p);

    return li;
}
