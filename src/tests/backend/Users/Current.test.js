import { vi } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { getCurrentUser } from '../../../backend/Users/Current.js';

vi.mock('@supabase/supabase-js');

const mockSupabase = {
    auth: {
        getUser: vi.fn(),
    },
};

createClient.mockReturnValue(mockSupabase);

describe('getCurrentUser', () => {
    beforeEach(() => {
        vi.clearAllMocks();
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
