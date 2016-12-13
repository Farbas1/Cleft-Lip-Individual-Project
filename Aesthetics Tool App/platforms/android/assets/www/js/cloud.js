$(document).ready(function() {

	var myDB;
	document.addEventListener("deviceready",onDeviceReady,false);
	function onDeviceReady() {
		myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});	
	}
	
    //Activity Item Toggle
    $('.activity-item').click(function(){
		$(this).find('.activity-item-detail').slideToggle(200); 
    });

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
	
});

function getImageLocation(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
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

function myFunction(arr) {
	var i;
	var out = '';
	for(i = 0; i<arr.length; i++) {
		out += 
		'<div class="activity-item container">' + 
			'<div ng-app="croppy"><img src="' + arr[i].image + '" alt="thumbnail"></img></div>' + 
			'<h2>' + arr[i].name + '</h2>' + 
			'<em>' + arr[i].date + '</em>' + 
			'<a href="#" class="activity-item-toggle"><i class="fa fa-plus"></i></a>' + 
			'<div class="activity-item-detail">' + 
				'<table style="width:100%">' + 
					'<tr>' + 
						'<td><a href="viewcloudimage.html?imageLocation=' + arr[i].image + '"><i class="fa fa-picture-o"></i> View image</a></td>' + 
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
						'<td><a href="drawingsscores.html"><i class="fa fa-bar-chart"></i> View drawings and scores</a></td>' + 
						'<td><a href="#"><i class="fa fa-times"></i> Close</a></td>' + 
					'</tr>' + 
				'</table>' + 
			'</div>' + 
		'</div>' + 
		'<div class="border"></div>';
	}
	document.getElementById("id01").innerHTML = out;
} 
// Use toast for download notifications
function downloadFile(idDB, nameDB, imageDB, imageLink) {
	var fileTransfer = new FileTransfer();
	var uri = encodeURI(imageLink);
	imageName = imageLink.split('/');
	var fileURL = "///storage/emulated/0/Android/data/com.adobe.phonegap.app/cache/" + imageName.pop();
	
	fileTransfer.download(
		uri, fileURL, function(entry) {
			alert("Downloaded");
			console.log("Download complete");
			insert(idDB, nameDB, imageDB, fileURL);
		},
		
		function(error) {
			alert("Error downloading");
			console.log("Download error");
		},
		
		false, {
			headers: {
				"Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
			}
		}
	);
}

function insert(idDB, nameDB, imageDB, fileURL) {
	var myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});
	var id = idDB;
	var name = nameDB;
	var date = imageDB;
	var image = fileURL;
	console.log(id + " " + name + " " + date + " " + image);
	myDB.transaction(function(transaction) {
		var executeQuery = "INSERT INTO phonegap_pro (id, name, date, image) VALUES (?,?,?,?)";             
		transaction.executeSql(executeQuery, [id, name, date, image]
			, function(tx, result) {
				 console.log('Inserted');
			},
			function(error){
				 alert('Error occurred'); 
			});
	});
}