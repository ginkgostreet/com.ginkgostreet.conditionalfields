/**
 * Constructor for this class.
 * 
 * @param inputElement jQueryObject - result of a jQuery selector that resolves to an input
 * e.g. cj("input#CIVICRM_QFID_0_34")
 * 
 * @param showValue string - value of the inputElement which causes the Trigger to evaluate to true
 * e.g. "1"
 * 
 * @param inputType string - type of the inputElement
 * e.g. "checkbox"
 * 
 * If per the above example, this were the only Trigger belonging to showHideObj, and the showValue at runtime = "1",
 * the showHideObj would be shown.
 */
function Trigger(inputElement, showValue, inputType) {
  this.inputElement = inputElement;
  this.showValue = showValue;
  this.inputType = inputType;
}

