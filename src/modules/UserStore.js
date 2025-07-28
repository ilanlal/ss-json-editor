// Google Apps Script code for Google Workspace Add-ons
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
    return this.userProperties
      .getProperty('localization') || "en"; // Default to English
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
    return this.userProperties.getProperty(
      Static_Resources.keys.identSpaces) || "2"; // Default to 2 spaces
  }

  /**
   * Sets the number of spaces for indentation.
   * @param {string} value The number of spaces for indentation, default is "2".
   */
  setIdentSpaces(value = "2") {
    this.userProperties.setProperty(
      Static_Resources.keys.identSpaces,
      value);
  }

  /**
   * Gets the license information for the user.
   * This function retrieves the user's license information from the user properties.
   *
   * @return {UserLicense | undefined} The user's license information, or undefined if not set.
   * @see UserLicense
   */
  getUserLicense() {
    const licenseData =
      this.userProperties.getProperty(
        Static_Resources.keys.userLicense);
    return licenseData ? JSON.parse(licenseData) : undefined;
  }

  /**
   * Sets the license information for the user.
   * @param {UserLicense} license The license information to set.
   */
  setUserLicense(license) {
    if (!(license instanceof UserLicense)) {
      throw new Error("Invalid license data");
    }
    const licenseJson = JSON.stringify(license);
    if (!licenseJson) {
      throw new Error("Invalid license data");
    }
    this.userProperties.setProperty(
      Static_Resources.keys.userLicense,
      licenseJson
    );
    return license;
  }

  /**
   * Clears the user's license information.
   */
  clearUserLicense() {
    this.userProperties.deleteProperty(Static_Resources.keys.userLicense);
  }
}