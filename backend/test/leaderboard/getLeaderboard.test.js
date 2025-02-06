const request = require('supertest');
const app = require('../../index'); 

describe('Leaderboard API', () => {
    test('Fetch top 10 players', async () => {
        const res = await request(app).get('/api/get-leaderboard');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('leaderboard');
        expect(Array.isArray(res.body.leaderboard)).toBe(true);
    });

    test('Handle database error', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {}); // Silence errors

        const mockSupabase = require('../src/services/supabaseClient');
        jest.spyOn(mockSupabase, 'from').mockReturnValue({
            select: jest.fn().mockReturnValue({
                order: jest.fn().mockReturnValue({
                    limit: jest.fn().mockRejectedValue(new Error('Database error')),
                }),
            }),
        });

        const res = await request(app).get('/api/get-leaderboard');
        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});
