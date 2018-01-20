var parameter;

function doGet(e) {
  
  parameter = e.parameter;
  var page= e.parameter.page;
  if(!page){
    page = 'index';
  }
  
     return HtmlService
     .createTemplateFromFile(page)
    // .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
     .evaluate();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function dataIntoHashRows(data, keysRow, startRow, filterFunction){
  var idKey= {};
  var keyId= {};
  var newData = [];

  for (var k = 0; k < data[keysRow].length; k++) { 
    // key is text, k is number

    var key = data[keysRow][k];
    key = key.replace("?","");
    key = key.replace("'","");
    key = key.replace(":","");
    if(key.trim() == ""){
       continue;
    }
    
    idKey[k] = key;
    keyId[key] = k;
  }
    
  for (var i = startRow; i < data.length; i++) { 
    var newRow = {};
    for (var j = 0; j < data[i].length; j++) { 
      if(!idKey[j] || idKey[j].trim() == ""){
        continue; 
      }
      newRow[idKey[j]] = data[i][j];
    }
    if(!filterFunction || filterFunction(newRow) == true){
      newData.push(newRow);
    }
  }
  return {data:newData, keyId: keyId, idKey: idKey};
  
}


function insertHashRow(table, data, keysrow){
  var insertArray = [];
  var idKey= {};
  var keyId= {};
    
  var range = "A"+(keysrow+1).toString() +":"+(keysrow+1).toString();

  tableMetaData = table
  .getActiveSheet()
  .getRange(range)
  .getValues();  
  
  for (var k = 0; k < tableMetaData[0].length; k++) { 
    var key = tableMetaData[0][k];
    // key is text, k is number
    if(key.trim() == ""){
       continue;
    }
    insertArray.push(""); 
    idKey[k] = key;
    keyId[key] = k;
  }
   
  datakeys = Object.keys(data);

  for(var i = 0; i < datakeys.length; i++){
    var key = datakeys[i];
    var k = keyId[key];
    insertArray[k] = data[key];
  }
  
  table.getActiveSheet().appendRow(insertArray);
}


function updateHashRow(table, data, keysrow, updateKey){
  Logger.log("updating2");
  var insertArray = [];
  var idKey= {};
  var keyId= {};
    
  var range = "A"+(keysrow+1).toString() +":"+(keysrow+1).toString();

  tableMetaData = table
  .getActiveSheet()
  .getRange(range)
  .getValues();  
  
  for (var k = 0; k < tableMetaData[0].length; k++) { 
    var key = tableMetaData[0][k];
    // key is text, k is number
    if(key.trim() == ""){
       continue;
    }
    insertArray.push(""); 
    idKey[k] = key;
    keyId[key] = k;
  }
   
  datakeys = Object.keys(data);

  for(var i = 0; i < datakeys.length; i++){
    var key = datakeys[i];
    var k = keyId[key];
    insertArray[k] = data[key];
  }
  
  var index = findRowNumForQuery(table, keysrow, keysrow + 1, function(row){
    if(row[updateKey.key] == updateKey.value){
      return true;
    }else{
      return false;
    }
  });
    
  var toDelete = index + 1;
  
  if(index){
    table.getActiveSheet().deleteRow(toDelete);
  }
  table.getActiveSheet().appendRow(insertArray);
  
  return index;
  
}


function findRowNumForQuery(table, keysRow, startRow, queryFunction){
  var tableData = table
  .getActiveSheet()
  .getDataRange()
  .getValues();

  var data = dataIntoHashRows(tableData, keysRow, startRow).data;
    
  for (var i = 0; i < data.length; i++) { 
    var res = queryFunction(data[i]);
    if(res == true){
      return i + startRow;
    }
  }
  return false;
}



function getImageUrl(imagename){
  var results = PicasaApp.find(imagename);
  return results[0].getUrl();
}
