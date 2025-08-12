class ControllerBuilder {
    static newHomeController(localization=AppManager.getLocalizationResources(), userStore=new UserStore()) {
        return HomeController.newController(localization, userStore);
    }

    static newJsonStudioController(localization=AppManager.getLocalizationResources(), userStore=new UserStore()) {
        return JsonStudioController.newController(localization, userStore);
    }

    static newAccountController(localization=AppManager.getLocalizationResources(), userStore=new UserStore()) {
        return AccountController.newController(localization, userStore);
    }

    static newReportController(localization=AppManager.getLocalizationResources(), userStore=new UserStore()) {
        return ReportController.newController(localization, userStore);
    }
}
