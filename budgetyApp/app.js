// Module pattern is used in this app.

let budgetController = (function () {
    
    let Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    let Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    let calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach((cur)=> {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };
    
    // small database
    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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
        
        deleteItem: function(type, id) {
            
            let ids = data.allItems[type].map(function(current) {
                return current.id;
            });
            
            let index = ids.indexOf(id);
            
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            
        },
        
        calculateBudget: function() {
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            // calculate the percentage of income that was spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);    
            }
            
        },
        
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        
        testing: function() {
            console.log(data);
        }
    };
    
})();

let UIController = (function() {
    
    let DOMStrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list",
        expensesContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expensesLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container"
        
    };
    
    let displayInField = function(field, content) {
        document.querySelector(field).textContent = content; 
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
                
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"</i></button></div></div></div>';
            } else if (Object.is(type, "exp")) {
                element = DOMStrings.expensesContainer;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            // Replace placeholder text with some actual data
            newHtml = html
                .replace("%id%", obj.id)
                .replace("%description%", obj.description)
                .replace("%value%", obj.value);
            
            // Insert HTML into DOM
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
            
        },
        
        displayBudget: function(obj) {
            displayInField(DOMStrings.budgetLabel, obj.budget);
            displayInField(DOMStrings.incomeLabel, obj.totalInc);
            displayInField(DOMStrings.expensesLabel, obj.totalExp);
            displayInField(DOMStrings.percentageLabel, obj.percentage > 0 ? obj.percentage + '%' : '---');
            
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
        
        document.querySelector(DOMStrings.container).addEventListener('click', ctrlDeleteItem);
    };
    
    var updateBudget = function() {
        
        // 4. Calculate the budget
        budgetCtrl.calculateBudget();
        
        // return budget
        let budget = budgetCtrl.getBudget();
        
        // 5. Display on UI
        UICtrl.displayBudget(budget);
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
    
    var ctrlDeleteItem = function(event) {
        let itemId, splitId, type, id;
        let node = event.target;
       
        while (!(node.id.includes('inc') || node.id.includes('exp'))) {
            node = node.parentNode;
        }
        itemId = node.id;
        
        if (itemId) {
            splitId = itemId.split('-');
            type = splitId[0];
            id = parseInt(splitId[1]);
            
            //1. Delete the item from the data structure
            console.log(id);
            budgetCtrl.deleteItem(type, id);
        
            // 2. Delete the item from the UI
        
            // 3. Update and show the new budget
        }
        
        
    };
    
    return {
        init: function() {
            console.log("Application is started");
            UICtrl.displayBudget({budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1});
            setupEventListeners();
        }
    }
    
})(budgetController, UIController);

controller.init();