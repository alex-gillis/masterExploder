import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { loginUser } from '../../../backend/Leaderboard/Retrieve.js';

jest.mock('@supabase/supabase-js');

const mockSupabase = {
    from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnThis(),
    })),
};

createClient.mockReturnValue(mockSupabase);

describe('loginUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return user data on successful login', async () => {
        const hashedPassword = bcrypt.hashSync('password', 10);
        mockSupabase.from().eq().single.mockResolvedValue({
            data: { id: '123', name: 'testuser', password: hashedPassword, highscore: 100, admin: false },
            error: null,
        });

        const user = await loginUser('testuser', 'password');
        expect(user).toEqual({ id: '123', username: 'testuser', highscore: 100, admin: false });
    });

    test('should return null if user is not found', async () => {
        mockSupabase.from().eq().single.mockResolvedValue({ data: null, error: { message: 'User not found' } });

        const user = await loginUser('testuser', 'password');
        expect(user).toBeNull();
    });

    test('should return null if password is incorrect', async () => {
        mockSupabase.from().eq().single.mockResolvedValue({
            data: { id: '123', name: 'testuser', password: bcrypt.hashSync('wrongpassword', 10) },
            error: null,
        });

        const user = await loginUser('testuser', 'password');
        expect(user).toBeNull();
    });
});
