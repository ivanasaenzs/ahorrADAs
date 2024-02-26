/* UTILITIES */
const $ = (selector) => document.querySelector(selector);
const $$ = (selectors) => document.querySelectorAll(selectors);

const showElement = (selectors) => {
  for (const selector of selectors) {
    $(selector).classList.remove("hidden");
  }
};

const hideElement = (selectors) => {
  for (const selector of selectors) {
    $(selector).classList.add("hidden");
  }
};

const cleanContainer = (selector) => {
  $(selector).innerHTML = "";
};

/* Random ID generator */
const randomId = () => self.crypto.randomUUID();

/* Default categories */
const defaultCategories = [
  { id: randomId(), categoryName: "comida" },
  { id: randomId(), categoryName: "servicios" },
  { id: randomId(), categoryName: "salud" },
  { id: randomId(), categoryName: "educación" },
  { id: randomId(), categoryName: "transporte" },
  { id: randomId(), categoryName: "trabajo" },
];
