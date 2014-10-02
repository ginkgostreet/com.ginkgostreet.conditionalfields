<?php

class CRM_Conditionalfields_Hook {

  /**
   * hook_civicrm_conditionalFields is used to specify which forms have
   * show/hide condition definitions supported by this extension
   *
   * @param array $formList An array, keyed by form name, of forms to be customized, e.g.,
   *        $formList = array(
   *          'CRM_Event_Form_Registration_Register' => array(
   *            'extension' => 'org.myorg.myext', // The name of the extension implementing the hook;
   *                                              // we need this so we know where to find the JavaScript
   *            'entityID' => 2,
   *          ),
   *          1 => array( ...
   * @return null The return value is ignored
   */
  public static function conditionalFields (array &$formList) {
    return CRM_Utils_Hook::singleton()->invoke(1, $formList, CRM_Utils_Hook::$_nullObject,
      CRM_Utils_Hook::$_nullObject, CRM_Utils_Hook::$_nullObject, CRM_Utils_Hook::$_nullObject,
      'civicrm_conditionalFields');
  }
}