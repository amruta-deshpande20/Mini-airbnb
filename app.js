const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);

main()
  .then(() => {
    console.log("connected to db ");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
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

app.listen(8080, (req, res) => {
  console.log("app is listening to port");
});

app.get("/", (req, res) => {
  res.send("hi i am working");
});

// Index route(show all hotels)
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/listing.ejs", { allListings });
}));

//create route
app.post("/listings", wrapAsync(async (req, res,next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//update route
app.put("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let { listing } = req.body;

  // Ensure image is treated as an object with a url property
  if (typeof listing.image === "string") {
    listing.image = { url: listing.image };
  }

  await Listing.findByIdAndUpdate(id, { ...listing });
  res.redirect(`/listings/${id}`);
}));

//New route(add a new place)
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route (show details of hotel by id)
app.get("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
}));

//delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

app.use((err,req,res,next)=>{
   let{statusCode = 500, message = "Something went wrong!"} = err;
   res.render("listings/error.ejs",{message});
  //  res.status(statusCode).send(message);
});
