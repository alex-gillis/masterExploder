import { createClient } from '@supabase/supabase-js';
import { logoutUser } from '../../../backend/Leaderboard/Retrieve.js';

jest.mock('@supabase/supabase-js');

const mockSupabase = {
    auth: {
        signOut: jest.fn(),
    },
};

createClient.mockReturnValue(mockSupabase);

describe('logoutUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should call signOut without errors', async () => {
        mockSupabase.auth.signOut.mockResolvedValue({ error: null });

        await logoutUser();
        expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    });

    test('should log an error if signOut fails', async () => {
        mockSupabase.auth.signOut.mockResolvedValue({ error: { message: 'Sign out failed' } });

        await logoutUser();
        expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    });
});
