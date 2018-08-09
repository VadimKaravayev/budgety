// Module pattern is used in this app.

var budgetController = (function() {
    
})();

var UIController = (function() {
    
    let DOMStrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn"
    };
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value  
            };
            
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
    }
    
    
    
    var ctrlAddItem = function() {
        
        // 1. Get the field input data
        let input = UICtrl.getInput();
        console.log(input);
        
        // 2. Add the item to the budget controller
        
        // 3. Add the item to the UI
        
        // 4. Calculate the budget
         
    }
    
    return {
        init: function() {
            console.log("Application is started");
            setupEventListeners();
        }
    }
    
})(budgetController, UIController);

controller.init();