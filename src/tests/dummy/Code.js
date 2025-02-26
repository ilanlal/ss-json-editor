function test_AB() {
    const file = 'tests/dummy';
    const htmlOutput = HtmlService.createTemplateFromFile(file);

    // create DOM from the htmlOutput
    const dom = htmlOutput.getContent();
    // create a new document
    const htmlDoc = XmlService.parse(dom);
    // get the element by id
    const element = htmlDoc.getRootElement().getElement('body').getElement('div');
    
    //Logger.log(element);
    // get the element text content
}

function test_AB1() {
    const response = doValidationReport({
        pageSize: 3,
        offset: 0,
        a1NotationRange: 'C9'
    });

    Logger.log({
        nextRowOffset: response.nextRowOffset,
        page: response.page,
        range: response.range
    });
}