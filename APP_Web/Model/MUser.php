<?php

session_start();
class MUser
{


    public function execute($method, $data, $url, $token = false){

        $data_encode = http_build_query($data);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded',($token ? 'Authorization: Bearer ' . $_SESSION['token'] : '')));

        switch ($method){
            case 'PUT':
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
                break;
            case 'POST':
                curl_setopt($ch, CURLOPT_POST, 1);
                break;
            case 'DELETE':
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
                break;
            case 'GET':
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
                break;
        }
        curl_setopt($ch, CURLOPT_POSTFIELDS,$data_encode);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response  = curl_exec($ch);
        curl_close($ch);

        return json_decode($response);

    }

    public function login($mail, $mdp){
        $url = "http://localhost:8050/api/users/login";
        $data = ["mail" => $mail, "password" => $mdp];
        $method = 'POST';

        return $this->execute($method, $data, $url);
    }

    public function inscription($nom, $prenom, $tel, $mail, $mdp){
        $url = "http://localhost:8050/api/users/register";
        $data = ["nom" => $nom, "prenom" => $prenom, "tel" => $tel, "mail" => $mail, "password" => $mdp];
        $method = 'POST';

        return $this->execute($method, $data, $url);
    }

    public function delete($id){
        $url = "http://localhost:8050/api/users/delete";
        $data = ["id" => $id];
        $method = 'DELETE';

        return $this->execute($method, $data, $url, true);
    }

    public function myInfo(){
        $url = "http://localhost:8050/api/users/myInfo";
        $data = [];
        $method = 'GET';

        return $this->execute($method, $data, $url, true);
    }

    public function search($recherche, $limit = false, $offset = false, $fieldOrder = false, $order = false){
        $url = "http://localhost:8050/api/users/search?" . ($limit ? "limit=" . $limit : '')
                                                          . ($offset ? "&offset=" . $offset : '')
                                                          . ($fieldOrder && $order ? "&order=" . $fieldOrder . ":" . $order : '');
        $data = ["recherche" => $recherche];
        $method = 'GET';

        return $this->execute($method, $data, $url, true);
    }

    public function updateMe($nom = false, $prenom = false, $tel = false){
        $url = "http://localhost:8050/api/users/myInfo/update";
        $data = [];
        if ($nom)
            $data['nom'] = $nom;
        if ($prenom)
            $data['prenom'] = $prenom;
        if ($tel)
            $data['tel'] = $tel;
        $method = 'PUT';

        return $this->execute($method, $data, $url, true);
    }
}