function openSideBar() {
    var html = HtmlService.createHtmlOutputFromFile("ablebits").setTitle("Pre Registration Tools")
    var ui = SpreadsheetApp.getUi(); // Or DocumentApp or SlidesApp or FormApp.
    ui.showSidebar(html);
}

function createSpreadsheetOpenTrigger() {
    const ss = SpreadsheetApp.getActive();
    ScriptApp.newTrigger('openSideBar')
        .forSpreadsheet(ss)
        .onOpen()
        .create();
}

function serverSideGetSheetNames(){
    const ss = getSs();
    const sheets = ss.getSheets();
    const sheetNames = sheets.map(sheet => sheet.getSheetName())
    Logger.log(sheetNames);
    return sheetNames;
}

function serverSideGetHeaders(sheetName,id){
    const sheet = getSheet(sheetName);
    const headerRange = sheet.getRange(1,1,1,sheet.getLastColumn());
    const headerVals = headerRange.getValues();
    Logger.log(headerVals);
    const returnObj = {
        headers: headerVals,
        id: id
    }
    return returnObj;
}



function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename).getContent()
  }
