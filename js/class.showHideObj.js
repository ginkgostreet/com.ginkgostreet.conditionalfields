function showHideObj(showHideElement) {
  this.showHideElement = showHideElement;
  this.triggerObjectsArray = new Array;
  this.logicalOperator = 'AND';
}

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
