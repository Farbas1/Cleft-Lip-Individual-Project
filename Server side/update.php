<?php
 include "db.php";
 if(isset($_POST['update']))
 {
 $id=$_POST['id'];
 $name=$_POST['name'];
 $duration=$_POST['duration'];
 $price=$_POST['price'];
 $q=mysqli_query($con,"UPDATE `images` SET `name`='$name',`duration`='$duration',`price`='$price' where `id`='$id'");
 if($q)
 echo "success";
 else
 echo "error";
 }
 ?>