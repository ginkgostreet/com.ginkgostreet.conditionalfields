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
function Trigger(config) {
  /*this.inputElement = undefined;
  this.showValue = undefined;
  this.inputType = undefined;*/
  this.isConditionTrue = this.defaultTest;
  cj.extend(this, config);
  this.initializeInputTypeAndGetter();
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
Trigger.prototype.initializeInputTypeAndGetter = function() {
  
  var inputElement = this.inputElement;
  
  if(inputElement.is(':checkbox')) {
    this.inputType = 'checkbox';
    this.getElementState = this.getCheckboxOrRadioState;
  }
  else if(inputElement.is(':radio')) {
    this.inputType = 'radio';
    this.getElementState = this.getCheckboxOrRadioState;
  }
  else {
    this.inputType = 'value';
    this.getElementState = this.getValue;
  }
 
};

Trigger.prototype.defaultTest = function() {
  return(this.showValue === this.getElementState(this.inputElement));
};

Trigger.prototype.getElementState = function (el) {
        
};

Trigger.prototype.getCheckboxOrRadioState = function (el) {
  return (el.is(':checked') ? "checked" : "unchecked");
};

Trigger.prototype.getValue = function (el) {
   return el.val();
};
