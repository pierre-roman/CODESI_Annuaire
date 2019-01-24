<?php

class CPersonne
{
    private $id;
    private $nom;
    private $prenom;
    private $tel;
    private $mail;

    public function __construct($id, $mail, $nom, $prenom, $tel)
    {
        $this->id = $id;
        $this->nom = $nom;
        $this->prenom = $prenom;
        $this->tel = $tel;
        $this->mail = $mail;
    }

    public function display(){
        return "<tr><td>" . $this->nom . "</td>"
            .  "<td>" . $this->prenom . "</td>"
            .  "<td>" . $this->tel . "</td>"
            .  "<td>" . $this->mail . "</td>"
            .  "<td><button type='button' onclick='supprimer(" . $this->id . ")'>Delete</button></form></td></tr>";
    }


}