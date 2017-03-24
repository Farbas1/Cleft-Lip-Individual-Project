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
	cloudTable();
}

function cloudTable() {
	var count = 0;
	var url = "https://aesthetics-tool.000webhostapp.com/jsondrawing.php";
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

function displayList(arr) {
	var i;
	var out = '';
	for(i = 0; i < arr.length; i++) {
		out += 
		'<div class="activity-item container">' + 
			'<div ng-app="croppy"><img src="' + arr[i].drawing + '" width="70" height="70" alt="thumbnail"></div>' + 
			'<h2>Symmetry score: ' + arr[i].score + '</h2>' + 
			'<em>Cloud drawing</em>' + 
			'<a href="#" onclick="myFunction1(\'' + arr[i].drawing + '\')" class="activity-item-toggle"><i class="fa fa-plus"></i></a>' + 
			'<div id="selected' + arr[i].drawing + '" class="activity-item-detail">' + 
				'<table style="width:100%">' + 
					'<tr>' + 
						'<td><a href="#" onclick="viewDrawing(\'' + arr[i].drawing + '\')"><i class="fa fa-pencil"></i> View drawing</a></td>' + 
						'<td><a href="#" onclick="downloadFile(';
						out +=
						"'" + arr[i].drawing + "', ";
						out +=
						"'" + arr[i].score + "', ";
						out += 
						"'" + arr[i].pid + "'" + 
						')"><i class="fa fa-download"></i> Download</a></td>' + 
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

function viewDrawing(drawing) {
	sessionStorage.setItem("link", drawing);
	window.open('localdrawingimage.html', '_self', false);
}

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
						function(error){
							  navigator.notification.alert('Error occurred'); 
						});
				});
			}
			else  navigator.notification.alert("You have already downloaded this image.");
		});
	});
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
