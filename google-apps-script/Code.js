function getSs() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss;
}

function onOpen(){
  initMenu()
}

function initMenu(){
  const ui = SpreadsheetApp.getUi()
  ui.createMenu("OSAS Card Functions")
    .addItem("Sort Accomodations","getData")
    .addItem("Merge IEP Info","addIeps")
    .addItem("Merge 504 Info","add504s")
    .addItem("Download Sheet","dlFile")
    .addToUi()

}

function getSheet(name) {
  const ss = getSs();
  const sheet = ss.getSheetByName(name);
  Logger.log(sheet)
  return sheet;
}


function getHeaders(sheetName){
  const sheet=getSheet(sheetName);
  const headerRange = sheet.getRange("L1:AH1");
  const headers = headerRange.getValues()[0];
  Logger.log(headers);
  return headers;
}

function getTypes(){
  return [
    ["MA",35],
    ["SC",36],
    ["EL",37]
   ];
}

function removeElpaColumns(sheetName){
  const sheet = getSheet(sheetName);
 
  const tf1 = sheet.createTextFinder("ELPA Domain Exemptions").findNext().getColumn()
  const tf2 = sheet.createTextFinder("HS ELPA Proficiency Met").findNext().getColumn()
  sheet.deleteColumns(tf1,2)

}


function addColumns(sheetName){
  const sheet = getSheet(sheetName)
  const types = getTypes();
  types.forEach( type =>{
    sheet.insertColumnAfter(type[1]-1)
    sheet.getRange(1,type[1]).setValue(type[0])
  })
}

function cleanUpHeaders(sheetName){
  const sheet = getSheet(sheetName);
   sheet.getRange("Z1").setValue("Text-to-Speech")
   sheet.getRange("AF1").setValue("Dictation (Embedded Speech-to-Text)")
}

function clearExtraColumns(sheetName){
  const sheet =getSheet(sheetName)
  const range = sheet.getRange("L1:AH");
  range.deleteCells(SpreadsheetApp.Dimension.COLUMNS);
}

function cleanUpFinalColumns(sheetName,range,startCol,numCols,lastCol){
  const sheet = getSheet(sheetName)
  const finalRange = sheet.getRange(range);
  sheet.setColumnWidths(startCol,numCols,175)
  finalRange.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP)
 sheet.autoResizeColumns(1,lastCol)
}


function getData(){
   const sheetName = SpreadsheetApp.getActiveSheet().getSheetName()
   removeElpaColumns(sheetName)
   cleanUpHeaders(sheetName)
   addColumns(sheetName)
   
   const headers = getHeaders(sheetName)
   const sheet = getSheet(sheetName)
   const range = sheet.getRange(2,12,sheet.getLastRow()-1,23);
   const data = range.getValues();
   const remove = "ELPA:One or More";
   //Logger.log(data)
  
   const types = getTypes()

   types.forEach(type => {
      data.forEach((row,idx) => {
        
        const mathRange = sheet.getRange(idx+2,type[1]);
        let mathAcom = []
        row.forEach((cell,idx) =>{
          if(cell.includes(type[0]) && cell === remove){
            return;
          }else if(cell.includes(type[0])){
            const accom = headers[idx];
            const items = cell.split(";").filter(item => item.includes(type[0]))
            mathAcom = [...mathAcom,`${accom}: ${items} ${String.fromCharCode(10)}`]
          }else{
           return;
          }
        })

      //  Logger.log(mathAcom)
        const cellText= mathAcom.join('')
        if(cellText.includes(remove)){
          const newString = cellText.replace(remove,"");
          mathRange.setValue([newString])
          return;
        }
        mathRange.setValue([cellText])

        })
    })

    clearExtraColumns(sheetName);
    cleanUpFinalColumns(sheetName,"L1:N",12,3,11);
    

   
}

function moveColumns(sheetName){
    const sheet = getSheet(sheetName);
    var columnSpec = sheet.getRange(1,3,sheet.getLastRow(),1)
    sheet.moveColumns(columnSpec,1);
    const range = sheet.getRange("A1:A");
    range.setNumberFormat("@")
    range.setNumberFormat("########")

}

function setHeaders(sheet,startCol,endCol,headers){
 // const headerRange = sheet.getRange(1,15,1,4);

  let counter = 0;

  for(let i=startCol;i<=endCol;i++){
    const range =sheet.getRange(1,i)
    range.setValue(headers[counter])
    counter += 1
  }
  
}

function getMergeCol(sheet){
 const mergeCol = sheet.createTextFinder("SSID").findNext().getColumn()
 Logger.log(mergeCol);
 return mergeCol;
}

function addIeps(){
  const headers = ["IEP Date","IEP Math","IEP Science","IEP ELA"]
  addFormulas(15,"A","M",'IEP Import',[8,10,11,9],15,18,headers,"O1:R")
}

function add504s(){
  const headers = ["504 Accomodations"]
  addFormulas(19,"C","I",'504 Import',[7],19,19,headers,"S1:S")
}

function addFormulas(lastCol,col1,col2,importSheet,colArr,startCol,endCol,headers,finalRange){
  const sheetName = SpreadsheetApp.getActiveSheet().getSheetName();
  const sheet = getSheet(sheetName);
  const mergeCol = getMergeCol(sheet);
  if(mergeCol!==1) moveColumns(sheetName);

  const range = sheet.getRange(2,1,sheet.getLastRow()-1,lastCol);
  const numRows = range.getNumRows();

  for(let num =1;num<=numRows;num++){
    const rowNum = num +1 
    const range =sheet.getRange(rowNum,lastCol)
    range.setFormula(`=iferror(arrayformula(VLOOKUP($A${rowNum},'${importSheet}'!$${col1}$2:$${col2}$1000,{${[...colArr].toString()}},FALSE)),"")`)
    range.setNumberFormat("mm/dd/yyyy")
  }

setHeaders(sheet,startCol,endCol,headers)


cleanUpFinalColumns(sheetName,finalRange,15,4,14)
pasteValues(sheet,finalRange)

}


function pasteValues(sheet,finalRange){
  const range = sheet.getRange(finalRange)
  const values = range.getValues();
  range.setValues(values)
}

function dlFile() {
  const sheetName = SpreadsheetApp.getUi().prompt("Enter school name: ").getResponseText();
  const newSs = SpreadsheetApp.create(sheetName)
  const sheet = getSheet(sheetName)
  const ssId = newSs.getId()
  sheet.copyTo(SpreadsheetApp.openById(ssId))
  newSs.deleteSheet(newSs.getSheetByName("Sheet1"))
  
  const url = newSs.getUrl()
  var htmlString = "<base target=\"_blank\">" +
    "<h3>URL</h3><a href=\"" + url + "\">CLICK ME</a>";
  var html = HtmlService.createHtmlOutput(htmlString);

  // const blob = newSs.getBlob()
  // const file = DriveApp.createFile(blob)
  // const ssUrl = file.getDownloadUrl()
  
  // // Create little HTML popup with the URL of the download
  // let htmlTemplate = HtmlService.createTemplateFromFile('Download.html');
  // htmlTemplate.dataFromServerTemplate = { url: ssUrl };



  SpreadsheetApp.getUi()
    .showModalDialog(html, 'Download');
};


function lookUpColumns(){
    const ss = getSs();

    //sheet where we want to add matching values
    const currentSheet = ss.getActiveSheet();
    const currentSsidRange = currentSheet.getRange(2,3,currentSheet.getLastRow()-1,1);
    const destRange = currentSheet.getRange(2,15,currentSheet.getLastRow()-1,4);
    const currentSsidValues = currentSsidRange.getValues();
   // Logger.log(currentSsidValues)

    //sheet we will pull matching values from
    const matchSheet = ss.getSheetByName("IEP Import");
    const matchSsidRange = matchSheet.getRange(2,1,matchSheet.getLastRow()-1,1);
    const sourceRange = matchSheet.getRange(2,8,matchSheet.getLastRow()-1,4);
    const matchSsidValues = matchSsidRange.getValues();
   
    const convertedNums = matchSsidValues.map(number => convertNumber(number[0]))
    Logger.log(convertedNums)

  //  const matchingSsids = currentSsidValues.filter(ssId => matchSsidValues.includes(ssId));
  //  Logger.log(matchingSsids)
}

function convertNumber(number){
  const fixedNumber = parseFloat(number).toFixed(0)
  return fixedNumber;
}
















