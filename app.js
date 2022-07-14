// Storage Controller
const StorageCtrl = (function () {
  //  Public method
  return {
    storeItems: function (item) {
      let items;
      // check if item in LS
      if (localStorage.getItem("items") === null) {
        items = [];
        // push new item
        items.push(item);
        // set to LS
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        // get object from localStorage
        items = JSON.parse(localStorage.getItem("items"));

        // push new item
        items.push(item);

        // reset LS
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getStorage: function () {
      let items;
      // check if item in LS
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        // get object from localStorage
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updataLocalStorage: function (updataItem) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach((item, index) => {
        if (updataItem.id === item.id) {
          items.splice(index, 1, updataItem);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteFromLs: function (id) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach((item, index) => {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    clearAllFromLS: function () {
      localStorage.removeItem("items");
      console.log("delete...");
    }
  };
})();

// Item Controller
const itemCtrl = (function () {
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
    // addItems = function () {};
  };

  // DATA STRUCTURE/ STATE
  const data = {
    // items: [
    // { id: 0, name: "Steak Breakfast", calories: 1200 },
    // { id: 0, name: "Steak Lunch", calories: 1200 },
    // { id: 0, name: "Steak Dinner", calories: 1200 }
    // ],
    items: StorageCtrl.getStorage(),
    currentItem: null,
    totalCalories: 0
  };

  //   PUBLIC MEHTOD
  return {
    getItem: function () {
      return data.items;
    },
    additems: function (name, calories) {
      // console.log(name, calories);

      let ID;
      // create an ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      // calories to Number
      calories = parseInt(calories);

      // create new item
      newItem = new Item(ID, name, calories);
      data.items.push(newItem);
      // console.log(newItem);
      return newItem;
    },
    getItemById: function (id) {
      let found = null;
      data.items.forEach((item) => {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function (name, calories) {
      calories = parseInt(calories);
      let found = null;
      data.items.forEach((item) => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
          console.log(item);
        }
      });
      return found;
    },
    deleteItem: function (id) {
      // get ids
      const ids = data.items.map((item) => {
        console.log(item.id);
        return item.id;
      });
      // get index
      const index = ids.indexOf(id);

      // remove item
      data.items.splice(index, 1);
      // console.log(data.items.splice(index, 1));
    },
    clearAllItems: function () {
      data.items = [];
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      // console.log("me", data.currentItem);
      return data.currentItem;
    },
    getTotalCalories: function () {
      let total = 0;
      // console.log(total);
      // console.log(data);
      data.items.forEach((item) => {
        // console.log("me", item.calories);
        total += item.calories;
        // total = total + item.calories;
      });
      data.totalCalories = total;

      return data.totalCalories;
    },
    logData: function () {
      return data;
    }
  };
})();

// UI Controller
const UICtrl = (function () {
  // UISelector = {
  //   itemList: "item-list",
  //   addBtn: ".add-btn"
  // };
  // PUBLIC METHOD
  return {
    populateItemsList: function (items) {
      let html = "";
      items.forEach((list) => {
        // console.log(list);
        // console.log("i got here");
        html += `
        <li id="item-${list.id}" class="collection-item">
              <strong>${list.name}: </strong> <em> ${list.calories}</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa-solid fa-pencil"></i>
                </a>
            </li>
        `;
      });
      // console.log(UISelector.addBtn);
      document.getElementById("item-list").innerHTML = html;
    },
    addListItem: function (item) {
      // show list
      document.getElementById("item-list").style.display = "block";
      // create li Element
      const li = document.createElement("li");
      // add class
      li.className = "collection-item";
      li.id = `item-${item.id}`;
      li.innerHTML = `<strong>${item.name}: </strong> <em> ${item.calories}</em>
      <a href="#" class="secondary-content">
          <i class="edit-item fa-solid fa-pencil"></i>
      </a>`;
      // console.log(li.innerHTML);
      document
        .getElementById("item-list")
        .insertAdjacentElement("beforeend", li);
    },
    uptdataListItem: function (item) {
      let listItems = document.querySelectorAll("#item-list li");

      listItems = Array.from(listItems);

      listItems.forEach((listItem) => {
        const itemID = listItem.getAttribute("id");

        if (itemID === `item-${item.id}`) {
          document.querySelector(
            `#${itemID}`
          ).innerHTML = `<strong>${item.name}: </strong> <em> ${item.calories}</em>
          <a href="#" class="secondary-content">
              <i class="edit-item fa-solid fa-pencil"></i>
          </a>`;
        }
      });
    },
    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      console.log(item);
      item.remove();
    },
    clearInput: function () {
      document.getElementById("item-name").value = "";

      document.getElementById("item-calories").value = "";
    },
    addItemToForm: function () {
      // console.log("item------------1", itemCtrl.getCurrentItem());
      document.getElementById("item-name").value =
        itemCtrl.getCurrentItem().name;

      document.getElementById("item-calories").value =
        itemCtrl.getCurrentItem().calories;

      UICtrl.showEditState();
    },
    removeItem: function () {
      let listItems = document.querySelectorAll("#item-list li");
      listItems = Array.from(listItems);
      listItems.forEach((item) => {
        item.remove();
      });
    },
    hideList: function () {
      document.getElementById("item-list").style.display = "none";
    },
    showTotalCalories: function (total) {
      document.querySelector(".total-calories").textContent = total;
    },
    clearEditState: function () {
      UICtrl.clearInput();

      document.querySelector(".update-btn").style.display = "none";

      document.querySelector(".delete-btn").style.display = "none";

      document.querySelector(".back-btn").style.display = "none";

      document.querySelector(".add-btn").style.display = "inline";
    },
    showEditState: function () {
      // UICtrl.clearInput();

      document.querySelector(".update-btn").style.display = "inline";

      document.querySelector(".delete-btn").style.display = "inline";

      document.querySelector(".back-btn").style.display = "inline";

      document.querySelector(".add-btn").style.display = "none";
    },
    // getSelectors: function () {
    //   // return UISelector;
    // },
    getItemInput: function () {
      return {
        name: document.getElementById("item-name").value,

        calories: document.getElementById("item-calories").value
      };
    }
  };
})();

// App Controller
const AppCtrl = (function (itemCtrl, StorageCtrl, UICtrl) {
  // LOAD EVENT LISTERNERS

  const loadEventListerners = function () {
    // GET UI SELECTORS

    // const UIselect = UICtrl.getSelectors();
    // add events
    document.querySelector(".add-btn").addEventListener("click", itemAddSubmit);

    document.addEventListener("keypress", (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        return false;
      }
    });

    document
      .querySelector("#item-list")
      .addEventListener("click", itemEditClick);

    document
      .querySelector(".update-btn")
      .addEventListener("click", itemUpdataSubmit);

    // delete item event
    document
      .querySelector(".delete-btn")
      .addEventListener("click", itemDeleteSubmit);

    // back button
    document
      .querySelector(".back-btn")
      .addEventListener("click", UICtrl.clearEditState);

    // clear all item
    document
      .querySelector(".clear-btn")
      .addEventListener("click", itemDeleteAll);
  };
  const itemAddSubmit = (e) => {
    // console.log("Bring food");
    const input = UICtrl.getItemInput();

    // const updateItem = itemCtrl.updateItem(input.name, input.calories);
    // UICtrl.uptdataListItem(updateItem);

    // const totalCalories = itemCtrl.getTotalCalories();

    // // show totalCalories to the ui
    // UICtrl.showTotalCalories(totalCalories);

    // UICtrl.clearEditState();

    if (input.name !== "" && input.calories !== "") {
      // console.log("bring food");

      const newItem = itemCtrl.additems(input.name, input.calories);
      // console.log(newItem);

      UICtrl.addListItem(newItem);

      // get totalCalories
      const totalCalories = itemCtrl.getTotalCalories();

      // show totalCalories to the ui
      UICtrl.showTotalCalories(totalCalories);

      // update localStorage
      StorageCtrl.updataLocalStorage();

      // storage ctrl
      StorageCtrl.storeItems(newItem);
      // clear field
      UICtrl.clearInput();
    }
    // console.log(input);
    e.preventDefault();
  };

  const itemEditClick = (e) => {
    if (e.target.classList.contains("edit-item")) {
      // console.log("this is it");
      // Get list item id (item-0, item-1)

      const listId = e.target.parentNode.parentNode.id;
      // const listId = e.target.parentN
      // console.log("id");
      // console.log(listId);
      const listArr = listId.split("-");
      // console.log(listArr);
      // console.log(listArr);

      const id = parseInt(listArr[1]);
      // console.log(id);

      const itemToEdit = itemCtrl.getItemById(id);

      // console.log(itemToEdit);

      itemCtrl.setCurrentItem(itemToEdit);

      UICtrl.addItemToForm();
    }

    // console.log(e.target.value);
    // console.log("this is it");

    e.preventDefault();
  };

  const itemUpdataSubmit = (e) => {
    const input = UICtrl.getItemInput();

    const updateItem = itemCtrl.updateItem(input.name, input.calories);

    UICtrl.uptdataListItem(updateItem);

    const totalCalories = itemCtrl.getTotalCalories();

    // show totalCalories to the ui
    UICtrl.showTotalCalories(totalCalories);

    // update localStorage
    StorageCtrl.updataLocalStorage(updateItem);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  // delete item event
  const itemDeleteSubmit = (e) => {
    // console.log("Delete this item");

    // get the needed item
    const currentItem = itemCtrl.getCurrentItem();

    // delete from delete structure
    itemCtrl.deleteItem(currentItem.id);

    // delete from the ui
    UICtrl.deleteListItem(currentItem.id);
    // console.log(UICtrl.deleteListItem(currentItem.id));

    const totalCalories = itemCtrl.getTotalCalories();

    // show totalCalories to the ui
    UICtrl.showTotalCalories(totalCalories);

    // delete from localStorage
    StorageCtrl.deleteFromLs(currentItem.id);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  // clear all button
  const itemDeleteAll = function (e) {
    // delete all items from data structure
    itemCtrl.clearAllItems();

    const totalCalories = itemCtrl.getTotalCalories();

    // show totalCalories to the ui
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.removeItem();

    // remove from localStorage
    StorageCtrl.clearAllFromLS();

    // hide ul
    UICtrl.hideList();
  };

  //   console.log(itemCtrl.logData());

  //   PUBLIC METHOD
  return {
    init: function () {
      // clear the edit btns
      UICtrl.clearEditState();
      //   console.log(itemCtrl.logData());
      const items = itemCtrl.getItem();
      // console.log(items);

      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        UICtrl.populateItemsList(items);
      }

      // get totalCalories
      const totalCalories = itemCtrl.getTotalCalories();

      // show totalCalories to the ui
      UICtrl.showTotalCalories(totalCalories);

      // load event listeners
      loadEventListerners();
    }
  };
})(itemCtrl, StorageCtrl, UICtrl);

AppCtrl.init();
