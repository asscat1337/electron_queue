<?php
require 'connect.php';

$inputJSON = file_get_contents('php://input');
if($inputJSON !==null){
    $json = json_decode($inputJSON,true);
    $arr = array_values($json);
    $id = $arr[0];
}

mysqli_query($link,"UPDATE `service` SET `status`=0 WHERE `id`=".$id);


?>