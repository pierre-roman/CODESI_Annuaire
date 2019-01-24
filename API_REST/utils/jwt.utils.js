//import
var jwt = require('jsonwebtoken');
var models = require('../models');

//Constantes
const JWT_SIGN_SECRET = '0gyjhfg3fdgdgfhhh242fldhghj7hgf8kj99k0ghuobfR3487jk5hg4fhgf5dhfdytdf7g8fghhfg';

//export
module.exports = {
    generateTokenForUser: function (userData) {
        return jwt.sign({
                userId: userData.id,
                userprenom: userData.prenom
            },
            JWT_SIGN_SECRET,
            {
                expiresIn: '1h'
            })
    },
    parseAuthorization: function (authorization) {
        return (authorization != null) ? authorization.replace('Bearer ', ''): null;
    },
    getUserId: function (authoriztion) {
        var userId = -1;
        var token = module.exports.parseAuthorization(authoriztion);
        if (token != null){
            try {
                var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
                if (jwtToken != null){
                    userId = jwtToken.userId;
                }
            }catch(err){
                return err;
            }
        }
        return userId;
    }
}