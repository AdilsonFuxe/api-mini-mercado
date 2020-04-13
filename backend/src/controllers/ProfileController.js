const connection = require('../database/connection');

module.exports={
    async index(request, response){
        const {id} = request.params
        const business = await connection('business')
                                .where('userID',id)
                                .select('*')
        return response.send(business);
    }
}