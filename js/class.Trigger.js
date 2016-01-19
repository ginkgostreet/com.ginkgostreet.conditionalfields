/**
 * Constructor for this class.
 * 
 * @param inputElement jQueryObject - result of a jQuery selector that resolves to an input
 * e.g. cj("input#CIVICRM_QFID_0_34")
 * 
 * @param showValue string - value of the inputElement which causes the Trigger to evaluate to true
 *
 * Inputs based upon value only:
 * e.g. "Arizona" - for a text input object value as a trigger
 * 
 * Inputs based upon checked/unchecked or selected/unselected:
 * e.g. "checked" - for radio buttons/checkboxes to be "checked" as a trigger
 * e.g. "unchecked" - for radio buttons/checkboxes to be "unchecked" as a trigger
 * 
 * Mixed case of checked and a specific value:
 * e.g. "98" for radio button which will change value, add a radio button Trigger, 
 * but will need to afterwards setInputType('value'), 
 * and add a separate trigger for checked/unchecked if desired on the same inputElement.
 * 
 */
function Trigger(inputElement, showValue) {
  this.inputElement = inputElement;
  this.showValue = showValue;
  this.inputType = undefined;
  this.determineInputType();
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
 * @param inputElement - a JQuery selector that resolves to an input
 * 
 */
Trigger.prototype.determineInputType = function() {
  
  var inputElement = this.inputElement;
  
 if(inputElement.is('select[multiple=multiple]'))
    this.inputType = 'multi-select';
  else if(inputElement.is(':checkbox'))
    this.inputType = 'checkbox';
  else if(inputElement.is(':radio'))
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
Trigger.prototype.setConditionTrueFunction = function (conditionFunction) {
    this.isConditionTrue = conditionFunction;
};

/**
 *
 * This is the default function for determining if the Trigger will evaluate to true.
 * Based upon this.inputType, it will determine how to check if the showValue matches with the inputElement.
 * 
 * @param multiSelectremovedValue string - this is an optional parameter that is only passed in to handle multi-selects
 * This is a bit of a hack to account for the fact that 
 * DOMNodeRemoved fires *before* the node is removed, 
 * making it impossible to rely on the DOM for information about de-selected options 
 * in an advanced multiselect context.
 * 
 * @return result - true or false
 * 
 */
Trigger.prototype.determineConditionTrue = function(multiSelectremovedValue) {
  
  var el = this.inputElement;
  var type = this.inputType;
    
  if(type === 'value') {
    return (this.showValue === el.val());
  }
  else if ((type === 'radio') || (type === 'checkbox')) { 
    
    if(this.showValue === "unchecked") {
      return (!el.is(':checked'));
    }
    else if(this.showValue === "checked") { 
      return (el.is(':checked'));
    }
    else {
      console.log("Invalid showValue specified for radio/checkbox element " + this.showValue);
      return false;
    }
 }
 else if((type === 'multi-select')) {
   return (el.children('option[value="' + this.showValue + '"]').length !== 0
            && multiSelectremovedValue !== this.showValue);
   
 }
  
};
