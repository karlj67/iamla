import { createClient } from '@supabase/supabase-js';

// Vérifier que les variables d'environnement sont bien définies
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Configuration Supabase manquante dans les variables d\'environnement');
}

export const supabase = createClient(supabaseUrl, supabaseKey); 