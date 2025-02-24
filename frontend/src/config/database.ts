import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase credentials are missing');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Test de connexion
supabase
  .from('users')
  .select('*')
  .then(({ data, error }) => {
    if (error) console.error('Erreur connexion DB:', error);
    else console.log('Connexion DB réussie, utilisateurs trouvés:', data?.length);
  }); 
