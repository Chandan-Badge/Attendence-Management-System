import express from "express";
import cors from "cors";
import "dotenv/config";
import main from "./config/mongoDB.js";
import authRouter from "./routes/authRoutes.js";

// App config
const app = express();
let port = process.env.PORT || 8080;
main();

app.use(express.json());
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "*",
    }),
);


app.get("/", (req, res) => {
    res.send("Server Started.");
});

app.use("/api/auth", authRouter);

app.listen(port, () => {
    console.log(`App was listen on port ${port}`);
});