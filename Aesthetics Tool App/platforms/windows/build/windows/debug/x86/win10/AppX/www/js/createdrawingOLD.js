var ctx, color = "#00FF00";	
var myDB;

document.addEventListener("deviceready",onDeviceReady,false);
function onDeviceReady(){
	myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});
	newCanvas();
}
  
function selectColor(el){
    for (var i=0;i<document.getElementsByClassName("palette").length;i++){
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
		x = e.changedTouches[0].pageX+33;
		y = e.changedTouches[0].pageY-25;
		ctx.moveTo(x,y);
	};
	var move = function(e) {
		e.preventDefault();
		x = e.changedTouches[0].pageX+33;
		y = e.changedTouches[0].pageY-25;
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
		x = e.pageX+33;
		y = e.pageY-25;
		ctx.moveTo(x,y);
	};
	var move = function(e) {
		e.preventDefault();
        e = e.originalEvent;
		x = e.pageX+33;
		y = e.pageY-25;
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
		x = e.pageX+33;
		y = e.pageY-25;
		ctx.moveTo(x,y);
	};
	var move = function(e) {
		if(clicked){
			x = e.pageX+33;
			y = e.pageY-25;
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
    var canvas = '<canvas id="canvas" width="400" height="600" style="max-width:98%;margin:3px; background: url(' + sessionStorage.getItem("canvas") + '); background-repeat: no-repeat; background-size: contain;"></canvas>';
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
	var drawing = document.getElementById("canvas").toDataURL();
	var score = generateScore(drawing);
	var pid = sessionStorage.getItem("pid");
	var uploaded = "No";
	myDB.transaction(function(transaction) {
        transaction.executeSql("INSERT INTO drawings_local (drawing, score, pid, uploaded) VALUES (?,?,?,?)", [drawing, score, pid, uploaded], function(tx, result) {
            sessionStorage.setItem("pid", pid);
			window.open('drawingsscores.html');
        },
        function(error) {
			alert('Error occurred'); 
        });
    });
}

function generateScore(drawing) {
	
	return 90;
}

