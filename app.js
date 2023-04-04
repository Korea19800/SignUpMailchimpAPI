// jshint eversion: 6

const express = require("express");
const bodyParser = require("body-parser");
//const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public")); // public안에 image랑 css파일 있어서 서버에 업로드 가능
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/",function(req,res){

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    
    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/78f81047fd";
    
    const options = {
        method: "POST",
        auth: "angela1:c04be68ff7b5b13ccb8167c643b4b4c5-us21"
    }

    const request = https.request(url, options,function(response){
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else{
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })
    
    request.write(jsonData);
    request.end();

    console.log(firstName,lastName,email);
});

// post for failure button
app.post("/failure",function(){
    res.redirect("/");
});

// post for success button
app.post("/success",function(){
    res.redirect("/");
});

app.listen(3000,function(){
    console.log("Server is running oon port 3000");
});

// API key
//c04be68ff7b5b13ccb8167c643b4b4c5-us21

// audience id
// 78f81047fd