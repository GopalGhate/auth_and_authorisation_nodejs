// Create a node server

const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const MONOGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/node_authentication_db";
const PORT = process.env.port || 5000;

const app = express();
app.use(express.json());



const dbConnect = async () => {
    try{
        await mongoose.connect(MONOGO_URI);
        console.log("Connected to database");
    }
    catch(error){
        console.log("error", error);
    }
}


app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal Server Error"
    });
  });

//   Start db connection
dbConnect();


// Routes goes here
app.use("/user/", userRoutes);

// Start server
app.listen(PORT, () => {
    console.log("server started")
})