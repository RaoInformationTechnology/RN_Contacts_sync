var exp = require('express');
var mongoose = require('mongoose');
var userController = require('./controller');
var bodyParser = require('body-parser');
var request = require('request');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
var FormData = require('form-data');
var app = exp();
mongoose.connect('mongodb://localhost:27017/employee', {useNewUrlParser: true})
.then(() => console.log("Connected"))
.catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.post('/user/signup',userController.addUser);
app.post('/user/login',userController.logIn);
app.post('/user/sendEmail',userController.sendEmail)
app.post('/user/checkOTP',userController.checkOTP)
app.post('/user/changePassword',userController.changePassword)
app.post('/user/createFile',userController.createFile)
app.post('/user/upload-to-drive',userController.uploadToDrive)
app.post('/user/readVCF',userController.readVCF)

app.listen(4000);

// var drive = google.drive({
// 	version: 'v3',
// 	auth: 'Bearer ya29.GlvqBqSkXV6DqX94FX89C_IEYbXhUIaZDBYo9HHpjP9OcsTsJ1czk5FL8uEIu0tdqZh-8Z00pUYcMpQaX0_LViqRv2XapvNG7ch5IHUxCprZ7-G7LEAFLesF7SNx',
// });

// var fileMetadata = {
//   'name': 'all',
//   'mimeType': 'text/vcf'
// };

// var media = {
//   mimeType: 'text/vcf',
//   body: fs.createReadStream('./all.vcf')
// };

// drive.files.create({
//   resource: fileMetadata,
//   media: media,
//   fields: 'id'
// }, function (err, file) {
//   if (err) {
//     // Handle error
//     console.error(err);
//   } else {
//     console.log('File Id:', file.id);
//   }
// });

// reactNativeAppSync@gmail.com


