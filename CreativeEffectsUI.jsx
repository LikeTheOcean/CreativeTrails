/**  
  * @scriptName  Creative Effects UI 2.0
  * @lisence Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) http://creativecommons.org/licenses/by-nc-sa/4.0/
  * @desc This script  sets the layers to Lighten and applies creative progressive Opacity
  * @prerequisite  Use Photoshop built in Script "Load Files into Stack" to open up all the files as layers or Select all and "Open as Layer in Photoshop" from Lightroom
  * @author Sathya sathya@liketheocean.com 
  * @release Sept 2014, Ver 2.0 Beta
  * @latestVersion http://liketheocean.com/night-photography/
  *
  * @newFeatures 
  * UI for the script
  * Two more effects BaseballBat (left to right, right to left)
  *  
*/  

// Uncomment the next line to show the debugger
//$.level = 1; debugger;

//Read the environment values
var defaultRulerUnits = preferences.rulerUnits; 
preferences.rulerUnits = Units.PIXELS;

// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop
// in case we double clicked the file
app.bringToFront();
main();

//Reset the environment values
preferences.rulerUnits = defaultRulerUnits;
//////////////////////////////////////////////////////////////////////////////////////////

// Function Calls including main() below ....
function main() {
	// reference active document
	var docRef = app.activeDocument;
	var myWindow = new Window ("dialog", "Creative Effects UI 2.0", undefined, {closeButton: true});

	// Define and Display the UI for the script
	// Group 1 - Template Drop down menu for Blend Mode Select
	// Set it to right alignment
	var myInputGroup1 = myWindow.add ("group");
	myInputGroup1.add ("statictext", undefined, "Blend Mode    :");
	myInputGroup1.alignment = "left";
	var blendMode = myInputGroup1.add ("dropdownlist", undefined, ["Lighten","Screen", "Normal", "SKIP                             "]);
	blendMode.selection = 3;

	// Group 2 - Template Drop down menu for Creative Mode Select
	// Set it to right alignment
	var myInputGroup2 = myWindow.add ("group");
	myInputGroup2.add ("statictext", undefined, "Creative Style :");
	myInputGroup2.alignment = "left";
	var creativeStyle = myInputGroup2.add ("dropdownlist", undefined, ["Comet Style - left to right", "Comet Style - right to left","Saucer Style","Space ship Style","Baseball Bat - left to right","Baseball Bat right to left","RESET","SKIP"]);
	creativeStyle.selection = 0;
	 
	//Separator
	 var dummyInputGroup = myWindow.add ("group");
	 myWindow.add ("panel", [0,0,250,3]);
		
	var myButtonGroup1 = myWindow.add ("group");
	myButtonGroup1.alignment = "right";
	//myButtonGroup1.add ("button", undefined, "OK");
	myButtonGroup1.add ("button", undefined, "Run Script", {name: "OK"});
	myButtonGroup1.add ("button", undefined, "Cancel"); 

	var myButtonGroup2 = myWindow.add ("group");
	myButtonGroup2.alignment = "right";
	var HelpButton = myButtonGroup2.add ("button", undefined, "Help");
	HelpButton.onClick = function () {openInBrowser("http://www.LikeTheOcean.com/");}

	///////////////////////////////////////////////////////////////////////////////////////
	// Identify when the dropdownlist is changed and act on the same - Creative Style
	var creativeStyleValue = 1;
	creativeStyle.onChange = function (){
		switch(creativeStyle.selection.text) {
			case "Comet Style - left to right": 
				creativeStyleValue = 1;
				break;
			case "Comet Style - right to left":
				creativeStyleValue = 2;			
				break;
			case "Saucer Style": 
				creativeStyleValue = 3;			
				break;
			case "Space ship Style": 
				creativeStyleValue = 4;
				break;
			case "Baseball Bat - left to right":
				creativeStyleValue = 5;		
				break;
			case "Baseball Bat right to left": 
				creativeStyleValue = 6;			
				break;
			case "RESET": 
				creativeStyleValue = 99;			
				break;
			case "SKIP": 
				creativeStyleValue = 0;			
				break;
			default : 
				alert("case 999");
		}
	}

	// Identify when the dropdownlist is changed and act on the same - Blend Mode
	var blendModeValue = 0;
	blendMode.onChange = function (){
		switch(blendMode.selection.text) {
			case "Lighten": 
				blendModeValue = 1;
				break;
			case "Screen":
				blendModeValue = 2;			
				break;
			case "Normal": 
				blendModeValue = 3;			
				break;
			case "SKIP                             ": 
				blendModeValue = 0;
				break;
			default : 
				alert("case 999");
		}
	}

	if (myWindow.show () == 1) {
		var configText = "";
		configText = removeConfigLayer(docRef);
		// Call the main function
		mainProg(docRef,blendModeValue,creativeStyleValue);
		var settingText = "StarTrailCreativeUI 6.0\r";
		settingText = settingText.concat("Blend Mode     : ",blendMode.selection.text,"\r");
		settingText = settingText.concat("Creative Style : ",creativeStyle.selection.text,"\r");
		configText = configText.concat(settingText,"\r");
		addConfigLayer(docRef,configText);
	} else {
	//	do nothing if it is cancelled
	}
} // end of function main

//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

function mainProg(docRef,blendModeValue, creativeStyleValue) {
	//BLEND MODE Variable , Defaults to Lighten Mode
	// LIGHTEN is the best option for star processing. Results might not be pleasing if changed
	// Variable added for future needs
	//0 -> Do not change
	//1 -> LIGHTEN
	//2 -> SCREEN
	//3 -> NORMAL
	BLEND_MODE = 0;	

	//Design Style Variable
	// 0 -> merges all shots with set BLEND MODE, no other creative processing 
	// 1 -> Comet Style left to right (light to dark)
	// 2 -> Comet Style right to left
	// 3 -> Saucer Style
	// 4 -> Space ship Style 
	// 5 -> Baseball Bat left to right
	// 6 -> Baseball Bat right to left
	// 99 -> Reset the creative style , all to 100% opacity
	CREATIVE_STYLE = 1;
	//Set value that is being passed from function call
	BLEND_MODE = blendModeValue;
	CREATIVE_STYLE = creativeStyleValue;	

	// Constants
	MAX_OPACITY = 100 ;

	// Calculate Program Variables
	// Program Variables
	//var doc = app.activeDocument;
	var doc = docRef;
	var numberOfLayers = doc.layers.length;
	var myIncrements = (MAX_OPACITY / numberOfLayers)*2 ;
	var myOpacity = 0;
	var trailLength = 0;
	var i =0 ; //loop Variable


	// Set the Blend Mode of all layers ////////////////////////////////////
	if (BLEND_MODE == 0) {
		// do nothing
	} else if (BLEND_MODE == 1) {
//		alert("Set Blend Mode to LIGHTEN");
		for(var i = 0 ; i < numberOfLayers;i++){
			doc.layers[i].blendMode = BlendMode.LIGHTEN;
			doc.layers[i].opacity = 100;
		}
	} else if (BLEND_MODE == 2) {
//		alert("Set Blen Mode to SCREEN");
		for(var i = 0 ; i < numberOfLayers;i++){
			doc.layers[i].blendMode = BlendMode.SCREEN;
			doc.layers[i].opacity = 100;		
		}
	} else if (BLEND_MODE == 3) {
//		alert("Set Blen Mode to NORMAL");
		for(var i = 0 ; i < numberOfLayers;i++){
			doc.layers[i].blendMode = BlendMode.NORMAL;
			doc.layers[i].opacity = 100;		
		}
	} else {
	// Defaults to LIGHTEN MODE
//		alert("Default to Blend Mode LIGHTEN");
		for(var i = 0 ; i < numberOfLayers;i++){
			doc.layers[i].blendMode = BlendMode.LIGHTEN;
			doc.layers[i].opacity = 100;		
		}
	}
	// End Set the Blend Mode of all layers /////////////////////////////////


	// Creative Processing
	if (CREATIVE_STYLE == 0) {
		// do nothing apart from normal Blending
	} else if (CREATIVE_STYLE == 1) {
		// Comet Style - right to left
//		alert("Creative Sytle - 1 - Comet right to left");
		numberOfLayers = doc.layers.length;
		myOpacity = 0;
		myIncrements = MAX_OPACITY / numberOfLayers ;	
		trailLength = numberOfLayers;

		// Set the creative effects
		for(var i = 0 ; i < trailLength;i++){
			myOpacity = myOpacity + myIncrements ; 
			if (myOpacity > 100) {myOpacity = 100 ;} 
			doc.layers[i].opacity = myOpacity;
		}
	} else if (CREATIVE_STYLE == 2) {
		// Comet Style - left to right
//		alert("Creative Sytle - 2 - Comet left to right");
		numberOfLayers = doc.layers.length;
		myOpacity = 100;
		myIncrements = MAX_OPACITY / numberOfLayers ;	
		trailLength = numberOfLayers;

		// Set the creative effects
		for(var i = 0 ; i < trailLength;i++){
			if (myOpacity < 0) {myOpacity = 0 ;} 
			doc.layers[i].opacity = myOpacity;
			myOpacity = myOpacity - myIncrements ; 		
		}
	} else if (CREATIVE_STYLE == 3) {
		//Creative Style 3	
//		alert("Creative Sytle - 3 - Saucer Style");
		alert("Effect will be pronounced only if there is atleast 25 frames");
		numberOfLayers = doc.layers.length;
		
		//The trail length needs to be odd for calculation purpose. Drop last frame if needed
		if (numberOfLayers % 2 == 0) {
//			alert("One frame ignored for smooth transition, by setting Opacity to Zero");
			trailLength = numberOfLayers - 1 ;
			doc.layers[trailLength].opacity = 0;
		} else {
			trailLength = numberOfLayers;
		}

		// Draw the first Half
		myOpacity = 0;
		myIncrements = MAX_OPACITY / ((trailLength-5)/2) ;
		for(i = 0 ; i < (trailLength-5)/2 ; i++){
			myOpacity = myOpacity + myIncrements ; 
			if (myOpacity > 100) {myOpacity = 100 ;} 
			doc.layers[i].opacity = myOpacity;
		}

		//Full Opacity for middle 5 frames
		//set opracity of middle 5 frames to zero
		myOpacity = 100;
		for(i = i ; i < ((trailLength-5)/2)+5; i++){
			doc.layers[i].opacity = myOpacity;
		}

		// Draw the second half
		myOpacity = 100;
		myIncrements = MAX_OPACITY / ((trailLength-5)/2) ;	
		for(i = i ; i < trailLength;i++){
			if (myOpacity < 0) {myOpacity = 0 ;}	
			doc.layers[i].opacity = myOpacity;
			myOpacity = myOpacity - myIncrements ; 
			
		}
	} else if (CREATIVE_STYLE == 4) {
		//Creative Style 4	
//		alert("Creative Sytle - 4 - Star Ship Style");
		alert("Effect will be pronounced only if there is atleast 25 frames");
		numberOfLayers = doc.layers.length;
		
		//The trail length needs to be odd for calculation purpose. Drop last frame if needed
		if (numberOfLayers % 2 == 0) {
//			alert("One frame ignored for smooth transition, by setting Opacity to Zero");
			trailLength = numberOfLayers - 1 ;
			doc.layers[trailLength].opacity = 0;
		} else {
			trailLength = numberOfLayers;
		}

		// Draw the first Half
		myOpacity = 0;
		myIncrements = MAX_OPACITY / ((trailLength-5)/2) ;
		for(i = 0 ; i < (trailLength-5)/2 ; i++){
			myOpacity = myOpacity + myIncrements ; 
			if (myOpacity > 100) {myOpacity = 100 ;}		
			doc.layers[i].opacity = myOpacity;
		}

		//Full Opacity for middle 5 frames
		//set opracity of middle 5 frames to zero
		myOpacity = 0;
		for(i = i ; i < ((trailLength-5)/2)+5; i++){
			doc.layers[i].opacity = myOpacity;
		}

		// Draw the second half
		myOpacity = 100;
		myIncrements = MAX_OPACITY / ((trailLength-5)/2) ;	
		for(i = i ; i < trailLength;i++){
			if (myOpacity < 0) {myOpacity = 0 ;}
			doc.layers[i].opacity = myOpacity;
			myOpacity = myOpacity - myIncrements ; 
			
		}
	} else if (CREATIVE_STYLE == 5) {
		// Baseball Bat Style - right to left
//		alert("Creative Sytle - 5 - Baseball Bat right to left");
		numberOfLayers = doc.layers.length;
		myOpacity = 0;
		myIncrements = MAX_OPACITY / numberOfLayers ;	
		trailLength = numberOfLayers;

		// Set the creative effects
		for(var i = 0 ; i < trailLength;i++){
			myOpacity = myOpacity + myIncrements ; 
			if (myOpacity > 100) {myOpacity = 100 ;} 
			doc.layers[i].opacity = myOpacity;
		}
		// baseball bat head
		doc.layers[0].opacity = 100;
	} else if (CREATIVE_STYLE == 6) {
		// Baseball Bat Style - left to right
//		alert("Creative Sytle - 6 - Baseball Bat left to right");
		numberOfLayers = doc.layers.length;
		myOpacity = 100;
		myIncrements = MAX_OPACITY / numberOfLayers ;	
		trailLength = numberOfLayers;

		// Set the creative effects
		for(var i = 0 ; i < trailLength;i++){
			if (myOpacity < 0) {myOpacity = 0 ;} 
			doc.layers[i].opacity = myOpacity;
			myOpacity = myOpacity - myIncrements ; 		
		}
		// baseball bat head
		doc.layers[i-1].opacity = 100;
	} else if (CREATIVE_STYLE == 99) {
		// Reset the creative style to null, basically sets the layer opacity to 100 for all 
//		alert("Creative Sytle - 99 - Reset");
		numberOfLayers = doc.layers.length;
		myOpacity = 100;
		trailLength = numberOfLayers;

		// Set the creative effects
		for(var i = 0 ; i < trailLength;i++){
			doc.layers[i].opacity = myOpacity;
		}
	} else {
		alert("Exception");
	}
// End Main Prog
}


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
