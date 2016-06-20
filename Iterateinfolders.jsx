//@include "/Applications/Adobe Photoshop CC 2015/Presets/Scripts/[RTCC]ReplaceShapeColors-iterate.jsx"

// Pre-selected starting point  
var topFolder = Folder.selectDialog(undefined,undefined,true)

var fileandfolderAr = scanSubFolders(topFolder,/\.(psd|psb|)$/i);
var fileList = fileandfolderAr[0];
for(var a = 0 ;a < fileList.length; a++)
{
var docRef = open(fileList[a]);
//do things here
getColors(app.activeDocument.layerSets);
executeAction( charIDToTypeID( "save" ) );

executeAction( charIDToTypeID( "Cls " ) );

}
function scanSubFolders(tFolder, mask) { // folder object, RegExp or string
    var sFolders = new Array(); 
    var allFiles = new Array(); 
    sFolders[0] = tFolder; 
    for (var j = 0; j < sFolders.length; j++){ // loop through folders             
        var procFiles = sFolders[j].getFiles(); 
        for (var i=0;i<procFiles.length;i++){ // loop through this folder contents 
            if (procFiles[i] instanceof File ){
                if(mask==undefined) allFiles.push(procFiles[i]);// if no search mask collect all files
                if (procFiles[i].fullName.search(mask) != -1) allFiles.push(procFiles[i]); // otherwise only those that match mask
        }else if (procFiles[i] instanceof Folder){
            sFolders.push(procFiles[i]);// store the subfolder
            scanSubFolders(procFiles[i], mask);// search the subfolder
         }
      } 
   } 
   return [allFiles,sFolders]; 
};
