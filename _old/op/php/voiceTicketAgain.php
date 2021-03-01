<?php

require_once 'connect.php';


$sql5 = mysqli_query($link,"SELECT * FROM `stateticket` WHERE `called`=1 and `calledAgain`=1 and `sound`=0 ORDER BY `id` ASC LIMIT 1");


while($row2 = mysqli_fetch_assoc($sql5)){
    $sql6 = mysqli_query($link,"UPDATE `stateticket` SET `sound`=1 WHERE `number` = '$row2[number]'");
    if($row2['sound']=='1'){
        echo json_encode($row2['number']);
    }
    else{
        die();
    }
}


?>