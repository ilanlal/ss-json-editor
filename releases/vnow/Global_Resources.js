// Global_Resources.gs
const Global_Resources = {
    appName: "Json Studio",
    module: "core-server",
    version: "0.0.2",
    en: {
        appDescription: "Json Studio is json tools for Google Sheets™️ to format, minify, and edit JSON data.",
        message: {
            error: "An error occurred while processing your request.",
            success: "Operation completed successfully.",
            info: "Information",
            warning: "Warning",
            confirm: "Are you sure you want to proceed?",
            loading: "Loading, please wait...",
            noData: "No data available.",
            invalidJson: "Invalid JSON data.",
            rangeNotSelected: "Please select a range of cells containing JSON data.",
            rangeSelected: "Range selected successfully.",
            notSupported: "This operation is not supported in the current context.",
            dialogClosed: "Dialog closed.",
            addOnOnly: "This add-on can only be used in Google Sheets™️.",
        },
        menu: {
            top: "Json studio",
            format: "Format",
            minify: "{..} Minify",
            prettify: "👁️ Prettify",
            edit: "✏️ Edit",
            rangeReport: "Range Report",
            help: "❔ Help",
            support: "💬 Support",
            about: "ℹ️ About",
            settings: "⚙️ Settings",
            easyAdm: "Easy ADM™️",
        },
        cards:{
            home: {
                title: "Home",
                subtitle: "Best JSON tools for Google Sheets™️",
                imageUrl: "https://raw.githubusercontent.com/ilanlal/ss-json-editor/refs/heads/main/assets/logo120.png",
                imageAltText: "Json Studio for Google Sheets™️"
            }
        },
        dialogs: {
            editor: {
                title: "JSON Editor ✏️",
                content: "Use this editor to format, minify, or edit JSON data in your spreadsheet."
            },
            help: {
                title: "Help & Support ❔",
                content: "This add-on provides tools for working with JSON data in Google Sheets. Use the buttons to format, minify, or edit JSON data in your spreadsheet."
            },
            about: {
                title: "ℹ️ About",
                content: "Json Studio is a powerful tool for working with JSON data in Google Sheets. It allows you to format, minify, and edit JSON data easily."
            }
        }
    }
};