const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

const validateListing = (req,res,next) =>{
   let { error } = listingSchema.validate(req.body);
  
  if(error){
    let errMsg = error.details.map((el) =>el.message).join(",");
    throw new ExpressError(400, errMsg);
  }else{
    next();
  }
}

// router.get("/", (req, res) => {
//   res.send("HII, it's working!");
// });



//shows all the list (home route)
router.get("/", wrapAsync(async (req, res) => {
  let allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
}));

//creating a form to create new list
router.get("/new", (req, res) => {
  res.render("./listings/new.ejs");
});


//create new list
router.post("/", validateListing , wrapAsync(async (req, res, next) => {
  let result = listingSchema.validate(req.body);
  console.log(result);
  
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

//shows a particular list by searching with findbyid.
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");

    if(!listing){
      throw new ExpressError(501, "Fill in valid details")
    }

  res.render("listings/show.ejs", { listing });
}));

//renders an update form
router.get("/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);  
  res.render("./listings/edit.ejs", { listing });
}));

//update route
router.put("/:id", validateListing , wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  
  if (!req.body.listing.image.url) {
  req.body.listing.image.url = "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60";
  }

  listing.set(req.body.listing);
  await listing.save();
  res.redirect(`/listings/${id}`);
}));


//deleting a list
router.delete("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedList = await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
  console.log(deletedList);
}));

module.exports = router;