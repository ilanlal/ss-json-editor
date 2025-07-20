// App Script code for Google Workspace Add-ons
// src/Store.js
class UserStore {
  constructor() {
    this.userProperties = PropertiesService.getUserProperties();
  }

  /**
   * Gets the localization for the user.
   * This function retrieves the user's localization setting from the user properties.
   * If no localization is set, it defaults to "en" (English).
   * @return {string} The user's localization setting, defaulting to "en".
   */
  getLocalization() {
    return this.userProperties.getProperty('localization') || "en"; // Default to English
  }

  /**
   * Sets the localization for the user.
   * @param {string} locale The locale to set, default is "en".
   */
  setLocalization(locale = "en") {
    this.userProperties.setProperty('localization', locale);
  }

  /**
   * Gets the number of spaces for indentation.
   * @return {string} The number of spaces for indentation, defaulting to "2".
   */
  getIdentSpaces() {
    return this.userProperties.getProperty(Static_Resources.keys.identSpaces) || "2"; // Default to 2 spaces
  }

  /**
   * Sets the number of spaces for indentation.
   * @param {string} value The number of spaces for indentation, default is "2".
   */
  setIdentSpaces(value = "2") {
    this.userProperties.setProperty(Static_Resources.keys.identSpaces, value);
  }

  /**
   * Gets the fail note flag.
   * @return {boolean} The fail note flag, defaulting to false.
   */
  getFailNoteFlag() {
    return this.userProperties.getProperty(Static_Resources.keys.failNoteFlag) === "true"; // Default to false
  }

  /**
   * Sets the fail note flag.
   * @param {boolean} value The fail note flag, default is false.
   */
  setFailNoteFlag(value = "false") {
    this.userProperties.setProperty(Static_Resources.keys.failNoteFlag, value);
  }

  /**
   * Gets the show errors flag.
   * @return {boolean} The show errors flag, defaulting to false.
   */
  getShowErrorsFlag() {
    return this.userProperties.getProperty(Static_Resources.keys.showErrorsFlag) === "true"; // Default to false
  }

  /**
   * Sets the show errors flag.
   * @param {boolean} value The show errors flag, default is false.
   */
  setShowErrorsFlag(value = "false") {
    this.userProperties.setProperty(Static_Resources.keys.showErrorsFlag, value);
  }
}