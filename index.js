import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";

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
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

addButtonEl.addEventListener("click", function() {
  let inputValue = inputFieldEl.value;
  
  if (inputValue.trim() !== "") {
    push(shoppingListInDB, inputValue);
    clearInputFieldEl();
  }
});

onValue(shoppingListInDB, function(snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());
    clearShoppingListEl();
    
    itemsArray.forEach(item => {
      appendItemToShoppingListEl(item);
    });
  } else {
    shoppingListEl.innerHTML = "No items here... yet";
  }
});

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
  
  newEl.addEventListener("click", function() {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
    remove(exactLocationOfItemInDB);
  });
  
  shoppingListEl.append(newEl);
}
