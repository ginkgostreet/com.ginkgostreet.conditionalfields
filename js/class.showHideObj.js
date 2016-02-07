function showHideObj(showHideElements) {

  this.showHideElementsArray = [];

  if (isString(showHideElements)) {
    this.addShowHideElementFromstring(showHideElements);
  }
  else if (isJQueryObject(showHideElements)) {
    this.addShowHideElementFromJQuery(showHideElements);
  }
  else if (showHideElements instanceof Array) {
    this.addShowHideElementFromArray(showHideElements);
  }
  else {
    this.logInvalidConstructorArgument(showHideElements);
  }

  this.triggerObjectsArray = new Array;
  this.logicalOperator = 'AND';
}

showHideObj.prototype.setLogicalOperator = function (operatorstring) {
  operatorstring = operatorstring.toUpperCase();
  if ((operatorstring === 'AND') || (operatorstring === 'OR')) {
    this.logicalOperator = operatorstring;
  }
  else {
    console.log("Invalid operatorstring: " + operatorstring);
  }
    
};

showHideObj.prototype.addShowHideElementFromstring = function (str) {
  if (cj(str).length)
    this.showHideElementsArray.push(cj(str));
  else
    console.log("Invalid string Used as jQuery Selector - No Results: " + str);
};

showHideObj.prototype.addShowHideElementFromJQuery = function (jqueryobj) {
  if (jqueryobj.length)
    this.showHideElementsArray.push(jqueryobj);
  else
    console.log("Invalid jQuery Selector - No Results: " + jqueryobj);
};

showHideObj.prototype.addShowHideElementFromArray = function (arr) {
  if (!arr.length)
    console.log("Invalid Empty Array - No Results");
  else {
      arr.forEach(function (entry) {
      if (isJQueryObject(entry))
        this.addShowHideElementFromJQuery(entry);
      else if (isString(entry))
        this.addShowHideElementFromstring(entry);
      else {
        console.log("Invalid Array Entry");
        this.logInvalidConstructorArgument(entry);
      }
    }, this);
  }
};

showHideObj.prototype.logInvalidConstructorArgument = function (arg) {
  console.log("Invalid showHideElements object type passed to ShowHideObj constructor: " + typeof(arg));
  console.log(arg);
  console.log("Allowed: string, string[], jQuery, or jQuery[].");
};

var isString = function (str) {
  return ((typeof (str) === "string") || (str instanceof String));
};

var isJQueryObject = function (obj) {
  return (obj && (obj instanceof jQuery || obj.constructor.prototype.jquery));
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