# ![Logo](https://raw.githubusercontent.com/ilanlal/ss-json-editor/main/assets/logo24.png) Json Studio

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

> Note: Until the add-on will support billing, the premium features are available for free.

## Documentation

You can refer to the [product requirements document](spec/Grok%20Code%20Fast%201/PRD.md) for detailed information about the features and functionality of this add-on.

For any questions, issues, or feedback, please open an issue on the [GitHub repository](https://github.com/ilanlal/ss-json-editor/issues).

For additional resources and references, check out the [REFERENCES.md](docs/REFERENCES.md) file.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
