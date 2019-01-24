<?php
$PATH_MODEL = "../Model/";
include_once ($PATH_MODEL . "MUser.php");

$MUser = new MUser();

$id = $_POST['id'];
$result = $MUser->delete($id);


header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');

echo json_encode($result);