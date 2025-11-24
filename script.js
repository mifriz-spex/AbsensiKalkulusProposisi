function tampilkanFormLanjutan() {
    const statusUtama = document.getElementById('statusUtama').value;
    
    // Sembunyikan semua dulu
    document.getElementById('formHadir').classList.add('hidden');
    document.getElementById('formTidakHadir').classList.add('hidden');
    document.getElementById('resultBox').classList.add('hidden');

    if (statusUtama === 'Hadir') {
        document.getElementById('formHadir').classList.remove('hidden');
    } else if (statusUtama === 'Tidak') {
        document.getElementById('formTidakHadir').classList.remove('hidden');
    }
}

function cekKeterlambatan() {
    const isTelat = document.getElementById('isTelat').value;
    const boxAlasan = document.getElementById('boxAlasan');
    isTelat === 'Y' ? boxAlasan.classList.remove('hidden') : boxAlasan.classList.add('hidden');
}

function cekIzin() {
    const isIzin = document.getElementById('isIzin').value;
    const boxBukti = document.getElementById('boxBukti');
    isIzin === 'Y' ? boxBukti.classList.remove('hidden') : boxBukti.classList.add('hidden');
}

function prosesAbsensi() {
    // 1. Ambil Semua Element
    const nama = document.getElementById('namaMahasiswa').value;
    const statusUtama = document.getElementById('statusUtama').value;
    
    // Element Input File
    const fileHadir = document.getElementById('buktiHadir'); // Kehadiran
    const fileTelat = document.getElementById('buktiTelat'); // Bukti Macet
    const fileIzin = document.getElementById('buktiIzin');   // Surat Dokter

    // Output Elements
    const resultBox = document.getElementById('resultBox');
    const statusText = document.getElementById('statusText');
    const evidenceList = document.getElementById('evidenceList');
    const resultName = document.getElementById('resultName');

    // 2. Validasi Nama
    if (nama.trim() === "") { alert("Isi Nama Lengkap dulu!"); return; }
    if (statusUtama === "") { alert("Pilih Status Kehadiran!"); return; }

    let finalStatus = "";
    let cssClass = "";
    let buktiText = ""; // String untuk menampung daftar bukti

    // --- LOGIKA UTAMA (PROPOSIONAL CALCULUS) ---

    // SKENARIO A: HADIR (p)
    if (statusUtama === 'Hadir') {
        
        // Validasi: Wajib Upload Selfie (s)
        // Logika: p -> s (Jika Hadir, Maka Wajib Ada Selfie)
        if (fileHadir.files.length === 0) {
            alert("Wajib upload bukti kehadiran!");
            return;
        }

        const isTelat = document.getElementById('isTelat').value;

        // Sub-Skenario A1: Tepat Waktu (p ^ ~q)
        if (isTelat === 'N') {
            finalStatus = "HADIR (TEPAT WAKTU)";
            cssClass = "hadir";
            buktiText += `<div class='evidence-item'>Bukti Hadir: ${fileHadir.files[0].name}</div>`;
        } 
        // Sub-Skenario A2: Terlambat (p ^ q)
        else {
            // Validasi: Wajib Upload Bukti Telat (t)
            // Logika: (p ^ q) -> (s ^ t)
            if (fileTelat.files.length === 0) {
                alert("⚠️ Karena terlambat, wajib upload bukti keterlambatan (misal: foto macet)!");
                return;
            }
            
            const alasan = document.getElementById('alasanTelat').value;
            if (alasan.trim() === "") { alert("Isi alasan keterlambatan!"); return; }

            finalStatus = "TERLAMBAT";
            cssClass = "telat";
            
            // Tampilkan kedua bukti (Selfie + Bukti Macet)
            buktiText += `<div class='evidence-item'>Bukti Hadir: ${fileHadir.files[0].name}</div>`;
            buktiText += `<div class='evidence-item'>Bukti Telat: ${fileTelat.files[0].name}</div>`;
            buktiText += `<div class='evidence-item' style='color:#b37e03'><i>Alasan: "${alasan}"</i></div>`;
        }
    } 
    // SKENARIO B: TIDAK HADIR (~p)
    else {
        const isIzin = document.getElementById('isIzin').value;
        
        // Sub-Skenario B1: Izin (~p ^ r)
        if (isIzin === 'Y') {
            if (fileIzin.files.length === 0) { alert("Wajib upload Surat Izin/Sakit!"); return; }
            
            finalStatus = "IZIN / SAKIT";
            cssClass = "izin";
            buktiText += `<div class='evidence-item'>Surat Izin: ${fileIzin.files[0].name}</div>`;
        } 
        // Sub-Skenario B2: Alpha (~p ^ ~r)
        else {
            finalStatus = "ALPHA (TANPA KETERANGAN)";
            cssClass = "alpha";
            buktiText += `<div class='evidence-item'>Tidak ada bukti yang dilampirkan.</div>`;
        }
    }

    // 3. Render Output
    resultName.innerHTML = `Mahasiswa: <b>${nama}</b>`;
    statusText.textContent = finalStatus;
    evidenceList.innerHTML = buktiText;
    
    resultBox.className = "result-box " + cssClass;
}