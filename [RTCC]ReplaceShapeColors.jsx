//@include "/Applications/Adobe Photoshop CC 2015/Presets/Scripts/xlib/stdlib.js"
//original is exportshapecolors

//Basic Instructions
//Input what to search for
//Input what to replace for
//Select what i searched
//Replace what is selected by what is 

var searchColor = prompt("Color to search","FF00AA");
var replaceColor = prompt("Color to replace","C00FFE");

var _r = hexToRgb(replaceColor).r,
    _g = hexToRgb(replaceColor).g,
    _b = hexToRgb(replaceColor).b;

//Function to extract color from Layer
function getAdjustmentLayerColor(doc, layer) { 
    var desc = Stdlib.getLayerDescriptor(doc, layer);
    var adjs = desc.getList(cTID('Adjs'));

    var clrDesc = adjs.getObjectValue(0);
    var color = clrDesc.getObjectValue(cTID('Clr '));

    var red = Math.round(color.getDouble(cTID('Rd  ')));
    var green = Math.round(color.getDouble(cTID('Grn ')));
    var blue = Math.round(color.getDouble(cTID('Bl  ')));

    var createdSolidColor = Stdlib.createRGBColor(red, green, blue);
    var createdRGBColor = createdSolidColor.rgb;
    return createdRGBColor.hexValue;
};

//Function to cycle through layers and output to external file
function getColors(layerNode) {    
    for (var i=0; i<layerNode.length; i++) {
        getColors(layerNode[i].layerSets);
        for(var layerIndex=0; layerIndex < layerNode[i].artLayers.length; layerIndex++) {
            var layer=layerNode[i].artLayers[layerIndex];
            app.activeDocument.activeLayer = layer;

             if (layer.kind == LayerKind.SOLIDFILL) {
                    alert(getAdjustmentLayerColor(app.activeDocument, layer));
                 if(searchColor == getAdjustmentLayerColor(app.activeDocument, layer)){
                      putFillColor(_r, _g, _b);
                 }
             }
        }
    }
}

getColors(app.activeDocument.layerSets);

//Replacer

function putFillColor(_r, _g, _b) {  
    var desc1 = new ActionDescriptor(),  
        desc2 = new ActionDescriptor(),  
        desc3 = new ActionDescriptor(),  
        ref1 = new ActionReference();  
    ref1.putEnumerated(stringIDToTypeID("contentLayer"), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));  
    desc1.putReference(charIDToTypeID('null'), ref1);  
    desc3.putDouble(charIDToTypeID('Rd  '), _r);  
    desc3.putDouble(charIDToTypeID('Grn '), _g);  
    desc3.putDouble(charIDToTypeID('Bl  '), _b);  
    desc2.putObject(charIDToTypeID('Clr '), stringIDToTypeID("RGBColor"), desc3);  
    desc1.putObject(charIDToTypeID('T   '), stringIDToTypeID("solidColorLayer"), desc2);  
    executeAction(charIDToTypeID('setd'), desc1, DialogModes.NO);  
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
