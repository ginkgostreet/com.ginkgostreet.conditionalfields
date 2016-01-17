/**
 * Constructor for this class.
 * 
 * @param toggleObject jQueryObject - result of a jQuery selector, e.g. cj("input#CIVICRM_QFID_0_34") 
 */
function showHideObj(toggleObject) {
  this.toggleObject = toggleObject;
  this.triggerObjectsArray = null;
  this.logicalOperator = 'AND';
  this.eventBoundTo = this.getDefaultEventBinding();
}

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