<?php

class CRM_Conditionalfields_Hook {

  /**
   * hook_civicrm_conditionalFields is used to specify which extensions have
   * show/hide condition definitions supported by this extension
   *
   * @param array $enableForExtensions An array of extensions implementing
   *    conditional fields, e.g.,
   *        $enableForExtensions[] = 'org.xyz.eventregistration'
   * @return null The return value is ignored
   */
  public static function conditionalFields (array &$enableForExtensions) {
    return CRM_Utils_Hook::singleton()->invoke(1, $enableForExtensions, CRM_Utils_Hook::$_nullObject,
      CRM_Utils_Hook::$_nullObject, CRM_Utils_Hook::$_nullObject, CRM_Utils_Hook::$_nullObject,
      'civicrm_conditionalFields');
  }
}