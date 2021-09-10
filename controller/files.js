import AWS from "aws-sdk";
import path from "path";
const __dirname = path.resolve();
AWS.config.loadFromPath(__dirname + "/config/s3.json");
const s3 = new AWS.S3();

export async function download(req, res) {
  const key = req.params.serverFileName;
  const filename = req.params.originalFileName;
  console.log(key);
  let params = {Bucket: "jksbook", Key: key};
  res.attachment(filename);
  s3.getObject(params).createReadStream().pipe(res);
}