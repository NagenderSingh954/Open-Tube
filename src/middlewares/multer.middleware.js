import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {

    cb(null, file.originalname+ '-' + uniqueSuffix)         //TODO change the file name store in the temp as the user can upload the fiile with same name
  }
})

const upload = multer({ storage: storage })

export const upload= multer({
    storage,
})