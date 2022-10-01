import express from "express";
import "express-async-errors";
import cors from "cors";

import prisma from "./lib/prisma/client";

import {
    validate,
    planetSchema,
    PlanetData,
    ValidationErrorMiddleware,
} from "./lib/validation";

const corsOption = {
    origin: "http://localhost:8080",
};

import { initMulterMiddleware } from "./lib/middleware/multer";

const upload = initMulterMiddleware();

const app = express();

app.use(express.json());

app.use(cors(corsOption));

app.get("/planets", async (request, response) => {
    const planets = await prisma.planet.findMany();

    response.json(planets);
});

app.get("/planet/:id(\\d+)", async (request, response, next) => {
    const planetId = Number(request.params.id);

    const planet = await prisma.planet.findUnique({
        where: { id: planetId },
    });

    if (!planet) {
        response.status(404);
        return next(`Cannot GET /planet/${planetId}`); //`string text`
    }

    response.json(planet);
});

app.post(
    "/planets",
    validate({ body: planetSchema }),
    async (request, response) => {
        const planetData: PlanetData = request.body;
        const planet = await prisma.planet.create({
            data: planetData,
        });

        response.status(201).json(planet);
    }
);

app.put(
    "/planets/:id(\\d+)",
    validate({ body: planetSchema }),
    async (request, response, next) => {
        const planetId = Number(request.params.id);
        const planetData: PlanetData = request.body;

        try {
            const planet = await prisma.planet.update({
                where: { id: planetId },
                data: planetData,
            });

            response.status(200).json(planet);
        } catch (e) {
            response.status(404);
            next("Cannot PUT /planets/" + planetId);
        }
    }
);

app.delete("/planet/:id(\\d+)", async (request, response, next) => {
    const planetId = Number(request.params.id);

    try {
        await prisma.planet.delete({
            where: { id: planetId },
        });

        response.status(204).end();
    } catch (e) {
        response.status(404);
        next("Cannot DELETE /planet/" + planetId);
    }
});

app.post(
    "/planets/:id(\\d+)/photo",
    upload.single("photo"),
    async (request, response, next) => {
        console.log("request.file", request.file);

        if (!request.file) {
            response.status(400);
            return next("No photo file upload");
        }

        const photoFilename = request.file.filename;

        response.status(201).json({ photoFilename });
    }
);

app.use(ValidationErrorMiddleware);

export default app;
