/**************** UTILITIES ****************/
const $ = (selector) => document.querySelector(selector);

const showElement = (selectors) => {
  for (const selector of selectors) {
    $(selector).classList.remove("hidden");
  }
};

const hideElement = (selectors) => {
  for (const selector of selectors) {
    const element = $(selector);
    // first check if it exists THEN add class
    if (element) {
      element.classList.add("hidden");
    }
  }
};

const cleanContainer = (selector) => {
  $(selector).innerHTML = "";
};

/* Random ID generator */
const randomId = () => self.crypto.randomUUID();

/* Default categories */
const defaultCategories = [
  { id: randomId(), categoryName: "Comida" },
  { id: randomId(), categoryName: "Servicios" },
  { id: randomId(), categoryName: "Salud" },
  { id: randomId(), categoryName: "Educación" },
  { id: randomId(), categoryName: "Transporte" },
  { id: randomId(), categoryName: "Trabajo" },
];

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

/* Add the categories to the select form in Balance section */
const addCategoryToSelect = (categories) => {
  cleanContainer("#select-form");
  $("#select-form").innerHTML += `<option value="Todas">Todas</option>`;
  for (const category of categories) {
    $(
      "#select-form"
    ).innerHTML += `<option value="${category.categoryName}">${category.categoryName}</option>`;
  }
};

/* Show edit category form and update to edited value */
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
  console.log("Rendering Categories with data:", categories);
  cleanContainer("#category-list");
  for (const category of categories) {
    $(
      "#category-list"
    ).innerHTML += `<div class="flex items-center justify-between mb-2">
        <div class="flex items-center">
            <span class="category-tag text-xs text-orange-400 bg-orange-100 rounded-md px-2 py-1" id="${category.id}">${category.categoryName}</span>
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
    addSelectOptions(categories);
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
    addSelectOptions(loadedCategoriesFromLocalStorage);
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

/* BALANCE */
/* Render balance overview */
const renderBalanceOverview = () => {
  let totalEarnings = 0;
  let totalExpenses = 0;

  loadedOperationsFromLocalStorage.forEach((operation) => {
    if (operation.operationType === "Ganancia") {
      totalEarnings += Number(operation.operationAmount);
    } else if (operation.operationType === "Gasto") {
      totalExpenses += Number(operation.operationAmount);
    }
  });

  const totalBalance = totalEarnings - totalExpenses;

  console.log("Total earnings are: ", `+$${totalEarnings}`);
  console.log("Total expenses are: ", `-$${totalExpenses}`);
  console.log("The total balance is: ", `$${totalBalance}`);

  $(
    "#balance-overview"
  ).innerHTML = `<div class="md:p-5 w-full flex flex-row justify-start">
            <h2 class="mb-8 font-bold text-4xl">Balance</h2>
          </div>
          <!-- EARNINGS -->
          <div class="w-full flex justify-between items-center">
            <h3 class="text-lg lg:text-xl font-bold">Ganancias</h3>
            <p class="text-xl text-green-500">${
              totalEarnings === 0 ? "" : "+"
            }$${Math.abs(totalEarnings)}</p>
          </div>
          <!-- EXPENSES -->
          <div class="w-full flex justify-between items-center">
            <h3 class="text-lg lg:text-xl font-bold">Gastos</h3>
            <p class="text-xl text-red-600">${
              totalExpenses === 0 ? "" : "-"
            }$${Math.abs(totalExpenses)}</p>
          </div>
          <!-- TOTAL -->
          <div class="w-full flex justify-between items-center">
            <h3 class="text-2xl font-bold">Total</h3>
            <p class="text-xl font-bold ${
              totalBalance >= 0 ? "text-green-500" : "text-red-600"
            }">${
    totalBalance === 0
      ? "0"
      : totalBalance > 0
      ? `+$${Math.abs(totalBalance)}`
      : `-$${Math.abs(totalBalance)}`
  }
            </p>
          </div>`;
};

/* OPERATIONS */
/* Show edit operation form */
const showEditOpForm = (operationId) => {
  hideElement(["#balance-section"]);
  showElement(["#edit-operation-section"]);
  $("#edit-operation-name-input").setAttribute("data-id", operationId);
  addSelectOptions(loadedCategoriesFromLocalStorage);
};

/* Delete operation */
const deleteOperation = (operationId) => {
  const updatedOperations = loadedOperationsFromLocalStorage.filter(
    (operation) => operation.id !== operationId
  );
  setInfo("operations", updatedOperations);
  loadedOperationsFromLocalStorage = updatedOperations;
  renderOperations(updatedOperations);
  renderBalanceOverview();
  console.log("Operations after deleting:", loadedOperationsFromLocalStorage);

  if (updatedOperations.length === 0) {
    hideElement(["#with-operations"]);
    showElement(["#no-operations"]);
  }
};

/* Add operation */
const addOperation = () => {
  const operationName = $("#new-operation-name-input").value;
  const operationType = $("#new-operation-filter-type-input").value;
  const operationAmount = $("#new-operation-amount-input").value;
  const operationCategory = $("#newop-category-select").value;
  const operationDate = $("#new-operation-date-input").value;
  console.log(operationDate);

  if (
    operationName !== "" &&
    operationType !== "" &&
    operationAmount !== "" &&
    operationCategory !== "" &&
    operationDate !== ""
  ) {
    const newOperation = {
      id: randomId(),
      operationName,
      operationType,
      operationAmount,
      operationCategory,
      operationDate,
    };

    loadedOperationsFromLocalStorage.push(newOperation);
    setInfo("operations", loadedOperationsFromLocalStorage);
    renderOperations(loadedOperationsFromLocalStorage);
    renderBalanceOverview();
  }
};

/* Edit operation */
const editOperation = () => {
  console.log("Edit operation button clicked");

  const operationId = $("#edit-operation-name-input").dataset.id;
  const updatedName = $("#edit-operation-name-input").value;
  const updatedAmount = $("#edit-operation-amount-input").value;
  const updatedCategory = $("#edit-operation-select").value;
  const updatedDate = $("#edit-operation-date-input").value;
  const updatedType = $("#edit-operation-type-select").value;

  console.log("Operation ID:", operationId);
  console.log("Updated Name:", updatedName);
  console.log("Updated Amount:", updatedAmount);
  console.log("Updated category:", updatedCategory);
  console.log("Updated DATE:", updatedDate);
  console.log("Updated Operation Type:", updatedType);

  if (
    operationId ||
    updatedName !== "" ||
    updatedType !== "" ||
    updatedAmount !== "" ||
    updatedCategory !== "" ||
    updatedDate !== ""
  ) {
    const updatedOperations = loadedOperationsFromLocalStorage.map(
      (operation) =>
        operation.id === operationId
          ? {
              ...operation,
              operationName: updatedName,
              operationType: updatedType,
              operationAmount: updatedAmount,
              operationCategory: updatedCategory,
              operationDate: updatedDate,
            }
          : operation
    );

    setInfo("operations", updatedOperations);
    renderOperations(updatedOperations);
    renderBalanceOverview();
  }
  hideElement(["#edit-operation-section"]);
  showElement(["#balance-section"]);
};

/* Render operations table */
const renderOperations = (operations) => {
  console.log("Rendering Operations with data:", operations);
  cleanContainer("#operations-table");
  for (const operation of operations) {
    /* Add red or green - Plus or minus symbols depending on the type of operation */
    let amountClass = "";
    let negativeOrPositiveAmount = "";

    if (operation.operationType === "Ganancia") {
      amountClass = "text-green-500";
      negativeOrPositiveAmount = `+$${operation.operationAmount}`;
    } else if (operation.operationType === "Gasto") {
      amountClass = "text-red-600";
      negativeOrPositiveAmount = `-$${operation.operationAmount}`;
    }

    $("#operations-table").innerHTML += `
       <tr class="flex-wrap flex md:justify-between" id="operation-${operation.id}">
                <td class="px-4 py-2 md:w-1/5 md:flex md:justify-start">
                  ${operation.operationName}
                </td>
                <td class="px-4 py-2 md:w-1/5 md:flex md:justify-start">
                  <span
                    class="category-tag text-xs text-orange-400 bg-orange-100 rounded-md px-2 py-1"
                    > ${operation.operationCategory}</span
                  >
                </td>
                <td class="px-4 py-2 md:w-1/5 md:flex md:justify-start">
                 ${operation.operationDate}
                </td>
                <td
                  class="px-4 py-2 md:w-1/5 md:flex md:justify-start font-bold ${amountClass}"
                >
                ${negativeOrPositiveAmount}
                </td>
                <td class="px-4 py-2 md:w-1/5 md:flex md:justify-start">
                  <button
                    class="mr-2 text-xs text-blue-500 bg-rose-200 hover:text-black rounded-md px-2 py-1"
                    onclick="showEditOpForm('${operation.id}')"
                    id="edit-operation-btn"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    class="text-xs text-blue-500 bg-rose-200 hover:text-black rounded-md px-2 py-1"
                    onclick="deleteOperation('${operation.id}')"
                    id="delete-operation-btn"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>`;
  }
};

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
  renderOperations(loadedOperationsFromLocalStorage);
  renderBalanceOverview();
  console.log("Operations after adding:", loadedOperationsFromLocalStorage);

  /* Check if there are operations loaded, if not, render the "No operations" section */
  const operationsLoaded = getInfo("operations");
  if (operationsLoaded && operationsLoaded.length > 0) {
    console.log("Operation(s) available!!");
    showElement(["#with-operations"]);
  } else {
    console.log("No operations found");
    hideElement(["#with-operations"]);
    showElement(["#no-operations"]);
  }

  $("#balance-nav").addEventListener("click", () => {
    console.log("Balance nav clicked");
    showElement(["#balance-section"]);
    hideElement(["#categories-section", "#reports-section"]);
  });

  $("#categories-nav").addEventListener("click", () => {
    console.log("Categories nav clicked");
    showElement(["#categories-section"]);
    hideElement(["#balance-section", "#reports-section"]);
  });

  $("#reports-nav").addEventListener("click", () => {
    console.log("Reports nav clicked");
    showElement(["#reports-section"]);
    hideElement(["#balance-section", "#categories-section"]);
  });

  $("#add-operation-btn").addEventListener("click", () => {
    console.log("Add new operation (FORM) button clicked");
    showElement(["#new-operation-section"]);
    hideElement(["#balance-section"]);
  });

  $("#add-newoperation-btn").addEventListener("click", () => {
    console.log("Add new operation (CONFIRMATION) button clicked");
    addOperation();
    hideElement(["#new-operation-section", "#no-operations"]);
    showElement(["#balance-section", "#with-operations"]);
  });

  $("#cancel-newoperation-btn").addEventListener("click", () => {
    console.log("Cancel new operation button clicked");
    hideElement(["#new-operation-section"]);
    showElement(["#balance-section"]);
  });

  $("#confirm-edit-operation-btn").addEventListener("click", () => {
    console.log("Edit operation button clicked");
    hideElement(["#edit-operation-section"]);
    showElement(["#balance-section"]);
  });

  $("#cancel-editoperation-btn").addEventListener("click", () => {
    console.log("CANCEL edit operation button clicked");
    hideElement(["#edit-operation-section"]);
    showElement(["#balance-section"]);
  });

  $("#add-category-btn").addEventListener("click", () => {
    addCategory();
  });

  $("#confirm-edit-category-btn").addEventListener("click", () => {
    cancelEditCategory();
  });

  $("#cancel-edit-category-btn").addEventListener("click", () => {
    cancelEditCategory();
  });

  /* Hide-show filter section in Balance */
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
};

window.addEventListener("load", initialize);
