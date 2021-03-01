<?php

require 'connect.php';

$InputJSON = file_get_contents('php://input');
if($InputJSON !==null){
    $json = json_decode($InputJSON,true);
    $arr = array_values($json);
    $id = $arr[0];
}


$sql = mysqli_query($link,"SELECT * from `service`");

while($row = mysqli_fetch_assoc($sql)){
    mysqli_query($link,'UPDATE `service` SET `status`=1 WHERE `id`='.$id);
}





?>