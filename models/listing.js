const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description: String,
    image:{
        filename:{ 
            type: String
    },
    url:{
        type: String,
    }
    },
    price:Number,
    location: String,
    country:String,
    reviews: [
        {
            type:Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref: "User",
    },
    category:{
        type:String,
        enum: ["Trending", "Rooms", "Iconic cities", "Serene Peaks", "Amazing pools", "Beach", "Castles", "Camping", "Farming", "Tent house", "Alpine Slopes", "Ancestral abodes"]
    }
});

// listingSchema.post("findOneAndDelete", async(listing) =>{
//     if(listing){
//         await Review.deleteMany({_id: {$in: listing.reviews}});
//     }
// })

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing; 

