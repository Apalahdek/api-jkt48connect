const express = require("express");
const { createPaymentString, createPaymentQr } = require("jkt48connect-saweria"); // Import modul jkt48connect-saweria
const cors = require("cors");
const validateApiKey = require("../middleware/auth"); // Import middleware validasi API key
const app = express();
const router = express.Router();

// Enable CORS for all domains (or specific domains)
app.use(cors({
  origin: '*',
}));

// Endpoint untuk membuat pembayaran
router.get("/", validateApiKey, async (req, res) => {
  const { amount, username, message } = req.query; // Mendapatkan parameter amount, username, dan message dari query URL

  // Pastikan amount dan username ada dalam query
  if (!amount || !username) {
    return res.status(400).json({
      message: "Parameter 'amount' dan 'username' harus disertakan.",
    });
  }

  try {
    // Memanggil fungsi createPaymentQr dari modul jkt48connect-saweria untuk membuat pembayaran
    const result = await createPaymentQr(username, { amount: parseInt(amount), message });

    // Mengembalikan data hasil pembayaran dalam format JSON
    res.json({
      author: "Valzyy",
      ...result, // Menyisipkan data hasil pembayaran langsung dari modul
    });
  } catch (error) {
    console.error("Error creating payment:", error.message);
    // Mengembalikan error response jika terjadi kesalahan
    res.status(500).json({
      message: "Gagal membuat pembayaran.",
      error: error.message,
    });
  }
});

module.exports = router;
