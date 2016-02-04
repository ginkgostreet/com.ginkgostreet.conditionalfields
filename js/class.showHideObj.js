function showHideObj(showHideElements) {
  if (showHideElements instanceof Array) {
    this.showHideElementsArray = showHideElements;
  }
  else if (showHideElements instanceof String) {
    if (cj(showHideElements).length) {
      this.showHideElementsArray = [];
      this.showHideElementsArray.push(cj(showHideElements));
    }
    else {
      throw new showHideConstructorError("Invalid constructor argument: " + showHideElements.toString());
    }
  }
  else {
    throw new showHideConstructorError("Invalid constructor argument. Requires string or valid jQuery selector, or array of jQuery selectors.");
  }

  this.triggerObjectsArray = new Array;
  this.logicalOperator = 'AND';
}

function showHideConstructorError(message) {
  this.message = message;
  this.stack = (new Error()).stack;
}

showHideConstructorError.prototype = Object.create(Error.prototype);
showHideConstructorError.prototype.name = "showHideConstructorError";

showHideObj.prototype.setLogicalOperator = function(operatorString) {
  operatorString = operatorString.toUpperCase();
  if((operatorString === 'AND') || (operatorString === 'OR')) {
    this.logicalOperator = operatorString;
  }
  else {
    console.log("Invalid operatorString: " + operatorString);
  }
    
};

showHideObj.prototype.testTriggers = function() {
  
  var triggers = this.triggerObjectsArray;
  var len = triggers.length;
  var last = len - 1;
  
  for(i = 0; i < len; i++) {
       
    if(!triggers[i].isConditionTrue() && this.logicalOperator === 'AND') { // first FALSE we hit, we're done checking
      return false;
    }
    else if (triggers[i].isConditionTrue() && this.logicalOperator === 'OR') { // first TRUE we hit, we're done checking
      return true;
    }
    else if (i === last) { // last element, if FALSE, we don't show because AND/OR fails  
      return triggers[i].isConditionTrue();
    }
  }
};

showHideObj.prototype.addTrigger = function(triggerObject) {
  this.triggerObjectsArray.push(triggerObject);
};

showHideObj.prototype.listenToTriggers = function() {
  
  var sho = this;
  
  var bindTriggers = function(index, trigger) {
    trigger.inputElement.bind(trigger.bindEvent, sho.getShowHideFunction());
  };

  cj.each(sho.triggerObjectsArray, bindTriggers);
 
};

showHideObj.prototype.getShowHideFunction = function() {
  var sho = this;
  
  return function() {
    (sho.testTriggers()) ? sho.showHideElementsArray.forEach(function(el) {el.show(); }) :  sho.showHideElementsArray.forEach(function(el) {el.hide(); }); 
  };
};