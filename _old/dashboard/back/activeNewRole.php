<?php

require 'connect.php';

$inputJSON = file_get_contents('php://input');

if($inputJSON !==null){
    $json = json_decode($inputJSON,true);
    $arr = array_values($json);
    $role = $arr[0];
}

$sql = mysqli_query($link,"INSERT into `role`(`role_id`,`role`) VALUES(NULL,'".$role."')");


?>