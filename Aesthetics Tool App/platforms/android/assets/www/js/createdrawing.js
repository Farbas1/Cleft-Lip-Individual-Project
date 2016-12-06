var ctx, color = "#00FF00";	

document.addEventListener("deviceready",onDeviceReady,false);
function onDeviceReady(){
	newCanvas();
}

  
  
function selectColor(el){
    for(var i=0;i<document.getElementsByClassName("palette").length;i++){
        document.getElementsByClassName("palette")[i].style.borderColor = "#777";
        document.getElementsByClassName("palette")[i].style.borderStyle = "solid";
    }
    el.style.borderColor = "#fff";
    el.style.borderStyle = "dashed";
    color = window.getComputedStyle(el).backgroundColor;
    ctx.beginPath();
    ctx.strokeStyle = color;
}

// prototype to	start drawing on touch using canvas moveTo and lineTo
var drawTouch = function() {
	var start = function(e) {
		ctx.beginPath();
		x = e.changedTouches[0].pageX-3;
		y = e.changedTouches[0].pageY-65;
		ctx.moveTo(x,y);
	};
	var move = function(e) {
		e.preventDefault();
		x = e.changedTouches[0].pageX-3;
		y = e.changedTouches[0].pageY-65;
		ctx.lineTo(x,y);
		ctx.stroke();
	};
    document.getElementById("canvas").addEventListener("touchstart", start, false);
	document.getElementById("canvas").addEventListener("touchmove", move, false);
}; 
    
// prototype to	start drawing on pointer(microsoft ie) using canvas moveTo and lineTo
var drawPointer = function() {
	var start = function(e) {
        e = e.originalEvent;
		ctx.beginPath();
		x = e.pageX-3;
		y = e.pageY-65;
		ctx.moveTo(x,y);
	};
	var move = function(e) {
		e.preventDefault();
        e = e.originalEvent;
		x = e.pageX-3;
		y = e.pageY-65;
		ctx.lineTo(x,y);
		ctx.stroke();
    };
    document.getElementById("canvas").addEventListener("MSPointerDown", start, false);
	document.getElementById("canvas").addEventListener("MSPointerMove", move, false);
};        

// prototype to	start drawing on mouse using canvas moveTo and lineTo
var drawMouse = function() {
	var clicked = 0;
	var start = function(e) {
		clicked = 1;
		ctx.beginPath();
		x = e.pageX-3;
		y = e.pageY-65;
		ctx.moveTo(x,y);
	};
	var move = function(e) {
		if(clicked){
			x = e.pageX-3;
			y = e.pageY-65;
			ctx.lineTo(x,y);
			ctx.stroke();
		}
	};
	var stop = function(e) {
		clicked = 0;
	};
    document.getElementById("canvas").addEventListener("mousedown", start, false);
	document.getElementById("canvas").addEventListener("mousemove", move, false);
	document.addEventListener("mouseup", stop, false);
};
	

	// function to setup a new canvas for drawing
function newCanvas() {
	//define and resize canvas
	var image = getImageLocation('imageLocation');
	alert(image);
    var canvas = '<canvas id="canvas" width="200" height="200" style="margin:3px;background: url(' + image + ');"></canvas>';
	document.getElementById("contentDraw").innerHTML = canvas;
    
    // setup canvas
	ctx=document.getElementById("canvas").getContext("2d");
	ctx.strokeStyle = color;
	ctx.lineWidth = 1;	
	
	// setup to trigger drawing on mouse or touch
    drawTouch();
    drawPointer();
	drawMouse();
}

function saveDrawing() {
	var dataUrl = document.getElementById("canvas").toDataURL();
	var fileTransfer = new FileTransfer();
	var uri = encodeURI(dataUrl);
	var imageName = getImageLocation('imageLocation');
	drawingName = imageName.split('/');
	var fileURL = "///storage/emulated/0/Android/data/com.adobe.phonegap.app/cache/" + drawingName.pop();
	var timeStamp = new Date();
	fileURL = fileURL.replace(".jpg", timeStamp.getTime() + ".png");
	fileTransfer.download(
		uri, fileURL, function(entry) {
			alert("Saved");
			console.log("Save complete");
			//Generate scores function goes here
		},
		
		function(error) {
			alert("Error Saving");
			console.log("Save error");
		},
		
		false, {
			headers: {
				"Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
			}
		}
	);	
}

function getImageLocation(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
