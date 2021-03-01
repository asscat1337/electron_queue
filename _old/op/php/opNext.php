<?php
include_once 'connect.php';
session_start();
$sql1 = mysqli_query($link,"SELECT * FROM `stateticket` WHERE `called`= 0 and `Privilege` LIKE '%$_SESSION[Privilege]%' ORDER BY `id` DESC LIMIT 1");
$sql = mysqli_query($link,"SELECT * FROM stateticket where `called` = 0");

$res = mysqli_num_rows($sql);
while($row = mysqli_fetch_assoc($sql1)){
    $json = array('ticket'=>$row['number'],'service'=>$row['service']);
    echo json_encode($json);
    $rowId = $row['id'];
    mysqli_query($link,"UPDATE `stateticket` SET `called` = 1,`sound`= 1 WHERE id =".$rowId."");
}

?> 