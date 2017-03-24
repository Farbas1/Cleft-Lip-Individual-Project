var patients = [];
var myDB;

document.addEventListener("deviceready",onDeviceReady,false);
function onDeviceReady() {
	myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});
	//Make container fullscreen         
	function create_paddings(){
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
	var url = "https://aesthetics-tool.000webhostapp.com/json.php";
	$.getJSON(url, function(result) {
		$.each(result, function(i, field) {
			patients[count] = {"id":field.id, "name":field.name, "date":field.date, "image":field.image};
			count++;
		});
		displayList(patients);
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
						'<td><a href="#" onclick="downloadFile(';
						out +=
						"'" + arr[i].id + "', ";
						out +=
						"'" + arr[i].name + "', ";
						out += 
						"'" + arr[i].date + "', ";
						out += 
						"'" + arr[i].image + "'" + 
						')"><i class="fa fa-download"></i> Download</a></td>' + 
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
	document.getElementById("id01").innerHTML = out;
}

function viewImage(image) {
	sessionStorage.setItem("link", image); 
	window.open('viewcloudimage.html', '_self', false);
}

function cloudDrawingsScores(id) {
	sessionStorage.setItem("pid", id); 
	window.open('clouddrawingsscores.html', '_self', false);
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

