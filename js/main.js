/**************** UTILITIES ****************/
const $ = (selector) => document.querySelector(selector);

const showElement = (selectors) => {
  for (const selector of selectors) {
    const element = $(selector);
    if (element) {
      $(selector).classList.remove("hidden");
    }
  }
};

const hideElement = (selectors) => {
  for (const selector of selectors) {
    const element = $(selector);
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
  const operationId = $("#edit-operation-name-input").dataset.id;
  const updatedName = $("#edit-operation-name-input").value;
  const updatedAmount = $("#edit-operation-amount-input").value;
  const updatedCategory = $("#edit-operation-select").value;
  const updatedDate = $("#edit-operation-date-input").value;
  const updatedType = $("#edit-operation-type-select").value;

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
  cleanContainer("#operations-table");
  for (const operation of operations) {
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

  for (const operation of loadedOperationsFromLocalStorage) {
    const operationElement = $(`#operation-${operation.id}`);

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

  for (const operation of loadedOperationsFromLocalStorage) {
    const categoryElement = $(`#operation-${operation.id}`);

    if (categoryElement) {
      if (operationCategorySelected === "Todas") {
        categoryElement.style.display = "flex";
      } else if (operationCategorySelected === operation.operationCategory) {
        categoryElement.style.display = "flex";
      } else if (operationCategorySelected !== operation.operationCategory) {
        categoryElement.style.display = "none";
      }
    }
  }
};

// Filter operation date: from the selected date onward
const filterOperationDate = () => {
  const operationDateSelected = new Date($("#filter-date-input").value);

  for (const operation of loadedOperationsFromLocalStorage) {
    const operationElement = $(`#operation-${operation.id}`);
    const operationDate = new Date(operation.operationDate);

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
  let highestEarningCategory = { name: "", amount: 0 };

  for (const operation of loadedOperationsFromLocalStorage) {
    let { operationCategory, operationAmount, operationType } = operation;
    let categoryName = operationCategory || "Uncategorized";

    if (
      operationType === "Ganancia" &&
      operationAmount > highestEarningCategory.amount
    ) {
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

  $("#highest-earning-category").innerHTML = `
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
  }
  return highestExpenseCategory;
};

// Render the highest expense category
const renderHighestExpenseCategory = () => {
  const highestExpenseCategory = calculateHighestExpenseCategory();

  $("#highest-expense-category").innerHTML = `
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

  $("#highest-balance-category").innerHTML = `
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
    const month = operationDate.slice(0, 7);

    if (operationType === "Ganancia") {
      if (!monthlyEarnings[month]) {
        monthlyEarnings[month] = 0;
      }
      monthlyEarnings[month] += parseFloat(operationAmount);
    }
  }

  let highestEarningMonth = { month: "", earning: 0 };

  for (const month in monthlyEarnings) {
    if (monthlyEarnings.hasOwnProperty(month)) {
      const earnings = monthlyEarnings[month];
      if (earnings > highestEarningMonth.earning) {
        highestEarningMonth = { month, earnings };
      }
    }
  }
  return highestEarningMonth;
};

// Render
const renderHighestEarningMonth = () => {
  const highestEarningMonth = calculateHighestEarningMonth();

  const originalMonth = highestEarningMonth.month;
  const splitMonth = originalMonth.split("-");
  const reversedMonth = `${splitMonth[1]}/${splitMonth[0]}`;

  $("#highest-earning-month").innerHTML = `
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

  const originalMonth = highestExpenseMonth.month;
  const splitMonth = originalMonth.split("-");
  const reversedMonth = `${splitMonth[1]}/${splitMonth[0]}`;

  $("#highest-expense-month").innerHTML = `
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

// Calculate the balance for each category
const calculateCategoryTotals = () => {
  const categoryTotals = {};

  for (const operation of loadedOperationsFromLocalStorage) {
    const { operationCategory, operationAmount, operationType } = operation;
    const categoryName = operationCategory || "Uncategorized";

    if (!categoryTotals[categoryName]) {
      categoryTotals[categoryName] = { income: 0, expense: 0, balance: 0 };
    }

    if (operationType === "Ganancia") {
      categoryTotals[categoryName].income += parseFloat(operationAmount);
    } else if (operationType === "Gasto") {
      categoryTotals[categoryName].expense += parseFloat(operationAmount);
    }

    categoryTotals[categoryName].balance =
      categoryTotals[categoryName].income -
      categoryTotals[categoryName].expense;
  }
  return categoryTotals;
};

// Render the total category balance
const renderCategoryTotals = () => {
  const totalsByCategory = calculateCategoryTotals();

  for (const categoryName in totalsByCategory) {
    const totals = totalsByCategory[categoryName];
    const { income, expense, balance } = totals;

    $("#category-totals").innerHTML += `
          <span class="text-xs text-orange-400 bg-orange-100 px-2 py-1 rounded-md whitespace-nowrap overflow-hidden">
            ${categoryName}
          </span>
     `;
    $("#category-totals-earnings").innerHTML += `
        <span>$${income}</span>
        `;
    $("#category-totals-expenses").innerHTML += `<span>$${expense}</span>`;
    $("#category-total-balance").innerHTML += ` <span>$${balance}</span>`;
  }
};

// Calculate the total balance for each month
const calculateMonthTotals = () => {
  const operations = getInfo("operations") || [];
  const monthTotals = {};

  for (const operation of operations) {
    const { operationDate, operationAmount, operationType } = operation;
    const monthYear = operationDate.slice(0, 7);

    if (!monthTotals[monthYear]) {
      monthTotals[monthYear] = { income: 0, expense: 0, balance: 0 };
    }

    if (operationType === "Ganancia") {
      monthTotals[monthYear].income += parseFloat(operationAmount);
    } else if (operationType === "Gasto") {
      monthTotals[monthYear].expense += parseFloat(operationAmount);
    }

    monthTotals[monthYear].balance =
      monthTotals[monthYear].income - monthTotals[monthYear].expense;
  }
  return monthTotals;
};

const renderMonthTotals = () => {
  const totalsByMonth = calculateMonthTotals();

  for (const monthYear in totalsByMonth) {
    if (totalsByMonth.hasOwnProperty(monthYear)) {
      const totals = totalsByMonth[monthYear];
      const { income, expense, balance } = totals;

      const splitDate = monthYear.split("-");
      const reversedDate = `${splitDate[1]}/${splitDate[0]}`;

      $("#month-totals").innerHTML += `
      <div class="w-1/4">
          <h4 class="font-semibold">${reversedDate}</h4>
          </div>
        `;

      $("#month-total-earnings").innerHTML += `
          <span>$${income}</span>
      `;

      $("#month-total-expenses").innerHTML += `
        <span>$${expense}</span>
       `;

      $("#month-total-balance").innerHTML += `
          <span>$${balance}</span>
        `;
    }
  }
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
    renderCategoryTotals();
    renderMonthTotals();

    showElement(["#reports-section"]);
    hideElement(["#no-reports-section"]);
  } else {
    hideElement(["#reports-section"]);
    showElement(["#no-reports-section"]);
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

  /* Check if there are operations loaded, if not, render the "No operations" section */
  const operationsLoaded = getInfo("operations");
  if (operationsLoaded && operationsLoaded.length > 0) {
    showElement(["#with-operations"]);
  } else {
    hideElement(["#with-operations"]);
    showElement(["#no-operations"]);
  }

  $("#balance-nav").addEventListener("click", () => {
    showElement(["#balance-section"]);
    hideElement([
      "#categories-section",
      "#no-reports-section",
      "#reports-section",
    ]);
  });

  $("#categories-nav").addEventListener("click", () => {
    showElement(["#categories-section"]);
    hideElement([
      "#balance-section",
      "#no-reports-section",
      "#reports-section",
    ]);
  });

  $("#reports-nav").addEventListener("click", () => {
    hideElement(["#balance-section", "#categories-section"]);
    renderReportsSection(loadedOperationsFromLocalStorage);
  });

  $("#add-operation-btn").addEventListener("click", () => {
    showElement(["#new-operation-section"]);
    hideElement(["#balance-section"]);
  });

  $("#add-newoperation-btn").addEventListener("click", () => {
    addOperation();
    cleanContainer;
    hideElement(["#new-operation-section", "#no-operations"]);
    showElement(["#balance-section", "#with-operations"]);
  });

  $("#cancel-newoperation-btn").addEventListener("click", () => {
    hideElement(["#new-operation-section"]);
    showElement(["#balance-section"]);
  });

  $("#confirm-edit-operation-btn").addEventListener("click", () => {
    hideElement(["#edit-operation-section"]);
    showElement(["#balance-section"]);
  });

  $("#cancel-editoperation-btn").addEventListener("click", () => {
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
};

window.addEventListener("load", initialize);
