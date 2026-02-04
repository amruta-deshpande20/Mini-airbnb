const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine('ejs', ejsMate);

main()
.then(()=>{
    console.log("connected to db ");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/airbnb")
}


//save listings
// app.get("/listings", async (req,res)=>{
//    let sampleListing = new Listing({
//     title:"my new villa",
//     description:"by the beach",
//     price:1200,
//     location:"Goa",
//     country:"India",
//    });
//    await sampleListing.save();
//    console.log("sample was saved");
//    res.send("successful");
// });


app.listen(8080,(req,res)=>{
    console.log("app is listening to port");
});


app.get("/",(req,res)=>{
    res.send("hi i am working");
});

// Index route(show all hotels)
app.get("/listings",async (req,res)=>{
    const allListings =  await Listing.find({});
    res.render("listings/listing.ejs",{allListings});
});

//create route
app.post("/listings",async(req,res)=>{
   const newListing = new Listing(req.body.listing);
   await newListing.save();
   res.redirect("/listings");
});

//edit route
app.get("/listings/:id/edit",async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

//update route

app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let { listing } = req.body;

    // Ensure image is treated as an object with a url property
    if (typeof listing.image === 'string') {
        listing.image = { url: listing.image };
    }

    await Listing.findByIdAndUpdate(id, { ...listing });
    res.redirect(`/listings/${id}`);
});

//New route(add a new place)
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//show route (show details of hotel by id) 
app.get("/listings/:id",async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});

//delte route 
app.get("/listings/:id/delete",async(req,res)=>{
    const {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})