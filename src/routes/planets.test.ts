import supertest from "supertest";
import { prismaMock } from "../lib/prisma/client.mock";
import app from "../app";

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
            .expect("Content-Type", /application\/json/)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080");

        expect(response.body).toEqual(planets);
    });
});

describe("GET /planets/:id", () => {
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
            .get("/planets/1")
            .expect(200)
            .expect("Content-Type", /application\/json/);

        expect(response.body).toEqual(planet);
    });
    test("Planet does not exist", async () => {
        // @ts-ignore
        prismaMock.planet.findUnique.mockResolvedValue(null);

        const response = await request
            .get("/planets/23")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot GET /planets/23");
    });

    test("Invalid planet ID", async () => {
        const response = await request
            .get("/planets/oafna")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot GET /planets/oafna");
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
            .expect("Content-Type", /application\/json/)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080");

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

describe("PUT /planets/:id", () => {
    test("Valid request", async () => {
        const planet = {
            id: 3,
            name: "Venus",
            description: "horrible planet <3",
            diameter: 124,
            moons: 0,
            createdAt: "2022-09-26T08:00:22.218Z",
            updateAA: "2022-09-26T08:00:22.218Z",
        };

        // @ts-ignore
        prismaMock.planet.update.mockResolvedValue(planet);

        const response = await request
            .put("/planets/3")
            .send({
                name: "Venus",
                description: "horrible planet <3",
                diameter: 124,
                moons: 0,
            })
            .expect(200)
            .expect("Content-Type", /application\/json/)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080");

        expect(response.body).toEqual(planet);
    });

    test("Invalid request", async () => {
        const planet = {
            diameter: 324,
            moons: 0,
        };

        const response = await request
            .put("/planets/23")
            .send(planet)
            .expect(404)
            .expect("Content-Type", /application\/json/);

        expect(response.body).toEqual({
            e: {
                body: expect.any(Array),
            },
        });
    });

    test("Planet does not exist", async () => {
        // @ts-ignore
        prismaMock.planet.update.mockRejectedValue(new Error("Error"));

        const response = await request
            .put("/planets/23")
            .send({
                name: "Venus",
                description: "horrible planet <3",
                diameter: 324,
                moons: 0,
            })
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot PUT /planets/23");
    });

    test("Invalid planet ID", async () => {
        const response = await request
            .put("/planets/oafna")
            .send({
                name: "Venus",
                describe: "horrible planet <3",
                diameter: 324,
                moons: 0,
            })
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot PUT /planets/oafna");
    });
});

describe("DELETE /planets/:id", () => {
    test("Valid request", async () => {
        const response = await request
            .delete("/planets/1")
            .expect(204)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080");

        expect(response.text).toEqual("");
    });

    test("Planet does not exist", async () => {
        // @ts-ignore
        prismaMock.planet.delete.mockRejectedValue(new Error("Error"));

        const response = await request
            .delete("/planets/23")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot DELETE /planets/23");
    });

    test("Invalid planet ID", async () => {
        const response = await request
            .delete("/planets/oafna")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot DELETE /planets/oafna");
    });
});

describe("POST /planets/:id/photo", () => {
    test("Valid request with png file upload", async () => {
        await request
            .post("/planets/23/photo")
            .attach("photo", "test-fixtures/photos/file.png")
            .expect(201)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080");
    });

    test("Valid request with jpeg file upload", async () => {
        await request
            .post("/planets/23/photo")
            .attach("photo", "test-fixtures/photos/images.jpg")
            .expect(201)
            .expect("Access-Control-Allow-Origin", "http://localhost:8080");
    });
    test("Invalid request with text file upload", async () => {
        const response = await request
            .post("/planets/23/photo")
            .attach("photo", "test-fixtures/photos/file.txt")
            .expect(500)
            .expect("Content-Type", /text\/html/);
        expect(response.text).toContain(
            "Error: the upload file must be a jpg or png"
        );
    });

    test("planet not exist", async () => {
        //@ts-ignore
        prismaMock.planet.update.mockRejectedValue(new Error("error"));

        const response = await request
            .post("/planets/23/photo")
            .attach("photo", "test-fixtures/photos/file.png")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot POST /planets/23/photo");
    });

    test("invalid planet ID", async () => {
        const response = await request
            .post("/planets/asdf/photo")
            .expect(404)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("Cannot POST /planets/asdf/photo");
    });

    test("Invalid request with no file upload", async () => {
        const response = await request
            .post("/planets/35/photo")
            .expect(400)
            .expect("Content-Type", /text\/html/);

        expect(response.text).toContain("No photo file upload");
    });
});
