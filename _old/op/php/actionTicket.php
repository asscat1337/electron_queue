<?php
require 'connect.php';

session_start();
date_default_timezone_set('Asia/Yekaterinburg');
$date = date('H:i:s');
$sql = mysqli_query($link,"SELECT * from `stateticket` WHERE `Privilege` LIKE '%$_SESSION[Privilege]%' AND `called`=0 ORDER BY `id` DESC LIMIT 1");
//var_dump("SELECT * from `stateticket` WHERE `Privilege`='$_SESSION[Privilege]' AND `called`=0 ORDER BY `id` DESC LIMIT 1");
echo json_encode($sql->fetch_all(MYSQLI_ASSOC),JSON_UNESCAPED_UNICODE);
?>