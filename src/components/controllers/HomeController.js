// Apps Script code for Google Workspace Add-ons
class HomeController {
    constructor(localization, userStore) {
        this.localization = localization;
        this.userStore = userStore;
        this.userLicenseManager = new UserLicenseManager(userStore);
        this.userLicense = this.userLicenseManager.getLicense();
    }

    home() {
        const indentSpaces = this.userStore.getIndentSpaces() || "2";
        const userLicense = this.userLicenseManager.getLicense();
        return CardService
            .newActionResponseBuilder()
            .setNavigation(
                CardService.newNavigation()
                    .pushCard(HomeCard
                        .create(userLicense, this.localization, indentSpaces)
                        .build()));
    }

    /**
     * Formats the JSON in the active range.
     * @returns {CardService.ActionResponse}
     */
    prettyJsonFormat() {
        const jsonStudio =
            new JsonStudio(
                SpreadsheetApp.getActiveSpreadsheet(),
                this.localization,
                this.userStore);

        // Call the formatRange method of JsonStudio
        const rangeReport = jsonStudio.formatRange();
        const reportItems = rangeReport.getItems();
        // If there are results, create and return the report card
        if (reportItems?.length > 0) {
            return new ReportController(this.userStore, this.localization)
                .home(rangeReport)
                .setStateChanged(true);
        }


        return CardService.newActionResponseBuilder()
            .setNotification(
                CardService.newNotification()
                    .setText(
                        this.localization.messages.success))
            .setStateChanged(true);
    }

    minifyJsonFormat() {
        const jsonStudio = new JsonStudio(
            SpreadsheetApp
                .getActiveSpreadsheet(), this.localization, this.userStore);

        // minify the range
        const rangeReport = jsonStudio.minifyRange();
        const reportItems = rangeReport.getItems();

        // If there are results, create and return the report card
        if (reportItems?.length > 0) {
            return new ReportController(this.userStore, this.localization)
                .home(rangeReport)
                .setStateChanged(true);
        }


        return CardService.newActionResponseBuilder()
            .setNotification(
                CardService.newNotification()
                    .setText(
                        this.localization.messages.success))
            .setStateChanged(true);
    }
}
