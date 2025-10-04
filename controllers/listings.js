const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
    let result = listingSchema.validate(req.body);
    console.log(result);

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New list created!");
    res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author"
        },
      })
      .populate("owner");
    console.log(listing);

    if (!listing) {
      req.flash("error", "List you requested for does not exist!");
      return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};

module.exports.renderUpdateForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "List you requested for does not exist!");
      return res.redirect("/listings");
    }

    res.render("./listings/edit.ejs", { listing });
};

module.exports.updateListing =async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);
    if (!req.body.listing.image.url) {
      req.body.listing.image.url =
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60";
    }

    listing.set(req.body.listing);
    await listing.save();
    req.flash("success", "List Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteList = async (req, res) => {
    let { id } = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    req.flash("success", "List Deleted!");
    res.redirect("/listings");
    console.log(deletedList);
};