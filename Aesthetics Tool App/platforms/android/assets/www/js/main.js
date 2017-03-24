var patients = [];
var myDB;
	
document.addEventListener("deviceready",onDeviceReady,false);
function onDeviceReady() {
	myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});
	myDB.transaction(function(transaction) {
		transaction.executeSql('CREATE TABLE IF NOT EXISTS patients_local (id text, name text, date text, image text)', []);
	});
	myDB.transaction(function(transaction) {
		transaction.executeSql('CREATE TABLE IF NOT EXISTS drawings_local (drawing text, score text, pid text, uploaded text)', []);
	});
	
	//Make container fullscreen         
	function create_paddings() {
		var no_padding = $(window).width();
		function mobile_paddings(){
			$('.content').css('padding-left', '20px');   
			$('.content').css('padding-right', '20px');   
			$('.container-fullscreen, .image-fullscreen').css('margin-left', '-21px');
			$('.container-fullscreen, .image-fullscreen').css('width', no_padding +2);    
		}
		
		function tablet_paddings(){
			$('.content').css('padding-left', '50px');   
			$('.content').css('padding-right', '50px');  
			$('.container-fullscreen, .image-fullscreen').css('margin-left', '-51px');
			$('.container-fullscreen, .image-fullscreen').css('width', no_padding +2);              
		}
		
		if($(window).width() < 766){
			mobile_paddings()
		}        
		if($(window).width() > 766){
			tablet_paddings()
		}
	}

	$(window).resize(function() { 
		create_paddings();
	});
	create_paddings();
	showTable();
}

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

function displayList(arr) {
	var i;
	var out = '';
	for(i = 0; i < arr.length; i++) {
		out += 
		'<div class="activity-item container">' + 
			'<div ng-app="croppy"><img src="' + arr[i].image + '" width="70" height="70" alt="thumbnail"></div>' + 
			'<h2>' + arr[i].name + '</h2>' + 
			'<em>' + arr[i].date + '</em>' + 
			'<a href="#" onclick="myFunction1(\'' + arr[i].id + '\')" class="activity-item-toggle"><i class="fa fa-plus"></i></a>' + 
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
	document.getElementById("id01").innerHTML = out;
}

function sync(id) {
	var uploaded = "No";
	myDB.transaction(function(transaction) {
		transaction.executeSql("SELECT * FROM drawings_local where pid=? AND uploaded=?", [id,uploaded], function(tx, results) {
			if (results.rows.length == 0) {
				 navigator.notification.alert("Already synced");
			}
			else {
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

function viewImage(image) {
	sessionStorage.setItem("link", image); 
	window.open('viewlocalimage.html', '_self', false);
}

function drawingsScores(id) {
	sessionStorage.setItem("pid", id); 
	window.open('drawingsscores.html', '_self', false);
}

function drawing(image, id) {
	sessionStorage.setItem("canvas", image); 
	sessionStorage.setItem("pid", id); 
	window.open('createdrawing.html', '_self', false);
}

function myFunction1(id) {
    document.getElementById("selected" + id).classList.toggle("show");
}

window.onclick = function(event) {
	if (!$(event.target).hasClass('activity-item-toggle')) {
		var dropdowns = document.getElementsByClassName("activity-item-detail");
		var i;
		for (i = 0; i < dropdowns.length; i++) {
			var openDropdown = dropdowns[i];
			if (openDropdown.classList.contains('show')) {
				openDropdown.classList.remove('show');
			}
		}
	}
}

angular.module('croppy', [])
	.directive('croppedImage', function () {
		return {
			restrict: "E",
			replace: true,
			template: "<div class='center-cropped'></div>",
			link: function(scope, element, attrs) {
				var width = attrs.width;
				var height = attrs.height;
				element.css('width', width + "px");
				element.css('height', height + "px");
				element.css('backgroundPosition', 'center center');
				element.css('backgroundRepeat', 'no-repeat');
				element.css('backgroundImage', "url('" + attrs.src + "')");
			}
		}
	});
