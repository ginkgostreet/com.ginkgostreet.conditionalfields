/**
 * Constructor for this class.
 * 
 * @param inputElement jQueryObject - result of a jQuery selector that resolves to an input
 * e.g. cj("input#CIVICRM_QFID_0_34")
 * 
 * @param showValue string - value of the inputElement which causes the Trigger to evaluate to true
 * e.g. "1" - typically for radio buttons or checkboxes to be "checked"
 * e.g. undefined - for a radio button or checkbox to be "unchecked"
 * 
 * If per the above example, this were the only Trigger belonging to showHideObj, and the showValue at runtime = "1",
 * the showHideObj would be shown.
 */
function Trigger(inputElement, showValue) {
  this.inputElement = inputElement;
  this.showValue = showValue;
  this.inputType = this.determineInputType();
  this.isConditionTrue = this.determineConditionTrue; // assignment of a function to a function
}

/**
 * If the Trigger itself is unable to properly determine the inputType during its construction,
 * the inputType can be set manually by using this function.
 * 
 * @param inputType string - type of the inputElement
 * e.g. "checkbox"
 *
 */
Trigger.prototype.setInputType = function (inputType) {
    this.inputType = inputType;
};

/**
 *
 * Determines the type of the inputElement supplied.
 * Defaults to 'value', or finds specific element by reflection:
 * (e.g. 'radio', 'checkbox', 'multi-select', etc.)
 * 
 */
Trigger.prototype.determineInputType = function() {
  
  var el = this.inputElement;
  
   if(el.is('select[multiple=multiple]'))
     this.inputType = 'multi-select';
   else if(el.is(':checkbox'))
     this.inputType = 'checkbox';
   else if(el.is(':radio'))
     this.inputType = 'radio';
   else
     this.inputType = 'value';
};

/**
 * If the desired condition to have isConditionTrue return true 
 * is not met by the default, determineConditionTrue,
 * the isConditionTrue function can be set manually set by using this function.
 * 
 * @param conditionFunction function - function to replace default behavior for isConditionTrue, 
 * IMPORTANT: conditionFunction must return true or false
 * 
 * e.g. function (arg1, arg2) {return (arg1 === arg2)};
 *
 */
Trigger.prototype.setInputType = function (conditionFunction) {
    this.isConditionTrue = conditionFunction;
};

/**
 *
 * This is the default function for determining if the Trigger will evaluate to true.
 * Based upon this.inputType, it will determine how to check if the showValue matches with the inputElement.
 * 
 * @return result - true or false
 * 
 */
Trigger.prototype.determineConditionTrue = function() {
  
  var el = this.inputElement;
  var type = this.inputType;
  
  if(type === 'value') {
    console.log('type is value');
    console.log(el.val());
    return (el.val() === this.showValue);
  }
  
};
