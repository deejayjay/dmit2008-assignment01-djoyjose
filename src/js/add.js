// Import the necessary firebase modules
import { ref as dbRef, push, set } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./libs/firebase/firebaseConfig";

const inputNewToyImage = document.getElementById("newToyImage");
const lblSuccess = document.getElementById("lblAddSuccess");
const lblFailure = document.getElementById("lblAddFailed");

// Attach event listeners
document.querySelector(".togglebtn-menu").addEventListener("click", onMenuButtonClick);
inputNewToyImage.addEventListener("change", onToyImageSelected);
document.forms["addToyForm"].addEventListener("submit", onAddNewToy);

// Toggles menu when the menu button is clicked
function onMenuButtonClick() {
  document.querySelector(".main-sidebar").classList.toggle("active-sidebar");
}

// Displays the selected image when a toy image is selected
function onToyImageSelected(e) {
  const file = e.target.files[0];
  document.querySelector(".toy-image__display > img").src = URL.createObjectURL(file);
}

// Prevents the default form behaviour and saves the new toy info to firebase
function onAddNewToy(e) {
  e.preventDefault();

  // Form data
  const toyTitle = document.getElementById("toyName").value.trim();
  const ageGroup = document.getElementById("toyAgeGroup").value.trim();
  const price = document.getElementById("toyPrice").value.trim();
  const toyImage = inputNewToyImage.files[0];

  saveNewToyInfo(toyTitle, ageGroup, price, toyImage);
}

// Save the toy info to firebase
async function saveNewToyInfo(title, ageGroup, price, image) {
  // Path to the toys info on firebase Realtime Database
  const dataRef = dbRef(db, "toys/");

  // Generate a firebase unique key for the new toy info
  const itemRef = await push(dataRef);

  // Path to the image file on firebase Storage
  const imageRef = storageRef(storage, `images/twl${itemRef.key}`);

  // Upload the image to the firebase storage
  const uploadResult = await uploadBytes(imageRef, image);
  const urlPath = await getDownloadURL(imageRef); // url to the image
  const storagePath = uploadResult.metadata.fullPath; // Relative path to the image in the storage bucket

  // Now, write the toy info to the realtime database under the path "toys"
  set(itemRef, {
    key: itemRef.key,
    sku: `twl${itemRef.key}`,
    image: urlPath,
    imageStoragePath: storagePath,
    title,
    price,
    ageGroup
  })
    .then(() => {
      lblSuccess.style.display = "block";
    })
    .catch((err) => {
      lblFailure.style.display = "block";
      console.log(`Unexpected error occurred while saving new toy info: ${err.message}`);
    });
}

lblSuccess.addEventListener("click", closeStatusMessage);
lblFailure.addEventListener("click", closeStatusMessage);

function closeStatusMessage(e) {
  e.currentTarget.remove();
}
