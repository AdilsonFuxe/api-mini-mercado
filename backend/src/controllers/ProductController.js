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
        const {id} = request.params;
        const authorization = request.headers.authorization;
        const {name, description, count, unit_price, validate_date, subcategoryID} = request.body;
        const {userID} = await connection('product')
                                .join('business', 'business.id', '=', 'product.businessID')
                                .where('product.id',id)
                                .select('business.userID')
                                .first();
        
        if(authorization !== userID)
            return response.status(404).send({error:'operation not permited'});
        await connection('product')
            .update({
                name,
                description,
                count,
                unit_price,
                validate_date,
                subcategoryID,
                updated_at: new Date()
            })
            .where('id', id);
        return response.status(204).send();
    },

    async delete(request, response){
        const authorization = request.headers.authorization;
        const {id} = request.params;

        const {userID} = await connection('product')
                        .join('business', 'business.id', '=', 'product.businessID')
                        .where('product.id',id)
                        .select('business.userID')
                        .first();

        if(userID !== authorization)
            return response.status(404).send({error:'operation not permited'});
        await connection('product')
            .where('id',id)
            .update('state',false)
        return response.status(204).send();
    },

    async show(request, response){
        const {id} = request.params;

        const product = await connection('product')
                                .where('id',id)
                                .where('state',true)
                                .select('*')
                                .first();
        return response.send(product);
    }
}