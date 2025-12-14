import { useState, useEffect } from 'react';
import { Concert } from '../types';
import { supabase } from '../supabaseClient';
import { INITIAL_CONCERTS } from '../constants';

export const useConcerts = () => {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch concerts from Supabase
  const fetchConcerts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('concerts')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      // SEEDING LOGIC:
      // If the database is empty (first run), we populate it with the static JSON file.
      // This ensures your historic data is uploaded to the cloud automatically.
      if (!data || data.length === 0) {
        console.log("Database empty. Seeding initial data...");
        await seedInitialData();
      } else {
        setConcerts(data);
      }
    } catch (err: any) {
      console.error('Error fetching concerts:', err.message);
      setError(err.message);
      // Fallback: load from constants if DB connection fails (e.g. table doesn't exist yet)
      setConcerts(INITIAL_CONCERTS);
    } finally {
      setLoading(false);
    }
  };

  const seedInitialData = async () => {
    try {
      // We strip the IDs from INITIAL_CONCERTS to let Supabase generate proper UUIDs
      const dataToInsert = INITIAL_CONCERTS.map(({ id, ...rest }) => rest);
      
      const { data, error } = await supabase
        .from('concerts')
        .insert(dataToInsert)
        .select()
        .order('date', { ascending: false });

      if (error) throw error;
      if (data) setConcerts(data);
      
    } catch (err) {
      console.error("Error seeding data:", err);
      // If seeding fails, we just show local data without crashing
      setConcerts(INITIAL_CONCERTS); 
    }
  };

  useEffect(() => {
    fetchConcerts();
  }, []);

  const addConcert = async (concert: Omit<Concert, 'id'>) => {
    try {
      // Insert into Supabase
      const { data, error } = await supabase
        .from('concerts')
        .insert([concert])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setConcerts(prev => [data, ...prev]);
      }
    } catch (err) {
      alert("Errore nell'aggiunta del concerto su Supabase. Controlla la console.");
      console.error(err);
    }
  };

  const updateConcert = async (id: string, updated: Partial<Concert>) => {
    try {
      // Remove any fields that shouldn't be updated or might cause issues
      const { id: _, ...cleanUpdates } = updated as any;

      const { error } = await supabase
        .from('concerts')
        .update(cleanUpdates)
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setConcerts(prev => prev.map(c => (c.id === id ? { ...c, ...updated } : c)));
    } catch (err) {
      alert("Errore nell'aggiornamento su Supabase.");
      console.error(err);
    }
  };

  const deleteConcert = async (id: string) => {
    try {
      const { error } = await supabase
        .from('concerts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setConcerts(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert("Errore nell'eliminazione su Supabase.");
      console.error(err);
    }
  };

  return { concerts, loading, error, addConcert, updateConcert, deleteConcert };
};