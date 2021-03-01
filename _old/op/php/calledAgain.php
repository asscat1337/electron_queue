<?php

require_once "connect.php";
$inputJSON = file_get_contents('php://input');

if($inputJSON !==null){
    $json = json_decode($inputJSON,true);
    $arr = array_values($json);
    $ticket = $arr[0];
}


$sql3 = mysqli_query($link,"SELECT * FROM `stateticket` WHERE `calledAgain` = 0 AND `number`='$ticket'");

//$sql1 = mysqli_query($link,"SELECT `id`,`time`,`date`,`number`,`sound` FROM `stateticket` WHERE `called`= 1 and `calledAgain` = 0 ORDER BY `number` DESC LIMIT 1 ");
$row1 = mysqli_fetch_assoc($sql3);
    $row1Id = $row1['id'];
    mysqli_query($link,"UPDATE `stateticket` SET `calledAgain` = 1 WHERE id = ".$row1Id."");



?>