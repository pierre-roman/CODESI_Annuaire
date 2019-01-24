<?php
$PATH_CONTROLLER='../Controller/';
include_once ($PATH_CONTROLLER . 'CUser.php');

$CUser = new CUser();

$result = $CUser->seConnecter($_POST['mail'], $_POST['mdp']);

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');

echo json_encode($result);