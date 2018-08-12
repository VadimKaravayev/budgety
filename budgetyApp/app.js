// Module pattern is used in this app.

var budgetController = (function () {
    
    'use strict';
    
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
   
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };
    
    return {
        addItem: function (type, des, val) {
            let newItem, ID;
            let money = data.allItems[type];
            ID = money.length > 0 ? money[money.length - 1].id + 1 : 0;
            if (Object.is(type, "exp")) {
                newItem = new Expense(ID, des, val);
            } else if (Object.is(type, "inc")) {
                newItem = new Income(ID, des, val);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },
        testing: function() {
            console.log(data);
        }
    };
    
})();

var UIController = (function() {
    
    let DOMStrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list",
        expensesContainer: ".expenses__list"
    };
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)  
            };
            
        }, 
        
        addListItem: function(obj, type) {
            let html, newHtml, element;
            // create HTML string with placeholder text
            if (Object.is(type, "inc")) {
                element = DOMStrings.incomeContainer;
                
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"</i></button></div></div></div>';
            } else if (Object.is(type, "exp")) {
                element = DOMStrings.expensesContainer;
                
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            // Replace placeholder text with some actual data
            newHtml = html
                .replace("%id%", obj.id)
                .replace("%description%", obj.description)
                .replace("%value%", obj.value);
            
            // Insert HTML into DOM
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
            
        },
        
        clearFields: function() {
            let fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMStrings.inputDescription + ", " + DOMStrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, value, array) {
                current.value = "";
            });
            
            fieldsArr[0].focus();
        },
        
        getDOMStrings: function() {
            return DOMStrings;
        }
        
    }
    
})();

// the controller distributes work among other modules. 
var controller = (function(budgetCtrl, UICtrl) {
    
    let setupEventListeners = function() {
        
        let DOMStrings = UICtrl.getDOMStrings();
        
        document.querySelector(DOMStrings.inputBtn).addEventListener("click", ctrlAddItem);
    
        document.addEventListener("keypress", (event)=> {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };
    
    var updateBudget = function() {
        
        // 4. Calculate the budget
        
        // return budget
        
        // 5. Display on UI 
    };
    
    
    var ctrlAddItem = function() {
        
        // 1. Get the field input data
        let input = UICtrl.getInput();
        console.log(input);
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            let newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // clear fields
            UICtrl.clearFields();
        }
        
        
        updateBudget();
         
    };
    
    return {
        init: function() {
            console.log("Application is started");
            setupEventListeners();
        }
    }
    
})(budgetController, UIController);

controller.init();