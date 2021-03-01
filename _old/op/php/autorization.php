<?php
session_start();
require 'connect.php';
$inputJSON = file_get_contents("php://input");


if($inputJSON !==null){
    $json = json_decode($inputJSON,true);
    $arr = array_values($json);
    $login = $arr[0];
    $password = $arr[1];

}
$sql = mysqli_query($link,"SELECT `fio`,`password`,`setPrivilege` FROM `users` WHERE `fio`='$login' AND `password`='$password' ");
// $row = mysqli_fetch_assoc($sql);

//var_dump("SELECT `fio`,`password`,`setPrivilege` FROM `users` WHERE `fio`='$login' AND `password`='$password' ");
while($row = mysqli_fetch_assoc($sql)){
    if($row['fio']==$login && $row['password']==$password){
        $_SESSION['user'] = $row['fio'];
        $_SESSION['Privilege'] = $row['setPrivilege'];
}
}
?>