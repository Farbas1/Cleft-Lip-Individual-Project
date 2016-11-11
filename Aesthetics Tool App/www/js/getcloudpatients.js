function myFunction(arr) {
	var i;
	var out = '';
	for(i = 0; i<arr.length; i++) {
		out += 
		'<div class="activity-item container">' + 
			'<img src="images/faces/face1.jpg" alt="img">' + 
			'<h5>' + arr[i].name + '</h5>' + 
			'<em>' + arr[i].date + '</em>' + 
			'<a href="#" class="activity-item-toggle"><i class="fa fa-plus"></i></a>' + 
			'<div class="activity-item-detail">' + 
				'<a href="' + arr[i].image + '"><i class="fa fa-picture-o"></i> View image</a>' + 
				'<a href="' + arr[i].image + '" download="test"><i class="fa fa-download"></i> Download</a>' + 
				'<a href="#"><i class="fa fa-pencil-square-o"></i> View drawings</a>' + 
				'<a href="#"><i class="fa fa-bar-chart"></i> View symmetry scores</a>' + 
				'<a href="#"><class="portfolio-link"><i class="fa fa-times"></i> Close</a>' + 
			'</div>' + 
		'</div>' + 
		'<div class="decoration"></div>';
	}
	document.getElementById("id01").innerHTML = out;
}