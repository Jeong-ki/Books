import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import path from "path";

const __dirname = path.resolve();
aws.config.loadFromPath(__dirname + "/config/s3.json");
const s3 = new aws.S3();

export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "jksbook",
    acl: "public-read",
    key: function (req, file, cb) {
      cb(null, Date.now() + "." + file.originalname.split(".").pop()); // 이름 설정
    },
  }),
});
