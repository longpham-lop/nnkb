// uploadRoute.js
import express from 'express';
import cloudinary from '../config/cloudinary.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    // Kiểm tra file
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // Upload lên Cloudinary từ buffer
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'user_uploads' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    res.status(200).json({
      message: 'Upload thành công',
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
