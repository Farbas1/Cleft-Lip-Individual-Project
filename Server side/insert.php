<?php
 include "db.php";
 if(isset($_POST['insert']))
 {
 $name=$_POST['name'];
 $date=$_POST['date'];
 $image=$_POST['image'];
 $q=mysqli_query($con,"INSERT INTO `images` (`name`,`date`,`image`) VALUES ('$name','$date','$image')");
 if($q)
  echo "success";
 else
  echo "error";
 }
 ?>