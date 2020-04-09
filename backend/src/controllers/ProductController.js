const connection = require('../database/connection');

module.exports={
    async create(request, response){
        const {name, description, count, unit_price, validate_date, subcategoryID, businessID} = request.body;
        const authorization = request.headers.authorization;

        const data = await connection('business')
                                .where('id',businessID)
                                .select('userID')
                                .first();
        if(data['userID'] !== authorization)
            return response.status(404).send({error:'operation not permited'});
       
        const [id] = await connection('product')
                            .insert({
                                name,
                                description,
                                count,
                                unit_price,
                                validate_date,
                                subcategoryID,
                                businessID
                            });
        return response.status(201).send({id});
    },
    async index(request, response){
        const [count] = await connection('product').where('state',true).count();
        
        const products = await connection('product')
                                .where('state',true)
                                .select('*');
        response.header('X-Total-Count',count['count(*)']);
        return response.send(products);
    },
    async update(request, response){

        const {name, description, count, unit_price, validate_date, subcategoryID, businessID} = request.body;
        const authorization = request.headers.authorization;
        const {id} = request.params;

        const data = await connection('business')
                                .where('id',businessID)
                                .select('userID')
                                .first();
        if(data['userID'] !== authorization)
            return response.status(404).send({error:'operation not permited'});

        
        await connection('product')
                .where('id',id)
                .update({
                    name,
                    description,
                    count,
                    unit_price,
                    validate_date,
                    subcategoryID,
                    businessID,
                });

        return response.status(201).send();
    },
    async delete(request, response){
        const {businessID} = request.body;
        const authorization = request.headers.authorization;
        const {id} = request.params;
        const data = await connection('business')
                                .where('id',businessID)
                                .select('userID')
                                .first();
        if(data['userID'] !== authorization)
            return response.status(404).send({error:'operation not permited'});
        
        await connection('product')
            .where('id',id)
            .update('state',false)

        return response.status(204).send();
    }
}