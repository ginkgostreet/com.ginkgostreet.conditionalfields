# CiviCRM Conditional Fields Extension #

### Authors: Ginkgo Street Labs: Frank Gomez, Michael Daryabegi, and Adam Edison ###

## Example Implementation for a Contribution Page ##

In this example, we have a contribution page, of the class CRM_Contribute_Form_Contribution_Main and id = 2.

_The following javascript file is therefore placed in following location:_

<custom_extension_root>/js/CRM_Contribute_Form_Contribution_Main/2.js

where *<custom_extension_root>* is the directory of the custom extension being developed to use this Conditional Fields extension.


```javascript
cj(function($) {
   
  // hide the "- none -" option at all times
  var noneOption = cj('input#CIVICRM_QFID_0_34').first().closest('.price-set-row');
  noneOption.hide();
  
  // always show the Payment Option section, and place it above the Total Amount
  $("div#pricesetTotal").before( $(".crm-public-form-item.crm-group.payment_options-group") );  
  $(".crm-public-form-item.crm-group.payment_options-group").show();
  $(".crm-public-form-item.crm-section.payment_processor-section").show();
  
  // the Annual Revenue label should appear above the radio options for Membership Level
  $("div.content.Membership_Level-content").before( $("div.description") );  
  
  var checkPricesInputbyID = {
    CHECK_PRICE_1: '#CIVICRM_QFID_93_6',
    CHECK_PRICE_2: '#CIVICRM_QFID_94_8',
    CHECK_PRICE_3: '#CIVICRM_QFID_95_10',
    CHECK_PRICE_4: '#CIVICRM_QFID_96_12',
    CHECK_PRICE_5: '#CIVICRM_QFID_97_14',
    CHECK_PRICE_6: '#CIVICRM_QFID_98_16',
    CHECK_PRICE_7: '#CIVICRM_QFID_99_18'
  };
  
  var creditPricesInputbyID = {
    CREDIT_PRICE_1: '#CIVICRM_QFID_163_20',
    CREDIT_PRICE_2: '#CIVICRM_QFID_164_22',
    CREDIT_PRICE_3: '#CIVICRM_QFID_165_24',
    CREDIT_PRICE_4: '#CIVICRM_QFID_166_26',
    CREDIT_PRICE_5: '#CIVICRM_QFID_167_28',
    CREDIT_PRICE_6: '#CIVICRM_QFID_168_30',
    CREDIT_PRICE_7: '#CIVICRM_QFID_169_32' 
 };
  
  // only one of these radio options can be "checked" by design
  var checksChecked = {inputElement: cj('div.crm-public-form-item.crm-section.payment_processor-section'), 
                       isConditionTrue: function() {
                         return (cj("#CIVICRM_QFID_0_payment_processor").is(":checked"));
                       }
                      };
                
  var creditChecked = cj.extend({}, checksChecked,
                      {isConditionTrue: function() {
                         return (cj("#CIVICRM_QFID_1_payment_processor").is(":checked"));
                       }
                     });
                
  var triggerCheckPaymentTypeChecked = new Trigger(checksChecked);
  var triggerCreditPaymentTypeChecked = new Trigger(creditChecked);
  
  var showHideCheckPaymentSelectors = new Array;
  var showHideCreditPaymentSelectors = new Array;
  
  $.each(checkPricesInputbyID, function(index, selectorString) {
    showHideCheckPaymentSelectors.push(cj(selectorString).first().closest('div.price-set-row'));
  });
  
  var sh = new showHideObj(showHideCheckPaymentSelectors);
  sh.addTrigger(triggerCheckPaymentTypeChecked);
  
  $.each(creditPricesInputbyID, function(index, selectorString) {
    showHideCreditPaymentSelectors.push(cj(selectorString).first().closest('div.price-set-row'));
  });
  
  var sh2 = new showHideObj(showHideCreditPaymentSelectors);
  sh2.addTrigger(triggerCreditPaymentTypeChecked);
  
  sh.listenToTriggers();
  sh.getShowHideFunction().call();
  sh2.listenToTriggers();
  sh2.getShowHideFunction().call();
});
```