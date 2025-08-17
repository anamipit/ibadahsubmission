# Debug Checklist - Data Tidak Muncul

Saya sudah menambahkan console.log di berbagai tempat untuk membantu debug. Ikuti langkah berikut:

## 1. Restart Server
```bash
npm run dev
```

## 2. Cek Console Server (Terminal)
Saat server start, Anda harus melihat:
```
🔧 Supabase Configuration:
- URL: https://yourproject.supabase.co...
- Key: eyJhbGciOiJIUzI1NiIsInR5c...
✅ Supabase client created successfully
Server is running on http://localhost:3000
```

**Jika tidak muncul:** Ada masalah dengan file `.env`

## 3. Cek Browser Console (F12 → Console)
Buka http://localhost:3000 dan lihat console browser. Anda harus melihat:
```
🔄 Starting to fetch submissions...
📡 Fetch response: { status: 200, statusText: "OK", ok: true }
📊 Received submissions data: [...]
📊 Number of submissions: X
🎨 Displaying submissions in table...
```

## 4. Cek Terminal Server Logs
Saat halaman dimuat, terminal harus menampilkan:
```
📊 Attempting to fetch submissions from Supabase...
🔍 Supabase response:
- Data: [array of submissions]
- Error: null
- Data length: X
✅ Successfully fetched submissions, sending response...
```

## 5. Kemungkinan Masalah & Solusi:

### A. Environment Variables Tidak Terbaca
**Gejala:** Server crash dengan error "Missing Supabase environment variables"
**Solusi:** 
1. Pastikan file `.env` ada di root folder
2. Pastikan tidak ada spasi di sekitar `=`
3. Restart server setelah mengubah `.env`

### B. Supabase Connection Error
**Gejala:** Error di terminal seperti "Failed to fetch submissions"
**Solusi:**
1. Cek URL dan Key Supabase benar
2. Pastikan tabel `submissions` ada
3. Cek RLS (Row Level Security) policy

### C. RLS Policy Problem
**Gejala:** Data kosong tapi tidak ada error
**Solusi:** Jalankan SQL ini di Supabase SQL Editor:
```sql
-- Buat policy untuk read access
CREATE POLICY "Public read access" 
ON public.submissions 
FOR SELECT 
USING (true);
```

### D. Network/CORS Error
**Gejala:** Error di browser console tentang CORS atau network
**Solusi:** Server sudah setup CORS, restart server

### E. Data Format Issue
**Gejala:** Error saat parsing response
**Solusi:** Cek struktur data di Supabase sesuai dengan yang diharapkan

## 6. Manual Test API
Test langsung di browser:
```
http://localhost:3000/api/submissions
```

Harus return JSON array dengan submissions.

## 7. Cek Supabase RLS
Di Supabase Dashboard → Table Editor → submissions → RLS should be ON dengan policy yang benar.

## 8. Debugging Commands
```bash
# Cek apakah .env terbaca
node -e "require('dotenv').config(); console.log(process.env.SUPABASE_URL);"

# Test koneksi langsung
node -e "
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
supabase.from('submissions').select('*').then(console.log);
"
```

Jalankan server dan buka browser, lalu kirim screenshot console log dari browser dan terminal!