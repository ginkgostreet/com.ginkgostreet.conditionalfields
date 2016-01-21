/**
 * Constructor for this class.
 * 
 * @param toggleObject jQueryObject - result of a jQuery selector to be shown or hidden
 * e.g. cj("input#CIVICRM_QFID_0_34").closest('div.price-set-row')
 */
function showHideObj(toggleObject) {
  this.toggleObject = toggleObject;
  this.triggerObjectsArray = new Array;
  this.logicalOperator = 'AND';
}

/**
 * Sets the logical operator to apply to all trigger objects.
 * NOTE: By default, the logical operator is set to 'AND' in the constructor.
 * 
 * If 'AND', then all conditions must be met to show this showHideObject.
 * If 'OR', then only one condition must be met to show this showHideObject.
 * 
 * @param operatorString string - either 'AND' or 'OR', case insensitive
 * 
 * Any unsupported value will result in an error being logged to the console,
 * and the current logicalOperator will remain in effect.
 * 
 */
showHideObj.prototype.setLogicalOperator = function(operatorString) {
  operatorString = operatorString.toUpperCase();
  if((operatorString === 'AND') || (operatorString === 'OR')) {
    this.logicalOperator = operatorString;
  }
  else {
    console.log("Invalid operatorString: " + operatorString);
  }
    
};

/**
 * Shows or hides this.toggleObject based upon Trigger logic and configuration of this object.
 * 
 * @param multiSelectRemovedValue string - optionally passed from bindEvents IFF we are dealing with a multi-select
 * 
 * @return result - true or false
 * 
 * 
 */
showHideObj.prototype.toggleShowHide = function(multiSelectRemovedValue) {
  
  this.shouldBeShown(multiSelectRemovedValue) ? this.show() : this.hide();
  
};


/**
 * Loops through each Trigger and evaluates whether or not to show or hide this.toggleObject,
 * based upon the logicalOperator.
 * 
 * @param multiSelectRemovedValue string - optionally passed from toggleShowHide IFF we are dealing with a multi-select
 * 
 * @return result - true or false
 * 
 * 
 */
showHideObj.prototype.shouldBeShown = function() {
  
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

/**
 * Adds a trigger object.
 * 
 * @param triggerObject Trigger - see the Trigger class for details about creating a Trigger object
 * 
 * Any invalid object result in an error being logged to the console,
 * and the object will not be added to this.triggerObjectsArray.
 * 
 */
showHideObj.prototype.addTrigger = function(triggerObject) {
  if(triggerObject.constructor === Trigger) {
    this.triggerObjectsArray.push(triggerObject);
  }
  else {
    console.log("Invalid triggerObject (below): ");
    console.log(triggerObject);
  }
};

/**
 * Binds DOM events to the showHide object in order to run the toggleShowHide function
 * upon the appropriate action taken on each individual Trigger object.
 *  
 */
showHideObj.prototype.bindEvents = function() {
  
  var triggers = this.triggerObjectsArray;
  var len = triggers.length;
  
  for(i = 0; i < len; i++) {
    
    var el = triggers[i].inputElement;
      
    if(el.inputType === 'multi-select') {
      
      el.bind('DOMNodeInserted', function() {
        this.toggleShowHide();
      });
      
      el.bind('DOMNodeRemoved', function(e){
        var removedMultiSelectElementValue = $(e.target).attr('value');
        this.toggleShowHide(removedMultiSelectElementValue);
      });
    } 
    else {
      el.change(function() {
       this.toggleShowHide();
      });
    }
  }
};

showHideObj.prototype.unsetValue = function() {
  var field = cj('[name=' + this.elementName + ']');
  // special case for advanced multiselects
  if(field.is('select[multiple=multiple]')) {
    console.log('Tried to unset value on multiselect; this functionality is not yet implemented');
  } else if (field.is(':checkbox, :radio')) {
    field.prop('checked', false);
  } else {
    field.val('');
  }
};
/*
////////////////////////////////////////////////
  // you shouldn't need to edit below this line //
  ////////////////////////////////////////////////
  // parse show/hide rules
  var showHideObjArr = {};
  $.each(showHideRules, function(index, obj) {
    // register triggers for each dependent
    $.each(obj.dependents, function(i, dependentName) {
      if (!showHideObjArr.hasOwnProperty(dependentName)) {
        showHideObjArr[dependentName] = new showHideObj(dependentName);
      }
      showHideObjArr[dependentName].registerTrigger(obj.name, obj.value);
    });

    // wire up the fields that trigger the show/hide behavior
    var el = $('[name="' + obj.name + '"]');

    // special case for advanced multiselects
    if(el.is('select[multiple=multiple]')) {
      el.bind('DOMNodeInserted', function(){
        $.each(obj.dependents, function(i, dep) {
          showHideObjArr[dep].toggle();
        });
      });
      el.bind('DOMNodeRemoved', function(e){
        var removedEl = e.target;
        $.each(obj.dependents, function(i, dep) {
          showHideObjArr[dep].toggle($(removedEl).attr('value'));
        });
      });
    } else {
      el.change(function() {
        $.each(obj.dependents, function(i, dep) {
          showHideObjArr[dep].toggle();
        });
      });
    }
  });

  */