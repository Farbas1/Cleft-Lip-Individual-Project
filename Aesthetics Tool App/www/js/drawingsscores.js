// Global database variable and list array
var drawings = [];
var myDB;

// Once device is ready, open the database
document.addEventListener("deviceready",onDeviceReady,false);
function onDeviceReady() {
	myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});

	showTable();
}

// Obtain the data of the drawings that have been saved locally for a selected patient
function showTable() {
	myDB.transaction(function(transaction) {
	transaction.executeSql('SELECT * FROM drawings_local where pid=?', [sessionStorage.getItem("pid")], function (tx, results) {
		var len = results.rows.length, i;
		
		for (i = 0; i < len; i++) {
			drawings[i] = {"drawing":results.rows.item(i).drawing, "score":results.rows.item(i).score, "pid":results.rows.item(i).pid, "uploaded":results.rows.item(i).uploaded};
		}
		
		displayList(drawings);
	}, null);
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
			'<em>Synced with cloud: ' + arr[i].uploaded + '</em>' + 
			'<a href="#" onclick="toggle(\'' + arr[i].drawing + '\')" class="activity-item-toggle" style="font-size:18px;">+</a>' + 
			'<div id="selected' + arr[i].drawing + '" class="activity-item-detail">' + 
				'<table style="width:100%">' + 
					'<tr>' + 
						'<td><a href="#" onclick="viewImage(\'' + arr[i].pid + '\')"><i class="fa fa-picture-o"></i> View image</a></td>' + 
						'<td><a href="#" onclick="sync(\'' + arr[i].drawing + '\', \'' + arr[i].score + '\', \'' + arr[i].pid + '\', \'' + arr[i].uploaded + '\')"><i class="fa fa-refresh"></i> Sync</a></td>' + 
					'</tr>' + 
					'<tr>' + 
						'<td><a href="#" onclick="viewDrawing(\'' + arr[i].drawing + '\')"><i class="fa fa-pencil"></i> View drawing</a></td>' + 
						'<td><a href="#" onclick="removeDrawing(\'' + arr[i].drawing + '\')"><i class="fa fa-trash"></i> Delete</a></td>' + 
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

// Deletes the selected drawing
function removeDrawing(drawing) {
	myDB.transaction(function(transaction) {
		transaction.executeSql("DELETE FROM drawings_local where drawing=?", [drawing], function(tx, result) {
			location.reload();
		},
		function(error){ navigator.notification.alert('Something went wrong deleting drawing.');});
	});
}

// Uploads the selected drawing to the cloud database
function sync(drawing, score, pid, uploaded) {
	if (uploaded == "Yes") {
		 navigator.notification.alert("Already synced");
	} else {
		uploaded = "Yes";
		var dataString = "drawing=" + encodeURIComponent(drawing) + "&score=" + score + "&pid=" + pid + "&uploaded=" + uploaded + "&insert=";
		
		$.ajax({
			type: "POST",
			url: "https://aesthetics-tool.000webhostapp.com/insert.php",
			data: dataString,
			crossDomain: true,
			cache: false,
			success: function(data) {
				if (data == "success") {
					navigator.notification.alert("synced");
					myDB.transaction(function(transaction) {
						transaction.executeSql("UPDATE drawings_local SET uploaded=? WHERE drawing=?", [uploaded,drawing], function(tx, result) {
							location.reload();
						},
						function(error){ navigator.notification.alert('Something went wrong');});
					});
				} else if (data == "error") {
					 navigator.notification.alert("Error syncing");
				}
			}
		});
	}
}

// Displays the selected patient's image
function viewImage(pid) {
	myDB.transaction(function(transaction) {
		transaction.executeSql('SELECT image FROM patients_local WHERE id=?', [pid], function(tx, result) {
			sessionStorage.setItem("link", result.rows.item(0).image); 
			window.open('localdrawingimage.html', '_self', false);
		},
		function(error){ navigator.notification.alert('Something went Wrong');});
	});
}

// Displays the selected drawing
function viewDrawing(drawing) {
	sessionStorage.setItem("link", drawing);
	window.open('localdrawingimage.html', '_self', false);
}
