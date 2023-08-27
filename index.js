const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const cors = require("cors");
app.use(cors());
const bodyParser = require("body-parser");
const { PythonShell } = require("python-shell");
app.use(bodyParser.raw({ type: "audio/wav", limit: "100mb" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.static("public"));
app.use("/getAudio", async (request, response, next) => {
  if (request.files && Object.keys(request.files).length !== 0) {
    const uploadedFile = request.files.audio;
    console.log(
      `file size is = ${uploadedFile.size} & file name is ${uploadedFile.name}`
    );
    const options = {
      mode: "text",
      pythonOptions: ["-m"],
      pythonPath: "python3", // Replace with the path to your Python executable
      scriptPath: "./", // Use the current directory as the script path
      args: ["-"], // Pass '-' as an argument to read audio from stdin
    };

    // Execute the Python script with vosk
    const pyshell = new PythonShell("speech_to_text.py", options);

    // Handle the Python script output
    let transcription = "";
    pyshell.stdout.on("data", function (data) {
      transcription += data;
    });

    // Handle errors
    pyshell.on("error", function (err) {
      console.error("Error during speech-to-text conversion:", err);
      response
        .status(500)
        .json({ error: "An error occurred during speech-to-text conversion." });
    });

    // When the Python script finishes, send the transcription back to the frontend
    pyshell.on("close", function () {
      console.log("Transcription:", transcription);
      response.status(200).json({ transcription });
    });

    // Send the audio data to the Python script through stdin
    pyshell.send(uploadedFile);
    response.status(200).json({
      message: `file size is = ${uploadedFile.size} & file name is ${uploadedFile.name}`,
    });
  } else
    response.status(500).json({
      message: "unsuccessful",
      error: "No File Found",
    });
});

app.use("/getNumber", (request, response, next) => {
  response.status(200).json({ number: Math.floor(Math.random() * 1000) });
});

app.use("/getProducts", (request, response, next) => {
  response.status(200).json({
    productsList: [
      {
        costPrice: 19000,
        description: "12GB RAM, 256 GB Storage",
        imgUrl:
          "https://d2xamzlzrdbdbn.cloudfront.net/products/713d32fb-b11e-4818-b854-72e04bcfc6a422300542.jpg",
        name: "Realme GT Neo 3",
        sellingPrice: 26000,
      },
      {
        costPrice: 17000,
        description: "8GB RAM, 128 GB Storage",
        imgUrl:
          "https://img6.gadgetsnow.com/gd/images/products/additional/large/G307073_View_1/mobiles/smartphones/realme-gt-neo-2-128-gb-neo-blue-8-gb-ram-.jpg",
        name: "Realme GT Neo 2",
        sellingPrice: 25000,
      },
      {
        costPrice: 18000,
        description: "6GB RAM, 128 GB Storage",
        imgUrl:
          "https://m.media-amazon.com/images/I/51LOXKT+vvL._AC_UL480_QL65_.jpg",
        name: "IQOO 7",
        sellingPrice: 26000,
      },
      {
        costPrice: 22000,
        description: "12 GB RAM, 1TB Storage",
        imgUrl: "https://m.media-amazon.com/images/I/81ZV6G2iRrL._SX679_.jpg",
        name: "Realme Narzo 60 Pro",
        sellingPrice: 29999,
      },
      {
        costPrice: 16000,
        description: "8GB RAM 256GB Storage",
        imgUrl: "https://m.media-amazon.com/images/I/81eoabezOsL._SX679_.jpg",
        name: "Realme 11 Pro 5G",
        sellingPrice: 24588,
      },
      {
        costPrice: 23000,
        description: "8GB RAM, 128GB Storage",
        imgUrl:
          "https://m.media-amazon.com/images/I/812yohjGZ2L._AC_UY327_FMwebp_QL65_.jpg",
        name: "Samsung Galaxy S20 FE 5G",
        sellingPrice: 29999,
      },
      {
        costPrice: 20000,
        description: "8GB RAM, 128 GB Storage",
        imgUrl:
          "https://m.media-amazon.com/images/I/61IiuWQcVjL._AC_UY327_FMwebp_QL65_.jpg",
        name: "IQOO Neo 7 5G",
        sellingPrice: 27999,
      },
      {
        costPrice: 19000,
        description: "12GB RAM, 256 GB Storage",
        imgUrl:
          "https://d2xamzlzrdbdbn.cloudfront.net/products/713d32fb-b11e-4818-b854-72e04bcfc6a422300542.jpg",
        name: "Realme GT Neo 3",
        sellingPrice: 26000,
      },
      {
        costPrice: 17000,
        description: "8GB RAM, 128 GB Storage",
        imgUrl:
          "https://img6.gadgetsnow.com/gd/images/products/additional/large/G307073_View_1/mobiles/smartphones/realme-gt-neo-2-128-gb-neo-blue-8-gb-ram-.jpg",
        name: "Realme GT Neo 2",
        sellingPrice: 25000,
      },
      {
        costPrice: 18000,
        description: "6GB RAM, 128 GB Storage",
        imgUrl:
          "https://m.media-amazon.com/images/I/51LOXKT+vvL._AC_UL480_QL65_.jpg",
        name: "IQOO 7",
        sellingPrice: 26000,
      },
    ],
  });
});

const server = app.listen(9999, (err) => {
  if (err) {
    console.log("Server crash due to ", err);
  } else {
    console.log("Server started at 9999");
  }
});
