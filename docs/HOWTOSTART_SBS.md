# How to Start - Step-by-Step Guide

## Prerequisites

Before you begin, ensure you have the following:
- A Google account (free Gmail™ account with access to Google Sheets™)
- Basic understanding of Google Apps Script (GAS)
- [clasp](https://github.com/google/clasp) (Command Line Apps Script Projects)

## 1. Clone the Repository

To clone the repository, follow these steps:

1. Open a terminal or command prompt.
2. Navigate to the directory where you want to clone the repository.
3. Run the following command:

   ```
   git clone https://github.com/ilanlal/ss-json-editor.git
   ```

4. Navigate into the cloned directory:

   ```
   cd ss-json-editor
   ```

## 2. Modify the `appsscript.json` file

1. Open the `appsscript.json` file in the root of your project.
2. Update the `oauthScopes` field to include the necessary scopes for your add-on.
3. Save the changes to the `appsscript.json` file.

## 3. Push the Code to Google Apps Script

1. Run the following command to deploy your project to Google Apps Script:

   ```
   clasp push
   ```

2. Follow the prompts to authorize the deployment.
3. Once the deployment is complete, you will receive a confirmation message.
