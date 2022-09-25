import supertest from "supertest";
import { prismaMock } from "./lib/prisma/client.mock";
import app from "./app";

const request = supertest(app);

test("GET /planets", async () => {
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

test("POST /planets", async () => {
    const planet = {
        name: "Venus",
        diameter: 324,
        moons: 0,
    };

    const response = await request
        .post("/planets")
        .send(planet)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    expect(response.body).toEqual(planet);
});
