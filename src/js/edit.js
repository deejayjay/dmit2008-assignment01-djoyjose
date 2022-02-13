// Import the necessary firebase modules
import { db, storage } from "./libs/firebase/firebaseConfig";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as databaseRef, get, set } from "firebase/database";

// Retrieve the key stored in the session storage
const key = sessionStorage.getItem("key");
let toyRef, existingToyInfo;

// Get reference to elements that need global scope
const editForm = document.forms["editToyForm"];
const uploadImage = document.getElementById("uploadImage");
const inputToyImage = document.getElementById("inputToyImage");
const lblSuccess = document.getElementById("lblAddSuccess");
const lblFailure = document.getElementById("lblAddFailed");

pageInit();

async function pageInit() {
  // Attach event listeners
  editForm.addEventListener("submit", onSaveChanges);
  inputToyImage.addEventListener("change", onSelectedImageChanges);
  document.querySelector(".togglebtn-menu").addEventListener("click", onMenuButtonClick);

  // Retrieve the toy info from firebase
  toyRef = databaseRef(db, `toys/${key}`);
  const toySnapShot = await get(toyRef);

  // If toy info exists, populate the form fields
  if (toySnapShot.exists()) {
    existingToyInfo = toySnapShot.val();
    populateExistingToyInfo(existingToyInfo);
  }
}

// Toggles menu when the menu button is clicked
function onMenuButtonClick() {
  document.querySelector(".main-sidebar").classList.toggle("active-sidebar");
}

// Add, add the toy info to the form fields
function populateExistingToyInfo({ title, ageGroup, price, image: imageUrl }) {
  editForm.elements["toyName"].value = title;
  editForm.elements["toyAgeGroup"].value = ageGroup;
  editForm.elements["toyPrice"].value = price;
  uploadImage.src = imageUrl;
}

// This function is used to update an existing toy info
async function updateToyInfo() {
  // Retrieve the new toy info from form fields
  const title = editForm.elements["toyName"].value.trim();
  const ageGroup = editForm.elements["toyAgeGroup"].value.trim();
  const price = editForm.elements["toyPrice"].value.trim();

  // Retrieve existing toy info for any field that is not in the form
  // IMPORTANT because the set() method will overwrite any data at this location and all child locations
  const sku = existingToyInfo.sku;
  let image = existingToyInfo.image;
  let imageStoragePath = existingToyInfo.imageStoragePath;

  // If there is a new toy image selected,
  // replace the existing toy image on firebase storage with the new one
  if (inputToyImage.files.length > 0) {
    const newImageRef = storageRef(storage, `images/twl${key}`);
    const uploadResult = await uploadBytes(newImageRef, inputToyImage.files[0]);
    image = await getDownloadURL(newImageRef);
    imageStoragePath = uploadResult.metadata.fullPath;
  }

  // Now write the new toy info to the location
  set(toyRef, {
    key,
    sku,
    image,
    imageStoragePath,
    title,
    price,
    ageGroup
  })
    .then(() => {
      // Once the update is successful, remove the key from session
      sessionStorage.removeItem("key");
      lblSuccess.style.display = "block"; // Display success status message
    })
    .catch((err) => {
      lblFailure.style.display = "block"; // Display failed status message
      console.log(`Unexpected error occurred while updating existing toy information: ${err.message}`);
    });
}

// Save the changes to firebase
function onSaveChanges(e) {
  e.preventDefault();

  // Now, update the toy info
  updateToyInfo();
}

// Change the image to the newly selected image
function onSelectedImageChanges(e) {
  const file = e.target.files[0];
  uploadImage.src = URL.createObjectURL(file);
}

lblSuccess.addEventListener("click", closeStatusMessage);
lblFailure.addEventListener("click", closeStatusMessage);

function closeStatusMessage(e) {
  e.currentTarget.remove();
}
