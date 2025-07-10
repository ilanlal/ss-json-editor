# clasp commands Backlog

[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)

- see [clasp - The Apps Script CLI](https://codelabs.developers.google.com/codelabs/clasp#0)
- see [Use the command line interface with clasp](https://developers.google.com/apps-script/guides/clasp)

## Starting up

1. `md src`
2. `clasp login`
3. `clasp create --type sheets --title "JSON Editor For Google Sheets™️" --rootDir ./src`
4. `clasp clone <Script ID> --rootDir ./src`

## Push & Deploy

`clasp push -w` or `clasp push`

## QUnit Tests

This project uses [QUnit](https://qunitjs.com/) for unit testing. You can run the tests using the following command:

```bash
clasp run test
```

## How to install this add-on

@see [docs/HELP.md](docs/HELP.md)