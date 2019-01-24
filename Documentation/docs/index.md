# Le projet de réseau
Ce projet consiste à mettre en oeuvre une API REST en javascript sur un serveur node.js/express.
Elle communique avec la base de données avec mysql. Elle communiquera dans un premier temps avec
un application en php et javascript. 

## Installation
Pour installé l'api il faut se positionner dans le répertoire 
principale de l'api et taper les commandes suivantes:

- Pour installer les dépendance:
    
        npm i
        
- Pour installer la BDD, allez sur mysql où vous voulez créer la BD et tapez:

        create database BDD_ServerRest_PierreROMAN;
   
- Puis retournez sur votre dossier de l'api et tapez:
        
        sequelize db:migrate

##lancement du server
une fois l'installation réalisée vous pouvez maintenant vous rendre dans le répertoire
du de l'api et lancer le fichier "server.js" avec node en tapant la commande:

    node server.js 
        