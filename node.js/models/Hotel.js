const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hotelSchema = new Schema({
    name: {
        type: String,
    },
    fabricationDate: {
        type: Date,
    },
    nbrRooms: {
        type: Number,
        default: 10,
    },
});

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
