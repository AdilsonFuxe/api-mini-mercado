const express = require('express');

const routes = express.Router();

const CategoryController = require('./controllers/CategoryController');
const SubCategoryController = require('./controllers/SubCategoryController');
const UserController = require('./controllers/UserController');
const BusinessController = require('./controllers/BusinessController');
const ProductController = require('./controllers/ProductController');
const SessionController = require('./controllers/SessionController');

routes.post('/categories', CategoryController.create);
routes.get('/categories', CategoryController.index);
routes.put('/categories/:id', CategoryController.update);
routes.delete('/categories/:id', CategoryController.delete);

routes.post('/subcategories', SubCategoryController.create);
routes.get('/subcategories', SubCategoryController.index);
routes.put('/subcategories/:id', SubCategoryController.update);
routes.delete('/subcategories/:id', SubCategoryController.delete);

routes.post('/users', UserController.create);
routes.get('/users', UserController.index);
routes.put('/users/:id', UserController.update);
routes.delete('/users/:id', UserController.delete);

routes.post('/businesses', BusinessController.create);
routes.get('/businesses', BusinessController.index);
routes.put('/businesses/:id', BusinessController.update);
routes.delete('/businesses/:id', BusinessController.delete);

routes.post('/products', ProductController.create);
routes.get('/products', ProductController.index);
routes.put('/products/:id', ProductController.update);
routes.delete('/products/:id', ProductController.delete);

routes.post('/session', SessionController.create);


module.exports = routes;