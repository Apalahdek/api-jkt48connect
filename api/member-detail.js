const express = require("express");
const axios = require("axios");
const validateApiKey = require("../middleware/auth"); // Import middleware untuk validasi API key

const router = express.Router();

// Endpoint untuk mengambil data member berdasarkan nama
router.get("/:name", validateApiKey, async (req, res) => {
  const { name } = req.params; // Mendapatkan nama dari parameter URL

  try {
    // Meminta data dari API berdasarkan nama
    const response = await axios.get(`https://api.crstlnz.my.id/api/member/${name}`);
    const memberData = response.data;

    // Mengembalikan data dalam bentuk JSON
    res.json({
      success: true,
      author: "Valzyy",
      data: memberData,
    });
  } catch (error) {
    console.error(`Error fetching member detail with name ${name}:`, error.message);

    // Mengembalikan error response jika terjadi kesalahan
    res.status(500).json({
      success: false,
      message: `Gagal mengambil data member dengan nama ${name}.`,
      error: error.message,
    });
  }
});

module.exports = router;