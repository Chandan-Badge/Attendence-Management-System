import express from "express";
import cors from "cors";
import "dotenv/config";
// import main from "./config/mongoDB.js";

// App config
const app = express();
let port = process.env.PORT || 8080;
// main();


app.get("/", (req, res) => {
    res.send("Server Started.");
})

app.listen(port, () => {
    console.log(`App was listen on port ${port}`);
})