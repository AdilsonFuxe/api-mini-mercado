const connection = require('../database/connection');

module.exports={
    async create(request, response){
        const userID = request.userID;
        const {name, description, location} = request.body;

        try{
            const [id] = await connection('business')
            .insert({
                name,
                description,
                location,
                userID
            });

            return response.send({id});
        }
        catch(err){
            return response.status(400).send({err: 'error on creating a neu business'});
        }
    },
    async index(request, response){
        try{
            const [count] = await connection('business').where('state', true).count();

            const businesses = await connection('business')
                                    .where('state',true)
                                    .andWhere('userID', request.userID)
                                    .select('*');

            response.header('X-Total-Count',count['count(*)']);
            return response.send(businesses);
        }
        catch(err){
            return response.status(400).send({err: 'error loading businesses'});
        }
    },
    async update(request, response){
        const { id } = request.params;
        const {name, description, location} = request.body;

        try{
            const result = await connection('business')
                .where('id',id)
                .andWhere('userID', request.userID)
                .andWhere('state',true)
                .update({
                    name,
                    description,
                    location
                });
            if(!result)
                return response.status(401).send({erro: 'Operation not permited'});

            return response.status(204).send();
        }
        catch(err){
            return response.status(400).send({err: 'error updating business'});
        }
       
    },
    async delete(request, response){
        const { id } = request.params;
       
        const result = await connection('business')
                            .where('id',id)
                            .andWhere('userID', request.userID)
                            .andWhere('state', true)
                            .update('state',false);

        if(!result)
            return response.status(401).send({erro: 'Operation not permited'});

        return response.status(204).send();
    },

    async show(request, response){
        const {id} = request.params;

        const business = await connection('business')
                                .where('id',id)
                                .andWhere('userID', request.userID)
                                .andWhere('state',true)
                                .select('*')
                                .first();
        return response.send(business);
    }
}