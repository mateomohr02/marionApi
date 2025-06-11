const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "videos-clases",
    resource_type: "video", // Esto es importante
    format: async (req, file) => "mp4", // Forzar formato
  },
});

const upload = multer({ storage });

module.exports = upload;
