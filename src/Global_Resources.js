// Global_Resources.gs
const Global_Resources = {
    appName: "Json Studio",
    module: "core-server",
    version: "5",
    en: {
        appDescription: "Json Studio is json tools for Google Sheets™️ to format, minify, and edit JSON data.",
        message: {
            tip: "Tip!",
            tipForMenu: "Use the menu to access the JSON tools.",
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
                content: "Welcome to Json Studio! Use the buttons below to format, minify, or edit JSON data in your spreadsheet.",
                imageAltText: "Json Studio for Google Sheets™️",
                footer: "Use the buttons below to format (prettify) or minify JSON data in your spreadsheet.",
                settings: "Settings",
                moreOptions: "More Options",
                moreOptionsContent: "Select a <b>range</b> of cells containing JSON data and use the buttons below to format (prettify) or minify the JSON.",
                identSpaces: "Indentation Spaces",
                identSpacesContent: "Set your custom indentation spaces for prettifying JSON (default is 2)",
                validateJsonSwitch: "Validate JSON",
                validateJsonSwitchContent: "Enable this option to validate JSON data before formatting or minifying. If the JSON is invalid, it will not be formatted or minified.",
            }
        },
        dialogs: {
            editor: {
                title: "JSON Editor ✏️",
                subtitle: "Edit your JSON data",
                content: "Use this editor to format, minify, or edit JSON data in your spreadsheet."
            },
            help: {
                title: "Help & Support ❔",
                subtitle: "Need assistance?",
                content: "This add-on provides tools for working with JSON data in Google Sheets. Use the buttons to format, minify, or edit JSON data in your spreadsheet."
            },
            about: {
                title: "ℹ️ About",
                subtitle: "About Json Studio",
                content: "Json Studio is a powerful tool for working with JSON data in Google Sheets. It allows you to format, minify, and edit JSON data easily."
            }
        }
    }
};