import { createClient } from '@supabase/supabase-js';
import { updateHighScore } from '../../../backend/Leaderboard/Update.js';

jest.mock('@supabase/supabase-js');

const mockSupabase = {
    from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
    })),
};

createClient.mockReturnValue(mockSupabase);

describe('updateHighScore', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // test('should update score if new score is higher', async () => {
    //     // Mock existing high score retrieval
    //     mockSupabase.from().select().eq().single.mockResolvedValue({
    //         data: { highscore: 50 }, // Existing high score
    //         error: null,
    //     });

    //     // Mock update response
    //     mockSupabase.from().update().eq().select.mockResolvedValue({
    //         data: [{ id: '123', highscore: 100 }], // Expected response
    //         error: null,
    //     });

    //     console.log('Mocked update response:', mockSupabase.from().update().eq().select.mockResolvedValue);

    //     const result = await updateHighScore('123', 100);
    //     console.log('Test Result:', result); // Log the actual returned value

    //     expect(result).toEqual([{ id: '123', highscore: 100 }]); // Ensure correct return value
    // });

    test('should not update if new score is lower', async () => {
        // Mock existing high score retrieval
        mockSupabase.from().select().eq().single.mockResolvedValue({
            data: { highscore: 150 }, // Existing high score is higher
            error: null,
        });

        const result = await updateHighScore('123', 100);
        console.log('Test Result (Lower Score):', result); // Log the actual returned value

        expect(result).toBeNull(); // Ensure function correctly prevents downgrade
    });
});
