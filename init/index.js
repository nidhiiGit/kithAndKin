if(process.env.NODE_ENV != "production"){
  require('dotenv').config({ path: "../.env" });
}

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const dbUrl= process.env.ATLASDB_URL

main().then(() =>{console.log("connected");})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async() =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({...obj, owner: "68df770d8be98e1f0427d92a"}))
    await Listing.insertMany(initData.data);
    console.log("data initialized");
}


initDB();

