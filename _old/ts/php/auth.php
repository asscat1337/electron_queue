<?php
session_start();
require 'connect.php';
$inputJSON = file_get_contents("php://input");


if($inputJSON !==null){
    $json = json_decode($inputJSON,true);
    $arr = array_values($json);
    $login = $arr[0];

}
$sql = mysqli_query($link,"SELECT * FROM `service` WHERE `setTerminalName`='$login'");

$_SESSION['Privilege'] = $login;
?>