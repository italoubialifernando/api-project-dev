import supertest from "supertest";
import { prismaMock } from "./lib/prisma/client.mock";
import app from "./app";

const request = supertest(app);

describe("GET /planets", () => {
    test("Valid request", async () => {
        const planets = [
            {
                id: 2,
                name: "Venus",
                description: null,
                diameter: 124,
                moons: 0,
                createdAt: "2022-09-25T20:33:36.194Z",
                updateAA: "2022-09-25T20:33:23.421Z",
            },
            {
                id: 1,
                name: "Mercury",
                description: null,
                diameter: 1234,
                moons: 32,
                createdAt: "2022-09-25T20:32:58.206Z",
                updateAA: "2022-09-25T20:33:45.981Z",
            },
        ];

        // @ts-ignore
        prismaMock.planet.findMany.mockResolvedValue(planets);

        const response = await request
            .get("/planets")
            .expect(200)
            .expect("Content-Type", /application\/json/);

        expect(response.body).toEqual(planets);
    });
});
describe("GET /planet/:id", () => {
    test("Valid request", async () => {
        const planet = {
            id: 1,
            name: "Mercury",
            description: null,
            diameter: 1234,
            moons: 32,
            createdAt: "2022-09-25T20:32:58.206Z",
            updateAA: "2022-09-25T20:33:45.981Z",
        };

        // @ts-ignore
        prismaMock.planet.findUnique.mockResolvedValue(planet);

        const response = await request
            .get("/planet/1")
            .expect(200)
            .expect("Content-Type", /application\/json/);

        expect(response.body).toEqual(planet);
    });
    test("Planet does not exist", async () => {
        // @ts-ignore
        prismaMock.planet.findUnique.mockResolvedValue(null);

        const response = await request
            .get("/planet/23")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot GET /planet/23");
    });

    test("Invalid planet ID", async () => {
        const response = await request
            .get("/planet/oafna")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot GET /planet/oafna");
    });
});

describe("POST /planets", () => {
    test("Valid request", async () => {
        const planet = {
            id: 3,
            name: "Venus",
            description: null,
            diameter: 124,
            moons: 0,
            createdAt: "2022-09-26T08:00:22.218Z",
            updateAA: "2022-09-26T08:00:22.218Z",
        };

        // @ts-ignore
        prismaMock.planet.create.mockResolvedValue(planet);

        const response = await request
            .post("/planets")
            .send({
                name: "Venus",
                diameter: 324,
                moons: 0,
            })
            .expect(201)
            .expect("Content-Type", /application\/json/);

        expect(response.body).toEqual(planet);
    });

    test("Invalid request", async () => {
        const planet = {
            diameter: 324,
            moons: 0,
        };

        const response = await request
            .post("/planets")
            .send(planet)
            .expect(404)
            .expect("Content-Type", /application\/json/);

        expect(response.body).toEqual({
            e: {
                body: expect.any(Array),
            },
        });
    });
});
