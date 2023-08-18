const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const cors = require("cors");
app.use(cors());
const bodyParser = require('body-parser');
const { PythonShell } = require('python-shell');
app.use(bodyParser.raw({ type: 'audio/wav', limit: '100mb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.static("public"));
app.use("/getAudio", async(request, response, next) => {
  if (request.files && Object.keys(request.files).length !== 0) {
    const uploadedFile = request.files.audio;
    console.log(`file size is = ${uploadedFile.size} & file name is ${uploadedFile.name}`);
    const options = {
        mode: 'text',
        pythonOptions: ['-m'],
        pythonPath: 'python3', // Replace with the path to your Python executable
        scriptPath: './', // Use the current directory as the script path
        args: ['-'], // Pass '-' as an argument to read audio from stdin
      };
  
      // Execute the Python script with vosk
      const pyshell = new PythonShell('speech_to_text.py', options);
  
      // Handle the Python script output
      let transcription = '';
      pyshell.stdout.on('data', function (data) {
        transcription += data;
      });
  
      // Handle errors
      pyshell.on('error', function (err) {
        console.error('Error during speech-to-text conversion:', err);
        response.status(500).json({ error: 'An error occurred during speech-to-text conversion.' });
      });
  
      // When the Python script finishes, send the transcription back to the frontend
      pyshell.on('close', function () {
        console.log('Transcription:', transcription);
        response.status(200).json({ transcription });
      });
  
      // Send the audio data to the Python script through stdin
      pyshell.send(uploadedFile);
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

app.use("/getNumber",(request,response,next)=>{
  response.status(200).json({number:Math.floor(Math.random()*1000)})
})

const server = app.listen(9999, (err) => {
  if (err) {
    console.log("Server crash due to ", err);
  } else {
    console.log("Server started at 9999");
  }
});
