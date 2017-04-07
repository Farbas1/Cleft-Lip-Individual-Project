// Global database variable and list array
var patients = [];
var myDB;
	
// Once device is ready, open the database and create the relevant tables if they have not been created already 
document.addEventListener("deviceready",onDeviceReady,false);
function onDeviceReady() {
	myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});
	
	myDB.transaction(function(transaction) {
		transaction.executeSql('CREATE TABLE IF NOT EXISTS patients_local (id text, name text, date text, image text)', []);
	});
	myDB.transaction(function(transaction) {
		transaction.executeSql('CREATE TABLE IF NOT EXISTS drawings_local (drawing text, score text, pid text, uploaded text)', []);
	});

	showTable();
}

// Obtain the data of the patients that have been downloaded locally
function showTable() {
	myDB.transaction(function(transaction) {
	transaction.executeSql('SELECT * FROM patients_local', [], function (tx, results) {
		var len = results.rows.length, i;
		for (i = 0; i < len; i++) {
			patients[i] = {"id":results.rows.item(i).id, "name":results.rows.item(i).name, "date":results.rows.item(i).date, "image":results.rows.item(i).image};
		}
		displayList(patients);
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
			'<div ng-app="croppy"><img src="' + arr[i].image + '" width="70" height="70" alt="thumbnail"></div>' + 
			'<h2>' + arr[i].name + '</h2>' + 
			'<em>' + arr[i].date + '</em>' + 
			'<a href="#" onclick="toggle(\'' + arr[i].id + '\')" class="activity-item-toggle" style="font-size:18px;">+</a>' + 
			'<div id="selected' + arr[i].id + '" class="activity-item-detail">' + 
				'<table style="width:100%">' + 
					'<tr>' + 
						'<td><a href="#" onclick="viewImage(\'' + arr[i].image + '\')"><i class="fa fa-picture-o"></i> View image</a></td>' + 
						'<td><a href="#" onclick="sync(\'' + arr[i].id + '\')"><i class="fa fa-refresh"></i> Sync</a></td>' + 
					'</tr>' + 
					'<tr>' + 
						'<td><a href="#" onclick="drawing(\'' + arr[i].image + '\', \'' + arr[i].id + '\')"><i class="fa fa-pencil"></i> Create drawing</a></td>' + 
						'<td><a href="#" onclick="removePatient(\'' + arr[i].id + '\')"><i class="fa fa-trash"></i> Delete</a></td>' + 
					'</tr>' +
					'<tr>' + 
						'<td><a href="#" onclick="drawingsScores(\'' + arr[i].id + '\')"><i class="fa fa-bar-chart"></i> View drawings and scores</a></td>' + 
						'<td><a href="#"><i class="fa fa-times"></i> Close</a></td>' + 
					'</tr>' + 
				'</table>' + 
			'</div>' + 
		'</div>' + 
		'<div class="border"></div>';
	}
	
	document.getElementById("list").innerHTML = out;
}

// Deletes the selected patient and its drawings
function removePatient(id) {
	myDB.transaction(function(transaction) {
		transaction.executeSql("DELETE FROM patients_local where id=?", [id], function(tx, result) {
			myDB.transaction(function(transaction) {
				transaction.executeSql("DELETE FROM drawings_local where pid=?", [id], function(tx, result) {
					location.reload();
				},
				function(error){ navigator.notification.alert('Something went Wrong deleting drawings.');});
			});
		},
		function(error){ navigator.notification.alert('Something went Wrong');});
	});
}

// Uploads all of the selected patient's drawings to the cloud database
function sync(id) {
	var uploaded = "No";
	
	myDB.transaction(function(transaction) {
		transaction.executeSql("SELECT * FROM drawings_local where pid=? AND uploaded=?", [id,uploaded], function(tx, results) {
			if (results.rows.length == 0) {
				 navigator.notification.alert("Already synced");
			} else {
				var success = 1, i;
				uploaded = "Yes";
				
				for (i = 0; i < results.rows.length; i++) {
					var dataString = "drawing=" + results.rows.item(i).drawing + "&score=" + results.rows.item(i).score + "&pid=" + results.rows.item(i).pid + "&uploaded=" + uploaded + "&insert=";
					$.ajax({
						type: "POST",
						url: "https://aesthetics-tool.000webhostapp.com/insert.php",
						data: dataString,
						crossDomain: true,
						cache: false,
						success: function(data) {
							if (data == "success") {
								myDB.transaction(function(transaction) {
									transaction.executeSql("UPDATE drawings_local SET uploaded=? WHERE pid=?", [uploaded,id], function(tx, result) {
									},
									function(error){success = 0;});
								});
							} else if (data == "error") {
								success = 0;
							}
						}
					});
				}
				
				if (success == 1) {
					 navigator.notification.alert("Sync complete");
				} else {
					 navigator.notification.alert("Something went wrong");
				}
			}
		},
		function(error){ navigator.notification.alert('Something went Wrong');});
	});
}

// Displays the selected patient's image
function viewImage(image) {
	sessionStorage.setItem("link", image); 
	window.open('viewlocalimage.html', '_self', false);
}

// Displays all of the local drawings for a selected patient
function drawingsScores(id) {
	sessionStorage.setItem("pid", id); 
	window.open('drawingsscores.html', '_self', false);
}

// Allows the user to draw the trace to create a symmetry score
function drawing(image, id) {
	sessionStorage.setItem("canvas", image); 
	sessionStorage.setItem("pid", id); 
	window.open('createdrawing.html', '_self', false);
}
