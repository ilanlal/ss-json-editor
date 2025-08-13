// Google Apps Script code for Google Workspace Add-ons
class UserStore {
  /**
   * use UserStore.newUserPropertiesStore() to create an instance of UserStore using user properties (Apps Script PropertiesService)
   * @param {*} userDataStore 
   */
  constructor(userDataStore) {
    this.userDataStorage = userDataStore;
  }

  /**
   * Gets the localization for the user.
   * This function retrieves the user's localization setting from the user properties.
   * If no localization is set, it defaults to "en" (English).
   * @return {string} The user's localization setting, defaulting to "en".
   */
  getLocalizationCode() {
    return this.userDataStorage
      .getProperty(UserStore.Constants.LOCALIZATION_KEY) || UserStore.Constants.DEFAULT_LOCALIZATION;
  }

  /**
   * Sets the localization for the user.
   * @param {string} locale The locale to set, default is "en".
   */
  setLocalizationCode(locale = UserStore.Constants.DEFAULT_LOCALIZATION) {
    this.userDataStorage.setProperty(UserStore.Constants.LOCALIZATION_KEY, locale);
    return this;
  }

  /**
   * Gets the number of spaces for indentation.
   * @return {number} The number of spaces for indentation, defaulting to DEFAULT_INDENT_SPACES.
   */
  getIndentSpaces() {
    const spaces = this.userDataStorage.getProperty(UserStore.Constants.INDENT_SPACES_KEY);

    if (!spaces) {
      return UserStore.Constants.DEFAULT_INDENT_SPACES; // Return default if not set or invalid
    }

    return parseInt(spaces);
  }

  /**
   * Sets the number of spaces for indentation.
   * @param {number} value The number of spaces for indentation, default is DEFAULT_INDENT_SPACES=2 constant.
   */
  setIndentSpaces(value = UserStore.Constants.DEFAULT_INDENT_SPACES) {
    this.userDataStorage.setProperty(UserStore.Constants.INDENT_SPACES_KEY, value);
    return this;
  }

  /**
   * Gets the license information for the user.
   * This function retrieves the user's license information from the user properties.
   *
   * @return {UserLicense | undefined} The user's license information, or undefined if not set.
   * @see UserLicense
   */
  getUserLicense() {
    const data = this.userDataStorage
      .getProperty(UserStore.Constants.USER_LICENSE_KEY);

    if (!data
      || data === "undefined"
      || data === "null"
      || data === "") {
      return undefined; // Return undefined if no license is set
    }

    return UserLicense.fromJSON(data);
  }

  /**
   * Sets the license information for the user.
   * @param {UserLicense} license The license information to set.
   */
  setUserLicense(license) {
    if (!(license instanceof UserLicense) && !(license === undefined)) {
      throw new Error("Invalid license object provided. Must be an instance of UserLicense or undefined.");
    }

    if(license === undefined) {
      return this.clearUserLicense();
    }
    
    const licenseJson = UserLicense.toJsonString(license);

    this.userDataStorage.setProperty(UserStore.Constants.USER_LICENSE_KEY, licenseJson);
    return this;
  }

  /**
   * Clears the user's license information.
   */
  clearUserLicense() {
    this.userDataStorage.deleteProperty(UserStore.Constants.USER_LICENSE_KEY);
    return this;
  }

  static newInstance() {
    return new UserStore(PropertiesService.getUserProperties());
  }
}

UserStore.Constants = {
  INDENT_SPACES_KEY: 'indentSpaces',
  USER_LICENSE_KEY: 'userLicense',
  LOCALIZATION_KEY: 'localization',
  DEFAULT_LOCALIZATION: 'en',
  DEFAULT_INDENT_SPACES: 2
};