const connection = require('../database/connection');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');
const bcrypt = require('bcryptjs');


function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    });
}

module.exports = {
    async create(request, response){
        const id = crypto.randomBytes(4).toString('HEX');
        const {first_name, last_name, email, phone, password } = request.body;
        try{

            let user = await connection('user').where('email',email).where('state',true).select('*').first();

            if(user) return response.status('400').send({error: 'already a user with this email'});

            user = await connection('user').where('phone',phone).where('state',true).select('*').first();

            if(user) return response.status('400').send({error: 'already a user with this phone'});

            const passHash = await bcrypt.hash(password, 10);
            
            await connection('user').insert({id, first_name, last_name, email, phone,password:passHash});
            return response.send({id, token:generateToken({id})});
        }
        catch(err){
            console.log(err);
            return response.status(400).send({error:'error creating a new user'});
        }
    },
    async authenticate(request, response){
        const {email, password} = request.body;

        try{
            const user = await connection('user').where('email',email).select('*').first();
            
            if(!user) 
                return response.status(400).send({error: 'User not found.'});

            if(! await bcrypt.compare(password, user.password)) 
                return response.status(400).send({error: 'Invalid Password.'});
            return response.send({user, token: generateToken({id:user.id})});
        }
        catch(err){
            console.log(err);
            return response.status(400).send({error: 'autheticate failure'});
        }
    }
    ,
    async index(request, response){

        const [count] = await connection('user').where('state',1).count();

        const users = await connection('user')
                                .where('state',1)
                                .select(
                                    'id',
                                    'first_name', 
                                    'last_name', 
                                    'email', 
                                    'phone',
                                    'password'
                                );
        response.header('X-Total-Count',count['count(*)']);
        return response.send(users);
    },
    async update(request, response){
        const {id} = request.params;
        const {first_name, last_name, email, phone, password} = request.body;

        await connection('user')
            .where('id',id)
            .update({
                first_name,
                last_name,
                email,
                phone,
                password
            });

        return response.send();
    },
    async delete(request, response){
        const {id} = request.params;

        await connection('user')
                .where('id',id)
                .update({state:false});

        return response.send();
    },

    async show(request, response){
        const {id} = request.params;

        const user = await connection('user')
                                .where('id',id)
                                .where('state',true)
                                .select('*')
                                .first();
        return response.send(user);
    }
}