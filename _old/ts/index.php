<?php
session_start();
if(!$_COOKIE['privilege']){
    header('Location:loginTerminal.php');
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>test234</title>
    <link rel="stylesheet" href="./css/main.css">
    <link media="print" rel="stylesheet" href="./css/ticket.css">
</head>
<body>
    <div class="header__main">
        <div class="header__wrapper">
            <div class="header__clock"></div>
            <div class="header__date"></div>
        </div>
        <div class="header__text">
        <h1>Электронная очередь</h1>
        </div>
    </div>
    <div class="button_wrapper">

   <?php
    require 'php/connect.php';
    $sql = mysqli_query($link,"SELECT * from `service` WHERE `setTerminalName`='$_SESSION[Privilege]' AND `status`=1");
    while($row = mysqli_fetch_assoc($sql)){
        echo "<div class=button_ticket data-id=$row[id]>
        <h1>$row[ServiceName]</h1>
        </div>";
    }
   ?>
        <!-- <div class="modal__ticket">Hello world</div> -->
    </div>
    <script src="./js/main.js" type="module"></script>
</body>
</html>