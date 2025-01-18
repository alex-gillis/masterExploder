async function registerUser(name, email, password) {
    // Step 1: Register with Supabase Auth
    const { user, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        console.error('Error during registration:', error.message);
        return null;
    }

    // Step 2: Add additional fields to the users table
    const { data, error: insertError } = await supabase
        .from('users')
        .insert([{ id: user.id, name, email, highscore: 0, role: 'player' }]);

    if (insertError) {
        console.error('Error inserting user data:', insertError.message);
        return null;
    }

    console.log('User registered successfully:', data);
    return data;
}

async function loginUser(email, password) {
    const { user, error } = await supabase.auth.signIn({
        email,
        password,
    });

    if (error) {
        console.error('Error during login:', error.message);
        return null;
    }

    console.log('User logged in successfully:', user);
    return user;
}