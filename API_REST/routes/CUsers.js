//import
var bcrypt = require('bcryptjs');
var jwtUtils = require('../utils/jwt.utils');
var models = require('../models');
const Sequelize = require('sequelize');

//Constantes
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,11}$/;
const TEL_REGEX = /^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/
const OP = Sequelize.Op;

//Routes
module.exports = {
    register: function (req, res) {
        //les paramètres
        var nom = req.body.nom;
        var prenom = req.body.prenom;
        var tel = req.body.tel;
        var mail = req.body.mail;
        var password = req.body.password;

        //vérification des champs
        if (nom == null){
            return res.status(400).json({'error': 'nom manquant'});
        }
        if (prenom == null){
            return res.status(400).json({'error': 'prenom manquant'});
        }
        if (tel == null){
            return res.status(400).json({'error': 'numéro de téléphone manquant'});
        }
        if (mail == null){
            return res.status(400).json({'error': 'e-mail manquant'});
        }
        if (password == null){
            return res.status(400).json({'error': 'mot de passe manquant'});
        }

        if(nom.length >= 50 || nom.length <= 1){
            return res.status(400).json({'error': 'le nom doit être compris entre 2 et 50 caractères'});
        }
        if(prenom.length >= 25 || prenom.length <= 2){
            return res.status(400).json({'error': 'le nom doit être compris entre 3 et 25 caractères'});
        }
        if (!EMAIL_REGEX.test(mail)){
            return res.status(400).json({'error': 'email invalide'});
        }
        if (!PASSWORD_REGEX.test(password)){
            return res.status(400).json({'error': 'le mot de passe doit être compris entre 4 et 11 caractère et pocèder au moins 1 caractère numérique'});
        }
        if (!TEL_REGEX.test(tel)){
            return res.status(400).json({'error': 'le numero de telephone est invalide'});
        }

        models.User.findOne({
            attributes: ['mail'],
            where: {mail: mail}
        }).then(function (userFound) {
            if (!userFound){
                bcrypt.hash(password, 10, function (err, bcryptedPassword) {
                    var newUser = models.User.create({
                        nom: nom,
                        prenom: prenom,
                        tel: tel,
                        mail: mail,
                        password: bcryptedPassword
                    }).then(function (newUser) {
                        return res.status(201).json({
                            'reponse': 'vous avez était inscrit, vous pouvez désormais vous connecté'
                        })
                    }).catch(function (err) {
                        return res.status(500).json({'error': 'impossible d\'aujouter l\'utilisateur'})
                    });
                });
            }else {
                return res.status(400).json({'error': 'l\'utilisateur existe déjà'});
            }
        }).catch(function(err){
            return res.status(500).json({'error': 'impossible de vérifier l\'utilisateur'});
        })

    },
    login: function(req, res) {
        //valeur
        var mail = req.body.mail;
        var password = req.body.password;

        //gestion des champs manquant
        if (mail == null)
            return res.status(400).json({'error': 'email manquant'});
        if (password == null)
            return res.status(400).json({'error': 'mot de passe manquant'});


        //recherche de l'utilisateur
        models.User.findOne({
            where: {mail: mail}
        }).then(function (userFound) {
            if (userFound){
                bcrypt.compare(password, userFound.password, function (errBycrypt, resBycrypt) {
                    if (resBycrypt){
                        return res.status(200).json({
                            'userId': userFound.id,
                            'token': jwtUtils.generateTokenForUser(userFound)
                        })
                    }
                    else
                        return res.status(403).json({'error': 'Mot de passe invalide'});
                });
            }
            else
                return res.status(404).json({'error': 'L\'utilisateur n\'est pas dans la base de donnée'})
        }).catch(function (err) {
            return res.status(500).json({'error': 'imposible de vérifier l\'utilisateur ' + err});
        })
    },

    getUserProfile: function (req, res) {
        //check le token
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        if (userId < 0 || typeof(userId) !== 'number')
            return res.status(400).json({'error': 'mauvais token'});

        //recherche de l'utilisateur
        models.User.findOne({
            attributes: ['mail', 'nom', 'prenom', 'id'],
            where: {id: userId}
        }).then(function (user){
            if (user){
                return res.status(201).json(user);
            }else{
                return res.status(404).json({'error': 'l\'utilisateur n\'a pas été trouvé'})
            }
        }).catch(function (err) {
            return res.status(500).json({'error': 'impossible de rechercher l\'utilisateur'});
        })
    },

    search: function (req, res) {
        //check le token
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        if (userId < 0 || typeof(userId) !== 'number')
            return res.status(400).json({'error': 'mauvais token'});

        var recherche = req.body.recherche;
        var limit = parseInt(req.query.limit);
        var offset = parseInt(req.query.offset);
        var order = req.query.order;

        //recherche des utilisateurs
        models.User.findAll({
            order: [(order != null) ? order.split(':') : ['nom', 'ASC']],
            attributes: ['id', 'mail', 'nom', 'prenom', 'tel'],
            limit: (!isNaN(limit)) ? limit : null,
            offset: (!isNaN(offset)) ? offset : null,
            where: {[OP.or]: [
                    {mail: {[OP.like]: '%'+recherche+'%'}},
                    {nom: {[OP.like]: '%'+recherche+'%'}},
                    {prenom: {[OP.like]: '%'+recherche+'%'}},
                    {tel: {[OP.like]: '%'+recherche+'%'}}
                ]}
        }).then(function (UsersFound) {
            if (UsersFound){
                res.status(200).json(UsersFound);
            }else{
                res.status(404).json({"error": "aucun utilisateur trouvé"});
            }
        }).catch(function (err) {
            res.status(500).json({"error": "impossible de rechercher les utilisateurs"});
        });
    },

    update: function (req, res) {
        //check le token
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        if (userId < 0 || typeof(userId) !== 'number')
            return res.status(400).json({'error': 'mauvais token'});

        //valeur
        var tel = req.body.tel;
        var nom = req.body.nom;
        var prenom = req.body.prenom;

        if (nom){
            if(nom.length >= 50 || nom.length <= 1){
                return res.status(400).json({'error': 'le nom doit être compris entre 2 et 50 caractères'});
            }
        }
        if (prenom){
            if(prenom.length >= 25 || prenom.length <= 2){
                return res.status(400).json({'error': 'le nom doit être compris entre 3 et 25 caractères'});
            }
        }
        if (tel){
            if (!TEL_REGEX.test(tel)){
                return res.status(400).json({'error': 'le numero de telephone est invalide'});
            }
        }

        //recherche de l'utilisateur
        models.User.findOne({
            attributes: ['id', 'tel', 'nom', 'prenom'],
            where: { id : userId}
        }).then(function (userFound) {
            if (userFound){
                userFound.update({
                    tel: (tel ? tel : userFound.tel),
                    nom: (nom ? nom : userFound.nom),
                    prenom: (prenom ? prenom : userFound.prenom)
                }).then(function () {
                    return res.status(201).json(userFound);
                }).catch(function (err) {
                    return res.status(500).json({'error': 'impossible de mettre à jour l\'utilisateur'});
                })
            }
            else{
                return res.status(404).json({'error': 'l\'utilisateur n\'a pas été trouvé'});
            }
        }).catch(function (err) {
            return res.status(500).json({'error': 'incapable de vérifier l\'utilisateur'});
        });
    },

    delete: function (req, res) {
        //check le token
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

       if (userId < 0 || typeof(userId) !== 'number')
           return res.status(400).json({'error': 'mauvais token'});

        //valeur
        var id = req.body.id;

        models.User.destroy({
            where: {id : id}
        }).then(function (userDelete) {
            if (userDelete) {
                if (userId == id) {
                    return res.status(201).json({'isUser': 'l\'utilisateur supprimé est l\'utilisateur connecté'})
                }
                else {
                    return res.status(201).json({'successful': 'utilisateur supprimé'});
                }
            }
            else {
                return res.status(400).json({'error': 'l\'utilisateur n\'existe pas' })
            }
        }).catch(function (err) {
            return res.status(500).json({'error': 'incapable de supprimer l\'utilisateur' })
        })
    }

}