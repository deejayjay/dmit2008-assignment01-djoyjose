// Import the necessary firebase modules
import { ref as dbRef, get, remove } from "firebase/database";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { db, storage } from "./libs/firebase/firebaseConfig";
import { getToyCard } from "./templates/toyCards";

document.querySelector(".togglebtn-menu").addEventListener("click", onMenuButtonClick);
document.querySelector(".btn-delete-confirm").addEventListener("click", onConfirmDelete);
document.querySelector(".btn-delete-cancel").addEventListener("click", onConfirmCancel);

pageInit();

async function pageInit() {
  const dataRef = dbRef(db, "toys/");
  const toysSnapShot = await get(dataRef);

  if (toysSnapShot.exists()) {
    const toysInfo = toysSnapShot.val();
    Object.values(toysInfo).map(toy => {
      const toyCard = getToyCard(toy);
      document.getElementById("toyCardsContainer").append(toyCard);
    });
  } else {
    console.log("No toy info available!!!");
  }
}

// Toggles menu when the menu button is clicked
function onMenuButtonClick() {
  document.querySelector(".main-sidebar").classList.toggle("active-sidebar");
}

async function onConfirmDelete(e) {
  // Retrieve the item key from session
  const key = sessionStorage.getItem("key");

  // Get toy info from realtime database
  const toyRef = dbRef(db, `toys/${key}`);
  const toySnapShot = await get(toyRef);

  if (toySnapShot.exists()) {
    const toyInfo = toySnapShot.val();

    // Remove toy image from storage
    const toyImgRef = storageRef(storage, toyInfo.imageStoragePath);
    deleteObject(toyImgRef)
      .then(() => {
        // Once the toy image is removed from storage,
        // remove toy info from realtime database
        remove(toyRef)
          .then(() => {
            // Now, remove toy card from the dashboard
            const card = document.querySelector(`#toyCard${key}`);
            card.remove();

            // Clear the item key from session
            sessionStorage.removeItem("key");

            // Hide the Confirm Delete modal window
            e.target.closest(".confirm-delete__overlay").classList.add("hidden");
          })
          .catch(err => console.log(`Unexpected error occurred while deleting toy info: ${err.message}`));
      })
      .catch(err => console.log(`Unexpected error occurred while deleting toy image: ${err.message}`));
  }
}

function onConfirmCancel(e) {
  // Clear the item key from session
  sessionStorage.removeItem("key");

  // Hide the Confirm Delete modal window
  e.target.closest(".confirm-delete__overlay").classList.add("hidden");
}
