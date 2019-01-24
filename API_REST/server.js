//import
var express = require('express');
var bodyParser = require('body-parser');
var apiRouter = require('./apiRouter').router;

//Instantiation du serveur
var server =express();

//configuration du body parser
server.use(bodyParser.urlencoded({exended: true}));
server.use(bodyParser.json());

//configurations des routes
server.get('/', function (req, res) {
   res.setHeader('Content-Type', 'text/html');
   res.status(200).send('<h1>Serveur REST Pierre ROMAN</h1>')
});

server.use('/api/', apiRouter);

//lancement du serveur
server.listen(8050, function () {
   console.log("le serveur écoute ...");
});