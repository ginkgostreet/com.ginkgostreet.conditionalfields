<?php

require_once 'conditionalfields.civix.php';

/**
 * Implementation of hook_civicrm_config
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_config
 */
function conditionalfields_civicrm_config(&$config) {
  _conditionalfields_civix_civicrm_config($config);
}

/**
 * Implementation of hook_civicrm_xmlMenu
 *
 * @param $files array(string)
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_xmlMenu
 */
function conditionalfields_civicrm_xmlMenu(&$files) {
  _conditionalfields_civix_civicrm_xmlMenu($files);
}

/**
 * Implementation of hook_civicrm_install
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_install
 */
function conditionalfields_civicrm_install() {
  _conditionalfields_civix_civicrm_install();
}

/**
 * Implementation of hook_civicrm_uninstall
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_uninstall
 */
function conditionalfields_civicrm_uninstall() {
  _conditionalfields_civix_civicrm_uninstall();
}

/**
 * Implementation of hook_civicrm_enable
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_enable
 */
function conditionalfields_civicrm_enable() {
  _conditionalfields_civix_civicrm_enable();
}

/**
 * Implementation of hook_civicrm_disable
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_disable
 */
function conditionalfields_civicrm_disable() {
  _conditionalfields_civix_civicrm_disable();
}

/**
 * Implementation of hook_civicrm_upgrade
 *
 * @param $op string, the type of operation being performed; 'check' or 'enqueue'
 * @param $queue CRM_Queue_Queue, (for 'enqueue') the modifiable list of pending up upgrade tasks
 *
 * @return mixed  based on op. for 'check', returns array(boolean) (TRUE if upgrades are pending)
 *                for 'enqueue', returns void
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_upgrade
 */
function conditionalfields_civicrm_upgrade($op, CRM_Queue_Queue $queue = NULL) {
  return _conditionalfields_civix_civicrm_upgrade($op, $queue);
}

/**
 * Implementation of hook_civicrm_managed
 *
 * Generate a list of entities to create/deactivate/delete when this module
 * is installed, disabled, uninstalled.
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_managed
 */
function conditionalfields_civicrm_managed(&$entities) {
  _conditionalfields_civix_civicrm_managed($entities);
}

/**
 * Implementation of hook_civicrm_caseTypes
 *
 * Generate a list of case-types
 *
 * Note: This hook only runs in CiviCRM 4.4+.
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_caseTypes
 */
function conditionalfields_civicrm_caseTypes(&$caseTypes) {
  _conditionalfields_civix_civicrm_caseTypes($caseTypes);
}

/**
 * Implementation of hook_civicrm_alterSettingsFolders
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_alterSettingsFolders
 */
function conditionalfields_civicrm_alterSettingsFolders(&$metaDataFolders = NULL) {
  _conditionalfields_civix_civicrm_alterSettingsFolders($metaDataFolders);
}

/**
 * Implementation of hook_civicrm_buildForm
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_buildForm
 */
function conditionalfields_civicrm_buildForm($formName, &$form){
  // make sure this doesn't get loaded more than once
  static $loaded = FALSE;

  $formList = array();
  CRM_Conditionalfields_Hook::conditionalFields($formList);

  $jsToLoad = array();
  foreach ($formList as $specFormName => $specData) {
    if ($formName == $specFormName && _conditionalfields_getEntityID($form) == $specData['entityID']) {
      // make sure the file exists
      $baseDir = CRM_Extension_System::singleton()->getMapper()->keyToBasePath($specData['extension']);
      $js_file = "js/{$specFormName}/{$specData['entityID']}.js";
      if (file_exists($baseDir . '/' . $js_file)) {
        $jsToLoad[$specData['extension']] = $js_file;
      }
    }
  }

  if (!empty($jsToLoad) && !$loaded) {
    $loaded = TRUE;

    $ccr = CRM_Core_Resources::singleton();
    $ccr->addScriptFile('com.ginkgostreet.conditionalfields', "js/class.showHideObj.js");

    foreach ($jsToLoad as $ext => $path) {
      $ccr->addScriptFile($ext, $path);
    }
  }
}

/**
 * Helper function to deal with inconsistency in assigning IDs to forms
 *
 * @param CRM_Core_Form $form
 * @return string The ID of the entity (e.g., Contribution, Event) represented in the form
 * @throws Exception
 */
function _conditionalfields_getEntityID(CRM_Core_Form $form) {
  if (is_a($form, 'CRM_Contribute_Form') || is_a($form, 'CRM_Contribute_Form_ContributionBase')) {
    return $form->_id;
  }

  if (is_a($form, 'CRM_Event_Form_Registration')) {
    return $form->_eventId;
  }

  CRM_Core_Error::debug_log_message('com.ginkgostreet.conditionalfields: Unable to get the entity ID for form ' . get_class($form));
  return NULL;
}