"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
const client_1 = __importDefault(require("./lib/prisma/client"));
const validation_1 = require("./lib/validation");
const corsOption = {
    origin: "http://localhost:8080",
};
const multer_1 = require("./lib/middleware/multer");
const upload = (0, multer_1.initMulterMiddleware)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOption));
app.get("/planets", async (request, response) => {
    const planets = await client_1.default.planet.findMany();
    response.json(planets);
});
app.get("/planet/:id(\\d+)", async (request, response, next) => {
    const planetId = Number(request.params.id);
    const planet = await client_1.default.planet.findUnique({
        where: { id: planetId },
    });
    if (!planet) {
        response.status(404);
        return next(`Cannot GET /planet/${planetId}`); //`string text`
    }
    response.json(planet);
});
app.post("/planets", (0, validation_1.validate)({ body: validation_1.planetSchema }), async (request, response) => {
    const planetData = request.body;
    const planet = await client_1.default.planet.create({
        data: planetData,
    });
    response.status(201).json(planet);
});
app.put("/planets/:id(\\d+)", (0, validation_1.validate)({ body: validation_1.planetSchema }), async (request, response, next) => {
    const planetId = Number(request.params.id);
    const planetData = request.body;
    try {
        const planet = await client_1.default.planet.update({
            where: { id: planetId },
            data: planetData,
        });
        response.status(200).json(planet);
    }
    catch (e) {
        response.status(404);
        next("Cannot PUT /planets/" + planetId);
    }
});
app.delete("/planet/:id(\\d+)", async (request, response, next) => {
    const planetId = Number(request.params.id);
    try {
        await client_1.default.planet.delete({
            where: { id: planetId },
        });
        response.status(204).end();
    }
    catch (e) {
        response.status(404);
        next("Cannot DELETE /planet/" + planetId);
    }
});
app.post("/planets/:id(\\d+)/photo", upload.single("photo"), async (request, response, next) => {
    if (!request.file) {
        response.status(400);
        return next("No photo file upload");
    }
    const planetId = Number(request.params.id);
    const photoFilename = request.file.filename;
    try {
        await client_1.default.planet.update({
            where: { id: planetId },
            data: { photoFilename },
        });
        response.status(201).json({ photoFilename });
    }
    catch (error) {
        response.status(404);
        next("Cannot POST /planets/" + planetId + "/photo");
    }
});
app.use("/planets/photos", express_1.default.static("uploads"));
app.use(validation_1.ValidationErrorMiddleware);
exports.default = app;
//# sourceMappingURL=app.js.map