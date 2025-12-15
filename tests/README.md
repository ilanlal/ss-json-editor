# Tests for this Project

This directory contains test files for the ss-json-editor project. The tests are written using the Jest framework and utilize the `@ilanlal/gasmocks` library to mock Google Apps Script services.

## Strategy

The tests are organized into separate files based on the service or component being tested. Each test file includes necessary imports and setups, such as mocking the `Config` configuration.

Each test file follows a similar structure, starting with necessary imports, setting up global configurations, and defining test cases using `describe` and `test` blocks.

## Running Tests

Make sure to configure Jest to recognize the Google Apps Script environment and the `@ilanlal/gasmocks` library.

> Note: This package is not published on npm registry. So, you need to install it directly from my GitHub repository. Sorry for the inconvenience.

```bash
npm i https://github.com/ilanlal/gasmocks --save-dev
```

> Use `npm uninstall @ilanlal/gasmocks` to remove the package.

You can run the tests using the following command:

```bash
npm test
```
