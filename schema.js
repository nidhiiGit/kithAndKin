const Joi = require("joi");

//according to our schema validation our listing should be an object and it must be "required"; (Whenever a request is sent their should be listing object always)
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description : Joi.string().required(),
        country: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required().min(0),
        image:Joi.object({
            url: Joi.string().allow("", null),
            filename: Joi.string().allow("", null)
        }).unknown(true) .optional(),
        category: Joi.string().valid(
      "Trending", "Rooms", "Iconic cities", "Serene Peaks", "Amazing pools", 
      "Beach", "Castles", "Camping", "Farming", "Tent house", "Alpine Slopes", "Ancestral abodes"
    ).required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
        rating:Joi.number().required().min(0).max(5)
    }).required()
});

