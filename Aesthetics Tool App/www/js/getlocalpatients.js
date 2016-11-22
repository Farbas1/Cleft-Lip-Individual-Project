function myFunction(arr) {
	var i;
	var out = '';
	for(i = 0; i<arr.length; i++) {
		out += 
		'<div class="activity-item container">' + 
			'<div ng-app="croppy"><img src="' + arr[i].image + '" width="70" height="70" alt="thumbnail"></div>' + 
			'<h2>' + arr[i].name + '</h2>' + 
			'<em>' + arr[i].date + '</em>' + 
			'<a href="#" class="activity-item-toggle"><i class="fa fa-plus"></i></a>' + 
			'<div class="activity-item-detail">' + 
				'<table style="width:100%">' + 
					'<tr>' + 
						'<td><a href="viewlocalimage.html?imageLocation=' + arr[i].image + '"><i class="fa fa-picture-o"></i> View image</a></td>' + 
						'<td><a href="#" class="show-bottom-notification-2 timer-notification"><i class="fa fa-refresh"></i> Sync</a></td>' + 
					'</tr>' + 
					'<tr>' + 
						'<td><a href="createdrawing.html"><i class="fa fa-pencil"></i> Create drawing</a></td>' + 
						'<td><a href="#"><i class="fa fa-trash"></i> Delete</a></td>' + 
					'</tr>' +
					'<tr>' + 
						'<td><a href="#"><i class="fa fa-bar-chart"></i> View drawings and scores</a></td>' + 
						'<td><a href="#"><i class="fa fa-times"></i> Close</a></td>' + 
					'</tr>' + 
				'</table>' + 
			'</div>' + 
		'</div>' + 
		'<div class="border"></div>';
	}
	document.getElementById("id01").innerHTML = out;
}