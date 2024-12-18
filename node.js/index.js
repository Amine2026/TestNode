const express = require("express");
const mongoose = require("mongoose");
const app = express();

const Hotel = require("./models/Hotel");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoURI = "mongodb://127.0.0.1:27017/CRUDHotel";
mongoose
    .connect(mongoURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

app.post("/hotels", async (req, res) => {
    try {
        const { name, fabricationDate, nbrRooms } = req.body;
        const newHotel = new Hotel({ name, fabricationDate, nbrRooms });
        await newHotel.save();
        res.status(201).send({ message: "Hotel created successfully", hotel: newHotel });
    } catch (error) {
        console.error("Error creating hotel:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});

app.get("/hotels", async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).send(hotels);
    } catch (error) {
        console.error("Error fetching hotels:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});

app.get("/hotels/:id", async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(404).send({ error: "Hotel not found" });
        }
        res.status(200).send(hotel);

    } catch (error) {
        console.error("Error fetching hotel:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});

app.put("/hotels/:id", async (req, res) => {
    try {
        const { name, fabricationDate, nbrRooms  } = req.body;

        const updatedHotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            { name, fabricationDate, nbrRooms },
            { new: true, runValidators: true }
        );

        if (!updatedHotel) {
            return res.status(404).send({ error: "Hotel not found" });
        }

        res.status(200).send({ message: "Hotel updated successfully", hotel: updatedHotel });
    } catch (error) {
        console.error("Error updating hotel:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});

app.delete("/hotels/:id", async (req, res) => {
    try {
        const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);

        if (!deletedHotel) {
            return res.status(404).send({ error: "Hotel not found" });
        }

        res.status(200).send({ message: "Hotel deleted successfully", hotel: deletedHotel });
    } catch (error) {
        console.error("Error deleting hotel:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});

app.get("/find/", async (req, res) => {
    try {
        const hotels = await Hotel.find({nbrRooms : {$gte:10 , $lte:100}});

        if (hotels.length === 0) {
            return res.status(404).send({ message: "No hotels found with this capacity" });
        }

        res.status(200).send(hotels);
    } catch (error) {
        console.error("Error finding hotels:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
