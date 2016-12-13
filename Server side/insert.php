<?php
 include "db.php";
 if(isset($_POST['insert']))
 {
 $id=$_POST['id'];
 $name=$_POST['name'];
 $date=$_POST['date'];
 $image=$_POST['image'];
 $q=mysqli_query($con,"INSERT INTO `images` ('id',`name`,`date`,`image`) VALUES ('$id','$name','$date','$image')");
 if($q)
  echo "success";
 else
  echo "error";
 }
 ?>