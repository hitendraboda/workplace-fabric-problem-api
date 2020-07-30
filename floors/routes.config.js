const FloorsController = require('./controllers/floors.controller');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');

exports.routesConfig = function (app) {
    app.post('/api/floor', [
        ValidationMiddleware.validJWTNeeded,
        FloorsController.insert
    ]);
    app.get('/api/floor', [
        ValidationMiddleware.validJWTNeeded,
        FloorsController.list
    ]);
    app.get('/api/floor/:floorId', [
        ValidationMiddleware.validJWTNeeded,
        FloorsController.getById
    ]);
    app.patch('/api/floor/:floorId', [
        ValidationMiddleware.validJWTNeeded,
        FloorsController.patchById
    ]);
    app.delete('/api/floor/:floorId', [
        ValidationMiddleware.validJWTNeeded,
        FloorsController.removeById
    ]);

    app.post('/api/floor/book', [
        ValidationMiddleware.validJWTNeeded,
        FloorsController.bookChair
    ]);

    app.post('/api/floor/desk', [
        ValidationMiddleware.validJWTNeeded,
        FloorsController.createDesk
    ]);
};