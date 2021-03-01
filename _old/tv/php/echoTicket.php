<?php
include_once "connect.php";

$sql = mysqli_query($link,"SELECT `number`,`time`,`service`,`sound` FROM `stateticket` WHERE `called`=1  ORDER by `id` DESC LIMIT 15");
//$sql1 = mysqli_query($link,"UPDATE `stateticket` SET `sound` = 0 ORDER BY `id` DESC LIMIT 1"); 
echo "<div class=tv__info>";
echo "<h1>Талон|Время|Сервис</h1>";
while($row = mysqli_fetch_assoc($sql)){
echo "<div class=number >".$row['number']."<div class=time>".$row['time']."</div><div class=service>".$row['service']."</div></div>";
}
echo "</div>";



?>