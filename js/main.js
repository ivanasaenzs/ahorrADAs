/**************** UTILITIES ****************/
const $ = (selector) => document.querySelector(selector);

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

/* Toggle filters section */
const filters = () => {
  const toggleAction = $("#toggle-filters");
  const filtersContent = $("#filters-content");
  if (toggleAction.innerText === "Ocultar filtros") {
    toggleAction.innerText = "Mostrar filtros";
    filtersContent.classList.add("hidden");
  } else {
    toggleAction.innerText = "Ocultar filtros";
    filtersContent.classList.remove("hidden");
  }
};

/* Default categories */
const defaultCategories = [
  { id: randomId(), categoryName: "Comida" },
  { id: randomId(), categoryName: "Servicios" },
  { id: randomId(), categoryName: "Salud" },
  { id: randomId(), categoryName: "Educación" },
  { id: randomId(), categoryName: "Transporte" },
  { id: randomId(), categoryName: "Trabajo" },
];

/* Local storage */
const setInfo = (key, info) => localStorage.setItem(key, JSON.stringify(info));
const getInfo = (key) => JSON.parse(localStorage.getItem(key));

let loadedCategoriesFromLocalStorage = getInfo("categories") || [];
let loadedOperationsFromLocalStorage = getInfo("operations") || [];

/* Add category options to New Operation & Edit Operation selects */
const addSelectOptions = (categories) => {
  $("#newop-category-select").innerHTML = "";
  $("#edit-operation-select").innerHTML = "";

  for (const category of categories) {
    $(
      "#newop-category-select"
    ).innerHTML += `<option value="${category.categoryName}">${category.categoryName}</option>`;
    $(
      "#edit-operation-select"
    ).innerHTML += `<option value="${category.categoryName}">${category.categoryName}</option>`;
  }
};

/* Adding the categories to the select form */
const addCategoryToSelect = (categories) => {
  cleanContainer("#select-form");
  $("#select-form").innerHTML += `<option value="Todas">Todas</option>`;
  for (const category of categories) {
    $(
      "#select-form"
    ).innerHTML += `<option value="${category.categoryName}">${category.categoryName}</option>`;
  }
};

/* Show edit category form and updates to edited value */
const showFormEdit = (categoryId) => {
  hideElement(["#categories-section"]);
  showElement(["#edit-category-section"]);
  $("#edit-category-input").setAttribute("data-id", categoryId);
};

/* Delete category */
const deleteCategory = (categoryId) => {
  const updatedCategories = loadedCategoriesFromLocalStorage.filter(
    (category) => category.id !== categoryId
  );
  setInfo("categories", updatedCategories);
  loadedCategoriesFromLocalStorage = updatedCategories;
  renderCategories(updatedCategories);
};

/* Render categories */
const renderCategories = (categories) => {
  cleanContainer("#category-list");
  for (const category of categories) {
    $(
      "#category-list"
    ).innerHTML += `<div class="flex items-center justify-between mb-2">
        <div class="flex items-center">
            <span class="category-tag text-xs text-orange-400 bg-orange-100 rounded-md px-2 py-1">${category.categoryName}</span>
        </div>
        <div class="flex items-center">
            <button class="text-xs text-blue-500 bg-rose-200 hover:text-black rounded-md px-2 py-1 ml-auto"
                onclick="showFormEdit('${category.id}')" id="edit-category-btn">
               <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="text-xs text-blue-500 bg-rose-200 hover:text-black rounded-md px-2 py-1 ml-2"
                onclick="deleteCategory('${category.id}')" id="delete-category-btn">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    </div>`;
  }
  addCategoryToSelect(categories);
};

/* Add category */
const addCategory = () => {
  const categoryName = $("#add-category-input").value;
  if (categoryName !== "") {
    const newCategory = { id: randomId(), categoryName };
    loadedCategoriesFromLocalStorage.push(newCategory);
    setInfo("categories", loadedCategoriesFromLocalStorage);
    renderCategories(loadedCategoriesFromLocalStorage);
    $("#add-category-input").value = "";
  }
};

/* Cancel edit operation */
const cancelEditCategory = () => {
  $("#edit-category-input").value = "";
  $("#edit-category-input").removeAttribute("data-id");
  hideElement(["#edit-category-section"]);
  showElement(["#categories-section"]);
};

/* Edit category */
const editCategory = () => {
  const categoryId = $("#edit-category-input").dataset.id;
  const updatedName = $("#edit-category-input").value;
  if (categoryId && updatedName !== "") {
    const updatedCategories = loadedCategoriesFromLocalStorage.map((category) =>
      category.id === categoryId
        ? { ...category, categoryName: updatedName }
        : category
    );
    setInfo("categories", updatedCategories);
    renderCategories(updatedCategories);
  }
};

/* OPERATIONS */

/************************* INITIALIZE APP *************************/
const initialize = () => {
  const hasDefaultCategories = getInfo("hasDefaultCategories");
  if (!hasDefaultCategories) {
    setInfo("categories", defaultCategories);
    setInfo("hasDefaultCategories", true);
  }

  loadedCategoriesFromLocalStorage = hasDefaultCategories
    ? loadedCategoriesFromLocalStorage
    : [...defaultCategories];

  renderCategories(loadedCategoriesFromLocalStorage);

  $("#balance-nav").addEventListener("click", () => {
    showElement(["#balance-section"]);
    hideElement([
      "#categories-section",
      "#reports-section",
      "#new-operation-section",
    ]);
  });

  $("#categories-nav").addEventListener("click", () => {
    showElement(["#categories-section"]);
    hideElement([
      "#balance-section",
      "#reports-section",
      "#new-operation-section",
      "#edit-operation-section",
    ]);
  });

  $("#reports-nav").addEventListener("click", () => {
    showElement(["#reports-section"]);
    hideElement([
      "#balance-section",
      "#edit-operation-section",
      "new-operation-section",
      "#categories-section",
    ]);
  });

  $("#add-category-btn").addEventListener("click", () => {
    addCategory();
  });

  $("#confirm-edit-category-btn").addEventListener("click", () => {
    hideElement(["#edit-category-section"]);
    showElement(["#categories-section"]);
    cancelEditCategory();
  });

  $("#cancel-edit-category-btn").addEventListener("click", () => {
    cancelEditCategory();
  });

  $("#toggle-filters").addEventListener("click", filters);

  // ABRIR DROPDOWN EN MOBILE
  $(".bars").addEventListener("click", () => {
    showElement([".xmark", "#menu-dropdown"]);
    hideElement([".bars"]);
  });

  // CERRAR DROPDOWN EN MOBILE
  $(".xmark").addEventListener("click", () => {
    showElement([".bars"]);
    hideElement([".xmark", "#menu-dropdown"]);
  });

  $("#add-operation-btn").addEventListener("click", (e) => {
    e.preventDefault();
    // $("#form").reset();
  });
};

window.addEventListener("load", initialize);
