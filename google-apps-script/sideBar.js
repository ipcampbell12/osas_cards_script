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