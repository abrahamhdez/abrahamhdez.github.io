<?php
$db = mysqli_connect('localhost','','','appsalon');

if (!$db) {
    echo 'Error';
    exit;
}
echo "Well";
?>