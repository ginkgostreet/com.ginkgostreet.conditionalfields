function showHideCollection() {
  this.showHideObjectsArray = new Array;
}

showHideCollection.prototype.addShowHideObj = function(showHideObject) {
  this.showHideObjectsArray.push(showHideObject);
};

showHideCollection.prototype.listenToTriggers = function() {
  
  var shoc = this;
  
  cj.each(this.showHideObjectsArray, function(index, sho) {
    
    var bindTriggers = function(index, trigger) {
      trigger.inputElement.bind(trigger.bindEvent, shoc.getShowHideFunction());
    };
    
    cj.each(sho.triggerObjectsArray, bindTriggers);
    
  });
};

showHideCollection.prototype.getShowHideFunction = function() {
  var shoa = this.showHideObjectsArray;
  
  return function() {
    cj.each(shoa, function(index, sho) {
      (sho.testTriggers()) ? sho.showHideElementsArray.forEach(function(el) {el.show(); }) :  sho.showHideElementsArray.forEach(function(el) {el.hide(); }); 
    });
  };
};