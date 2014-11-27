/**  
  * @scriptName  Creative Trails UI 2.0
  * @lisence Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) http://creativecommons.org/licenses/by-nc-sa/4.0/
  * @desc This script  sets the layers to Lighten and extends Trails in a creative fashion. The length and pattern of the trails can be controlled by parameters
  * @prerequisite  Open the image that is intended for extending trails. Make sure it has only one layer. It is optional to have a Anchor point selected with Pen tool prior to calling the script
  * @author Sathya sathya@liketheocean.com 
  * @release Sept 2014, Ver 2.0 Beta
  * @latestVersion http://liketheocean.com/night-photography/
  *
  * @newFeatures 
  * UI for the script
  *  
*/  

// defined for the Vortex function that uses Transform and Set
// Global 
cTID = function(s) { return app.charIDToTypeID(s); };
sTID = function(s) { return app.stringIDToTypeID(s); };

//enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop
//in case we double clicked the file
app.bringToFront();
main();

function main() {

// reference active document
var docRef = app.activeDocument;
// Make sure there is only one layer in the current open images
var numberOfLayers = docRef.layers.length;
var myAnchorX = 0;
var myAnchorY = 0;
if (numberOfLayers == 1) {
	// Rename the layer to Base Layer
	docRef.activeLayer.name = "Trail_x";

	//Read to see if there is a Path defined. If yes, then read the first point so it can be loaded as the Anchor Point
	// identify path if a path is present;  
	var thePath = selectedPath();  
	if (thePath != undefined) {  
		// collect info;  
		var thePathInfo = collectPathInfoFromDesc(docRef, thePath);  
		myAnchorX = Math.round(thePathInfo[0][0][0][0]); 
		myAnchorY = Math.round(thePathInfo[0][0][0][1]);
	} else {
	// do nothing; 
	}  
} else {
	alert ("Too many Layers");
	return 99;
}



var myWindow = new Window ("dialog", "Creative Trails UI 2.0", undefined, {closeButton: true});

// Group 1 - Template Drop down menu
// Set it to right alignment
 var myInputGroup1 = myWindow.add ("group");
 myInputGroup1.add ("statictext", undefined, "Template :");
 var templateDropdown = myInputGroup1.add ("dropdownlist", undefined, ["Simple","Vortex (Clockwise)", "Vortex (Anti Clockwise)", "Zoom"]);
 templateDropdown.selection = 1;

 //Seperator
  var dummyInputGroup = myWindow.add ("group");
  myWindow.add ("panel", [0,0,190,3]);

 var myInputGroup2 = myWindow.add ("group");
 myInputGroup2.add ("statictext", undefined, "Anchor Point :");
 myInputGroup2.add ("statictext", undefined, "X");
 var pointX = myInputGroup2.add ("edittext", undefined, myAnchorX);
 pointX.characters = 5;
// pointX.active = true;
 myInputGroup2.add ("statictext", undefined, "Y");
 var pointY = myInputGroup2.add ("edittext", undefined, myAnchorY);
 pointY.characters = 5;
// pointY.active = true;

 var myInputGroup3 = myWindow.add ("group");
 myInputGroup3.add ("statictext", undefined, "Vortex Trim  :");
 myInputGroup3.add ("statictext", undefined, "X");
 var trimPointX = myInputGroup3.add ("edittext", undefined, "99.8");
 trimPointX.characters = 5;
// trimPointX.active = true;
 myInputGroup3.add ("statictext", undefined, "Y");
 var trimPointY = myInputGroup3.add ("edittext", undefined, "99.8");
 trimPointY.characters = 5;
// trimPointY.active = true;

var myInputGroup4 = myWindow.add ("group");
 myInputGroup4.add ("statictext", undefined, "Trail Length  :");
 var trailLength = myInputGroup4.add ("edittext", undefined, "40");
 trailLength.characters = 4;
 trailLength.active = true;
 
var myInputGroup5 = myWindow.add ("group");
 myInputGroup5.add ("statictext", undefined, "Rotate Angle :");
 var rotateAngle = myInputGroup5.add ("edittext", undefined, "0.2");
 rotateAngle.characters = 4;
// rotateAngle.active = true;
	
var myButtonGroup1 = myWindow.add ("group");
myButtonGroup1.alignment = "right";
//myButtonGroup1.add ("button", undefined, "OK");
myButtonGroup1.add ("button", undefined, "Run Script", {name: "OK"});
myButtonGroup1.add ("button", undefined, "Cancel"); 

var myButtonGroup2 = myWindow.add ("group");
myButtonGroup2.alignment = "right";
var HelpButton = myButtonGroup2.add ("button", undefined, "Help");
HelpButton.onClick = function () {
	openInBrowser("http://liketheocean.com/night-photography/make-your-star-trails-awesome#CreativeTrailsUI");
}

var scriptFolder = new File(WhoAmI()).parent;
var myLogoImg = myWindow.add ("image", undefined, File (scriptFolder+'/LTO_logo_240.png'));
myLogoImg.onClick = function () {
	openInBrowser("http://www.LikeTheOcean.com/");
}


///////////////////////////////////////////////////////////////////////////////////////
// Identify when the dropdownlist is changed and act on the same
templateDropdown.onChange = function (){
    switch(templateDropdown.selection.text) {
		case "Simple": 
			//alert("Simple in"); 
			trailLength.text=trailLength.text;
			pointX.text=pointX.text;
			pointY.text=pointY.text;
			rotateAngle.text=0.1;
			trimPointX.text=100;
			trimPointY.text=100;
			break;
        case "Vortex (Clockwise)":
			//alert("Vortex (Clockwise)");		
			trailLength.text=trailLength.text;
			pointX.text=pointX.text;
			pointY.text=pointY.text;
			rotateAngle.text=0.2;
			trimPointX.text=99.8;
			trimPointY.text=99.8;
			break;
        case "Vortex (Anti Clockwise)": 
			//alert("Vortex (Anti Clockwise)");
			trailLength.text=trailLength.text;
			pointX.text=pointX.text;
			pointY.text=pointY.text;
			rotateAngle.text=-0.2;
			trimPointX.text=99.8;
			trimPointY.text=99.8;
			break;
		case "Zoom": 
			//alert ("zoom");
			trailLength.text=trailLength.text;
			pointX.text=pointX.text;
			pointY.text=pointY.text;
			rotateAngle.text=0.0;
			trimPointX.text=100.2;
			trimPointY.text=100.2;
			break;
		default : 
			alert("case 999");
	}
}


if (myWindow.show () == 1) {
	var configText = "";
	configText = removeConfigLayer(docRef);
	// Call the main function
	mainProg(docRef,trailLength.text, pointX.text, pointY.text,rotateAngle.text, trimPointX.text, trimPointY.text);
	//Create the config text from the settings
	var settingText = "Creative Trails UI 2.0\r";
	settingText = settingText.concat("Trail Length : ",trailLength.text,"\r");
	settingText = settingText.concat("Center Point : (",pointX.text, " , ", pointY.text,")","\r");
	settingText = settingText.concat("Rotate Angle : ",rotateAngle.text,"\r");
	settingText = settingText.concat("Trim X       : ",trimPointX.text,"\r");
	settingText = settingText.concat("Trim Y       : ",trimPointY.text,"\r\r");	
	addConfigLayer(docRef,settingText);		
} else {
//	do nothing if it is cancelled
}
//////////////////////////////////////////////////////////////////////////////////////////
} // end of function main

//////////////////////////////////////////////////////////////////////////////////////////

//////////// Main Program ////////////////////////////////////////////////////////////////
function mainProg(docRef,countUI,xUI,yUI,angleUI,trimUIX, trimUIY) {
	// Program Variables
	//replicate layers, depending on the number of DuplicateCount
	//app.preferences.rulerUnits = Units.PIXELS;
	var duplicateCount = 10;
	//Vortex parms
	var x=1300;
	var y=600;
	//for 1024 images use 0.1 for 2048 use 0.5 and 4K use 0.02
	var angle=0.2;
	//for 1024 or 2048 use 99.8
	var trimX=99.8;
	var trimY=99.8;
	duplicateCount = countUI;	
	x = xUI; y = yUI; angle = angleUI; trimX = trimUIX; trimY = trimUIY;


//	for(var i = 0 ; i < duplicateCount;i++){
//		var newdLayer = docRef.activeLayer.duplicate();
//		newdLayer.blendMode = BlendMode.LIGHTEN;
		//	rename to trail i
//		newdLayer.name = "Trail"+i;
//		Vortex(x,y,angle,trimX,trimY);
//  }
		
    for (var i = 1; i < duplicateCount; i++) { 
       // now process the next layer
		var newdLayer = docRef.activeLayer.duplicate();
		//newdLayer = docRef.layer[i];
		newdLayer.blendMode = BlendMode.LIGHTEN;
		//	rename to trail i
		newdLayer.name = "Trail_"+i;
		Vortex(x,y,angle,trimX,trimY);
    } 
///////////////////////////////////////////////////////////////////
} // end of function mainProg

//==================== Function Calls ======
//==================== Vortex ==============
//
// Make sure to have the duplicate layer is created and the blend mode set to LIGHTEN
// the use Vortex() to apply vortex effect once on that layer
// Control Variables 
//	Anchor point (x,y)
//  Rotate Angle = 0.1
//  trimWidthHeight = 99.8



function Vortex(x,y,angle,trimX, trimY) { 
  // Transform
  function step2(enabled, withDialog) {
  
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    desc1.putEnumerated(cTID('FTcs'), cTID('QCSt'), sTID("QCSIndependent"));
    var desc2 = new ActionDescriptor();
    desc2.putUnitDouble(cTID('Hrzn'), cTID('#Pxl'), x);
    desc2.putUnitDouble(cTID('Vrtc'), cTID('#Pxl'), y);
    desc1.putObject(cTID('Pstn'), cTID('Pnt '), desc2);
    var desc3 = new ActionDescriptor();
    desc3.putUnitDouble(cTID('Hrzn'), cTID('#Pxl'), 0);
    desc3.putUnitDouble(cTID('Vrtc'), cTID('#Pxl'), 0);
    desc1.putObject(cTID('Ofst'), cTID('Ofst'), desc3);
    desc1.putUnitDouble(cTID('Wdth'), cTID('#Prc'), trimX);
    desc1.putUnitDouble(cTID('Hght'), cTID('#Prc'), trimY);
    desc1.putUnitDouble(cTID('Angl'), cTID('#Ang'), angle);
    desc1.putBoolean(cTID('Lnkd'), true);
    executeAction(cTID('Trnf'), desc1, dialogMode);
  };
  
  step2();      // Transform
};

// Below is for calling the help web page from the button click
function openInBrowser(/*str*/ url) {
     var isMac = (File.fs == "Macintosh"),
          fName = 'tmp' + (+new Date()) + (isMac ? '.webloc' : '.url'),
          fCode = isMac ?
               ('<?xml version="1.0" encoding="UTF-8"?>\r'+
               '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" '+
               '"http://www.apple.com/DTDs/PropertyList-1.0.dtd">\r'+
               '<plist version="1.0">\r'+
               '<dict>\r'+
                    '\t<key>URL</key>\r'+
                    '\t<string>%url%</string>\r'+
               '</dict>\r'+
               '</plist>') :
               '[InternetShortcut]\rURL=%url%\r';

     var f = new File(Folder.temp.absoluteURI + '/' + fName);
     if(! f.open('w') ) return false;

     f.write(fCode.replace('%url%',url));
     f.close();
     f.execute();
     $.sleep(500);     // 500 ms timer
     f.remove();
     return true;
}

// Below function is for the Progress Bar
function createProgressWindow(title, message, min, max, parent, useCancel) { 
   var win = new Window('palette', title); 
   win.bar = win.add('progressbar', undefined, min, max); 
   win.bar.preferredSize = [300, 20]; 
   win.stProgress = win.add('statictext');
   win.stProgress .preferredSize.width = 200;
   win.parent = undefined; 

   if (parent) { 
      if (parent instanceof Window) { 
         win.parent = parent; 
      } else if (useCancel == undefined) { 
         useCancel = parent; 
      } 
   } 

   if (useCancel) { 
      win.cancel = win.add('button', undefined, 'Cancel'); 
      win.cancel.onClick = function() { 
      try { 
         if (win.onCancel) { 
            var rc = win.onCancel(); 
            if (rc || rc == undefined) { 
               win.close(); 
            } 
         } else { 
            win.close(); 
         } 
         } catch (e) { alert(e); } 
      } 
   }

   win.updateProgress = function(val) {
      var win = this;
      if (val != undefined) {
         win.bar.value = val;
      }else {
         win.bar.value++;
      }
      if (win.recenter) {
         win.center(win.parentWin);
      }
      win.update();
   }
   win.center(win.parent); 
   return win; 
}; 

// Below function is for reading the PAth if present
// Script to read a first dot of a path , delete the path and display the x,y value
// get active path
////// determine selected path //////  
function selectedPath () {  
try {  
var ref = new ActionReference();   
ref.putEnumerated( charIDToTypeID("Path"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );   
var desc = executeActionGet(ref);  
var theName = desc.getString(charIDToTypeID("PthN"));  
return app.activeDocument.pathItems.getByName(theName)  
}  
catch (e) {  
return undefined  
}  
};

////// collect path infor from actiondescriptor //////  
function collectPathInfoFromDesc (myDocument, thePath) {  
//var myDocument = app.activeDocument;  
var originalRulerUnits = app.preferences.rulerUnits;  
app.preferences.rulerUnits = Units.PIXELS;  
var ref = new ActionReference();  
for (var l = 0; l < myDocument.pathItems.length; l++) {  
     var thisPath = myDocument.pathItems[l];  
     if (thisPath == thePath && thisPath.name == "Work Path") {  
          ref.putProperty(cTID("Path"), cTID("WrPt"));  
          };  
     if (thisPath == thePath && thisPath.name != "Work Path" && thisPath.kind != PathKind.VECTORMASK) {  
          ref.putIndex(cTID("Path"), l + 1);  
          };  
     if (thisPath == thePath && thisPath.kind == PathKind.VECTORMASK) {  
        var idPath = charIDToTypeID( "Path" );  
        var idPath = charIDToTypeID( "Path" );  
        var idvectorMask = stringIDToTypeID( "vectorMask" );  
        ref.putEnumerated( idPath, idPath, idvectorMask );  
          };  
     };  
var desc = app.executeActionGet(ref);  
var pname = desc.getString(cTID('PthN'));  
// create new array;  
var theArray = new Array;  
var pathComponents = desc.getObjectValue(cTID("PthC")).getList(sTID('pathComponents'));  
// for subpathitems;  
for (var m = 0; m < pathComponents.count; m++) {  
     var listKey = pathComponents.getObjectValue(m).getList(sTID("subpathListKey"));  
     var operation = thePath.subPathItems[m].operation;  
// for subpathitem’s count;  
     for (var n = 0; n < listKey.count; n++) {  
          theArray.push(new Array);  
          var points = listKey.getObjectValue(n).getList(sTID('points'));  
          try {var closed = listKey.getObjectValue(n).getBoolean(sTID("closedSubpath"))}  
          catch (e) {var closed = false};  
// for subpathitem’s segment’s number of points;  
          for (var o = 0; o < points.count; o++) {  
               var anchorObj = points.getObjectValue(o).getObjectValue(sTID("anchor"));  
               var anchor = [anchorObj.getUnitDoubleValue(sTID('horizontal')), anchorObj.getUnitDoubleValue(sTID('vertical'))];  
//			   alert (anchor);
               var thisPoint = [anchor];  
               try {  
                    var left = points.getObjectValue(o).getObjectValue(cTID("Fwd "));  
                    var leftDirection = [left.getUnitDoubleValue(sTID('horizontal')), left.getUnitDoubleValue(sTID('vertical'))];  
                    thisPoint.push(leftDirection)  
                    }  
               catch (e) {  
                    thisPoint.push(anchor)  
                    };  
               try {  
                    var right = points.getObjectValue(o).getObjectValue(cTID("Bwd "));  
                    var rightDirection = [right.getUnitDoubleValue(sTID('horizontal')), right.getUnitDoubleValue(sTID('vertical'))]  
                    thisPoint.push(rightDirection)  
                    }  
               catch (e) {  
                    thisPoint.push(anchor)  
                    };  
               theArray[theArray.length - 1].push(thisPoint);  
               };  
          theArray[theArray.length - 1].push(closed);  
          theArray[theArray.length - 1].push(operation);  
          };  
     };  
// reset;  
app.preferences.rulerUnits = originalRulerUnits;  
return theArray;  
};    

function createText(docRef,fface, size, colR, colG, colB, content, tX, tY) {
  // Add a new layer in the new document
  var artLayerRef = docRef.artLayers.add();

  // Specify that the layer is a text layer
  artLayerRef.kind = LayerKind.TEXT

  //This section defines the color of the hello world text
  textColor = new SolidColor();
  textColor.rgb.red = colR;
  textColor.rgb.green = colG;
  textColor.rgb.blue = colB;

  //Get a reference to the text item so that we can add the text and format it a bit
  textItemRef = artLayerRef.textItem
  textItemRef.font = fface;
  textItemRef.contents = content;
  textItemRef.color = textColor;
  textItemRef.size = size
  textItemRef.position = new Array(tX, tY) //pixels from the left, pixels from the top
}


function removeConfigLayer(docRef) {
	var configText = "";
	//Check if the text layer is already present (using name "Config Settings")
	//If yes then delete the layer  
	//var docRef = app.activeDocument;

	for(var i = 0 ; i < docRef.layers.length ; i++){
		if (docRef.layers[i].name == "Config Settings") {
			//read the text in the layer and assign to configText so it can be returned to calling function
			configText = docRef.layers[i].textItem.contents;
			docRef.layers[i].remove();
		}
	}	
	//returns the text that was present in the layer, use as needed
	return configText
}

function addConfigLayer(docRef, text) {
	var configText = text;
	//	Create new layer for displaying settings
	// 	Rename the layer "Config Settings"
	//  Generate Data
	//  Write text to Layer	
	createText(docRef,"Arial", 12, 128,128,128, text, 100, 100);
	docRef.activeLayer.name = "Config Settings";
	docRef.activeLayer.textItem.justification = Justification.LEFT;
	docRef.activeLayer.visible = false;
}

function WhoAmI() {
   var where;
   try {
      var FORCEERROR = FORCERRROR;
   }
   catch( err ) {
      where = File(err.fileName);
   }
   return where;
}
