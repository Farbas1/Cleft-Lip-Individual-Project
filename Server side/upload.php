<?php
	//Allow Headers
	header('Access-Control-Allow-Origin: *');
	move_uploaded_file($_FILES["file"]["tmp_name"], urldecode($_FILES["file"]["name"]));
?>