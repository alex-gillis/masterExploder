import { supabase } from '../Supabase.js';

export async function upsertCustomUser(user) {
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert({
        auth_user_id: user.id,  
        name: user.email,       
        highscore: 0,           
        waveNumber: 1,
        currentEnemies: 3,
        currentScore: 0,
        currentHealth: 3
      }, { onConflict: 'auth_user_id' });
      
    if (error) {
      console.error('Error upserting custom user:', error);
      return null;
    }
    console.log('Custom user upserted successfully:', data);
    return data;
  } catch (err) {
    console.error('Unexpected error in upsertCustomUser:', err);
    return null;
  }
}
