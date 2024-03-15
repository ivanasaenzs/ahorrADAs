/**************** UTILITIES ****************/
const $ = (selector) => document.querySelector(selector);

const showElement = (selectors) => {
  for (const selector of selectors) {
    const element = $(selector);
    // first check if it exists THEN remove class
    if (element) {
      $(selector).classList.remove("hidden");
    }
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
  { id: randomId(), categoryName: "comida" },
  { id: randomId(), categoryName: "servicios" },
  { id: randomId(), categoryName: "salud" },
  { id: randomId(), categoryName: "educación" },
  { id: randomId(), categoryName: "transporte" },
  { id: randomId(), categoryName: "trabajo" },
];

/* LOCAL STORAGE */
const setInfo = (key, info) => localStorage.setItem(key, JSON.stringify(info));
const getInfo = (key) => JSON.parse(localStorage.getItem(key));

let loadedCategoriesFromLocalStorage = getInfo("categories") || [];
let loadedOperationsFromLocalStorage = getInfo("operations") || [];

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

/************************* CATEGORIES ********************************/
// Add category options to New Operation & Edit Operation selects
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

// Add the categories to the select form in Balance section
const addCategoryToSelect = (categories) => {
  cleanContainer("#select-form");
  $("#select-form").innerHTML += `<option value="Todas">Todas</option>`;

  for (const category of categories) {
    $(
      "#select-form"
    ).innerHTML += `<option value="${category.categoryName}">${category.categoryName}</option>`;
  }
};

// Show edit category form and update to edited value
const showFormEdit = (categoryId) => {
  hideElement(["#categories-section"]);
  showElement(["#edit-category-section"]);
  $("#edit-category-input").setAttribute("data-id", categoryId);
};

// Delete category
const deleteCategory = (categoryId) => {
  const updatedCategories = loadedCategoriesFromLocalStorage.filter(
    (category) => category.id !== categoryId
  );
  setInfo("categories", updatedCategories);
  loadedCategoriesFromLocalStorage = updatedCategories;
  renderCategories(updatedCategories);
};

// Render categories
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

// Add category
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

// Edit category
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

// Cancel edit operation
const cancelEditCategory = () => {
  $("#edit-category-input").value = "";
  $("#edit-category-input").removeAttribute("data-id");
  hideElement(["#edit-category-section"]);
  showElement(["#categories-section"]);
};

/************************* BALANCE ********************************/
// Render balance overview
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
      ? "$0"
      : totalBalance > 0
      ? `+$${Math.abs(totalBalance)}`
      : `-$${Math.abs(totalBalance)}`
  }
            </p>
          </div>`;
};

/************************* OPERATIONS ********************************/
// Show edit operation form
const showEditOpForm = (operationId) => {
  hideElement(["#balance-section"]);
  showElement(["#edit-operation-section"]);
  $("#edit-operation-name-input").setAttribute("data-id", operationId);
  addSelectOptions(loadedCategoriesFromLocalStorage);
};

// Delete operation
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

// Add operation
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

// Edit operation
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

// Render operations table
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

// FILTER OPERATIONS based on user selection
// Filter by operation type: Earning - Expense
const filterOperationType = () => {
  const operationTypeSelected = $("#filters-type-input").value;
  console.log(operationTypeSelected);

  for (const operation of loadedOperationsFromLocalStorage) {
    const operationElement = $(`#operation-${operation.id}`);
    console.log(operationElement);

    if (operationElement) {
      if (
        operationTypeSelected === "Ganancia" &&
        operation.operationType === "Gasto"
      ) {
        operationElement.style.display = "none";
      } else if (
        operationTypeSelected === "Gasto" &&
        operation.operationType === "Ganancia"
      ) {
        operationElement.style.display = "none";
      } else {
        operationElement.style.display = "flex";
      }
    }
  }
};

// Filter operation category: depending on the category selected
const filterOperationCategory = () => {
  const operationCategorySelected = $("#select-form").value;
  console.log(operationCategorySelected);

  for (const operation of loadedOperationsFromLocalStorage) {
    const categoryElement = $(`#operation-${operation.id}`);
    console.log(categoryElement);
    console.log(operation.operationCategory);

    // only enters the conditional if the element exists
    if (categoryElement) {
      if (operationCategorySelected === "Todas") {
        categoryElement.style.display = "flex";
      } else if (operationCategorySelected === operation.operationCategory) {
        categoryElement.style.display = "flex";
      } else if (operationCategorySelected !== operation.operationCategory) {
        // hides all the ops ?? should render no operations section
        categoryElement.style.display = "none";
      }
    }
  }
};

// Filter operation date: from the selected date onward
const filterOperationDate = () => {
  const operationDateSelected = new Date($("#filter-date-input").value);
  console.log(operationDateSelected);

  for (const operation of loadedOperationsFromLocalStorage) {
    const operationElement = $(`#operation-${operation.id}`);
    console.log(operationElement);
    const operationDate = new Date(operation.operationDate);
    console.log(operationDate);

    if (operationDate >= operationDateSelected) {
      operationElement.style.display = "flex";
    } else {
      operationElement.style.display = "none";
    }
  }
};

// Sort by the arrays of operations according to specific conditions
const sortingFunctions = {
  "mas-reciente": (a, b) =>
    new Date(b.operationDate) - new Date(a.operationDate),
  "menos-reciente": (a, b) =>
    new Date(a.operationDate) - new Date(b.operationDate),
  "mayor-monto": (a, b) => b.operationAmount - a.operationAmount,
  "menor-monto": (a, b) => a.operationAmount - b.operationAmount,
  az: (a, b) => a.operationName.localeCompare(b.operationName),
  za: (a, b) => b.operationName.localeCompare(a.operationName),
};

// Function that does the actual sortering
const sortingFunction = (operations, sortCondition) => {
  // I make a copy of the original array so the sort() method doesn't modify it
  const sortedOperations = [...operations];
  return sortedOperations.sort(sortingFunctions[sortCondition]);
};

// Pass the operation and condition selected as arguments and render result
const sortByOperations = () => {
  const sortBySelected = $("#filter-sortby-input").value;

  const sortedOperations = sortingFunction(
    loadedOperationsFromLocalStorage,
    sortBySelected
  );
  renderOperations(sortedOperations);
};

/************************* REPORTS ********************************/
// Calculate the highest earning category out of all the operations entered
const calculateHighestEarningCategory = () => {
  // initiliaze object to store final result
  let highestEarningCategory = { name: "", amount: 0 };

  for (const operation of loadedOperationsFromLocalStorage) {
    let { operationCategory, operationAmount, operationType } = operation;
    console.log(operationCategory, operationAmount, operationType);
    let categoryName = operationCategory || "Uncategorized";

    if (
      operationType === "Ganancia" &&
      operationAmount > highestEarningCategory.amount
    ) {
      // if true, update highestEarningCategory with the current category name and amount
      highestEarningCategory = {
        name: categoryName,
        amount: parseFloat(operationAmount),
      };
    }
  }
  return highestEarningCategory;
};

// Render the highest earning category
const renderHighestEarningCategory = () => {
  const highestEarningCategory = calculateHighestEarningCategory();
  console.log("Highest Earning Category:", highestEarningCategory);

  $("#categoria-mayor-ganancia").innerHTML = `
    <div class="flex items-center p-1">
      <div class="w-2/3">
        <span class="text-xs text-orange-400 bg-orange-100 px-2 py-1 rounded-md whitespace-nowrap overflow-hidden">
          ${highestEarningCategory.name}
        </span>
      </div>
      <div class="w-1/3 flex items-end justify-end">
        <span class="whitespace-nowrap overflow-hidden text-green-600">
          $${highestEarningCategory.amount}
        </span>
      </div>
    </div>
  `;
};

// Calculate the category with the highest expense
const calculateHighestExpenseCategory = () => {
  let highestExpenseCategory = { name: "", amount: 0 };

  for (const operation of loadedOperationsFromLocalStorage) {
    let { operationCategory, operationAmount, operationType } = operation;
    let categoryName = operationCategory || "Uncategorized";

    if (
      operationType === "Gasto" &&
      operationAmount > highestExpenseCategory.amount
    ) {
      highestExpenseCategory = {
        name: categoryName,
        amount: parseFloat(operationAmount),
      };
    }
    // console.log(categoryName);
    // console.log(operationCategory, operationAmount, operationType);
  }
  return highestExpenseCategory;
};

// Render the highest expense category
const renderHighestExpenseCategory = () => {
  const highestExpenseCategory = calculateHighestExpenseCategory();
  console.log("Highest Expense Category:", highestExpenseCategory);

  $("#categoria-mayor-gasto").innerHTML = `
  <div class="flex items-center justify-between">
        <div class="w-2/3">
          <span class="px-2 py-1 text-xs text-orange-400 bg-orange-100 rounded-md whitespace-nowrap overflow-hidden">
    ${highestExpenseCategory.name}
          </span>
        </div>
        <div class="w-1/3 flex items-end justify-end">
          <span class="whitespace-nowrap overflow-hidden text-red-600">
            $${highestExpenseCategory.amount}
          </span>
        </div>
      </div>
  `;
};

// Calculate the category with the highest balance
const calculateHighestBalanceCategory = () => {
  let categoryBalances = {};

  for (const operation of loadedOperationsFromLocalStorage) {
    let { operationCategory, operationAmount, operationType } = operation;
    let categoryName = operationCategory || "Uncategorized";

    if (!categoryBalances[categoryName]) {
      categoryBalances[categoryName] = 0;
    }

    if (operationType === "Gasto") {
      categoryBalances[categoryName] -= parseFloat(operationAmount);
    } else if (operationType === "Ganancia") {
      categoryBalances[categoryName] += parseFloat(operationAmount);
    }
  }

  let highestBalanceCategoryName = "";
  let highestBalance = 0;

  for (const categoryName in categoryBalances) {
    const balance = Math.abs(categoryBalances[categoryName]);

    if (balance > highestBalance) {
      highestBalance = balance;
      highestBalanceCategoryName = categoryName;
    }
  }
  return {
    name: highestBalanceCategoryName,
    balance: categoryBalances[highestBalanceCategoryName],
  };
};

// Render category
const renderHighestBalanceCategory = () => {
  const highestBalanceCategory = calculateHighestBalanceCategory();
  console.log("Category with the Highest Balance:", highestBalanceCategory);

  $("#categoria-mayor-balance").innerHTML = `
  <div class="flex items-center justify-between">
        <div class="w-2/3">
          <span class="px-2 py-1 text-xs text-orange-400 bg-orange-100 rounded-md whitespace-nowrap overflow-hidden">
    ${highestBalanceCategory.name}
          </span>
        </div>
        <div class="w-1/3 flex items-end justify-end">
          <span class="whitespace-nowrap overflow-hidden text-red-600">
            $${highestBalanceCategory.balance}
          </span>
        </div>
      </div>
  `;
};

// Calculate the month with the highest earnings
const calculateHighestEarningMonth = () => {
  const monthlyEarnings = {};

  for (const operation of loadedOperationsFromLocalStorage) {
    const { operationDate, operationType, operationAmount } = operation;
    // to cut the day out of the date format
    const month = operationDate.slice(0, 7);
    console.log(
      `This is the full date: ${operationDate} /// This is the "sliced" date with only the year and month: ${month}`
    );

    if (operationType === "Ganancia") {
      // if the month key in my monthlyEarnings object doesn't exist, i initialize it to 0 so i can then add the result of every iteration
      if (!monthlyEarnings[month]) {
        monthlyEarnings[month] = 0;
      }
      monthlyEarnings[month] += parseFloat(operationAmount);
      // console.log(monthlyEarnings[month]);
    }
  }

  // initialize the object with the results
  let highestEarningMonth = { month: "", earning: 0 };

  for (const month in monthlyEarnings) {
    if (monthlyEarnings.hasOwnProperty(month)) {
      const earnings = monthlyEarnings[month];
      // if the earnings for the current month (earnings) are greater than the earnings of the current highestEarningMonth object, we update it with the latest month and earnings
      if (earnings > highestEarningMonth.earning) {
        highestEarningMonth = { month, earnings };
        console.log("These are the highest earnings: ", `$${earnings}`);
      }
    }
  }
  return highestEarningMonth;
};

// Render
const renderHighestEarningMonth = () => {
  const highestEarningMonth = calculateHighestEarningMonth();
  console.log("Month with the highest earning: ", highestEarningMonth);

  // reverse the original date so we get MONTH-YEAR instead of YEAR-MONTH
  const originalMonth = highestEarningMonth.month;
  const splitMonth = originalMonth.split("-");
  const reversedMonth = `${splitMonth[1]}/${splitMonth[0]}`;

  $("#mes-mayor-ganancia").innerHTML = `
  <div class="flex items-center justify-between">
        <div class="w-2/3">
          <span class="whitespace-nowrap overflow-hidden">${reversedMonth}</span>
        </div>
        <div class="w-1/3 flex items-end justify-end">
          <span class="whitespace-nowrap overflow-hidden text-green-600">
           $${highestEarningMonth.earnings}
          </span>
        </div>
      </div> 
  `;
};

// Calculate the month with the highest expense
const calculateHighestExpenseMonth = () => {
  const monthlyExpenses = {};

  for (const operation of loadedOperationsFromLocalStorage) {
    const { operationDate, operationType, operationAmount } = operation;
    const month = operationDate.slice(0, 7);

    if (operationType === "Gasto") {
      if (!monthlyExpenses[month]) {
        monthlyExpenses[month] = 0;
      }

      monthlyExpenses[month] += parseFloat(operationAmount);
      // console.log(monthlyExpenses[month]);
    }
  }

  let highestExpenseMonth = { month: "", expense: 0 };

  for (const month in monthlyExpenses) {
    if (monthlyExpenses.hasOwnProperty(month)) {
      const expense = monthlyExpenses[month];
      if (highestExpenseMonth.expense < expense) {
        highestExpenseMonth = { month, expense };
      }
    }
  }
  return highestExpenseMonth;
};

// Render the month with the highest expense
const renderHighestExpenseMonth = () => {
  const highestExpenseMonth = calculateHighestExpenseMonth();
  console.log("Month with the highest expense", highestExpenseMonth);

  const originalMonth = highestExpenseMonth.month;
  const splitMonth = originalMonth.split("-");
  const reversedMonth = `${splitMonth[1]}/${splitMonth[0]}`;

  $("#mes-mayor-gasto").innerHTML = `
 <div class="flex items-center justify-between">
        <div class="w-2/3">
          <span class="whitespace-nowrap overflow-hidden">${reversedMonth}</span>
        </div>
        <div class="w-1/3 flex items-end justify-end">
          <span class="whitespace-nowrap overflow-hidden text-red-600">
         $${highestExpenseMonth.expense}
          </span>
        </div>
      </div>
  `;
};

// Render reports
const renderReportsSection = () => {
  if (
    loadedOperationsFromLocalStorage &&
    loadedOperationsFromLocalStorage.length > 0
  ) {
    // operations exist, so now render the reports
    renderHighestEarningCategory();
    renderHighestExpenseCategory();
    renderHighestBalanceCategory();
    renderHighestEarningMonth();
    renderHighestExpenseMonth();

    // show the reports section
    showElement(["#reports-section"]);
    hideElement(["#no-reports-section"]);
  } else {
    // no operations exist, hide the reports section and show the no reports message
    hideElement(["#reports-section"]);
    showElement(["#no-reports-section"]);
  }
};

/************************* INITIALIZE APP *************************/
const initialize = () => {
  // sets my object of hardcoded categories as default so they appear every time even if local storage is deleted
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

  // Hide-show filter section in Balance
  $("#toggle-filters").addEventListener("click", filters);

  // Filter operations
  $("#filters-type-input").addEventListener("change", filterOperationType);
  $("#select-form").addEventListener("change", filterOperationCategory);
  $("#filter-date-input").addEventListener("input", filterOperationDate);
  $("#filter-sortby-input").addEventListener("change", sortByOperations);

  // Open dropdown menu in mobile
  $(".bars").addEventListener("click", () => {
    showElement([".xmark", "#menu-dropdown"]);
    hideElement([".bars"]);
  });

  // Close dropdown menu in mobile
  $(".xmark").addEventListener("click", () => {
    showElement([".bars"]);
    hideElement([".xmark", "#menu-dropdown"]);
  });

  // Render reports section
  renderReportsSection(loadedOperationsFromLocalStorage);
};

window.addEventListener("load", initialize);
