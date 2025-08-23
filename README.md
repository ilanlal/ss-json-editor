# ![Logo](https://raw.githubusercontent.com/ilanlal/ss-json-editor/main/assets/logo24.png) Json Studio ```v10.mp.rev```

[![GitHub repo size](https://img.shields.io/github/repo-size/ilanlal/ss-json-editor)](https://github.com/ilanlal/ss-json-editor)
[![GitHub last commit](https://img.shields.io/github/last-commit/ilanlal/ss-json-editor)](https://github.com/ilanlal/ss-json-editor)
[![GitHub issues](https://img.shields.io/github/issues/ilanlal/ss-json-editor)](https://github.com/ilanlal/ss-json-editor/issues)
[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ilanlal/ss-json-editor/blob/main/LICENSE.md)

This Google Sheets™ add-on that allows users to format JSON data directly within their spreadsheets. It provides a user-friendly interface for working with JSON data, making it easier to manage and manipulate structured data.

If you are looking for a **simple way to prettify or minify JSON data** in your Google Sheets™ cell, this add-on is for you! 😉

## What can you do with this add-on?

If you have raw JSON in a cell like this:

```json
{"name": "John", 
"age": 30, 
"city": "New York"}
```

You can select the cell and click Prettify. It will transform it into:

```json
{
  "name": "John",
  "age": 30,
  "city": "New York"
}
```

Click Minify, and it will compress it into a single line:

```json
{"name":"John","age":30,"city":"New York"}
```

## Use Cases for Json Studio

  Here are some common use cases for web developers and API consumers:

  1. **API Response Formatting:** When working with APIs, the response data is often in JSON format. Json Studio allows you to format and manipulate this data directly within Google Sheets™, making it easier to analyze and visualize.

  2. **Collaborative Data Editing:** Json Studio enables multiple users to collaborate on JSON data within a Google Sheets™ environment. This is particularly useful for teams working on API integrations or data analysis projects.

  3. **Educational Purposes:** Json Studio can be used as a teaching tool to help students understand JSON structure and data manipulation. It provides a hands-on approach to learning about APIs and data formats.

## Release Notes ```v10.mp.rev```

- **Bug Fixes**: Resolved various bugs and issues reported by Google Marketplace Team.
- **Documentation**: Updated documentation to reflect new features and changes.

## How to Install

  Due to Google Workspace Marketplace policies, the add-on is not publicly listed. You can install it using the method below.

  **Prerequisites:**

  1. You need a Google account: free Gmail™ account with access to Google Sheets™ or Google Workspace account are supported.
  
  2. Ensure that you have [Enable Apps Script API](https://script.google.com/home/usersettings) enabled in your Google account.

  **Make a Copy of add-on template:**

  1. Open this Google Sheets™ [Json Studio Template](https://docs.google.com/spreadsheets/d/10KQrGvLF0A6glTYwo16pp3P0w8ZvMXD9ZPbLUKzfjBc/edit?usp=sharing) document.

  2. Click on "File" in the menu, then select "Make a copy".

  3. Choose a name and location for the copy, then click "OK".

  4. Wait for the copy process to complete. The new spreadsheet will open automatically.

  **Install the Add-on:**

  1. Open the Apps Script editor by clicking on "Extensions" in the menu, then selecting "Apps Script".

  2. In the Apps Script editor, click on "Deploy" in the top right corner, then select "Test deployments".

  3. Click on "Install add-on" to install the add-on for your Google account.

     ![Screenshot](https://raw.githubusercontent.com/ilanlal/ss-json-editor/refs/heads/vnext/assets/480x346install.jpg)

  You should now see the add-on icon in the side panel in any Google Sheets™ document.

## Screenshots

  | Home | Report |
  | --- | --- |
  | ![Home Screenshot](https://lh3.googleusercontent.com/-WCx0wZsAP7E/aI3dvgckXII/AAAAAAAAB6U/029MQrH8L30UbGiat-NIUFCc4oNGzHiFACNcBGAsYHQ/Screenshot-1280x800-v9001.png) | ![Report Screenshot](https://lh3.googleusercontent.com/-DN8IkZ9oUlU/aJ-a5t22dcI/AAAAAAAAB6g/uWyzs_3n3QYl7_nAzDe7MtDwRj_YJ2UuQCNcBGAsYHQ/Screenshot-1280x800-v9002.png) |

### Membership Plans

#### Free vs Premium

| Free | Premium |
| --- | --- |
| **Prettify JSON**: Format JSON data to make it more readable. | **All the free Features**: Includes all features available in the free version. |
| **Validation**: Validate JSON data for syntax errors.  | **Minify JSON**: Remove unnecessary whitespace and line breaks from JSON data. |
|  | **Select Indentation**: Choose the indentation level for prettified JSON data. (1, 2, 4, 6 or 8 spaces) |

> Note: Until the add-on will support billing, the premium features are available for free.

### References

For additional resources and references, check out the [REFERENCES.md](docs/REFERENCES.md) file.

### Development roadmap

This add-on is under active development. The roadmap for the JSON Studio add-on includes the following [phases](docs/ROADMAP.md):

### Installation

Note: This add-on is currently in development and not yet available in the Google Workspace Marketplace.

### Powered by

- [Easy ADM](https://www.easyadm.com/)

### Help and Support

For help and support, please refer to the [HELP.md](docs/HELP.md) file.

### FAQ

For frequently asked questions, please refer to the [FAQ.md](docs/FAQ.md) file.

### About

For more information about this add-on, please refer to the [ABOUT.md](docs/ABOUT.md) file.
