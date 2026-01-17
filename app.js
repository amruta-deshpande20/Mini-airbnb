const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

main()
.then(()=>{
    console.log("connected to db ");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb")
}

app.get("/",(req,res)=>{
    res.send("hi i am working");
});

app.get("/listings", async (req,res)=>{
   let sampleListing = new Listing({
    title:"my new villa",
    description:"by the beach",
    price:1200,
    location:"Goa",
    country:"India",
   });
   await sampleListing.save();
   console.log("sample was saved");
   res.send("successful");
});

app.listen(8080,(req,res)=>{
    console.log("app is listening to port");
});