import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyA5ya8yk-RrMj1sjv4MlZxIX-xsZSKABWI",
  authDomain: "catty-c71d4.firebaseapp.com",
  databaseURL: "https://catty-c71d4.firebaseio.com",
  projectId: "catty-c71d4",
  storageBucket: "catty-c71d4.appspot.com",
  messagingSenderId: "1018205991656",
  appId: "1:1018205991656:web:15884e4c8c55fe373ecf5d",
  measurementId: "G-RGXYW94XNL"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");
const shoppingListInDB = ref(database, "shoppingList");

addButtonEl.addEventListener("click", () => {
  const inputValue = inputFieldEl.value.trim();

  if (inputValue) {
    push(shoppingListInDB, inputValue)
      .then(() => clearInputFieldEl())
      .catch(error => console.error("Error adding item:", error));
  }
});

onValue(shoppingListInDB, (snapshot) => {
  clearShoppingListEl();
  if (snapshot.exists()) {
    const itemsArray = Object.entries(snapshot.val());
    itemsArray.forEach(item => appendItemToShoppingListEl(item));
  } else {
    shoppingListEl.innerHTML = "<li>No items here... yet</li>";
  }
});

function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
  inputFieldEl.value = "";
}

function appendItemToShoppingListEl(item) {
  const [itemID, itemValue] = item;

  const newEl = document.createElement("li");
  newEl.textContent = itemValue;
  newEl.className = "shopping-item";

  newEl.addEventListener("click", () => {
    const itemRef = ref(database, `shoppingList/${itemID}`);
    remove(itemRef)
      .catch(error => console.error("Error removing item:", error));
  });

  shoppingListEl.appendChild(newEl);
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js")
      .then(registration => console.log("Service Worker registered with scope:", registration.scope))
      .catch(error => console.log("Service Worker registration failed:", error));
  });
}

const CACHE_NAME = 'shopping-list-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/index.css',
  '/index.js',
  '/cat.png',
  '/apple-touch-icon.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  'https://fonts.googleapis.com/css2?family=Hachi+Maru+Pop&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .catch(error => console.error("Error caching files:", error))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/index.html'))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
