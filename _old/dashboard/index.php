<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <h1>Панель администратора</h1>
    <h1>Оперативная информация по организации</h1>
    
    <div class="addService">
        <input type="text" class="serviceInput" placeholder="Введите услугу">
        <?php
        require 'back/connect.php';
        $sql = mysqli_query($link,"SELECT * from `role`");
        echo "<label for=checkbox__div>Выберите роль</label>";
        echo "<div class=checkbox__div>";
        while($row = mysqli_fetch_assoc($sql)){
            echo "<input type=checkbox data-id=$row[role_id] value=$row[role]><span>$row[role]</span></input>";
        }
        echo "</div>";
        echo "<select class=terminalSelect>";
        echo "<option selected disabled>Выберите терминал</option>";
        $sql1 = mysqli_query($link,"SELECT * from `terminal`");
        while($row1 = mysqli_fetch_assoc($sql1)){
            echo "<option>$row1[nameTerminal]</option>";
        }
        echo "</select>";
        ?>
        <button class="serviceAccept">Подтвердить</button>
    </div>
    <div class="addOperator">
        <input type="text" class="operatorInput" placeholder="Введите ФИО оператора">
        <button class="OperatorAccept">Подтвердить</button>
        <select class="selectService">
        <option disabled selected>Выберите роль</option>
        <?php
            require 'back/connect.php';
            $sql = mysqli_query($link,"SELECT * FROM `role`");
            while($row=mysqli_fetch_assoc($sql)){
                echo "<option data-id=$row[role_id]>$row[role]</option>";
            }
        ?>
        </select>
    </div>
    <div class="addNewRole">
        <input type="text" class="inputRole" placeholder="Введить роль">
        <button class="activeNewRole">Подтвердить</button>
    </div>
    <div class="addTerminal">
        <input type="text" class="inputTerminal" placeholder="Введите название терминала">
        <button class="activeNewTerminal">Подтвердить</button>
    </div>
    <div class="showUsers">
    <span>Список пользователей</span>
    <?php 
        require 'back/connect.php';
        $sql = mysqli_query($link,"SELECT * from `users`");
        while($row = mysqli_fetch_assoc($sql)){
            echo "<div data-users=$row[id]>
            <span>$row[fio]</span>
            <span>$row[password]</span>
            </div>" ;
        }
    ?>
    </div>
    <div class="showService">
    <span>Список сервисов</span>
        <?php
            require 'back/connect.php';
            $sql = mysqli_query($link,"SELECT * from `service`");
            while($row = mysqli_fetch_assoc($sql)){
                if($row['status']==1){
                    echo "<div class=result>
                    <span>$row[ServiceName]</span>
                    <input type=checkbox checked data-id=$row[id]>
                    </div>";
                }else{
                    echo "<div class=result>
                    <span>$row[ServiceName]</span>
                    <input type=checkbox data-id=$row[id]>
                    </div>";
                }
            }

        ?>
    </div>
    <script src="js/index.js"></script>
</body>
</html>