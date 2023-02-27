import nc from "next-connect";
import onError from "../../common/errormiddleware";
// import multer from "multer";
// import path from "path";
import express from "express";
import fileupload from 'express-fileupload'
import formData from 'express-form-data'
const handler = nc(onError);

// let storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public");
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// let upload = multer({
//   storage: storage,
// });

// let uploadFile = upload.single("file");

// config middleware
// handler.use(uploadFile);
handler.use(fileupload());
handler.use(formData.parse());
handler.use(express.urlencoded({ extended: true }));  
handler.use(express.json()) ; 
handler.post(async (req, res) => {
  console.log("req.file", req.file);
  //console.log(req.files.file)
  console.log(req.files)
  console.log("req.body", req.body.files);
  let url = "http://" + req.headers.host;
  // let filename = req.file.filename;
  res.status(200).send({
    url: url + "/public/" + req.file.filename,
  });
});

export default handler;