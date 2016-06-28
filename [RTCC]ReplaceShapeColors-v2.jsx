//@include "/Applications/Adobe Photoshop CC 2015/Presets/Scripts/xlib/stdlib.js"
//original is exportshapecolors
// © David Luna fuckin' boss.
// © Roman Tauler 

//COLOR VARS
var searchColor = prompt("Color to search","777575");
var searchColorstroke = prompt("Stroke Color to search","414142");

var replaceColor = prompt("Color to replace","C00FFE");
var replaceColorstroke = prompt("Stroke Color to replace","8CC63F");

var strokeyesorno = prompt("0 to no stroke 1 to stroke","0");

//hextoRGB
var _r = hexToRgb(replaceColor).r;
    _g = hexToRgb(replaceColor).g;
    _b = hexToRgb(replaceColor).b;

var _sr = hexToRgb(replaceColorstroke).r;
    _sg = hexToRgb(replaceColorstroke).g;
    _sb = hexToRgb(replaceColorstroke).b;
//END COLOR VARS

//STROKE
function getAdjustmentLayerColorStroke(doc, layer){
    var ref = new ActionReference();  
    ref.putEnumerated( stringIDToTypeID("contentLayer"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );  
    var layerDesc = executeActionGet(ref);  
    //var strokeSt = layerDesc.getObjectValue(stringIDToTypeID("AGMStrokeStyleInfo")); 
    //MAGIC
    //var agmDesc = strokeSt.getBoolean(stringIDToTypeID( "strokeEnabled" )); 
    //alert(agmDesc);
    //MAGIC!
    var strokeSt, agmDesc, createdRGBColorStroke;

    try {
        strokeSt = layerDesc.getObjectValue(stringIDToTypeID("AGMStrokeStyleInfo"));
    } catch (e) {
        strokeSt = null;
    }

    if ( strokeSt ) {
        var strokeStyleColor = strokeSt.getObjectValue(stringIDToTypeID("strokeStyleContent")).getObjectValue(stringIDToTypeID("color"));  
        var stroker = Math.round(strokeStyleColor.getDouble(stringIDToTypeID("red")));
        var strokeg = Math.round(strokeStyleColor.getDouble(stringIDToTypeID("green")));
        var strokeb = Math.round(strokeStyleColor.getDouble(stringIDToTypeID("blue")));
        var createdSolidColorStroke = Stdlib.createRGBColor(stroker, strokeg, strokeb);

        createdRGBColorStroke = createdSolidColorStroke.rgb;
        agmDesc = strokeSt.getBoolean(stringIDToTypeID( "strokeEnabled" ));
    } else {
        createdRGBColorStroke = null;
        agmDesc = false;
    }

    
    return {
        hexValue: createdRGBColorStroke ? createdRGBColorStroke.hexValue : '',
        agmDesc : agmDesc
    };
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

//Function to cycle through layers apply changes if requests are met.

function getSolidLayers(layerSet) {
    var l = layerSet.length,
        layers = [],
        currentLayer;

    while(l--) {
        currentLayer = layerSet[l];

        if ( currentLayer.kind == LayerKind.SOLIDFILL ) {
            layers.push(currentLayer);
        }
        if ( currentLayer.artLayers && currentLayer.artLayers.length ){
            layers = layers.concat(getSolidLayers(currentLayer.artLayers));
        }
        if ( currentLayer.layerSets && currentLayer.layerSets.length ){
            layers = layers.concat(getSolidLayers(currentLayer.layerSets));
        }
    }

    return layers;
}

function getColors(layerSet) {
    var layers = getSolidLayers(layerSet),
        i = layers.length,
        current, currentColor, currentStroke;

    while ( i-- ) {
        current = layers[i];
        currentColor = getAdjustmentLayerColor(app.activeDocument, current);
        app.activeDocument.activeLayer = current;
        if (strokeyesorno == 0) {
            if (searchColor == currentColor){
                putFillColor(_r, _g, _b);
            }
        }

        if (strokeyesorno == 1) {
            currentStroke = getAdjustmentLayerColorStroke(app.activeDocument, current);
            if (searchColor == currentColor && searchColorstroke == currentStroke.hexValue && currentStroke.agmDesc) {
                putFillColor(_r, _g, _b);
                putFillColorStroke(_sr, _sg, _sb);
            } 
        }
    }

    alert (layers.length);
}


//Apply Fill Color

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

//Apply Stroke Color

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


getColors(app.activeDocument.layerSets);
