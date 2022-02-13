function getNoToysMessage() {
  const templete = `
    <output class="no-toys_message">
      You have not added any toys. Please add toys by clicking on the Add Toy button.
    </output>
  `;

  const noToyMessage = document.createRange().createContextualFragment(templete).children[0];
  return noToyMessage;
}

export default getNoToysMessage;
