
function readProperty(key){
     try{
          const scriptProperties = PropertiesService.getScriptProperties();
          const property = JSON.parse(scriptProperties.getProperty(key));
          return property;
     }catch(e){
         console.log(e)
          console.log(`Unable to retrieve value for ${key}`)
     }
}

function tryIt(){
  readProperty("SHEET_NAMES")
}

function writeProperty(key,value){
     try{
          const scriptProperties = PropertiesService.getScriptProperties();
          scriptProperties.setProperty(key,JSON.stringify(value));
     }catch(e){
          console.log(`Script property for ${key} not set`);   
     }

}

function deleteProperties(){
     try {
     // Get user properties in the current script.
     const userProperties = PropertiesService.getScriptProperties();
     // Delete all user properties in the current script.
     userProperties.deleteAllProperties();
     } catch (err) {
     // TODO (developer) - Handle exception
     console.log('Failed with error %s', err.message);
     }
}