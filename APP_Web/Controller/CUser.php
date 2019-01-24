<?php

$PATH_MODEL = "../Model/";
include_once ($PATH_MODEL . "MUser.php");
session_start();
class CUser
{
    private $MUser;

    /**
     * CUser constructor.
     * @param $MUser
     */
    public function __construct()
    {
        $this->MUser = new MUser();
    }


    public function seConnecter($mail, $mdp){
        $result = $this->MUser->login($mail, $mdp);

        if (!$result->{'error'}){
            $_SESSION['token'] = $result->{'token'};
        }

        return $result;
    }

    public function inscription($nom, $prenom, $tel, $mail, $mdp){
        $result = $this->MUser->inscription($nom, $prenom, $tel, $mail, $mdp);
        return $result;
    }
}