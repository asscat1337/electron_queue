<?php

require 'connect.php';


$inputJSON = file_get_contents("php://input");

if($inputJSON !== null){
    $json = json_decode($inputJSON,true);
    $arr = array_values($json); 
    $fio = $arr[0];
    $password = $arr[1];
    $selectedValue = $arr[2];
}

mysqli_query($link,"INSERT INTO `users`(`id`,`fio`,`password`,`setPrivilege`) VALUES (NULL,'".$fio."','".$password."','".$selectedValue."')");

?>