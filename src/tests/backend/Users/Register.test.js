import { vi } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { registerUser } from '../../../backend/Users/Register.js';

vi.mock('@supabase/supabase-js');

const mockSupabase = {
    from: vi.fn(() => ({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
    })),
};

createClient.mockReturnValue(mockSupabase);

describe('registerUser', () => {
    beforeEach(() => {
        vi.clearAllMocks();
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
