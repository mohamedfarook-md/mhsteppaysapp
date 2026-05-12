const Tesseract = require('tesseract.js');

const extractTextFromImage = async (imagePath) => {

  try {

    const result = await Tesseract.recognize(
      imagePath,
      'eng'
    );

    return result.data.text;

  } catch (err) {

    console.log("OCR ERROR:", err);

    return '';
  }
};

module.exports = {
  extractTextFromImage,
};