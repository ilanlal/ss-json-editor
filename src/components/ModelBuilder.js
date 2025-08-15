class ModelBuilder {
    static newReportItem(sheetName = null) {
        return ReportItem.newReportItem()
            .setSheetName(sheetName);
    }

    static newRangeReport(sheetName = null) {
        return RangeReport.newRangeReport()
            .setSheetName(sheetName);
    }

    static newUserLicense() {
        return UserLicense.newUserLicense();
    }

    static newUserInfo() {
        return UserInfo.newUserInfo();
    }
}