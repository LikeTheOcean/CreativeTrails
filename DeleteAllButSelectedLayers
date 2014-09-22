/**  
  * @scriptName Delete All But Selected Layers 2.0
  * @license Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) http://creativecommons.org/licenses/by-nc-sa/4.0/
  * @desc This script deletes all the layers except the selected layers
  * @prerequisite  File open with multiple layers
  * @author Sathya sathya@liketheocean.com 
  * @release Sept 2014, Ver 2.0 Beta
  * @latestVersion http://liketheocean.com/night-photography/
  *
  * @limitation Currently reads only the high level layers, had not been tested with folders and sub layers
  * @attribution based on Code from https://forums.adobe.com/message/4259664
*/  

// defined for the Vortex function that uses Transform and Set
// Global 
cTID = function(s) { return app.charIDToTypeID(s); };
sTID = function(s) { return app.stringIDToTypeID(s); };

// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop
// in case we double clicked the file
app.bringToFront();
main();

function main(){
	if(!documents.length) return;  
	var docRef = activeDocument;  
	//deleteSelectedLayers(docRef);
	deleteAllButSelectedLayers(docRef);	
}

function deleteSelectedLayers(docRef) {
	//read the selected layer position
	// iterate thru all layers and delete all but the selected layers
	var selectedLayerName = docRef.activeLayer.name;
	var totalNumLayers = docRef.layers.length;
	var layersSelected = getSelectedLayersIdx();
	var layerIDs=[];  

	for(var d =0;d<layersSelected.length;d++){ layerIDs.push([[layersSelected[d]],["N"]]);}  

	var toDelete=[];  
	for(var l in layerIDs){  
		if(layerIDs[l][1].toString() == "N") {  
			toDelete.push(getIDX(Number(layerIDs[l][0])));  
        }  
    }
	for(var t in toDelete){  
        selLayer(Number(toDelete[t]));  
        docRef.activeLayer.remove();  
    }
}

function deleteAllButSelectedLayers(docRef) {
	//read the selected layers into an array
	var myLayersSelected=getSelectedLayersIdx();  
	//var mylayerIDs=[];  
	//for(var d =0;d<mylayersSelected.length;d++){ mylayerIDs.push([[mylayersSelected[d]],["N"]]);}  

	//select all layer and load IDs into array
	selectAllLayers();  
	var allLayers=getSelectedLayersIdx();  
	var layerIDs=[];  
	for(var d =0;d<allLayers.length;d++){ layerIDs.push([[allLayers[d]],["N"]]);}  	
	
	// iterate thru all layers and mark ones to be deleted
	for(var z in allLayers){  
		for(var s in myLayersSelected){  
			if(Number(allLayers[z]) == Number(myLayersSelected[s])){  
				layerIDs[z][1] = "Y";   
				break; 
			}  
		}  
	}    	
	
	//deleted marked layers
		var toDelete=[];  
	for(var l in layerIDs){  
		if(layerIDs[l][1].toString() == "N") {  
			toDelete.push(getIDX(Number(layerIDs[l][0])));  
        }  
    }
	for(var t in toDelete){  
        selLayer(Number(toDelete[t]));  
        docRef.activeLayer.remove();  
    }
}

function selectAllLayers(layer) {  
	if(layer == undefined) 
		layer = 0;  
	topLayer=true;  
	if(!activeDocument.layers[0].visible){  
		topLayer=false;  
	}  
	activeDocument.activeLayer = activeDocument.layers[activeDocument.layers.length-1];  
	if(activeDocument.activeLayer.isBackgroundLayer)   
		if(!activeDocument.layers[activeDocument.layers.length-2].visible){  
			activeDocument.activeLayer = activeDocument.layers[activeDocument.layers.length-2];  
			activeDocument.activeLayer.visible=false;  
		}else{  
			activeDocument.activeLayer = activeDocument.layers[activeDocument.layers.length-2];  
		}  
	var BL = activeDocument.activeLayer.name;  
	activeDocument.activeLayer = activeDocument.layers[layer];  
	var desc5 = new ActionDescriptor();  
	var ref3 = new ActionReference();  
	ref3.putName( charIDToTypeID('Lyr '), BL);  
	desc5.putReference( charIDToTypeID('null'), ref3 );  
	desc5.putEnumerated( stringIDToTypeID('selectionModifier'), stringIDToTypeID('selectionModifierType'), stringIDToTypeID('addToSelectionContinuous') );  
	desc5.putBoolean( charIDToTypeID('MkVs'), false );  
	executeAction( charIDToTypeID('slct'), desc5, DialogModes.NO );  
	if(!topLayer) 
		activeDocument.layers[0].visible=false;  
};

function getIDX(idx) {  
    var ref = new ActionReference();   
    ref.putProperty( charIDToTypeID("Prpr") , stringIDToTypeID( "layerID" ));   
    ref.putIndex( charIDToTypeID( "Lyr " ), idx );   
    return executeActionGet(ref).getInteger(stringIDToTypeID( "layerID" ));  
};

function selLayer(layerID,add){  
	var result =getLayerItemIndexByLayerID(layerID);  
	if(result > 0){  
		try{   
			activeDocument.backgroundLayer;  
			var bkGround = 1;  
		}catch(e) {var bkGround = 0;}  
	selectLayerByIndex(result - bkGround ,add);  
	}else{  
		alert("Layer does not exist");    
	}  
};

function getLayerItemIndexByLayerID(id) {   
	var ref = new ActionReference();   
    ref.putProperty( charIDToTypeID("Prpr") , charIDToTypeID( "ItmI" ));   
    ref.putIdentifier( charIDToTypeID( "Lyr " ), id );   
	try{  
		return executeActionGet(ref).getInteger(charIDToTypeID( "ItmI" ));  
	}catch(e){return true;}  
};  
  

function selectLayerByIndex(index,add){   
   add = (add == undefined)  ? add = false : add;  
	var ref = new ActionReference();  
    ref.putIndex(charIDToTypeID("Lyr "), index);  
    var desc = new ActionDescriptor();  
    desc.putReference(charIDToTypeID("null"), ref );  
         if(add) desc.putEnumerated( stringIDToTypeID( "selectionModifier" ), stringIDToTypeID( "selectionModifierType" ), stringIDToTypeID( "addToSelection" ) );   
      desc.putBoolean( charIDToTypeID( "MkVs" ), false );   
     try{  
    executeAction(charIDToTypeID("slct"), desc, DialogModes.NO );  
}catch(e){}  
};  
  
function getSelectedLayersIdx(){  
   var selectedLayers = new Array;  
   var ref = new ActionReference();  
   ref.putEnumerated( charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );  
   var desc = executeActionGet(ref);  
   if( desc.hasKey( stringIDToTypeID( 'targetLayers' ) ) ){  
      desc = desc.getList( stringIDToTypeID( 'targetLayers' ));  
       var c = desc.count   
       var selectedLayers = new Array();  
       for(var i=0;i<c;i++){  
         try{   
            activeDocument.backgroundLayer;  
            selectedLayers.push(  desc.getReference( i ).getIndex() );  
         }catch(e){  
            selectedLayers.push(  desc.getReference( i ).getIndex()+1 );  
         }  
       }  
    }else{  
      var ref = new ActionReference();   
      ref.putProperty( charIDToTypeID("Prpr") , charIDToTypeID( "ItmI" ));   
      ref.putEnumerated( charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );  
      try{   
         activeDocument.backgroundLayer;  
         selectedLayers.push( executeActionGet(ref).getInteger(charIDToTypeID( "ItmI" ))-1);  
      }catch(e){  
         selectedLayers.push( executeActionGet(ref).getInteger(charIDToTypeID( "ItmI" )));  
      }  
   }  
   return selectedLayers;  
};
