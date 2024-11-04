import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, push, onValue, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA5ya8yk-RrMj1sjv4MlZxIX-xsZSKABWI",
  authDomain: "catty-c71d4.firebaseapp.com",
  projectId: "catty-c71d4",
  storageBucket: "catty-c71d4.appspot.com",
  messagingSenderId: "1018205991656",
  appId: "1:1018205991656:web:15884e4c8c55fe373ecf5d",
  measurementId: "G-RGXYW94XNL"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");
const shoppingListInDB = ref(database, "shoppingList");

addButtonEl.addEventListener("click", function() {
  let inputValue = inputFieldEl.value;
  
  if (inputValue.trim() !== "") {
    push(shoppingListInDB, inputValue);
    clearInputFieldEl();
  }
});

// Listen for changes in the database and update UI
onValue(shoppingListInDB, function(snapshot) {
  clearShoppingListEl();
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());
    
    itemsArray.forEach(item => {
      appendItemToShoppingListEl(item);
    });
  } else {
    shoppingListEl.innerHTML = "No items here... yet";
  }
});

// Helper functions to manage UI
function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
  inputFieldEl.value = "";
}

function appendItemToShoppingListEl(item) {
  let itemID = item[0];
  let itemValue = item[1];
  
  let newEl = document.createElement("li");
  newEl.textContent = itemValue;
  
  // Set up click listener for deletion
  newEl.addEventListener("click", function() {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
    remove(exactLocationOfItemInDB);
  });
  
  shoppingListEl.append(newEl);
}

// Register service worker if supported
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("/service-worker.js").then(
      function(registration) {
        console.log("Service Worker registered with scope:", registration.scope);
      },
      function(error) {
        console.log("Service Worker registration failed:", error);
      }
    );
  });
}
