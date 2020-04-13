const connection = require('../database/connection');
const crypto = require('crypto');

module.exports = {
    async create(request, response){
        const {first_name, last_name, email, phone, password} = request.body;
        const id = crypto.randomBytes(4).toString('HEX');
        
        await connection('user').insert({
            id,
            first_name,
            last_name,
            email,
            phone,
            password
        });

        return response.send({id});
    },
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