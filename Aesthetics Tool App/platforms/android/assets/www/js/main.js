var patients = [];
$(document).ready(function() {

	var myDB;
	
	document.addEventListener("deviceready",onDeviceReady,false);
	function onDeviceReady(){
		myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});
		myDB.transaction(function(transaction) {
			transaction.executeSql('CREATE TABLE IF NOT EXISTS phonegap_pro (name text, date text, image text)', []);
		});
		showTable();
	}

	function showTable() {
		myDB.transaction(function(transaction) {
		transaction.executeSql('SELECT * FROM phonegap_pro', [], function (tx, results) {
			var len = results.rows.length, i;
			for (i = 0; i < len; i++) {
				patients[i] = {"name":results.rows.item(i).name, "date":results.rows.item(i).date, "image":results.rows.item(i).image};
			}
			myFunction(patients);
		}, null);
		});
	}
	
	function removePatient(name){
	  alert(name);
	  myDB.transaction(function(transaction) {
		var executeQuery = "DELETE FROM phonegap_pro where name=?";
		transaction.executeSql(executeQuery, [name],
		  //On Success
		  function(tx, result) {alert('Deleted successfully');},
		  //On Error
		  function(error){alert('Something went Wrong');});
	  });
	}

	$("#update").click(function(){
	  var name=$("#name").text();
	  var date=$("#date").val();
	  var image=$("#image").val()
	  myDB.transaction(function(transaction) {
		var executeQuery = "UPDATE phonegap_pro SET date=?, image=? WHERE name=?";
		transaction.executeSql(executeQuery, [date,image,name],
		  //On Success
		  function(tx, result) {alert('Updated successfully');},
		  //On Error
		  function(error){alert('Something went Wrong');});
	  });
	});

	function getUrlVars() {
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for (var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	}
	
	function uploadFile() {
	   var fileURL = "///storage/emulated/0/Android/data/com.adobe.phonegap.app/cache/myFile.jpg";
	   var uri = encodeURI("https://aesthetics-tool.000webhostapp.com/drawings/upload.php");
	   var options = new FileUploadOptions();
		
	   options.fileKey = "file";
	   options.fileName = fileURL.substr(fileURL.lastIndexOf('/')+1);

	   options.mimeType = "image/jpg";

	   var headers = {'headerParam':'headerValue'};
	   options.headers = headers;

	   var ft = new FileTransfer();

	   ft.upload(fileURL, uri, onSuccess, onError, options);

	   function onSuccess(r) {
		  console.log("Upload complete");
	   }

	   function onError(error) {
		  console.log("Upload error");
	   }
		
	}
	
    //Activity Item Toggle
    $('.activity-item').click(function(){
		$(this).find('.activity-item-detail').slideToggle(200);
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
    
});
	function removePatient(name){
	  alert(name);
	  myDB.transaction(function(transaction) {
		var executeQuery = "DELETE FROM phonegap_pro where name=?";
		transaction.executeSql(executeQuery, [name],
		  //On Success
		  function(tx, result) {alert('Deleted successfully');},
		  //On Error
		  function(error){alert('Something went Wrong');});
	  });
	}
 function myFunction(arr) {
	var i;
	var out = '';
	for(i = 0; i<arr.length; i++) {
		out += 
		'<div class="activity-item container">' + 
			'<div ng-app="croppy"><img src="' + arr[i].image + '" width="70" height="70" alt="thumbnail"></div>' + 
			'<h2>' + arr[i].name + '</h2>' + 
			'<em>' + arr[i].date + '</em>' + 
			'<a href="#" onclick="test()" class="activity-item-toggle"><i class="fa fa-plus"></i></a>' + 
			'<div class="activity-item-detail">' + 
				'<table style="width:100%">' + 
					'<tr>' + 
						'<td><a href="viewlocalimage.html?imageLocation=' + arr[i].image + '"><i class="fa fa-picture-o"></i> View image</a></td>' + 
						'<td><a href="#" onclick="sync()" class="show-bottom-notification-2 timer-notification"><i class="fa fa-refresh"></i> Sync</a></td>' + 
					'</tr>' + 
					'<tr>' + 
						'<td><a href="createdrawing.html?imageLocation=' + arr[i].image + '"><i class="fa fa-pencil"></i> Create drawing</a></td>' + 
						'<td><a href="#" onclick="removePatient(\'' + arr[i].name + '\')"><i class="fa fa-trash"></i> Delete</a></td>' + 
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

function test() {
	$('.activity-item').find('.activity-item-detail').slideToggle(200);
}

function sync() {
	$('.bottom-notification-2').slideDown(200);
	var notification_timer = setTimeout(function(){ $('.timeout-notification').slideUp(250); },2000);
}  

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
