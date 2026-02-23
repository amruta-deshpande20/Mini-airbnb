const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description:  String,
    image: {
    //   filename: String,
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2070&auto=format&fit=crop",
            set: (v) => v === "" 
                ? "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2070&auto=format&fit=crop" 
                : v,
        }
    },
    price: { type: Number, default: 0 },
    location: String,
    country: String,
    reviews:[{
         type : Schema.Types.ObjectId,
         ref:"Review",
    },

    ],
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
      await Review.deleteMany({reviews :{$in:listing.reviews}});
    }
    
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;