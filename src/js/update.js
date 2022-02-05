import { db, storage } from "./libs/firebase/firebaseConfig";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { ref as databaseRef, set, get } from "firebase/database";

const rentalForm = document.forms["rentalForm"];
let rentalData, rentalRef;

rentalForm.addEventListener("submit", onUpdateRental);

pageInit();

async function pageInit() {
  const key = sessionStorage.getItem("key");
  console.log("Update page");
  console.log(key);

  // Ref with key  rental/key
  rentalRef = databaseRef(db, `rentals/${key}`);

  // get data
  const rentalSnapShot = await get(rentalRef);
  rentalData = rentalSnapShot.val();

  // populate the form
  renderExistingRental(rentalData);
}

function renderExistingRental(existingData) {
  const template = `
  <div>
    <div class="property-image form-control">
      <div class="display">
        <img src="${existingData.urlPath}" alt="jimhortons vacation upload images of your vacaction rental" />
      </div>
      <label for="rentalImage">Select image</label>
      <input type="file" id="rentalImage" style="display: none" class="select-file" accept=".jpg, .png, .jpeg, .webp" />
    </div>
    <div class="rental-name form-control">
      <label for="cityName">rental property city</label>
      <input id="cityName" type="text" value="${existingData.city}" />
    </div>
    <div class="submit-button form-control">
      <button type="submit">Update Property</button>
    </div>
  </div>
  `;

  const element = document.createRange().createContextualFragment(template).children[0];
  element.querySelector("#rentalImage").addEventListener("change", onImageSelected);
  rentalForm.append(element);
}

async function onUpdateRental(e) {
  e.preventDefault();

  // Reference to existing image in Storage
  const existingImage = storageRef(storage, rentalData.storagePath);
  // Delete the existing image from the Storage
  deleteObject(existingImage)
    .then(updateRentalInfoInDatabase)
    .catch(error => {
      console.log(`Unexpected error occurred when trying to delete the image from the storage: ${error.message}`);
    });
}

async function updateRentalInfoInDatabase() {
  console.log("Existing image was deleted successfully!!!");
  const newCity = document.getElementById("cityName").value.trim();
  const newImage = document.getElementById("rentalImage").files[0];

  const newImageRef = storageRef(storage, `images/${newImage.name}`);
  const uploadResult = await uploadBytes(newImageRef, newImage);
  const newUrlPath = await getDownloadURL(newImageRef);
  const newStoragePath = await uploadResult.metadata.fullPath;

  // Update the rental info once the old image was deleted successfully
  set(rentalRef, {
    key: rentalData.key,
    sku: rentalData.sku,
    urlPath: newUrlPath,
    storagePath: newStoragePath,
    city: newCity,
    price: 13999
  })
    .then(() => {
      console.log("Rental information was updated successfully!!!");
      sessionStorage.removeItem("key");
    })
    .catch(error => console.log(`Error occurred while updating existing rental information: ${error.message}`));
}

function onImageSelected(e) {
  const file = e.target.files[0];
  document.querySelector(".display img").src = URL.createObjectURL(file);
}
