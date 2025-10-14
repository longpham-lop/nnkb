// testCloud.js
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

async function testCloudinary() {
  try {
    console.log("Đang test kết nối Cloudinary...");

    console.log("Cloud name:", cloudinary.config().cloud_name);

    const result = await cloudinary.uploader.upload(
      "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
      { public_id: "test_connection_image" }
    );

    console.log("Upload thành công!");
    console.log("Ảnh URL:", result.secure_url);

    const optimizedUrl = cloudinary.url("test_connection_image", {
      fetch_format: "auto",
      quality: "auto",
    });
    console.log("URL tối ưu:", optimizedUrl);

  } catch (err) {
    console.error("kết nối Cloudinary:", err.message);
  }
}

testCloudinary();
