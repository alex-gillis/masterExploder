import { vi } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { logoutUser } from '../../../backend/Users/Logout.js';

vi.mock('@supabase/supabase-js');

const mockSupabase = {
    auth: {
        signOut: vi.fn(),
    },
};

createClient.mockReturnValue(mockSupabase);

describe('logoutUser', () => {
    beforeEach(() => {
        vi.clearAllMocks();
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
