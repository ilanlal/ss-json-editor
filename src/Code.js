// Code.gs
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
}

function test_AB() {
  const htmlContent = HtmlService.createHtmlOutputFromFile('tests/dummy').getContent();
  const jsContent = htmlContent.replaceAll('<script>', '').replaceAll('</script>', '');
  
  // eval jsContent as new js object
  const jsObject = new Function(jsContent);
  // call method from jsObject
  jsObject();
  // call method from jsObject
  DummyAddon.DummyModel.dummyMethod();
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