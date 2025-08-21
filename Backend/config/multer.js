const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const ext = file.originalname.split(".").pop(); // pdf / doc / docx
    const filename = file.originalname.split(".")[0];

    return {
      folder: "resumes",
      resource_type: "raw", // non-images
      allowed_formats: ["pdf", "doc", "docx"],
      public_id: Date.now() + "-" + filename + "." + ext, // 👈 extension ko yahin add kar do
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
