import { vi } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { updateHighScore } from '../src/Update.js';

vi.mock('@supabase/supabase-js');

const mockSupabase = {
    from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
    })),
};

createClient.mockReturnValue(mockSupabase);

describe('updateHighScore', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should update score if new score is higher', async () => {
        mockSupabase.from().select().eq().single.mockResolvedValue({ data: { highscore: 50 }, error: null });
        mockSupabase.from().update().eq.mockResolvedValue({ data: { id: '123', highscore: 100 }, error: null });

        const result = await updateHighScore('123', 100);
        expect(result).toEqual({ id: '123', highscore: 100 });
    });

    test('should not update if new score is lower', async () => {
        mockSupabase.from().select().eq().single.mockResolvedValue({ data: { highscore: 150 }, error: null });

        const result = await updateHighScore('123', 100);
        expect(result).toBeNull();
    });
});
