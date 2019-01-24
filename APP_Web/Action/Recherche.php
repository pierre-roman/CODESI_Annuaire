<?php
$PATH_Controller = "../Controller/";
include_once ($PATH_Controller . 'CAnnuaire.php');

$CAnnuaire = new CAnnuaire();

$recherche = $_POST['recherche'];
$CAnnuaire->rechercher($recherche);
$result = $CAnnuaire->displayContent();

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');

echo json_encode($result);