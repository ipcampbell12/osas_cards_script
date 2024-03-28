
function readProperties(key){
     try{
          const scriptProperties = PropertiesService.getScriptProperties();
          scriptProperties.getProperty(key)
     }catch(e){
          console.log(`Unable to retrieve value for ${key}`)
     }
}

function writeProperties(key,value){
     try{
          const scriptProperties = PropertiesService.getScriptProperties();
          scriptProperties.setProperty(key,value)
     }catch(e){
          console.log(`Script property for ${key} not set`)
     }

}