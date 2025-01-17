const qrcode = require("qrcode");
const axios = require("axios");
const FormData = require("form-data");

// Fungsi untuk mengunggah buffer ke Catbox.moe
async function uploadBufferToCatbox(buffer, filename) {
  try {
    const form = new FormData();
    form.append("reqtype", "fileupload");
    form.append("fileToUpload", buffer, {
      filename,
      contentType: "image/jpeg",
    });

    const response = await axios({
      url: "https://catbox.moe/user/api.php",
      method: "POST",
      headers: {
        ...form.getHeaders(),
      },
      data: form,
    });

    if (response.data) {
      return response.data;
    } else {
      throw new Error("Unexpected API response structure");
    }
  } catch (err) {
    throw new Error(`Failed to upload to Catbox: ${err.message}`);
  }
}

// Fungsi untuk membuat QR Code langsung dari buffer
const createQr = async (text) => {
  try {
    const buffer = await qrcode.toBuffer(text, { width: 1020 });
    const filename = `${Date.now()}.jpg`;
    const url = await uploadBufferToCatbox(buffer, filename);
    return { url };
  } catch (err) {
    console.error("Error creating QR code:", err);
    throw err;
  }
};

module.exports = { createQr };
