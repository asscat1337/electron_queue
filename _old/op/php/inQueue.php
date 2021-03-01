<?php
require 'connect.php';


$inputJSON = file_get_contents('php://input');
if($inputJSON !=null){
    $json = json_decode($inputJSON,true);
    $arr = array_values($json);
    $ticket = $arr[0];
}
mysqli_query($link,"UPDATE `stateticket` SET `called`=0,`sound`=0 WHERE  `number`='$ticket'");
//var_dump("UPDATE `stateticket` SET `called`=0 WHERE  `number`='$ticket'");



?>