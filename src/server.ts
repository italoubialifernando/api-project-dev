import express from "express";
import "express-async-errors";

const app = express();

app.get("/", (req, res) => {
    res.send("running");
});

const port = 3030;

app.listen(port, () => {
    console.log("[server]: server run port http://localhost:" + port);
});
