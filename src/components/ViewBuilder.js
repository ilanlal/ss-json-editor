class ViewBuilder {
    static newHomeCard
        (userLicense = ServiceBuilder.newUserStore().getUserLicense(),
            localization = AppManager.getLocalizationResources(),
            indentationSpaces = ServiceBuilder.newUserStore().getIndentSpaces()) {
        return HomeCard.newHomeCard()
            .setIndentationSpaces(indentationSpaces)
            .setLocalization(localization)
            .setUserLicense(userLicense)
            .newCardBuilder();
    }


    static newAccountCard
        (userLicense = ServiceBuilder.newUserStore().getUserLicense(),
            localization = AppManager.getLocalizationResources()) {
        return AccountCard.newAccountCard()
            .setUserLicense(userLicense)
            .setLocalization(localization)
            .newCardBuilder();
    }

    static newReportCard
        (rangeReport, userLicense = ServiceBuilder.newUserStore().getUserLicense(),
            localization = AppManager.getLocalizationResources()) {

        return ReportCard.newReportCard()
            .setRangeReport(rangeReport)
            .setUserLicense(userLicense)
            .setLocalization(localization)
            .newCardBuilder();
    }

    static newAboutCard(localization = AppManager.getLocalizationResources(), packageInfo = Static_Resources.package) {
        return AboutCard.newAboutCard()
            .setLocalization(localization)
            .setPackageInfo(packageInfo)
            .newCardBuilder();
    }
}