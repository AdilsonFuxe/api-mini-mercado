const connection = require('../database/connection');

module.exports = {

    
    async create(request, response){
        const {name, description} = request.body;

        const [id] = await connection('category').insert({
            name,
            description
        })

        return response.send({id})
    },

    
    async index(request, response ){

        const [count] = await connection('category').where('state',true).count();

        const categories = await connection('category')
                                .where('state',true)
                                .select('*');
                                
        response.header('X-Total-Count',count['count(*)']);
        return response.send(categories);
    },

    async update(request, response){
        
        const { id } = request.params;
        
        const { name, description } = request.body;

        await connection('category')
            .where('id',id)
            .update({
                name,
                description,
                updated_at: new Date()
            });

        return response.send();
    },

    async delete(request, response)
    {
        const { id } = request.params;
        
        await connection('category')
            .where('id', id)
            .update({state:false});
        return response.send();
    },

    async show(request, response){
        const {id} = request.params;

        const category = await connection('category')
                                .where('id',id)
                                .where('state',true)
                                .select('*')
                                .first();
        return response.send(category);
    }

}