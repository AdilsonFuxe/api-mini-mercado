const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

module.exports = (request, response, next)=>{
    const authHeader = request.headers.authorization;

    if(!authHeader)
        return response.status(401).send({error: 'No token provided'});

    
    const parts = authHeader.split(' ');

    console.table(authHeader);
    if(parts.length != 2)
        return response.status(401).send({error: 'Token error.'});
    
    
    const [scheme, token] = parts;
    
    if(!/^Bearer$/i.test(scheme))
        response.status(401).send({error: 'Token malformed.'});

    jwt.verify(token, authConfig.secret, (err, decoded)=>{
        if(err)
            return response.status(401).send({error: 'Token invalid'});
        request.userID = decoded.id;
        return next();
    })
}