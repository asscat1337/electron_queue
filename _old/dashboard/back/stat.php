<?php
require 'connect.php';

// $sql = mysqli_query($link,"SELECT `number` FROM `stateticket`");
// $resultNum = mysqli_num_rows($sql);
// $arr = array("stats"=>array('Количество номеров'=>$resultNum));
// echo json_encode($arr,JSON_UNESCAPED_UNICODE);
$sql1 = mysqli_query($link,"SELECT `id`,`serviceName`,`status` from `service`");
echo json_encode($sql1->fetch_all(MYSQLI_ASSOC),JSON_UNESCAPED_UNICODE);

?>