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
    const start = new Date()
    const savedNames = readProperty("SHEET_NAMES");
    // console.log("Save data is:"+savedNames)
    
    if(savedNames){
      // console.log("Property has data; go ahead and read it")
      const end = new Date();
      console.log(`Reading from script properties took ${(end - start) / 1000}`)
      return savedNames;
    } else{
      console.log("Property was empty; saved the data")
        const ss = getSs();
        const sheets = ss.getSheets();
        const sheetNames = sheets.map(sheet => sheet.getSheetName())
        writeProperty("SHEET_NAMES",sheetNames);
        const end = new Date();
        console.log(`Reading from the spreadsheet took ${(end - start) / 1000}`)
        return sheetNames;
    }

}

function serverSideGetHeaders(sheetName,id){
    // Logger.log(`The sheetname received is ${sheetName}`)
    const sheet = getSheet(sheetName);
    const headerRange = sheet.getRange(1,1,1,sheet.getLastColumn());
    const headerVals = headerRange.getValues();
    // Logger.log(headerVals);
    const returnObj = {
        headers: headerVals,
        id: id
    }
    return returnObj;
}



function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename).getContent()
  }
