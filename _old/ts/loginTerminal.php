
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <form action="" method="post" class="loginForm">
    <select class="select__terminal">
    <option selected disabled>Выберите терминал</option>
        <?php
        require 'php/connect.php';
        $sql = mysqli_query($link,"SELECT * from `terminal`");
        while($row = mysqli_fetch_assoc($sql)){
            echo "<option data-id=$row[terminal_id]>$row[nameTerminal]</option>";
        }
        ?>
        </select>
        <input type="button" value="Вход" class="confirm">
    </form>
    <script src="js/login.js" type="module"></script>
</body>
</html>