<?php
include_once 'connect.php';
global $GlobalId;
$inputJson = file_get_contents('php://input');
if($inputJson !==null){
    $json = json_decode($inputJson,true);
    $arr = array_values($json);
    $id = $arr[0];
}
$GlobalId = $id;
$sql = mysqli_query($link,"SELECT * from `service` WHERE `status`=1 and `id`=$GlobalId");
//$row = mysqli_fetch_assoc($sql);

$i = 1;
while($row = mysqli_fetch_assoc($sql)){  
    $pointer = $row['pointer'];
    $point = (int)$pointer;
    $numberOfTick="$row[Letter]".sprintf('%04d',$pointer);
    $serviceName = $row['ServiceName'];
    $Privilege = $row['setService'];
    $sql2 = mysqli_query($link,"UPDATE `service` SET `pointer` = $point + 1 WHERE id = $GlobalId");
    $sql3=mysqli_query($link,"SELECT `pointer` FROM `service` WHERE `id` = $GlobalId");
    $point = mysqli_fetch_assoc($sql3);
    if($point['pointer']>=150){
        mysqli_query($link,"UPDATE `service` SET pointer = 0 WHERE `id`=$GlobalId");
    }
} 
echo json_encode(array('ticket'=>$numberOfTick,'serviceName'=>$serviceName));

date_default_timezone_set('Asia/Yekaterinburg');

$date = date("d.m.y");
$time = date("H:i:s");
mysqli_query($link,"INSERT INTO `stateticket`(`id`, `time`, `date`, `number`, `service`,`Privilege`,`called`,`calledAgain`,`sound`) VALUES (NULL,'".$time."','".$date."','".$numberOfTick."','".$serviceName."','".$Privilege."',0,0,0)");
//var_dump("INSERT INTO `stateticket`(`id`, `time`, `date`, `number`, `service`,`Privilege`,`called`,`calledAgain`,`sound`) VALUES (NULL,'".$time."','".$date."','".$numberOfTick."','".$serviceName."','".$Privilege."',0,0,0)");

?>