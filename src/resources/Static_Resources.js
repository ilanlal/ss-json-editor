// Static_Resources.js
// This file contains static resources used across the application.
const Static_Resources = {
  appName: "Json Studio",
  menuTitle: "Json studio",
  module: "core-server",
  // This is the static resources for the deployment.
  package: {
    // build number. 
    // This is used to identify the version of the static resources.
    // It should be updated with each deployment 😉.
    build: "20250814.031300",
    // version of the Google Apps Script deployment (usually vnext)
    version: "v9-gcp-reviews",
    // Google Marketplace URL for the add-on.
    marketplaceUrl: "https://workspace.google.com/marketplace/app/json_studio/1234567890",
    // Google Apps Script project URL for the add-on.
    projectUrl: "https://script.google.com/d/AKfycbx1234567890",
    // GitHub URLs for the 'main' (Production) repo.
    vnowGithubUrl: "https://github.com/your-repo",
    // GitHub URLs for the 'vnext' (Development) repo.
    vnextGithubUrl: "https://github.com/your-repo",
  },
  qunit: {
    hidepassed: true, // Hide passed tests by default
    title: "Json Studio QUnit Tests",
  },
  resources: {
    indentSpaces: "indentSpaces",
    reportCardName: "reportCard",
    homeCardName: "homeCard",
    accountCardName: "accountCard",
    jsonEditorCardName: "jsonEditorCard",
  },
  parameters: {
    maxRangeSize: 1000, // Maximum number of cells in a range
    freeActivationDays: 90, // Number of free activation days
  },
  userLicense: "userLicense",
  dataInput: "dataInput",
  maxRangeSize: 1000, // Maximum number of cells in a range
  emojis: {
    success: "✅",
    error: "❌",
    info: "ℹ️",
    warning: "⚠️",
    loading: "⏳",
    tip: "💡",
    premium: "🏆",
    edit: "✏️",
    format: "📑",
    minify: "🔽",
    lock: "🔒",
    unlock: "🔓",
    account: "👤",
  }
};
