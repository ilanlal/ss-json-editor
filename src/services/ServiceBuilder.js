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

    static newSpreadsheetService(sheetName = null) {
        const sheet = sheetName
            ? SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName)
            : SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

        return SpreadsheetService.newSpreadsheetService(sheet);
    }

    static newRangeService(sheetName, a1Notation) {
        return RangeService.newRangeService(sheetName, a1Notation);
    }
}