//@include "/Applications/Adobe Photoshop CC 2015/Presets/Scripts/xlib/stdlib.js"
//original is exportshapecolors

//Basic Instructions
//Input what to search for
//Input what to replace for
//Select what i searched
//Replace what is selected by what is 

//FILLCOLOR
var searchColor = prompt("Color to search","FF00AA");
var searchColorstroke = prompt("Stroke Color to search","414142");

var replaceColor = prompt("Color to replace","C00FFE");
var replaceColorstroke = prompt("Stroke Color to replace","8CC63F");

var _r = hexToRgb(replaceColor).r;
    _g = hexToRgb(replaceColor).g;
    _b = hexToRgb(replaceColor).b;

var _sr = hexToRgb(replaceColorstroke).r;
    _sg = hexToRgb(replaceColorstroke).g;
    _sb = hexToRgb(replaceColorstroke).b;

//ENDFILLCOLOR

//STROKE
function getAdjustmentLayerColorStroke(doc, layer){
    var ref = new ActionReference();  
    ref.putEnumerated( stringIDToTypeID("contentLayer"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );  
    var layerDesc = executeActionGet(ref);  
    var strokeSt = layerDesc.getObjectValue(stringIDToTypeID("AGMStrokeStyleInfo"));  
    var strokeStyleColor = strokeSt.getObjectValue(stringIDToTypeID("strokeStyleContent")).getObjectValue(stringIDToTypeID("color"));  

    var stroker = Math.round(strokeStyleColor.getDouble(stringIDToTypeID("red")));
    var strokeg = Math.round(strokeStyleColor.getDouble(stringIDToTypeID("green")));
    var strokeb = Math.round(strokeStyleColor.getDouble(stringIDToTypeID("blue")));

    var createdSolidColorStroke = Stdlib.createRGBColor(stroker, strokeg, strokeb);
    var createdRGBColorStroke = createdSolidColorStroke.rgb;
    return createdRGBColorStroke.hexValue;
};
//ENDSTROKE

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
                    // alert(getAdjustmentLayerColor(app.activeDocument, layer));
                 if(searchColor == getAdjustmentLayerColor(app.activeDocument, layer)){
                       if(searchColorstroke == getAdjustmentLayerColorStroke(app.activeDocument, layer)){
                            putFillColor(_r, _g, _b);
                            putFillColorStroke(_sr, _sg, _sb);
                        }                                        
                 }
               
             }
        }
    }
}

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

function putFillColorStroke(_sr,_sg,_sb){
    var idsetd = charIDToTypeID( "setd" );
    var desc1694 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref265 = new ActionReference();
        var idcontentLayer = stringIDToTypeID( "contentLayer" );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref265.putEnumerated( idcontentLayer, idOrdn, idTrgt );
    desc1694.putReference( idnull, ref265 );
    var idT = charIDToTypeID( "T   " );
        var desc1695 = new ActionDescriptor();
        var idstrokeStyle = stringIDToTypeID( "strokeStyle" );
            var desc1696 = new ActionDescriptor();
            var idstrokeStyleContent = stringIDToTypeID( "strokeStyleContent" );
                var desc1697 = new ActionDescriptor();
                var idClr = charIDToTypeID( "Clr " );
                    var desc1698 = new ActionDescriptor();
                    var idRd = charIDToTypeID( "Rd  " );
                    desc1698.putDouble( idRd, _sr );
                    var idGrn = charIDToTypeID( "Grn " );
                    desc1698.putDouble( idGrn, _sg );
                    var idBl = charIDToTypeID( "Bl  " );
                    desc1698.putDouble( idBl, _sb );
                var idRGBC = charIDToTypeID( "RGBC" );
                desc1697.putObject( idClr, idRGBC, desc1698 );
            var idsolidColorLayer = stringIDToTypeID( "solidColorLayer" );
            desc1696.putObject( idstrokeStyleContent, idsolidColorLayer, desc1697 );
            var idstrokeStyleVersion = stringIDToTypeID( "strokeStyleVersion" );
            desc1696.putInteger( idstrokeStyleVersion, 2 );
            var idstrokeEnabled = stringIDToTypeID( "strokeEnabled" );
            desc1696.putBoolean( idstrokeEnabled, true );
        var idstrokeStyle = stringIDToTypeID( "strokeStyle" );
        desc1695.putObject( idstrokeStyle, idstrokeStyle, desc1696 );
    var idshapeStyle = stringIDToTypeID( "shapeStyle" );
    desc1694.putObject( idT, idshapeStyle, desc1695 );
executeAction( idsetd, desc1694, DialogModes.NO );
}

// EXTRA FUNCTION ROUND CORNERS
// function putRoundCorners(_corner) {  
// var idchangePathDetails = stringIDToTypeID( "changePathDetails" );  
//     var desc26 = new ActionDescriptor();  
//     var idkeyOriginType = stringIDToTypeID( "keyOriginType" );  
//     desc26.putInteger( idkeyOriginType, 1 );  
//     var idkeyOriginRRectRadii = stringIDToTypeID( "keyOriginRRectRadii" );  
//         var desc27 = new ActionDescriptor();  
//         var idunitValueQuadVersion = stringIDToTypeID( "unitValueQuadVersion" );  
//         desc27.putInteger( idunitValueQuadVersion, 1 );  
//         var idtopRight = stringIDToTypeID( "topRight" );  
//         var idPxl = charIDToTypeID( "#Pxl" );  
//         desc27.putUnitDouble( idtopRight, idPxl, _corner );  
//         var idtopLeft = stringIDToTypeID( "topLeft" );  
//         var idPxl = charIDToTypeID( "#Pxl" );  
//         desc27.putUnitDouble( idtopLeft, idPxl, _corner );  
//         var idbottomLeft = stringIDToTypeID( "bottomLeft" );  
//         var idPxl = charIDToTypeID( "#Pxl" );  
//         desc27.putUnitDouble( idbottomLeft, idPxl, _corner );  
//         var idbottomRight = stringIDToTypeID( "bottomRight" );  
//         var idPxl = charIDToTypeID( "#Pxl" );  
//         desc27.putUnitDouble( idbottomRight, idPxl, _corner );  
//     var idradii = stringIDToTypeID( "radii" );  
//     desc26.putObject( idkeyOriginRRectRadii, idradii, desc27 );  
//     var idkeyActionRadiiSource = stringIDToTypeID( "keyActionRadiiSource" );  
//     desc26.putInteger( idkeyActionRadiiSource, 1 );  
//     var idkeyActionChangeAllCorners = stringIDToTypeID( "keyActionChangeAllCorners" );  
//     desc26.putBoolean( idkeyActionChangeAllCorners, true );  
// executeAction( idchangePathDetails, desc26, DialogModes.NO );
// }

//Hex to RGB convert
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

// getColors(app.activeDocument.layerSets);