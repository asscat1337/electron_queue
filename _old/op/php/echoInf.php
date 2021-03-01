<?php
session_start();
include_once 'connect.php';
$sql = mysqli_query($link,"SELECT * FROM stateticket where `called` = 0 and `Privilege` LIKE '%$_SESSION[Privilege]%'");
//var_dump("SELECT * FROM stateticket where `called` = 0 and `Privilege` LIKE '%$_SESSION[Privilege]%'");
$res = mysqli_num_rows($sql);
$row = mysqli_fetch_assoc($sql);

echo json_encode(array('ticketCol'=>$res,'id'=>$row['id']));
mysqli_free_result($sql);
?>