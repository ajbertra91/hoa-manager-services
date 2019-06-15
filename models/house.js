const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mgHouseSchema = new Schema({
    lot: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    contactInfo: Schema.Types.Mixed,
    owners: {
        type: [Schema.Types.Mixed],
        required: true
    },
    requests: [Schema.Types.Mixed],
    hoaFeePaid: [Schema.Types.Mixed],
    violations: [Schema.Types.Mixed]
});

module.exports = mongoose.model('House', mgHouseSchema);