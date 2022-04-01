let expreess=require('express');
let router=expreess.Router({mergeParams:true});
let ExpressError=require('../utils/ExpressError');
let catchAsync=require('../utils/catchAsync');
let Campground=require('../models');
let {campgroundSchema}=require('../schemas');
let Review=require('../Review');
let {reviewSchema}=require('../schemas');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');


router.post('/',isLoggedIn, validateReview,catchAsync(reviews.createReview
))
router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(reviews.deleteReview))
module.exports=router;