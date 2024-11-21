const express = require("express");
const router = express.Router();
const apiKeys = require("../apiKeys"); // File yang berisi daftar API key dan tanggal kedaluwarsa

// Fungsi untuk format tanggal seperti "Sabtu 12 Agustus 2024 jam 12:00"
function formatDate(date) {
  const options = {
    weekday: 'long', // Nama hari (contoh: Sabtu)
    year: 'numeric', // Tahun (contoh: 2024)
    month: 'long', // Nama bulan (contoh: Agustus)
    day: 'numeric', // Tanggal (contoh: 12)
    hour: '2-digit', // Jam (contoh: 12)
    minute: '2-digit', // Menit (contoh: 00)
    hour12: true // Format waktu 12 jam (AM/PM)
  };
  return new Intl.DateTimeFormat('id-ID', options).format(date); // Format menggunakan locale Indonesia
}

// Endpoint untuk memeriksa API key
router.get("/check-apikey/:api_key", (req, res) => {
  const { api_key } = req.params; // Ambil API key dari path parameter

  if (!api_key) {
    return res.status(400).json({
      success: false,
      message: "API key tidak ditemukan. Harap masukkan API key Anda.",
    });
  }

  const expiryDate = apiKeys[api_key]; // Cari API key di database atau file

  if (!expiryDate) {
    return res.status(403).json({
      success: false,
      message: "API key tidak valid. Silakan beli API key di WhatsApp 6285701479245 atau wa.me/6285701479245.",
    });
  }

  const now = new Date();

  if (now > expiryDate) {
    return res.status(403).json({
      success: false,
      message: `API key sudah kedaluwarsa. Silakan perpanjang API key Anda di WhatsApp 6285701479245 atau wa.me/6285701479245.`,
    });
  }

  // Jika API key valid dan belum kedaluwarsa
  res.status(200).json({
    success: true,
    message: "API key valid.",
    expiry_date: formatDate(expiryDate), // Tanggal kedaluwarsa diformat
  });
});

module.exports = router;