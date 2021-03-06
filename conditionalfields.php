<?php

require_once 'conditionalfields.civix.php';
use CRM_Conditionalfields_ExtensionUtil as E;

/**
 * Implementation of hook_civicrm_buildForm
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_buildForm
 */
function conditionalfields_civicrm_buildForm($formName, &$form){
  // make sure this doesn't get loaded more than once
  static $loaded = FALSE;
  $extensions = array();
  CRM_Conditionalfields_Hook::conditionalFields($extensions);
//  var_dump($form->get('id'));
  $jsToLoad = array();
  foreach ($extensions as $ext) {
    // look for implementations by form ID
    // make sure the file exists
    $entId = $form->get('id');
    if (is_null($entId)) continue;
    $baseDir = CRM_Extension_System::singleton()->getMapper()->keyToBasePath($ext);
    $js_file = "js/{$formName}/{$entId}.js";
    if (file_exists($baseDir . '/' . $js_file)) {
      $jsToLoad[$ext] = $js_file;
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

/**
 * Implements hook_civicrm_config().
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_config
 */
function conditionalfields_civicrm_config(&$config) {
  _conditionalfields_civix_civicrm_config($config);
}

/**
 * Implements hook_civicrm_xmlMenu().
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_xmlMenu
 */
function conditionalfields_civicrm_xmlMenu(&$files) {
  _conditionalfields_civix_civicrm_xmlMenu($files);
}

/**
 * Implements hook_civicrm_install().
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_install
 */
function conditionalfields_civicrm_install() {
  _conditionalfields_civix_civicrm_install();
}

/**
 * Implements hook_civicrm_postInstall().
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_postInstall
 */
function conditionalfields_civicrm_postInstall() {
  _conditionalfields_civix_civicrm_postInstall();
}

/**
 * Implements hook_civicrm_uninstall().
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_uninstall
 */
function conditionalfields_civicrm_uninstall() {
  _conditionalfields_civix_civicrm_uninstall();
}

/**
 * Implements hook_civicrm_enable().
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_enable
 */
function conditionalfields_civicrm_enable() {
  _conditionalfields_civix_civicrm_enable();
}

/**
 * Implements hook_civicrm_disable().
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_disable
 */
function conditionalfields_civicrm_disable() {
  _conditionalfields_civix_civicrm_disable();
}

/**
 * Implements hook_civicrm_upgrade().
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_upgrade
 */
function conditionalfields_civicrm_upgrade($op, CRM_Queue_Queue $queue = NULL) {
  return _conditionalfields_civix_civicrm_upgrade($op, $queue);
}

/**
 * Implements hook_civicrm_managed().
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
 * Implements hook_civicrm_caseTypes().
 *
 * Generate a list of case-types.
 *
 * Note: This hook only runs in CiviCRM 4.4+.
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_caseTypes
 */
function conditionalfields_civicrm_caseTypes(&$caseTypes) {
  _conditionalfields_civix_civicrm_caseTypes($caseTypes);
}

/**
 * Implements hook_civicrm_angularModules().
 *
 * Generate a list of Angular modules.
 *
 * Note: This hook only runs in CiviCRM 4.5+. It may
 * use features only available in v4.6+.
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_angularModules
 */
function conditionalfields_civicrm_angularModules(&$angularModules) {
  _conditionalfields_civix_civicrm_angularModules($angularModules);
}

/**
 * Implements hook_civicrm_alterSettingsFolders().
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_alterSettingsFolders
 */
function conditionalfields_civicrm_alterSettingsFolders(&$metaDataFolders = NULL) {
  _conditionalfields_civix_civicrm_alterSettingsFolders($metaDataFolders);
}

/**
 * Implements hook_civicrm_entityTypes().
 *
 * Declare entity types provided by this module.
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_entityTypes
 */
function conditionalfields_civicrm_entityTypes(&$entityTypes) {
  _conditionalfields_civix_civicrm_entityTypes($entityTypes);
}

// --- Functions below this ship commented out. Uncomment as required. ---

/**
 * Implements hook_civicrm_preProcess().
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_preProcess
 *
function conditionalfields_civicrm_preProcess($formName, &$form) {

} // */

/**
 * Implements hook_civicrm_navigationMenu().
 *
 * @link http://wiki.civicrm.org/confluence/display/CRMDOC/hook_civicrm_navigationMenu
 *
function conditionalfields_civicrm_navigationMenu(&$menu) {
  _conditionalfields_civix_insert_navigation_menu($menu, 'Mailings', array(
    'label' => E::ts('New subliminal message'),
    'name' => 'mailing_subliminal_message',
    'url' => 'civicrm/mailing/subliminal',
    'permission' => 'access CiviMail',
    'operator' => 'OR',
    'separator' => 0,
  ));
  _conditionalfields_civix_navigationMenu($menu);
} // */
