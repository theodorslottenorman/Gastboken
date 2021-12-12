
const express = require("express");
const app = express();
app.use(express.static("publik"));
app.listen("3000");
console.log("Kör servern på localhost:3000");

app.get("/start", (req, res) => {
    res.sendFile(__dirname + "/start.html");
});


const fs = require("fs");
app.get("/hamta-json", (req, res) => {
    console.log("Mottog förfrågan med XMLHttpRequest från klienten");
    fs.readFile("meddelande.json", function(err, data) {
        if (err) throw err; 
        res.send(data);
    });
});


app.get("/gastboken", (req, res) => {
    fs.readFile("start.html", function(err, data){
        fs.readFile("meddelande.json", function(err, minJson) {
            let html = data.toString().replace(minJson);
            res.send(html);
        });
    });
});


app.use(express.urlencoded({extended: true}));
app.post("/gastboken", (req, res) => {
   
    fs.readFile("start.html", function(err, data){
        fs.readFile("meddelande.json", function(err, minJson) {
            
            let falt = JSON.parse(minJson);
            let nyttMeddelande = {    
                namn: req.body.namn,

                meddelande: req.body.meddelande
            };
            console.log(nyttMeddelande);
            falt.push(nyttMeddelande);    
            let nyJson = JSON.stringify(falt);
            fs.writeFile("meddelande.json", nyJson, (err) => {
                if (err) throw err;
            });
            
            let output = "";
            for (meddelande in falt) {
                for (attribut in meddelande) {
                    output += meddelande[attribut] + " ";
                }
                output += "<br>";
            }
            let html = data.toString().replace(output);
            res.send(html);
        });
    });
});