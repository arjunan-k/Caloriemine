// // Storage Controller
const StorageCtrl = (function() {

    return {

        storeItem: function(item) {
            let items;
            if(localStorage.getItem('items') === null) {
                items = []
                items.push(item)
                localStorage.setItem('items', JSON.stringify(items))
            } else {
                items = JSON.parse(localStorage.getItem('items'))
                items.push(item)
                localStorage.setItem('items', JSON.stringify(items))
            }
        },

        getItemsFromStorage: function() {
            let items;
            if(localStorage.getItem('items') === null) {
                items = []
            } else {
                items = JSON.parse(localStorage.getItem('items'))
            }
            return items
        },

        updateItemStorage: function(updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'))
            items.forEach((item, index) => {
                if(updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem)
                }
            })
            localStorage.setItem('items', JSON.stringify(items))
        },

        deleteItemFromStorage: function(id) {
            let items = JSON.parse(localStorage.getItem('items'))
            items.forEach((item, index) => {
                if(id === item.id) {
                    items.splice(index, 1)
                }
            })
            localStorage.setItem('items', JSON.stringify(items))
        },

        clearItemFromStorage: function() {
            localStorage.removeItem('items');
        }
    }
})()



// Item Controller
const ItemCtrl = (function() {

    const Item = function(id, name, calories) {
        this.id = id
        this.name = name
        this.calories = calories
    }

    const data = {
        // items: [
        //     {id: 0, name: 'Steak', calories: 1200},
        //     {id: 1, name: 'Chicken', calories: 200},
        //     {id: 2, name: 'Eggs', calories: 750}
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    return {

        getItems: function() {
            return data.items
        },

        lodData: function() {
            return data
        },

        addItem: function(name, calories) {
            let ID;
            if(data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1
            } else {
                ID = 0
            }
            const newCalories = parseInt(calories)
            newItem = new Item(ID, name, newCalories)
            data.items.push(newItem)
            return newItem
        },

        getTotalCalories: function() {
            let total = 0;
            data.items.forEach(item => {
                total += item.calories
            })
            data.totalCalories = total
            return data.totalCalories
        },

        getElementbyId: function(id) {
            let found = null;
            data.items.forEach(item => {
                if(item.id === id) {
                    found = item
                }
            })
            return found
        },

        setCurrentItem: function(item) {
            data.currentItem = item
        },

        getCurrentItem: function() {
            return data.currentItem
        },

        updateItem: function(name, calories) {
            newCalories = parseInt(calories)
            let found = null;
            data.items.forEach(item => {
                if(item.id === data.currentItem.id) {
                    item.name = name
                    item.calories = newCalories
                    found = item
                }
            })
            return found
        },

        deleteItem: function(id) {
            ids = data.items.map(item => {
                return item.id
            })
            const index = ids.indexOf(id)
            data.items.splice(index, 1)
        },

        clearAllItems: function() {
            data.items = []
        }
    }
})();



// UI Controller
const UICtrl = (function() {

    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        listItems: '#item-list li',
        clearBtn: '.clear-btn'
    }

    return {

        populateItemList: function(items) {
            let html = ""
            items.forEach(item => {
                html += `
                <li class="collection-item" id="item-${item.id}"><strong>${item.name}: </strong><em>${item.calories} Calories</em><a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a></li>
                `;
            document.querySelector(UISelectors.itemList).innerHTML = html;
            })
        },

        getSelectors: function() {
            return UISelectors
        },

        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },

        addListItem: function(item) {
            document.querySelector(UISelectors.itemList).style.display = 'block'
            const li = document.createElement('li')
            li.className = 'collection-item'
            li.id = `item-${item.id}`

            li.innerHTML = `
                <strong>${item.name}: </strong><em>${item.calories} Calories</em><a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
            `
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },

        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = ""
            document.querySelector(UISelectors.itemCaloriesInput).value = ""
        },

        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = 'none'
        },

        showTotalCalories(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories
        },

        clearEditState: function() {
            UICtrl.clearInput()
            document.querySelector(UISelectors.updateBtn).style.display = 'none'
            document.querySelector(UISelectors.deleteBtn).style.display = 'none'
            document.querySelector(UISelectors.backBtn).style.display = 'none'
            document.querySelector(UISelectors.addBtn).style.display = 'inline'
        },

        showEditState: function() {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline'
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline'
            document.querySelector(UISelectors.backBtn).style.display = 'inline'
            document.querySelector(UISelectors.addBtn).style.display = 'none'
        },

        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories
            UICtrl.showEditState();
        },

        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelectors.listItems)

            listItems = Array.from(listItems)
            listItems.forEach(listItem => {
                const itemID = listItem.getAttribute('id')
                if(itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `
                        <strong>${item.name}: </strong><em>${item.calories} Calories</em><a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
                    `
                }
            })
        },

        deleteListItem: function(id) {
            const itemID = `#item-${id}`
            const item = document.querySelector(itemID)
            item.remove()
            const totalCalories = ItemCtrl.getTotalCalories()
            UICtrl.showTotalCalories(totalCalories)
            UICtrl.clearEditState()
        },

        removeAllItems: function() {
            let listItems = document.querySelectorAll(UISelectors.listItems)
            listItems = Array.from(listItems)
            listItems.forEach(item => {
                item.remove()
            })
        }
    }
})();



// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {

    const loadEventListeners = function(){
        const UISelectors = UICtrl.getSelectors()
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13) {
                e.preventDefault()
                return false
            }
        })

        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick)
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit)
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState)
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit)
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick)
    }

    const itemAddSubmit = function(e) {
        const input = UICtrl.getItemInput();
        if(input.name != '' && input.calories != '') {
            const newItem = ItemCtrl.addItem(input.name, input.calories)
            UICtrl.addListItem(newItem)
            const totalCalories = ItemCtrl.getTotalCalories()
            UICtrl.showTotalCalories(totalCalories)
            StorageCtrl.storeItem(newItem)
            UICtrl.clearInput()
        }
        e.preventDefault();
    }

    const itemEditClick = function(e) {
        if(e.target.classList.contains('edit-item')) {
            const listId = e.target.parentNode.parentNode.id
            const listIdArr = listId.split('-')
            const id = parseInt(listIdArr[1])

            const itemToEdit = ItemCtrl.getElementbyId(id);
            
            ItemCtrl.setCurrentItem(itemToEdit)
            UICtrl.addItemToForm();
        }
        e.preventDefault()
    }

    const itemDeleteSubmit = function(e) {
        const currentItem = ItemCtrl.getCurrentItem()
        ItemCtrl.deleteItem(currentItem.id)
        StorageCtrl.deleteItemFromStorage(currentItem.id)
        UICtrl.deleteListItem(currentItem.id)
        e.preventDefault()
    }

    const itemUpdateSubmit = function(e){
        const input = UICtrl.getItemInput()
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories)
        UICtrl.updateListItem(updatedItem)
        const totalCalories = ItemCtrl.getTotalCalories()
        UICtrl.showTotalCalories(totalCalories)
        StorageCtrl.updateItemStorage(updatedItem)
        UICtrl.clearEditState()

        e.preventDefault()
    }

    const clearAllItemsClick = function(e) {
        ItemCtrl.clearAllItems()
        const totalCalories = ItemCtrl.getTotalCalories()
        UICtrl.showTotalCalories(totalCalories)
        UICtrl.removeAllItems()
        StorageCtrl.clearItemFromStorage()
        UICtrl.hideList()
    }

    return {
        
        init: function() {
            UICtrl.clearEditState()
            const items = ItemCtrl.getItems();
            if (items.length === 0) {
                UICtrl.hideList()
            } else {
                UICtrl.populateItemList(items)
            }
            const totalCalories = ItemCtrl.getTotalCalories()
            UICtrl.showTotalCalories(totalCalories)
            loadEventListeners();
        }
    }

})(ItemCtrl, StorageCtrl, UICtrl);

App.init()