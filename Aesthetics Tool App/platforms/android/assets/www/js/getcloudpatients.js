function myFunction(arr) {
	var i;
	var out = '';
	for(i = 0; i<arr.length; i++) {
		out += 
		'<div class="activity-item container">' + 
			'<div ng-app="croppy"><img src="' + arr[i].image + '" alt="thumbnail"></div>' + 
			'<h2>' + arr[i].name + '</h2>' + 
			'<em>' + arr[i].date + '</em>' + 
			'<a href="#" class="activity-item-toggle"><i class="fa fa-plus"></i></a>' + 
			'<div class="activity-item-detail">' + 
				'<table style="width:100%">' + 
					'<tr>' + 
						'<td><a href="viewcloudimage.html?imageLocation=' + arr[i].image + '"><i class="fa fa-picture-o"></i> View image</a></td>' + 
						'<td><a href="#" onclick="downloadFile(';
						out +=
						"'" + arr[i].image + "'" + ')"><i class="fa fa-download"></i> Download</a></td>' + 
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
function downloadFile(imageLink) {
	var fileTransfer = new FileTransfer();
	var uri = encodeURI(imageLink);
	alert(uri);
	imageName = imageLink.split('/');
	var fileURL = "///storage/emulated/0/Android/data/com.adobe.phonegap.app/cache/" + imageName.pop();
	
	fileTransfer.download(
		uri, fileURL, function(entry) {
			alert("Downloaded");
			console.log("Download complete");
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




/* $(document).ready(function() {
 	var url = "https://aesthetics-tool.000webhostapp.com/json.php";
	$.getJSON(url, function(result) {
		console.log(result);
		$.each(result, function(i, field) {
			var id = field.id;
			var name = field.name;
			var date = field.date;
			var image = field.image;
			$("#listview").append(
				'<div class="activity-item container">' + 
					'<div ng-app="croppy"><img src="' + image + '" alt="thumbnail"></div>' + 
					'<h2>' + name + '</h2>' + 
					'<em>' + date + '</em>' + 
					'<a href="#" class="activity-item-toggle"><i class="fa fa-plus"></i></a>' + 
					'<div class="activity-item-detail">' + 
						'<table style="width:100%">' + 
							'<tr>' + 
								'<td><a href="viewcloudimage.html?imageLocation=' + image + '"><i class="fa fa-picture-o"></i> View image</a></td>' + 
								'<td><a href="' + image + '" download="test"><i class="fa fa-download"></i> Download</a></td>' + 
							'</tr>' + 
							'<tr>' + 
								'<td><a href="#"><i class="fa fa-bar-chart"></i> View drawings and scores</a></td>' + 
								'<td><a href="#"><i class="fa fa-times"></i> Close</a></td>' + 
							'</tr>' + 
						'</table>' + 
					'</div>' + 
				'</div>' + 
				'<div class="border"></div>'
			);
		});
	});
}); */