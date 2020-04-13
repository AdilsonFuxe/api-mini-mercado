const connection = require('../database/connection');

module.exports={
    async create(request, response){
        const {name, description, location} = request.body;
        const userId = request.headers.authorization;

        const [id] = await connection('business')
                            .insert({
                                name,
                                description,
                                location,
                                userId
                            });

        return response.send({id});
    },
    async index(request, response){
        const [count] = await connection('business').where('state', true).count();

        const businesses = await connection('business')
                                .where('state',true)
                                .select('*');

        response.header('X-Total-Count',count['count(*)']);
        return response.send(businesses);
    },
    async update(request, response){
        const { id } = request.params;
        const authorization = request.headers.authorization;
        const {name, description, location} = request.body;

        const result = await connection('business')
                                .where('id',id)
                                .andWhere('userID', authorization)
                                .update({
                                    name,
                                    description,
                                    location
                                });
        if(!result)
            return response.status(401).send({erro: 'Operation not permited'});

        return response.status(204).send();
    },
    async delete(request, response){
        const { id } = request.params;
        const authorization = request.headers.authorization;

        const result = await connection('business')
                            .where('id',id)
                            .andWhere('userId', authorization)
                            .update('state',false);

        if(!result)
            return response.status(401).send({erro: 'Operation not permited'});

        return response.status(204).send();
    },

    async show(request, response){
        const {id} = request.params;

        const business = await connection('business')
                                .where('id',id)
                                .where('state',true)
                                .select('*')
                                .first();
        return response.send(business);
    }
}