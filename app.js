const express = require("express");
const app = express();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

const path = require("path");
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const mongoose = require("mongoose");

main()
  .then(() => {
    console.log("connected");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}


app.get("/", (req, res) => {
  res.send("HII, it's working!");
});


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


app.all(/.*/ , (req,res,next) =>{
  next(new ExpressError(404, "Page not found!"));
});


app.use((err,req,res,next) =>{
  let { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("error.ejs", {message});
})

app.listen(1111, () => {
  console.log("Server is listening at port 1111");
});
