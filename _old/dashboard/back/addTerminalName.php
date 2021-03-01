<?php
require 'connect.php';


$inputJSON = file_get_contents('php://input');
if($inputJSON !==null){
    $json = json_decode($inputJSON,true);
    $arr = array_values($json);
    $terminlalName = $arr[0];
}



$sql = mysqli_query($link,"INSERT INTO `terminal`(`terminal_id`,`nameTerminal`) VALUES(NULL,'".$terminlalName."')");

?>