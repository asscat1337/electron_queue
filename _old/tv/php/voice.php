<?php
require_once "connect.php";
$sql = mysqli_query($link,"SELECT * FROM `stateticket` WHERE `sound`=1  ORDER BY `id` DESC LIMIT  1");
$arr = mysqli_fetch_assoc($sql);
$sql1 = mysqli_query($link,"SELECT * FROM `stateticket` WHERE `sound`=0  ORDER BY `id` DESC LIMIT  1");
$row = mysqli_fetch_assoc($sql1);
 if($arr['sound']==1 && $arr['called']==1){
        $res = $arr['number'];
        $json = array('ticket'=>$res,'id'=>$arr['id']);
        echo json_encode($json);
        mysqli_query($link,"UPDATE `stateticket` SET `sound`=0 WHERE `id`='$arr[id]'");
    }
 if($row['calledAgain']==1 && $row['sound']==0){
        $res = $row['number'];
        $json = array('ticket'=>$res);
        echo json_encode($json);
        mysqli_query($link,"UPDATE `stateticket` SET `calledAgain`=0 WHERE `id`='$row[id]'");
    }
    else if($arr['called']==0){
        echo "null";
    }
?>