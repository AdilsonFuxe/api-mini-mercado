const connection = require('../database/connection');

module.exports={
    async index(request, response){
        const {id} = request.params
        const business = await connection('business')
                                .where('userID',id)
                                .select('*')
        return response.send(business);
    },

    async show(request, response){
        const {userID,businessID} = request.params

        const products = await connection('product')
                                .join('business', 'business.id', 'product.businessID')
                                .where('business.userID',userID)
                                .andWhere('product.businessID',businessID)
                                .select(['product.*']);
       
        return response.send(products);
    }
}