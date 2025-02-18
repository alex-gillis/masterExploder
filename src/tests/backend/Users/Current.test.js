import { createClient } from '@supabase/supabase-js';
import { getCurrentUser } from '../../../backend/Leaderboard/Retrieve.js';

jest.mock('@supabase/supabase-js');

const mockSupabase = {
    auth: {
        getUser: jest.fn(),
    },
};

createClient.mockReturnValue(mockSupabase);

describe('getCurrentUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return user when authenticated', async () => {
        mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: '123' } }, error: null });

        const user = await getCurrentUser();
        expect(user).toEqual({ id: '123' });
    });

    test('should return null on error', async () => {
        mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: { message: 'Error' } });

        const user = await getCurrentUser();
        expect(user).toBeNull();
    });
});
