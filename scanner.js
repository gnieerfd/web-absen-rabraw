// --- KONFIGURASI SUPABASE ---
const SUPABASE_URL = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwdm5pbmJicGV3bHh0eWZtYnBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MTAxNDEsImV4cCI6MjA2NjE4NjE0MX0.Bq5xZ3dsfSNIz0ZyyCe6qKIXigIuak87ht4SVtIYlVI';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwdm5pbmJicGV3bHh0eWZtYnBkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDYxMDE0MSwiZXhwIjoyMDY2MTg2MTQxfQ.RWuvJcKllXNgoYqde9DAw_yVRcgKj1lKrlemf-mJJr8';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- ELEMEN HTML ---
const resultDiv = document.getElementById('result');

// --- FUNGSI UTAMA ---

// Fungsi ini akan berjalan jika scan berhasil
async function onScanSuccess(decodedText, decodedResult) {
    // Hentikan scan sementara agar tidak scan berkali-kali
    html5QrcodeScanner.pause();

    const nim = decodedText;
    resultDiv.innerHTML = `Mencari NIM: ${nim}...`;
    resultDiv.className = 'alert alert-info';

    try {
        // 1. Cek apakah panitia dengan NIM ini ada di database
        let { data: panitia, error: panitiaError } = await supabase
            .from('panitia')
            .select('nama_lengkap, divisi')
            .eq('nim', nim)
            .single(); // .single() untuk ambil satu data saja

        if (panitiaError || !panitia) {
            throw new Error("Panitia tidak ditemukan!");
        }

        // (Opsional Lanjutan) Cek apakah hari ini sudah absen atau belum
        // Ini mencegah double-scan. Kamu bisa kembangkan logika ini.

        // 2. Jika panitia ditemukan, masukkan data ke tabel 'kehadiran'
        const { error: insertError } = await supabase
            .from('kehadiran')
            .insert([{ nim_panitia: nim, tipe_absen: 'KEHADIRAN' }]);

        if (insertError) {
            throw new Error(`Gagal mencatat kehadiran: ${insertError.message}`);
        }

        // 3. Tampilkan pesan sukses
        resultDiv.innerHTML = `✅ BERHASIL!<br><span class="math-inline">\{panitia\.nama\_lengkap\} \(</span>{panitia.divisi})`;
        resultDiv.className = 'alert alert-success';

    } catch (error) {
        // Jika ada error di salah satu langkah, tampilkan pesan gagal
        resultDiv.innerHTML = `❌ GAGAL!<br>${error.message}`;
        resultDiv.className = 'alert alert-danger';
    }

    // Jalankan lagi scan setelah 3 detik
    setTimeout(() => {
        resultDiv.innerHTML = "Arahkan QR Code ke Kamera";
        resultDiv.className = '';
        html5QrcodeScanner.resume();
    }, 3000);
}

// Fungsi ini akan berjalan jika scan gagal (bisa diabaikan)
function onScanFailure(error) {
    // console.warn(`QR code scan failed: ${error}`);
}


// --- INISIALISASI SCANNER ---
let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", // ID dari div di HTML
    { fps: 10, qrbox: { width: 250, height: 250 } }, // Konfigurasi
    false // verbose
);
html5QrcodeScanner.render(onScanSuccess, onScanFailure);
