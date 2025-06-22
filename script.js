// Ganti dengan URL dan Kunci Anon dari akun Supabase kamu
const SUPABASE_URL = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwdm5pbmJicGV3bHh0eWZtYnBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MTAxNDEsImV4cCI6MjA2NjE4NjE0MX0.Bq5xZ3dsfSNIz0ZyyCe6qKIXigIuak87ht4SVtIYlVI';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwdm5pbmJicGV3bHh0eWZtYnBkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDYxMDE0MSwiZXhwIjoyMDY2MTg2MTQxfQ.RWuvJcKllXNgoYqde9DAw_yVRcgKj1lKrlemf-mJJr8';

// Membuat koneksi ke Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Bagian utama kode ---

// Memilih elemen-elemen dari HTML
const form = document.getElementById('form-absen');
const notifikasi = document.getElementById('notifikasi');
const tombolKirim = document.getElementById('tombol-kirim');

// Menambahkan 'event listener' ke form
// Kode di dalam ini akan berjalan saat tombol "Kirim Absensi" di-klik
form.addEventListener('submit', async (event) => {
    // Mencegah form mengirim data dengan cara default (yang bikin halaman refresh)
    event.preventDefault();

    // Menonaktifkan tombol saat proses pengiriman
    tombolKirim.disabled = true;
    tombolKirim.innerHTML = 'Mengirim...';
    
    // Mengambil data dari setiap input di form
    const nama = document.getElementById('nama').value;
    const nim = document.getElementById('nim').value;
    const divisi = document.getElementById('divisi').value;
    const ambilKonsumsi = document.getElementById('konsumsi').checked; // true atau false

    // Mengirim data ke tabel 'absensi' di Supabase
    const { data, error } = await supabase
        .from('absensi') // Nama tabel yang kita buat
        .insert([
            { 
                nama: nama, 
                nim: nim, 
                divisi: divisi, 
                konsumsi: ambilKonsumsi 
            },
        ]);
        
    // Cek apakah ada error saat pengiriman
    if (error) {
        console.error('Error:', error);
        // Tampilkan notifikasi gagal
        notifikasi.innerHTML = `<div class="alert alert-danger">Gagal mengirim absen! Coba lagi. Error: ${error.message}</div>`;
    } else {
        console.log('Success:', data);
        // Tampilkan notifikasi berhasil
        notifikasi.innerHTML = `<div class="alert alert-success">Absen berhasil terkirim! Terima kasih.</div>`;
        // Kosongkan form setelah berhasil
        form.reset();
    }
    
    // Mengaktifkan kembali tombol setelah selesai
    tombolKirim.disabled = false;
    tombolKirim.innerHTML = 'Kirim Absensi';
});