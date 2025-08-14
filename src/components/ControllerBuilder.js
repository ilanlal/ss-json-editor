class ControllerBuilder {
    static newHomeController(localization = AppManager.getLocalizationResources(), userStore = ServiceBuilder.newUserStore()) {
        return HomeController.newHomeController(localization, userStore);
    }

    static newJsonStudioController(localization = AppManager.getLocalizationResources(), userStore = ServiceBuilder.newUserStore()) {
        return JsonStudioController.newJsonStudioController(localization, userStore);
    }

    static newAccountController(
        localization = AppManager.getLocalizationResources(), 
        userStore = ServiceBuilder.newUserStore()
    ) {
        return AccountController.newAccountController(localization, userStore);
    }

    static newReportController(localization = AppManager.getLocalizationResources(), userStore = ServiceBuilder.newUserStore()) {
        return ReportController.newReportController(localization, userStore);
    }

    static newAboutController(localization = AppManager.getLocalizationResources()) {
        return AboutController.newAboutController(localization);
    }
}