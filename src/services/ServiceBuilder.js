class ServiceBuilder {
    static newJsonStudio() {
        return JsonStudio.newInstance();
    }

    static newRangeReport() {
        return RangeReport.newRangeReport();
    }

    static newUserStore() {
        return UserStore.newInstance();
    }
}