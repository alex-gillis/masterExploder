const request = require('supertest');
const app = require('../../index'); 

describe('Update High Score API', () => {
    let userId = null;

    beforeAll(async () => {
        const res = await request(app)
            .post('/api/register')
            .send({ username: 'TestPlayer', password: 'password123' });

        expect(res.statusCode).toBe(201);
        userId = res.body.userId;
    });

    test('Update high score with a valid higher score', async () => {
        const res = await request(app)
            .post('/api/update-highscore')
            .send({ userId, newScore: 200 });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'High score updated');
    });

    test('Do not update if the new score is lower', async () => {
        const res = await request(app)
            .post('/api/update-highscore')
            .send({ userId, newScore: 100 }); // Lower than 200

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'No update needed');
    });

    test('Fail if missing parameters', async () => {
        const res = await request(app).post('/api/update-highscore').send({});
        expect(res.statusCode).toBe(400);
    });
});
