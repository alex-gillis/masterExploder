import { createClient } from '@supabase/supabase-js';
import { registerUser } from '../../../backend/Leaderboard/Retrieve.js';

jest.mock('@supabase/supabase-js');

const mockSupabase = {
    from: jest.fn(() => ({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnThis(),
    })),
};

createClient.mockReturnValue(mockSupabase);

describe('registerUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return user ID on successful registration', async () => {
        mockSupabase.from().insert().select().single.mockResolvedValue({ data: { id: '123' }, error: null });

        const userId = await registerUser('newuser', 'password');
        expect(userId).toEqual('123');
    });

    test('should return null on registration failure', async () => {
        mockSupabase.from().insert().select().single.mockResolvedValue({ data: null, error: { message: 'Insert error' } });

        const userId = await registerUser('newuser', 'password');
        expect(userId).toBeNull();
    });
});
