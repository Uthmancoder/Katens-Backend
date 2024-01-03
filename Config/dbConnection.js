const mongoose = require("mongoose")
const env = require("dotenv").config();

// declaring the MongoDB URL
const MongoUrl = process.env.MONGO_URL;

// connecting to the database
const connect = () => {
    mongoose.set("strictQuery", false);
    mongoose.connect(MongoUrl, {
        useNewUrlParser: true, // Corrected option name
        useUnifiedTopology: true,
    });

    const DBconnection = mongoose.connection;

    DBconnection.on("error", (err) => {
        console.error("Error connecting to the database:", err);
    });

    DBconnection.once("open", () => {
        console.log("Connected to the database");
    });

    DBconnection.on("disconnected", () => {
        console.log("Database Disconnected. Reconnecting ...");
        // Attempt to reconnect after a delay
        setTimeout(() => connect(), 5000); // Reconnect after a 5-second delay
    });
}
module.exports = connect