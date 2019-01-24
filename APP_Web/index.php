<?php
session_start();

$content = '';

if ($_SESSION['token']){
    $content = file_get_contents("View/AnnuairePage.html");
}
else{
    $content = file_get_contents("View/ConnexionPage.html");
}

echo $content;