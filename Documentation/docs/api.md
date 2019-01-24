#API
L'Api REST utilise le protocole http pour transmettre et récupérer
ses données. On peut donc l'utiliser avec de nombreux language. Elle 
dispose de plusieurs fonctions qui servent à effectuer des actions 
sur une base de données. chacune d'entre elles, utilise un verbe http 
différent selon le type d'action qu'elle doit effectuer. 

Dans cette API il y a 6 fonctions et 4 verbe http différents.

- POST: pour envoyer des données

- GET: pour récupérer des données

- PUT: pour modifier des données

- DELETE: pour supprimer des données

Cette API utilise l'ORM sequelize afin de simplifier la relation entre 
l'api et la base de données. Cette dernière sera donc traitée comme une 
base de données orienté objet au sein du programme de l'API.

La quasi-totalité de ses fonctions font passer leurs données dans le
body de la requete html et non dans le header.

##Authentification
Il y a dans cette API un système d'authentification par token. Sans lui 
la plupart des fonctions de cette API vous seront inaccessibles 

###Register
cette fonction permet d'inscrire un nouvel utilisateur dans la base de
données:

`http://localhost:8050/api/users/register`

Cette fonction avec le login est une des seules qui ne requière pas le token.
Elle permet de stocker dans la base de données les données que l'on lui envoie
et renvoie un message de confirmation d'inscription si il a bien réussi à ajouté
l'utilisateur et sinon un message d'erreur avec l'erreur correspondante.

En cas de succès:

    {"reponse": "vous avez était inscrit, vous pouvez désormais vous connecté"}
    
Exemple d'erreur:

    {"error": "l'utilisateur existe déjà"}
    
Les données doivent lui être passé par le body et sous le format 
`application/x-www-form-urlencoded`. Il faut donc préciser dans le header de
la requete:

`Content-Type: application/x-www-form-urlencoded`

On doit donc passer à cette fonction les paramètres suivant:

- nom : le nom de l'utilisateur

- prenom : le prenom de l'utilisateur

- tel : le numéro de téléphone de l'utilisateur

- mail : l'adresse e-mail de l'utilisateur

- password : le mot de passe de l'utilisateur (Attention le mot de passe doit contenir plus de 4 caractère, moins de 11 caractère et un nombre)

Cette requete devra être envoyé en POST.

Par exemple en php:

    $url = "http://localhost:8050/api/users/register";
    $data = ["nom" => "RANDOM", "prenom" => "jean-didier", "tel" => "0640061525", "mail" => "jean-didier.random@etu.univ-amu.fr", "password" => "MonMDP1"];
    
    $data_encode = http_build_query($data);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS,$data_encode);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response  = curl_exec($ch);
    curl_close($ch);

###Login
Cette fonction permet à un utilisateur de se connecter avec les identifiants qu'il a rentré dans
la fonction register:

`http://localhost:8050/api/users/login`
    
Comme dit dans le register cette fonction est une des deux seuls à ne pas nécéssité de token.
Car pour le login c'est justement celle qui va permettre d'en généré un.

Si les identifiants qu'on lui a donné sont juste alors il génère et renvoie un token, le token est généré à partir
de l'id et le prenom de l'utilisateur et est valable 1 h. Si vous dévelloppez une application gardez le token de coté
pour le mettre dans le header des requetes qui necéssite une authentification.

En cas de succès:
    
    {
        "userId": 23, 
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIzLCJ1c2VycHJlbm9tIjoiamVhbi1kaWRpZXIiLCJpYXQiOjE1NDMzNDUwMTcsImV4cCI6MTU0MzM0ODYxN30.08wlg2ceZoEWQwsD4zhuo2il9i0O8Ejg3RAmURJBEPE"
    }

Exemple d'erreur:

    {"error": "Mot de passe invalide"}
    
Les données doivent lui être passé par le body et sous le format 
`application/x-www-form-urlencoded`. Il faut donc préciser dans le header de
la requete:

`Content-Type: application/x-www-form-urlencoded`

On doit donc passer à cette fonction les paramètres suivant:

- mail : l'adresse e-mail de l'utilisateur

- password : le mot de passe de l'utilisateur

Cette requete devra être envoyé en POST.

Exemple en php:
    
    $url = "http://localhost:8050/api/users/login";
    $data = ["mail" => "jean-didier.random@etu.univ-amu.fr", "password" => "MonMDP1"];
    
    $data_encode = http_build_query($data);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS,$data_encode);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response  = curl_exec($ch);
    curl_close($ch);
    
##La récupération de données

###myInfo
Cette fonction permet à un utilisateur connecté de récupérer ses informations:

`http://localhost:8050/api/users/myInfo`

Cette fonction n'a besoin d'aucun paramètre mais un token valide doit être précisé
dans le header de la requete http précèdé de "Bearer " pour qu'elle renvoie les données de l'utilisateur.
Si le token est valide elle va donc lire l'id contenu dans le token et ainsi pouvoir
renvoyé les différentes informations.

En cas de succès:    

    {
        "mail": "jean-didier.random@etu.univ-amu.fr", 
        "nom": "RANDOM",
        "prenom": "jean-didier",
        "id": 23
    }
    
Exemple d'erreur:

    {
        "error": "mauvais token"
    }
    
Cette requete devra être envoyé en GET.

Exemple en php:

    $url = "http://localhost:8050/api/users/myInfo";
        
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded', 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIzLCJ1c2VycHJlbm9tIjoiamVhbi1kaWRpZXIiLCJpYXQiOjE1NDMzNDUwMTcsImV4cCI6MTU0MzM0ODYxN30.08wlg2ceZoEWQwsD4zhuo2il9i0O8Ejg3RAmURJBEPE'));
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response  = curl_exec($ch);
    curl_close($ch);

###search
Cette fonction permet de rechercher dans tout les champs des utilisateur de la base:

`http://localhost:8050/api/users/search?limit=[nombre]&offset=[nombre]&order=[champ:ordre]`

la limit est le nombre de résultat maximum qui est renvoyé, le offset permet d'ignoré les
[nombre] premiers résultats et le order permet de trier un champ dans un ordre.

Exemple:

`http://localhost:8050/api/users/search?limit=2&offset=3&order=id:ASC`

Cette fonction a tout d'abord besoin d'un token valide qui doit être précisé
dans le header de la requete http précèdé de "Bearer ". Elle peut aussi avoir
des options de recherches en paramètre tel que limit, offset et order mais ce
n'est pas obligatoire. Le motif de recherche doit lui être passé par le body 
et sous le format `application/x-www-form-urlencoded`. 
Il faut donc préciser dans le header de la requete:
                       
`Content-Type: application/x-www-form-urlencoded`

Si il n'y a pas de motif de recherche elle renvoie rien, si le motif de recherche
est vide elle renvoie toute la table.

En cas de succès:
    
    [
        {
            "id": 5,
            "mail": "pierre.roman@etu.univ-amu.fr",
            "nom": "jean-bernard",
            "prenom": "Pierre",
            "tel": "0640061525"
        },
        {
            "id": 23,
            "mail": "jean-didier.random@etu.univ-amu.fr",
            "nom": "RANDOM",
            "prenom": "jean-didier",
            "tel": "0640061525"
        },
        {
            "id": 4,
            "mail": "jean-claude.vendame@etu.univ-amu.fr",
            "nom": "vendame",
            "prenom": "jean-claude",
            "tel": "0632099309"
        }
    ]
    
Exemple d'erreur:
    
    {
        "error": "mauvais token"
    }
    
On peut donc passer à cette fonction les paramètres en param suivant:

- limit : limite le nombre de résultat au nombre passer en paramètre

- offset : ignore les "nombre passé en paramètre" premiers résultats

- order : on indique le champ que l'on veut trier deux points l'ordre 
dans le quel on veut trier

On peut passer à cette fonction dans le body le paramètre suivant:

- recherche : qui permet de recherché une chaine de caractère contenu
dans tous les champs

Cette requete devra être envoyé en GET.

Exemple en php
    
    $url = "http://localhost:8050/api/users/search"
    $data = ["recherche" => 'jean'];
    
    $data_encode = http_build_query($data);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded', 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIzLCJ1c2VycHJlbm9tIjoiamVhbi1kaWRpZXIiLCJpYXQiOjE1NDMzNDUwMTcsImV4cCI6MTU0MzM0ODYxN30.08wlg2ceZoEWQwsD4zhuo2il9i0O8Ejg3RAmURJBEPE'));
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
    curl_setopt($ch, CURLOPT_POSTFIELDS,$data_encode);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response  = curl_exec($ch);
    curl_close($ch);

##Modifier de données

###Update
Cette fonction permet de modifier les données de l'utilisateur connecté dans la Base de donnée:

`http://localhost:8050/api/users/myInfo/update`

Cette fonction a tout d'abord besoin d'un token valide qui doit être précisé
dans le header de la requete http précèdé de "Bearer ". Elle renvoie si le token
est bon les données de l'utilisateur et la date de l'update:

En cas de succès:

    {
        "id": 23,
        "tel": "0640061525",
        "nom": "PASRANDOM",
        "prenom": "jean-didier",
        "updatedAt": "2018-11-27T20:30:54.033Z"
    }
    
En cas d'erreur:
    
    {
        "error": "mauvais token"
    }
    
Les données doivent lui être passé par le body et sous le format 
`application/x-www-form-urlencoded`. Il faut donc préciser dans le header de
la requete:

`Content-Type: application/x-www-form-urlencoded`

On peut donc passer à cette fonction les paramètres suivant:

- nom : le nom de l'utilisateur

- prenom : le prenom de l'utilisateur

- tel : le numéro de téléphone de l'utilisateur

Cette requete devra être envoyé en PUT.

Exemple en php:

    $url = "http://localhost:8050/api/users/myInfo/update";
    $data = ["nom" => "PASRANDOM"];
    
    $data_encode = http_build_query($data);
        
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded', 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIzLCJ1c2VycHJlbm9tIjoiamVhbi1kaWRpZXIiLCJpYXQiOjE1NDMzNDUwMTcsImV4cCI6MTU0MzM0ODYxN30.08wlg2ceZoEWQwsD4zhuo2il9i0O8Ejg3RAmURJBEPE'));
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
    curl_setopt($ch, CURLOPT_POSTFIELDS,$data_encode);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response  = curl_exec($ch);
    curl_close($ch);

##Suppression de données

###Delete
Cette fonction permet de supprimer un utilisateur:

`http://localhost:8050/api/users/delete`

Cette fonction a tout d'abord besoin d'un token valide qui doit être précisé
dans le header de la requete http précèdé de "Bearer ". Elle renvoie un message
de succès si l'utilisateur a été supprimé, si l'utilisateur était celui qui 
était connecté ça renvoie un message spécial.

En cas de succès:
    
    {"successful": "utilisateur supprimé"}
    
En cas de succès mais étant l'utilisateur connecté:

    {"isUser": "l'utilisateur supprimé est l'utilisateur connecté"}
    
Exemple d'erreur:

    {"error": "l'utilisateur n'existe pas"}
    
L'id de l'utilisateur à supprimé doit être passé par le body et sous le format 
`application/x-www-form-urlencoded`. Il faut donc préciser dans le header de
la requete:

`Content-Type: application/x-www-form-urlencoded`

On doit donc passer à cette fonction le paramètres suivant:

- id : l'id de l'utilisateur à supprimer

Cette requete devra être envoyé en DELETE.

Exemple en php:

    $url = "http://localhost:8050/api/users/delete";
    $data = ["id" => "23"];
            
    $data_encode = http_build_query($data);
            
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded', 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIzLCJ1c2VycHJlbm9tIjoiamVhbi1kaWRpZXIiLCJpYXQiOjE1NDMzNDUwMTcsImV4cCI6MTU0MzM0ODYxN30.08wlg2ceZoEWQwsD4zhuo2il9i0O8Ejg3RAmURJBEPE'));
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
    curl_setopt($ch, CURLOPT_POSTFIELDS,$data_encode);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response  = curl_exec($ch);
    curl_close($ch);