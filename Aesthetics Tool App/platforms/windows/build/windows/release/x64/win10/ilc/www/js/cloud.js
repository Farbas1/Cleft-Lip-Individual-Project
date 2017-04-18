// Global database variable and list array
var patients = [];
var myDB;

// Once device is ready, open the database
document.addEventListener("deviceready",onDeviceReady,false);
function onDeviceReady() {
	myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});

	cloudTable();
}

// Obtain the data of the patients that are available for download on the cloud database.
function cloudTable() {
	var count = 0;
	var url = "https://aesthetics-tool.000webhostapp.com/patient_list.php";
	$.getJSON(url, function(result) {
		$.each(result, function(i, field) {
			patients[count] = {"id":field.id, "name":field.name, "date":field.date, "image":field.image};
			count++;
		});
		displayList(patients);
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
						'<td><a href="#" onclick="downloadFile(\'' + arr[i].id + '\', \'' + arr[i].name + '\', \'' + arr[i].date + '\', \'' + arr[i].image + '\')"><i class="fa fa-download"></i> Download</a></td>' + 
					'</tr>' + 
					'<tr>' + 
						'<td><a href="#" onclick="cloudDrawingsScores(\'' + arr[i].id + '\')"><i class="fa fa-bar-chart"></i> View drawings and scores</a></td>' + 
						'<td><a href="#"><i class="fa fa-times"></i> Close</a></td>' + 
					'</tr>' + 
				'</table>' + 
			'</div>' + 
		'</div>' + 
		'<div class="border"></div>';
	}
	
	document.getElementById("list").innerHTML = out;
}

// Displays the selected patient's image
function viewImage(image) {
	sessionStorage.setItem("link", image); 
	window.open('viewcloudimage.html', '_self', false);
}

// Displays all of the cloud drawings for a selected patient
function cloudDrawingsScores(id) {
	sessionStorage.setItem("pid", id); 
	window.open('clouddrawingsscores.html', '_self', false);
}

// Downloads the selected patient
function downloadFile(idDB, nameDB, dateDB, imageDB) {
	var myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});
	
	myDB.transaction(function (tx) {
		tx.executeSql("SELECT id FROM patients_local WHERE id=?", [idDB], function (tx, result) {
			if (result.rows.length == 0) {
				myDB.transaction(function(transaction) {
					var executeQuery = "INSERT INTO patients_local (id, name, date, image) VALUES (?,?,?,?)";             
					transaction.executeSql(executeQuery, [idDB, nameDB, dateDB, imageDB]
						, function(tx, result) {
							 console.log('Inserted');
							  navigator.notification.alert("Downloaded");
						},
						function(error){
							  navigator.notification.alert('Error occurred'); 
						});
				});
			}
			else  navigator.notification.alert("You have already downloaded this image.");
		});
	});
}
