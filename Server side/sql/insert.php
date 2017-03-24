<?php
 include "db.php";
 if(isset($_POST['insert']))
 {
 $drawing=mysqli_real_escape_string($con, $_POST['drawing']);
 $score=$_POST['score'];
 $pid=$_POST['pid'];
 $uploaded=$_POST['uploaded'];
 $q=mysqli_query($con,"INSERT INTO `drawings` (`drawing`,`score`,`pid`,`uploaded`) VALUES ('$drawing','$score','$pid','$uploaded')");
 if($q)
  echo "success";
 else
  echo "error";
 }
 ?>