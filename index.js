const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.static("public"));
app.use("/getAudio", (request, response, next) => {
  if (request.files && Object.keys(request.files).length !== 0) {
    const uploadedFile = request.files.audio;
    console.log(uploadedFile.name);
    response
      .status(200)
      .json({
        message: `file size is = ${uploadedFile.size} & file name is ${uploadedFile.name}`,
      });
  } else
    response.status(500).json({
      message: "unsuccessful",
      error: "No File Found",
    });
});

const server = app.listen(9999, (err) => {
  if (err) {
    console.log("Server crash due to ", err);
  } else {
    console.log("Server started at 9999");
  }
});
