class ControllerBuilder {
    static newHomeController(localization=AppManager.getLocalizationResources(), userStore=ModuleBuilder.newUserStore()) {
        return HomeController.newHomeController(localization, userStore);
    }

    static newJsonStudioController(localization=AppManager.getLocalizationResources(), userStore=ModuleBuilder.newUserStore()) {
        return JsonStudioController.newJsonStudioController(localization, userStore);
    }

    static newAccountController(localization=AppManager.getLocalizationResources(), userStore=ModuleBuilder.newUserStore()) {
        return AccountController.newAccountController(localization, userStore);
    }

    static newReportController(localization=AppManager.getLocalizationResources(), userStore=ModuleBuilder.newUserStore()) {
        return ReportController.newReportController(localization, userStore);
    }
}
