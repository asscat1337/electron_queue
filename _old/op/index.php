<?php
    if(!$_COOKIE['user']){
        header('Location:login.php');
    }
    session_start();
    var_dump($_SESSION);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="css/op.css">
</head>
<body>
    <div class="op__header">
    </div>

    <div class="op__content">
        <div class="op__text">
            <div class="col"></div>
            <div class="opTicket"></div>
            <div class="opCalledAgain"></div>
        </div>
        <div class="op__buttons">
            <input type="button" value="Следующий"  class="btn1">
            <input type="button" value="Вызвать повторно"  class="btn2">
            <input type="button" value="В очередь"  class="btn3">
        </div>
        <button class="show__queue">Список очереди</button>
        <div class="op__block">
        <div class="op__block-queue hide">
            <p>Список очереди</p>
        </div>
        </div>
    </div>

    <script src="js/main.js" type="module"></script>
</body>
</html>