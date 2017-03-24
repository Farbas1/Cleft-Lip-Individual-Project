var drawings = [];
var myDB;
	
document.addEventListener("deviceready",onDeviceReady,false);
function onDeviceReady(){
	myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});
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
	transaction.executeSql('SELECT * FROM drawings_local where pid=?', [sessionStorage.getItem("pid")], function (tx, results) {
		var len = results.rows.length, i;
		for (i = 0; i < len; i++) {
			drawings[i] = {"drawing":results.rows.item(i).drawing, "score":results.rows.item(i).score, "pid":results.rows.item(i).pid, "uploaded":results.rows.item(i).uploaded};
		}
		displayList(drawings);
	}, null);
	});
}

function removeDrawing(drawing) {
	myDB.transaction(function(transaction) {
		transaction.executeSql("DELETE FROM drawings_local where drawing=?", [drawing], function(tx, result) {
			location.reload();
		},
		function(error){ navigator.notification.alert('Something went wrong deleting drawing.');});
	});
}

function displayList(arr) {
	var i;
	var out = '';
	for(i = 0; i < arr.length; i++) {
		out += 
		'<div class="activity-item container">' + 
			'<div ng-app="croppy"><img src="' + arr[i].drawing + '" width="70" height="70" alt="thumbnail"></div>' + 
			'<h2>Symmetry score: ' + arr[i].score + '</h2>' + 
			'<em>Synced with cloud: ' + arr[i].uploaded + '</em>' + 
			'<a href="#" onclick="myFunction1(\'' + arr[i].drawing + '\')" class="activity-item-toggle"><i class="fa fa-plus"></i></a>' + 
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
	document.getElementById("id01").innerHTML = out;
}

function sync(drawing, score, pid, uploaded) {
	if (uploaded == "Yes") {
		 navigator.notification.alert("Already synced");
	}
	else {
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

function viewImage(pid) {
	myDB.transaction(function(transaction) {
		transaction.executeSql('SELECT image FROM patients_local WHERE id=?', [pid], function(tx, result) {
			sessionStorage.setItem("link", result.rows.item(0).image); 
			window.open('localdrawingimage.html', '_self', false);
		},
		function(error){ navigator.notification.alert('Something went Wrong');});
	});
}

function viewDrawing(drawing) {
	sessionStorage.setItem("link", drawing);
	window.open('localdrawingimage.html', '_self', false);
}

function myFunction1(drawing) {
    document.getElementById("selected" + drawing).classList.toggle("show");
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
