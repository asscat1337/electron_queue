<?php
require 'connect.php';
$inputJSON = file_get_contents('php://input');
if($inputJSON !==null){
    $json=json_decode($inputJSON,true);
    $arr = array_values($json);
    $letter1 = $arr[1];
    $serviceName1 = $arr[0];
    $pointer1 = $arr[2];
    $priority1 = $arr[3];
    $status = $arr[4];
   $setPrivilege = implode(',',$arr[5]);
   $setService = $arr[6];
   $setTerminalName = $arr[7];

}
$sql = mysqli_query($link,"INSERT into `service`(`id`,`Letter`,`ServiceName`,`pointer`,`Priority`,`status`,`setPrivilege`,`setService`,`setTerminalName`) VALUES(NULL,'".$letter1."','".$serviceName1."','".$pointer1."','".$priority1."','".$status."','".$setPrivilege."','".$setService."','".$setTerminalName."')");
//var_dump("INSERT into `service`(`id`,`Letter`,`ServiceName`,`pointer`,`Priority`,`status`,`setPrivilege`) VALUES(NULL,'".$letter1."','".$serviceName1."','".$pointer1."','".$priority1."','".$status."','".$setPrivilege."')");
?>