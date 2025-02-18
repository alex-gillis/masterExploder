import { createClient } from '@supabase/supabase-js';
import { getLeaderboard } from '../../../backend/Leaderboard/Retrieve.js';

jest.mock('@supabase/supabase-js');

const mockSupabase = {
    from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
    })),
};

createClient.mockReturnValue(mockSupabase);

describe('getLeaderboard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return a list of top users', async () => {
        // Ensure mock data is correctly set
        const mockData = [
            { name: 'player1', highscore: 100 },
            { name: 'player2', highscore: 90 }
        ];

        mockSupabase.from().select().order().limit.mockResolvedValue({
            data: mockData,
            error: null,
        });

        const leaderboard = await getLeaderboard();
        console.log('Leaderboard result:', leaderboard); // Debugging output
        expect(leaderboard).toEqual(mockData);
    });
});
