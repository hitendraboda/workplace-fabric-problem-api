const FloorModel = require('../models/floors.model');

exports.insert = (req, res) => {
    FloorModel.createFloor(req.body)
        .then((result) => {
            res.status(201).send({ id: result._id });
        });
};

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    FloorModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.getById = (req, res) => {
    FloorModel.findById(req.params.floorId)
        .then((result) => {
            res.status(200).send(result);
        });
};

exports.patchById = (req, res) => {
    FloorModel.patchUser(req.params.floorId, req.body)
        .then((result) => {
            res.status(204).send({});
        });

};

exports.removeById = (req, res) => {
    FloorModel.removeById(req.params.floorId)
        .then((result) => {
            res.status(204).send({});
        });
};

exports.bookChair = async (req, res) => {
    FloorModel.findById(req.body.floorId).then(async floor => {
        desk = floor.desks.find(d => d._id == req.body.deskId);
        if (!desk) {
            return res.status(404).json({
                type: 'Error',
                status: 'Not found',
                message: 'Desk not found',
                path: req.originalUrl
            });
        }

        chair = desk.chairs.find(c => c._id == req.body.chairId);
        if (!chair) {
            return res.status(404).json({
                type: 'Error',
                status: 'Not found',
                message: 'Chair not found',
                path: req.originalUrl
            });
        }

        if (chair.booked && req.body.booked) {
            return res.status(409).json({
                type: 'Error',
                status: 'Already exist',
                message: 'Chair already booked',
                path: req.originalUrl
            });
        }
        chair.booked = req.body.booked;
        let updateResponse = await FloorModel.update(floor.id, floor);
        let response = {
            code: 'success',
            message: 'record updated',
            data: updateResponse,
        }
        res.status(200).json(response);
    }).catch(err => {
        res.status(500).send(err);
    });
}

exports.createDesk = async (req, res) => {
    try {
        floor = await FloorModel.findById(req.body.floorId);
        if (!floor) {
            return res.status(404).json({
                type: 'Error',
                status: 'Not found',
                message: 'Floor not found',
                path: req.originalUrl
            });
        }
        let bodyClone = { ...req.body };
        delete bodyClone.floorId;
        floor.desks.push(bodyClone);

        let updateResponse = await FloorModel.update(req.body.floorId, floor);
        let response = {
            code: 'success',
            message: 'Desk added',
            data: updateResponse,
        }
        res.status(200).json(response);
    } catch (err) {
        res.status(500).send(err);
    }
}