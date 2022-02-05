function rentalCard({ key, city, urlPath }) {
  const template = `
  <aside class="vacation-rentals">
    <figure>
      <img src="${urlPath}" width="160" alt="rental property" />
      <figcaption><h2>${city}</h2></figcaption>
    </figure>

    <footer>
      <button id="edit" data-key="${key}">edit</button>
      <button id="delete" data-key="${key}">delete</button>
    </footer>
  </aside>
  `;

  const element = document.createRange().createContextualFragment(template).children[0];
  addCardControls(element);
  return element;
}

function addCardControls(rental) {
  rental.querySelector("#edit").addEventListener("click", onEditRental);
  rental.querySelector("#delete").addEventListener("click", onRemoveRental);
}

function onEditRental(e) {
  const key = e.target.dataset.key;
  sessionStorage.setItem("key", key);
  window.location.assign("update.html");
}

function onRemoveRental(e) {
  const key = e.target.dataset.key;
  sessionStorage.setItem("key", key);
  window.location.assign("delete.html");
}

export { rentalCard };
