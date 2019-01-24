<?php
$PATH_MODEL = "../Model/";
include_once ($PATH_MODEL . 'MUser.php');
include_once ('CPersonne.php');

class CAnnuaire
{
    private $listPers;
    private $MUser;


    public function __construct()
    {
        $this->MUser = new MUser();
    }


    public function rechercher($recherche){
        $result = $this->MUser->search($recherche);
        $listPers = array();

        for($i = 0; $i < sizeof($result); $i++)
            $this->listPers[$i] = new CPersonne($result[$i]->{'id'}, $result[$i]->{'mail'}, $result[$i]->{'nom'}, $result[$i]->{'prenom'}, $result[$i]->{'tel'});
    }
    public function displayContent(){
        $lignes = "";
        foreach ($this->listPers as &$ligne) {
            $lignes = $lignes . $ligne->display();
        }
        return $lignes;
    }
}