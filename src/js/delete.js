import { db, storage } from "./libs/firebase/firebaseConfig";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { ref as databaseRef, push, set, get, remove } from "firebase/database";

async function pageInit() {
  const key = sessionStorage.getItem("key");
  console.log("Delete page");
  console.log(key);

  // Rental database ref with the key
  const rentalRef = databaseRef(db, `rentals/${key}`);

  // get data
  const rentalSnapShot = await get(rentalRef);
  const rentalData = rentalSnapShot.val();

  console.log(rentalData);

  // Rental image storage reference
  const rentalImgRef = storageRef(storage, rentalData.storagePath);
  // Delete the existing image from the storage
  deleteObject(rentalImgRef).then(async () => {
    console.log("Existing image was deleted successfully!!!");

    const removeResult = await remove(rentalRef);
    sessionStorage.removeItem("key");
  });

  // remove(ref)
}

pageInit();
