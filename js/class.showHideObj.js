/**
 * Constructor for this class.
 * 
 * @param toggleObject jQueryObject - result of a jQuery selector to be shown or hidden
 * e.g. cj("input#CIVICRM_QFID_0_34").closest('div.price-set-row')
 */
function showHideObj(toggleObject) {
  this.toggleObject = toggleObject;
  this.triggerObjectsArray = null;
  this.logicalOperator = 'AND';
}

/**
 * Sets the logical operator to apply to all trigger objects.
 * NOTE: By default, the logical operator is set to 'AND' in the constructor.
 * 
 * If 'AND', then all conditions must be met to show this showHideObject.
 * If 'OR', then only one condition must be met to show this showHideObject.
 * 
 * @param fieldName string - either 'AND' or 'OR', case insensitive
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
 * Adds a trigger object.
 * 
 * @param triggerObject Trigger - see the Trigger class for details about creating a Trigger object
 * 
 * Any invalid object result in an error being logged to the console,
 * and the object will not be added to this.triggerObjectsArray.
 * 
 */
showHideObj.prototype.addTrigger = function(triggerObject) {
  if(typeof triggerObject === "Trigger") {
    this.triggerObjectsArray.push(triggerObject);
  }
  else {
    console.log("Invalid triggerObject (below): ");
    console.log(triggerObject);
  }
};

/**
 * @param fieldName string - name of triggering field
 * @param value string - name of triggering value
 */
showHideObj.prototype.registerTrigger = function(fieldName, value) {
  this.triggers.push({name:fieldName, value:value});
};

/**
 * @param removedVal string - This is a bit of a hack to account for the fact
 *                            that DOMNodeRemoved fires *before* the node is
 *                            removed, making it impossible to rely on the DOM
 *                            for information about de-selected options in an
 *                            advanced multiselect context.
 */
showHideObj.prototype.toggle = function(removedVal) {
  var SHO = this;
  var ruleApplied = false;
  cj.each(SHO.triggers, function(i, trigger) {
    var triggerEl = cj('[name="' + trigger.name + '"]');

    // special case for advanced multiselects
    if(triggerEl.is('select[multiple=multiple]')) {
      if(
        triggerEl.children('option[value="' + trigger.value + '"]').length &&
        removedVal !== trigger.value
      ) {
        SHO.element.show(1000);
        ruleApplied = true;
        return false;
      }
    } else if (triggerEl.is(':checkbox, :radio')) {
      if (
        // allows an unchecked checkbox to be used as a trigger
        (
          trigger.value === undefined
          && cj(triggerEl).filter(':checked').length === 0
        )
        // standard check: if checked box has the value, show the dependent
        || cj(triggerEl).filter(':checked[value=' + trigger.value + ']').length) {
        SHO.element.show(1000);
        ruleApplied = true;
        return false;
      }
    } else {
      if (cj(triggerEl).val() === trigger.value) {
        SHO.element.show(1000);
        ruleApplied = true;
        return false;
      }
    }
  });

  if (!ruleApplied) {
    this.unsetValue();
    this.element.hide(1000);
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