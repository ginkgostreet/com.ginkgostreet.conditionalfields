function showHideObj (name) {
  this.elementName = name;
  // the element to be shown/hidden; this is a jQuery object
  this.element = cj('[name="' + name + '"]').first().closest('.crm-section');
  // array of objects specifying a list form elements/values, any of which will result in a show
  this.triggers = [];
}

var SHOW_SPEED = 300;

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
        SHO.element.show(SHOW_SPEED);
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
        SHO.element.show(SHOW_SPEED);
        ruleApplied = true;
        return false;
      }
    } else {
      if (cj(triggerEl).val() === trigger.value) {
        SHO.element.show(SHOW_SPEED);
        ruleApplied = true;
        return false;
      }
    }
  });

  if (!ruleApplied) {
    this.unsetValue();
    this.element.hide(SHOW_SPEED);
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
