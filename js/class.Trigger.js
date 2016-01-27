function Trigger(config) {
  this.isConditionTrue = this.defaultTest;
  cj.extend(this, config);
  this.initializeInputTypeAndGetter();
}

Trigger.prototype.bindEvent = "change";


Trigger.prototype.setInputType = function (inputType) {
    this.inputType = inputType;
};


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
