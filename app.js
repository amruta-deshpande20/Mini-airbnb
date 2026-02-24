const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);

app.use("/listings", listings);
app.use("/listings/:id/reviews",reviews);

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

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.render("listings/error.ejs", { message });
  //  res.status(statusCode).send(message);
});
