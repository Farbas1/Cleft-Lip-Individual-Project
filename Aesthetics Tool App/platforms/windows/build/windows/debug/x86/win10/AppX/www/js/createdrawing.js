var myDB;

document.addEventListener("deviceready",onDeviceReady,false);
function onDeviceReady(){
	myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});
}
	
function saveDrawing() {
	var drawing = document.getElementById("canvas").toDataURL();
	var pid = sessionStorage.getItem("pid");
	var uploaded = "No";
	var score;
	
	var initial = [];
	var img = new Image();
	img.onload = function() { 
		var canvas = document.createElement('canvas');
		if (img.width%2)
			canvas.width = img.width - 1;
		else canvas.width = img.width;
		
		canvas.height = img.height;
		canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
		
		for (var i = 0; i < canvas.height; i++) {
			initial[i] = [];
		}
		var pixelData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
		var blue = 2;
		for (var i = 0; i < canvas.height; i++) {
			for (var j = 0; j < canvas.width; j++) {
				if (pixelData[blue] != 0) {
					initial[i][j] = 1;
				} else initial[i][j] = 0;
				blue += 4;
			}
		}
		
		
		var left = [];
		var right = [];
		var overlap = [];
		for (var i = 0; i < initial.length; i++) {
			left[i] = [];
			right[i] = [];
			overlap[i] = [];
		}
		
		var ones = 0;
		var twos = 0;
		
	//	console.log("Left: ");
		for (var i = 0; i < initial.length; i++) {
			for (var j = 0; j < initial[0].length / 2; j++) {
				left[i][j] = initial[i][j];
	//			console.log(left[i][j]);
			}
		}

	//	console.log("Right: ");
		for (var i = 0; i < initial.length; i++) {
			for (var j = initial[0].length / 2; j < initial[0].length; j++) {
				right[i][j - initial[0].length / 2] = initial[i][j];
	//			console.log(right[i][j - initial[0].length / 2]);
			}
		}
		
		for (var i = 0; i < right.length; i++) {
			for (var j = 0; j < right[i].length / 2; j++) {
				var temp = right[i][j];
				right[i][j] = right[i][right[i].length - j - 1];
				right[i][right[i].length - j - 1] = temp;
			}
		}
		
	//	console.log("Right mirror: ");
		for (var i = 0; i < initial.length; i++) {
			for (var j = 0; j < right[i].length; j++) {
	//			console.log(right[i][j]);
			}
		}
		
		for (var i = 0; i < left.length; i++) {
			for (var j = 0; j < left[0].length; j++) {
				overlap[i][j] = left[i][j] + right[i][j];
				if (overlap[i][j] == 1) {
					ones++;
				}
				else if (overlap[i][j] == 2) {
					twos++;
				}
			}
		}
		
	//	console.log("Overlap: ");
		for (var i = 0; i < overlap.length; i++) {
			for (var j = 0; j < overlap[i].length; j++) {
	//			console.log(overlap[i][j]);
			}
		}
		
		score = twos / (ones + twos) * 100;
		score = Math.round(score * 100) / 100;
		console.log(score + "%");
		myDB.transaction(function(transaction) {
			transaction.executeSql("INSERT INTO drawings_local (drawing, score, pid, uploaded) VALUES (?,?,?,?)", [drawing, score, pid, uploaded], function(tx, result) {
				sessionStorage.setItem("pid", pid);
				window.open('drawingsscores.html', '_self', false);
			},
			function(error) {
				 navigator.notification.alert('Error occurred'); 
			});
		});
	}
	img.src = drawing;

	
}