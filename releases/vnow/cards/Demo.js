/**
 *  Create the top-level card, with buttons leading to each of three
 *  'children' cards, as well as buttons to backtrack and return to the
 *  root card of the stack.
 *  @return {Card}
 */
function createNavigationCard(e) {
    // If the user is not authorized, return an empty card.
    if (e && e.authMode === ScriptApp.AuthMode.NONE) {
        SpreadsheetApp.getUi().alert('This add-on can only be used in Google Sheets™️.');
        // todo: return error card
        return CardService.newCardBuilder().build();
    }

    // Create a button set with actions to navigate to 3 different
    // 'children' cards.
    var buttonSet = CardService.newButtonSet();
    for (var i = 1; i <= 3; i++) {
        buttonSet.addButton(createToCardButton(i));
    }

    // Build the card with all the buttons (two rows)
    var card = CardService.newCardBuilder()
        .setHeader(CardService.newCardHeader().setTitle('Navigation'))
        .addSection(CardService.newCardSection()
            .addWidget(buttonSet)
            .addWidget(buildPreviousAndRootButtonSet()));
    return card.build();
}

/**
 *  Create a button that navigates to the specified child card.
 *  @return {TextButton}
 */
function createToCardButton(id) {
    var action = CardService.newAction()
        .setFunctionName('gotoChildCard')
        .setParameters({ 'id': id.toString() });
    var button = CardService.newTextButton()
        .setText('Card ' + id)
        .setOnClickAction(action);
    return button;
}

/**
 *  Create a ButtonSet with two buttons: one that backtracks to the
 *  last card and another that returns to the original (root) card.
 *  @return {ButtonSet}
 */
function buildPreviousAndRootButtonSet() {
    var previousButton = CardService.newTextButton()
        .setText('Back')
        .setOnClickAction(CardService.newAction()
            .setFunctionName('gotoPreviousCard'));
    var toRootButton = CardService.newTextButton()
        .setText('To Root')
        .setOnClickAction(CardService.newAction()
            .setFunctionName('gotoRootCard'));

    // Return a new ButtonSet containing these two buttons.
    return CardService.newButtonSet()
        .addButton(previousButton)
        .addButton(toRootButton);
}

/**
 *  Create a child card, with buttons leading to each of the other
 *  child cards, and then navigate to it.
 *  @param {Object} e object containing the id of the card to build.
 *  @return {ActionResponse}
 */
function gotoChildCard(e) {
    var id = parseInt(e.parameters.id);  // Current card ID
    var id2 = (id == 3) ? 1 : id + 1;      // 2nd card ID
    var id3 = (id == 1) ? 3 : id - 1;      // 3rd card ID
    var title = 'CARD ' + id;

    // Create buttons that go to the other two child cards.
    var buttonSet = CardService.newButtonSet()
        .addButton(createToCardButton(id2))
        .addButton(createToCardButton(id3));

    // Build the child card.
    var card = CardService.newCardBuilder()
        .setHeader(CardService.newCardHeader().setTitle(title))
        .addSection(CardService.newCardSection()
            .addWidget(buttonSet)
            .addWidget(buildPreviousAndRootButtonSet()))
        .build();

    // Create a Navigation object to push the card onto the stack.
    // Return a built ActionResponse that uses the navigation object.
    var nav = CardService.newNavigation().pushCard(card);
    return CardService.newActionResponseBuilder()
        .setNavigation(nav)
        .build();
}

/**
 *  Pop a card from the stack.
 *  @return {ActionResponse}
 */
function gotoPreviousCard() {
    var nav = CardService.newNavigation().popCard();
    return CardService.newActionResponseBuilder()
        .setNavigation(nav)
        .build();
}

/**
 *  Return to the initial add-on card.
 *  @return {ActionResponse}
 */
function gotoRootCard() {
    var nav = CardService.newNavigation().popToRoot();
    return CardService.newActionResponseBuilder()
        .setNavigation(nav)
        .build();
}