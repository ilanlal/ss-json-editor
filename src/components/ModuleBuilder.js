class ModuleBuilder {
    static newJsonStudio() {
        return new JsonStudio();
    }

    static newRangeReport() {
        return RangeReport.create();
    }

    static newUserStore() {
        return new UserStore();
    }

    static newUserLicenseManager(userStore = ModuleBuilder.newUserStore()) {
        return new UserLicenseManager(userStore);
    }
}