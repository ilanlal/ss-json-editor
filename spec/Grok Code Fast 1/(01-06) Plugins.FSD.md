# Functional Specification Document (FSD) | Json Studio | Google Workspace Add-on

## 1. Feature Overview

| Metadata | Details |
| :--- | :--- |
| **Feature Name** | Json Studio Plugins |
| **Module** | [`src/Plugins.js`](../../src/Plugins.js) |
| **Priority** | High |
| **Status** | Completed |

### 1.1 Summary

The `Plugins.js` file implements the core plugin architecture for Json Studio, a Google Workspace add-on for managing Telegram bots. It provides a modular system of plugins (e.g., JsonTools) that handle bot authentication, API interactions, UI rendering via CardService, and data persistence. The architecture supports MVC patterns, with Controllers for logic, Views for UI, and integrated services for Telegram API calls and sheet operations.

---

## 2. User Stories & Rationale

**As a** Bot Developer  
**I want to** use a modular plugin system in Google Sheets  
**So that** I can easily connect, configure, and manage my Telegram bots through a visual interface.

**As a** Google Workspace User  
**I want to** access bot management features like webhook setup, chat inspection, and JSON tools  
**So that** I can build and monitor bots without deep coding knowledge.

### 2.1 Acceptance Criteria

- [x] Plugins are organized in a `Plugins` object with consistent structure (id, name, Controller, View).
- [x] Core modules (App, Sheet, TerminalOutput) handle data and logging.
- [x] UI uses CardService for sidebar cards, with navigation and actions.
- [x] API interactions via `TelegramBotClient` for methods like `getMe`, `getChat`, `setWebhook`.
- [x] Properties stored in `PropertiesService` for persistence.
- [x] Error handling with notifications and logging to sheets.

---

## 3. UI/UX Design (CardService)

The UI is built using Google Apps Script's CardService, rendering in the sidebar. Each plugin has a HomeCard for primary interaction, with sections for input, status, and actions. Navigation uses pushCard, updateCard, and popToRoot. Icons use Material Icons with `setFill(false)`. Colors are defined via `primaryColor()`, `secondaryColor()`, `accentColor()`.

### 3.1 Card Flow

1. **Entry Point:** Home plugin loads the main dashboard, showing plugin list and connection status.
2. **Plugin Access:** User selects a plugin (e.g., GetMe, GetChat, Webhook, JsonTools) from the grid.
3. **Interaction Cards:** Each plugin has a HomeCard for input/results, with footers for actions.
4. **Confirmation:** Destructive actions (e.g., disconnect, delete webhook) use `ConfirmationCard`.
5. **Results:** API responses displayed in `BuildResultSection` with grids and raw JSON.

### 3.2 Widget Specifications

**Home Card (`Plugins.Home.View.HomeCard`):**

- **Header:** Title: "Json Studio", Subtitle: Package short_description, Image: Logo.
- **Section 1:** `WelcomeSection` (connection status).
- **Section 2:** Grid of plugin buttons (e.g., GetMe, GetChat, Webhook, JsonTools).
- **Section 3:** Quick actions (Settings, Help, About).
- **Section 4 (Conditional):** Premium CTA if not premium.

**Connection Card (`Plugins.Connection.View.HomeCard`):**

- **Header:** Title: "Connection", Image: Welcome.
- **Section 1:** Token input (`TextInput`), Connect button.
- **Footer:** Primary button for Connect.

**Webhook Card (`Plugins.Webhook.View.HomeCard`):**

- **Header:** Title: "Webhook Configurator".
- **Section 1:** Status (URL, pending updates).
- **Section 2:** Form inputs (URL, max connections, etc.).
- **Footer:** Set/Update or Delete button.

**GetMe/GetChat Cards:** Similar, with result sections showing API data in grids.

**JsonTools Card:** Provides JSON utilities (beautify, minify, validate) via buttons in a collapsible section.

---

## 4. Technical Implementation

### 4.1 Architecture (MVC Pattern)

- **Controller:** Each plugin has a `Controller` object with methods like `Load(e)` for rendering, handling form inputs, and API calls.
- **View:** `View` objects build CardService cards, using helpers like `BuildResultSection`.
- **Service/Model:** Integrated via `TelegramBotClient` for API, `Plugins.Modules` for sheets/logging, `PropertiesService` for storage.

### 4.2 Data Interactions

**Google Sheets (`SpreadsheetApp`):**

- **Read:** User properties for settings (e.g., `txt_bot_api_token`).
- **Write:** Logs to "Terminal Output" sheet via `TerminalOutput.write`, dumps API results to sheets via `Sheet.dumpObjectToSheet`.

**Telegram API (`UrlFetchApp`):**

- **Endpoints:** `https://api.telegram.org/bot<token>/getMe`, `/getChat`, `/getWebhookInfo`, `/setWebhook`, `/deleteWebhook`.
- **Payload:** JSON for POST requests (e.g., setWebhook with URL, options).

**Properties Service:**

- **UserProperties:** Stores tokens, settings (e.g., `txt_bot_api_token`, `terminal_output_switch`).
- **ScriptProperties:** For global config (e.g., logging flags).

---

## 5. Configuration & Security

### 5.1 AppScript Manifest (`appsscript.json`)

- **Scopes:** `https://www.googleapis.com/auth/script.external_request` for API calls, `https://www.googleapis.com/auth/spreadsheets.currentonly` for sheet access.
- **UrlFetchWhitelist:** `https://api.telegram.org/`.
- **Universal Actions:** Home plugin as entry point.

### 5.2 Security Considerations

- Tokens stored in UserProperties (user-specific, not shared).
- Input validation for URLs (HTTPS required).
- No sensitive data in logs; tokens masked in display.

---

## 6. Edge Cases & Error Handling

- **No Token:** Plugins check `txt_bot_api_token`; throw error if missing.
- **API Errors:** Parse `ok: false`; show notification with message.
- **Network Failures:** `UrlFetchApp` exceptions logged and notified.
- **Invalid Inputs:** Form validation (e.g., URL must start with HTTPS).
- **Sheet Access:** Errors if sheet not found; logged to Terminal Output.
- **Premium Checks:** Features gated by `isPremium` from App.getData().
