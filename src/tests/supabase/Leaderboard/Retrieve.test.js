import { vi } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { getLeaderboard } from '../src/Retrieve.js';

vi.mock('@supabase/supabase-js');

const mockSupabase = {
    from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
    })),
};

createClient.mockReturnValue(mockSupabase);

describe('getLeaderboard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should return a list of top users', async () => {
        mockSupabase.from().select().order().limit.mockResolvedValue({
            data: [{ name: 'player1', highscore: 100 }, { name: 'player2', highscore: 90 }],
            error: null,
        });

        const leaderboard = await getLeaderboard();
        expect(leaderboard).toEqual([{ name: 'player1', highscore: 100 }, { name: 'player2', highscore: 90 }]);
    });

    test('should return an empty array on error', async () => {
        mockSupabase.from().select().order().limit.mockResolvedValue({ data: null, error: { message: 'Error' } });

        const leaderboard = await getLeaderboard();
        expect(leaderboard).toEqual([]);
    });
});
