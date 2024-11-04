const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const date = new Date();
    const folderName = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const uploadPath = path.join('public', 'uploads', folderName);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/webp', 'image/jpg', 'image/png', 'image/jpeg'];
  const allowedVideoTypes = ['video/mp4'];

  if (allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else if (allowedVideoTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new APIError(400, 'Invalid file type'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

exports.uploadImage = upload.single('image');
exports.uploadVideo = upload.single('video');