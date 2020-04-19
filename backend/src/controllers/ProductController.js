const connection = require('../database/connection');

module.exports={
    async create(request, response){
        const {name, description, count, unit_price, validate_date, subcategoryID, businessID} = request.body;
        try{
            const {userID} = await connection('business')
                                .where('id',businessID)
                                .andWhere('userID', request.userID)
                                .select('userID')
                                .first();
            if(!userID)
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
        }   
        catch(err){
            return response.status(400).send({error: 'Error creating product.'});
        }     
        
    },
    async index(request, response){
        try{
            //const [count] = await connection('product').where('state',true).count();
            //businessID
            const products = await connection('product')
            .join('business', 'business.id', '=', 'product.businessID')
            .where('product.state',true)
            .andWhere('business.userID', request.userID)
            .select('product.*');
            //response.header('X-Total-Count',count['count(*)']);
            return response.send(products);
        } 
        catch(err){
            return response.status(400).send({error: 'Error loading products.'});
        }
    },
    async update(request, response){
        const {id} = request.params;
        const {name, description, count, unit_price, validate_date, subcategoryID} = request.body;
        try{
            const product = await connection('product')
                                .join('business', 'business.id', '=', 'product.businessID')
                                .where('product.state',true)
                                .andWhere('business.userID', request.userID)
                                .andWhere('product.id',id)
                                .select('product.*')
                                .first();
            
            if(!product)
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
        }
        catch(err){
            return response.status(400).send({error: 'Error updating product.'});
        }
    },

    async delete(request, response){
        const {id} = request.params;
        try{
            const product = await connection('product')
                                .join('business', 'business.id', '=', 'product.businessID')
                                .where('product.state',true)
                                .andWhere('business.userID', request.userID)
                                .andWhere('product.id',id)
                                .select('product.*')
                                .first();
        
            if(!product)
                return response.status(404).send({error:'operation not permited'});

            await connection('product')
                .where('id',id)
                .update('state',false)
            return response.status(204).send();
        }
        catch(err){
            return response.status(400).send({error: 'Error deleting product.'});
        }        
    },

    async show(request, response){
        try{
            const {id} = request.params;

            const product = await connection('product')
                                    .join('business', 'business.id', '=', 'product.businessID')
                                    .where('product.state',true)
                                    .andWhere('business.userID', request.userID)
                                    .andWhere('product.id',id)
                                    .select('product.*')
                                    .first();
            return response.send(product);
        }
        catch(err){
            return response.status(400).send({error: 'Error loading product.'});
        }
        
    }
}