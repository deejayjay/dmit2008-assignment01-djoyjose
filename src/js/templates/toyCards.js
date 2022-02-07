function getToyCard({ key, title, ageGroup, price, image }) {
  const cardTemplate = `
  <section class="toys-card" id="toyCard${key}">
    <div class="toys-card__top">
      <div class="toys-actions">
        <i class="fas fa-edit" id="editToy" title="edit toy" data-key="${key}"></i>
        <i class="fas fa-trash" id="deleteToy" title="delete toy" data-key="${key}"></i>
      </div>
      <div class="toy-image__wrapper">
        <img src="${image}" alt="A picture of ${title}" class="toy-image" />
      </div>
      <div class="toy-info__wrapper">
        <h3 class="toy-title">${title}</h3>
        <p class="toy-age-group">${ageGroup} year olds</p>
        <p class="toy-price">\$${price}</p>
      </div>
    </div>
    <button class="btn-add-to-cart btn-global btn-global--gold">
      <i class="fas fa-cart-plus"></i>
      Add to Cart
    </button>
  </section>
  `;

  const toyCard = document.createRange().createContextualFragment(cardTemplate).children[0];
  addCardControls(toyCard);
  return toyCard;
}

function addCardControls(toyCard) {
  toyCard.querySelector("#editToy").addEventListener("click", onEditToyInfo);
  toyCard.querySelector("#deleteToy").addEventListener("click", onDeleteToyInfo);
}

function onEditToyInfo(e) {
  const key = e.target.dataset.key;
  console.log({ key });
  // sessionStorage.setItem("key", key);
  // window.location.assign("edit.html");
}

function onDeleteToyInfo(e) {
  // Storge the item key to session
  sessionStorage.setItem("key", e.target.dataset.key);

  // Show the Confirm Delete modal window
  document.querySelector(".confirm-delete__overlay").classList.remove("hidden");
}

export { getToyCard };
