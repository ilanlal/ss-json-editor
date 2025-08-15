class ViewBuilder {
    static newHomeCard(
        localization = AppManager.getLocalizationResources(),
        userInfo = ModelBuilder.newUserInfo()
            .setUserId('_user')
            .setUserLicense(ServiceBuilder.newUserStore().getUserLicense()),
        indentationSpaces = ServiceBuilder.newUserStore().getIndentSpaces()
    ) {
        return HomeCard.newHomeCard()
            .setIndentationSpaces(indentationSpaces)
            .setLocalization(localization)
            .setUserInfo(userInfo)
            .newCardBuilder();
    }


    static newAccountCard(
        localization = AppManager.getLocalizationResources(),
        userInfo = ModelBuilder.newUserInfo()
            .setUserId('_user')
            .setUserLicense(ServiceBuilder.newUserStore().getUserLicense())
    ) {
        return AccountCard.newAccountCard()
            .setLocalization(localization)
            .setUserInfo(userInfo)
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