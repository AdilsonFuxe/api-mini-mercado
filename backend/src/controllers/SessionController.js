const connection = require('../database/connection');

module.exports = {
    async create(request, response){
        const {userID, password} = request.body;

        const user = await connection('user')
                            .where('state',true)
                            .andWhere('id', userID )
                            .andWhere('password', password)
                            .select('first_name', 'last_name', 'phone', 'email')
                            .first();
        if(!user)
            return response.status(404).send({error:'user not found'});

        return response.status(201).send(user);
    }
}