var userModel = require('./modal');
var nodemailer = require('nodemailer');
let userController = {};
var vcardparser = require('vcardparser');
var vCardsJS = require('vcards-js');
const { exec } = require('child_process');
var cmd=require('node-cmd');
const fs = require('fs');
var request = require('request');
var FormData = require('form-data');
const readline = require('readline');
const {google} = require('googleapis');
const https = require('https');
var vcard = require('vcard-json');


let otp = Math.floor(100000 + Math.random() * 900000)



userController.addUser = function(req,res){
	console.log(req.body);
	entered_email = req.body.email;
	console.log(req.body.email);
	userModel.findOne({email: entered_email},function(err,foundEmail){
		if(foundEmail){
			res.status(402).send("Email already registered");
		}else{
			var user = new userModel(req.body);
			console.log("from server",req.body);
			user.save(function(err,savedUser){
				console.log("User saved",savedUser);
				res.send(savedUser)
			})

		}
	})
	console.log(req.body);
}

userController.logIn = function(req,res){
	console.log('======',req.body);	
	console.log("server entered email",req.body.email);
	console.log("server entered email",req.body.password);
	userModel.findOne({email: req.body.email},function(err,foundUser){
		if(foundUser){
			console.log("password",foundUser.password);
			if(foundUser.password == req.body.password){
				res.status(200).send("Logged In success");
			}
			else{
				res.status(402).send("Unauthorizes Access")
				console.log("Wrong password");
			}
		}else{
			res.status(404).send("Email Not Found");
		}
	})	
}

userController.sendEmail = function(req,res){
	var email = req.body.email;
	console.log("email",req.body.email);
	let transporter	= nodemailer.createTransport({
		service: 'gmail',
		secure: 'false',
		port: 25,
		auth: {
			user: 'reactNativeAppSync@gmail.com',
			pass: 'raoinfotech'
		},
		tls:{
			rejectUnauthorized: false
		}
	});

	let HelperOptions = {
		from: '"Sync" <reactNativeAppSync@gmail.com',
		to: email,
		subject: 'Password Recovery Email',
		text: 'Your OTP is '+otp
	};

	transporter.sendMail(HelperOptions, (error,info)=>{
		if(error){
			console.log(error);
		}
		console.log('success');
		console.log(info);
	});

}

userController.checkOTP = function(req,res){	
	if(req.body.otp == otp){
		res.status(200).send('OK') 
	}else{
		res.status(500).send('wrong') 
	}
}

userController.changePassword = function(req,res){
	var email = req.body.email;
	var password = req.body.password


	userModel.findOneAndUpdate({email: req.body.email},{$set:{password: req.body.password}},{upsert: true},function(err,updatedUser){
		if(updatedUser){
			res.status(200).send(updatedUser)
		}else{
			res.status(500).send(err)
		}
	});
}

userController.createFile = function(req,res){

	let name = []
	let number = []

	for(let i = 0 ; i < req.body.length ; i ++){
		name = req.body[i].name;
		number = req.body[i].number;
		var vCard = vCardsJS();
		vCard.firstName = name  
		vCard.cellPhone = number	
		vCard.saveToFile('./contacts/'+name+'.vcf');		
	}	

	cmd.get('cat ./contacts/*.vcf > ./all.vcf',function(err, data, stderr){
		console.log('done');
	}) 
	res.status(200).send();
}

userController.uploadToDrive = function(req, res){
	token = req.body.token;
	console.log(token);
	var formData = new FormData();
	console.log(token);
	formData.append("data",fs.createReadStream('./all.vcf'), "all.vcf");
	request({
		headers: {			
			'Authorization': token
		},
		uri: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
		body: formData,	
		method: 'POST'
	}, function (err, resp, body) {
		if(err){  		
			console.log(err);
		}else{
			console.log('resp');
			res.status(200).send()
		}
	});
}

userController.readVCF = function(req, res){
	console.log('reading...');
	content = req.body.content;
	vcardparser.parseString(content, function(err,json) {
		if(err)
			return console.log(err);
		console.log(json);
		res.send(json);
	});
}

module.exports = userController;
