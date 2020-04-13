const connection = require('../database/connection');

module.exports = {
    async create(request, response){
        const {name, description, categoryID} = request.body;

        const [id] = await connection('subcategory').insert({
            name,
            description, 
            categoryID
        });

        return response.send({id});
    },
    async index(request, response){

        try{
            const [count] = await connection('subcategory').where('state',1).count();

            const subcategories = await connection('subcategory')
                                        .where('state',1)
                                        .select('*');
    
            response.header('X-Total-Count',count['count(*)']);
    
            return response.send(subcategories);
        }
        catch(err){
            console.log(err);
            return response.status(404).send({erro: 'Ouve algum problema'});
        }
    },
    async update(request, response){
        const {id} = request.params;
        const {name, description, categoryID} = request.body;

        await connection('subcategory')
                .where('id',id)
                .update({
                    name,
                    description,
                    categoryID,
                    updated_at: new Date()
                });
        
        return response.send();
    },
    async delete(request, response){
        const {id} = request.params;
        await connection('subcategory').where('id',id).update({state:false});
        return response.send()
    },

    async show(request, response){
        const {id} = request.params;

        const subcategory = await connection('subcategory')
                                .where('id',id)
                                .where('state',true)
                                .select('*')
                                .first();
        return response.send(subcategory);
    }
}