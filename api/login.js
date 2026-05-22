import { createClient } from "@supabase/supabase-js";

// 1. Siapkan koneksi ke Supabase (URL dan Key-nya nanti disetting di Vercel)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // 2. Tolak akses kalau request-nya bukan pengiriman data (POST)
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method tidak diizinkan" });
  }

  // 3. Tangkap email dan password yang diketik user
  const { email, password } = req.body;

  // 4. Minta Supabase untuk ngecek login user
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  // 5. Kalau gagal (misal: password salah), balikin pesan error
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  // 6. Kalau berhasil, balikin pesan sukses
  return res.status(200).json({ message: "Login berhasil!", user: data.user });
}
