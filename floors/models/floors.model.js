const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const floorSchema = new Schema({
    floorName: String,
    desks: [
        {
            deskName: String,
            deskType: String,
            deskPosition: {
                x: Number,
                y: Number
            },
            chairs: [
                {
                    chairName: String,
                    chairType: String,
                    booked: {
                        type: Boolean,
                        default: false
                    },
                    chairPosition: {
                        x: Number,
                        y: Number
                    }
                }
            ]
        }
    ]
}, {
    timestamps: true
});

floorSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
floorSchema.set('toJSON', {
    virtuals: true
});

floorSchema.findById = function (cb) {
    return this.model('Floors').find({ id: this.id }, cb);
};

const Floor = mongoose.model('Floors', floorSchema);

exports.findById = (id) => {
    return Floor.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createFloor = (floorData) => {
    const floor = new Floor(floorData);
    return floor.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Floor.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            })
    });
};

exports.patchFloor = (id, floorData) => {
    return new Promise((resolve, reject) => {
        Floor.findById(id, function (err, floor) {
            if (err) reject(err);
            for (let i in floorData) {
                floor[i] = floorData[i];
            }
            Floor.save(function (err, updatedFloor) {
                if (err) return reject(err);
                resolve(updatedFloor);
            });
        });
    })

};

exports.removeById = (floorId) => {
    return new Promise((resolve, reject) => {
        Floor.remove({ _id: floorId }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

exports.update = (id, floor) => {
    return new Promise((resolve, reject) => {
        Floor.findOneAndUpdate({ _id: id }, floor, { new: true, upsert: true, setDefaultsOnInsert: true }, (error, doc) => {
            if (error) {
                reject(error);
            } else {
                resolve(doc);
            }
        });
    })
}

