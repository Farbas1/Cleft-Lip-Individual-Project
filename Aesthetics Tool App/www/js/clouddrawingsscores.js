// Global database variable and list array
var drawings = [];
var myDB;

// Once device is ready, open the database
document.addEventListener("deviceready",onDeviceReady,false);
function onDeviceReady() {
	myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});

	cloudTable();
}

// Obtain the data of the drawings that have been uploaded to the cloud database for a selected patient
function cloudTable() {
	var count = 0;
	var url = "https://aesthetics-tool.000webhostapp.com/drawing_list.php";
	
	$.getJSON(url, function(result) {
		$.each(result, function(i, field) {
			if (field.pid == sessionStorage.getItem("pid")) {
				drawings[count] = {"drawing":field.drawing, "score":field.score, "pid":field.pid};
				count++;
			}
		});
		
		displayList(drawings);
	});
}

// Displays the list of data obtained with selectable options
function displayList(arr) {
	var i;
	var out = '';
	
	for (i = 0; i < arr.length; i++) {
		out += 
		'<div class="activity-item container">' + 
			'<div ng-app="croppy"><img src="' + arr[i].drawing + '" width="70" height="70" alt="thumbnail"></div>' + 
			'<h2>Symmetry score: ' + arr[i].score + '</h2>' + 
			'<em>Cloud drawing</em>' + 
			'<a href="#" onclick="toggle(\'' + arr[i].drawing + '\')" class="activity-item-toggle" style="font-size:18px;">+</a>' + 
			'<div id="selected' + arr[i].drawing + '" class="activity-item-detail">' + 
				'<table style="width:100%">' + 
					'<tr>' + 
						'<td><a href="#" onclick="viewDrawing(\'' + arr[i].drawing + '\')"><i class="fa fa-pencil"></i> View drawing</a></td>' + 
						'<td><a href="#" onclick="downloadFile(\'' + arr[i].drawing + '\', \'' + arr[i].score + '\', \'' + arr[i].pid + '\')"><i class="fa fa-download"></i> Download</a></td>' + 
					'</tr>' +
					'<tr>' + 
						'<td><a href="#"><i class="fa fa-times"></i> Close</a></td>' + 
					'</tr>' + 
				'</table>' + 
			'</div>' + 
		'</div>' + 
		'<div class="border"></div>';
	}
	
	document.getElementById("list").innerHTML = out;
}

// Displays the selected drawing
function viewDrawing(drawing) {
	sessionStorage.setItem("link", drawing);
	window.open('clouddrawingimage.html', '_self', false);
}

// Downloads the selected drawing
function downloadFile(drawingDB, scoreDB, pidDB) {
	var myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});
	var uploaded = "Yes";
	
	myDB.transaction(function (tx) {
		tx.executeSql("SELECT drawing FROM drawings_local WHERE drawing=?", [drawingDB], function (tx, result) {
			if (result.rows.length == 0) {
				myDB.transaction(function(transaction) {
					transaction.executeSql("INSERT INTO drawings_local (drawing, score, pid, uploaded) VALUES (?,?,?,?)", [drawingDB, scoreDB, pidDB, uploaded], function(tx, result) {
						navigator.notification.alert("Downloaded");
					},
					function(error) {
						navigator.notification.alert('Error occurred'); 
					});
				});
			}
			else  navigator.notification.alert("You have already downloaded this image.");
		});
	});
}
