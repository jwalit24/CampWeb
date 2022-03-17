let expreess=require('express');
let router=expreess.Router({mergeParams:true});
let ExpressError=require('../utils/ExpressError');
let catchAsync=require('../utils/catchAsync');
let Campground=require('../models');
let {campgroundSchema}=require('../schemas');
let Review=require('../Review');
let {reviewSchema}=require('../schemas');


let validatecampgroundreview=(req,res,next)=>{
    let {reviewSchema}=require('../schemas'); 
    let {error}=reviewSchema.validate(req.body);
     if(error){
         let msg=error.details.map(el=>el.message).join(',');
         throw new ExpressError(msg,400);
     }
     else
     {
         next();
     }
}

router.post('/',validatecampgroundreview,catchAsync(async (req,res,next)=>{

    let campground=await Campground.findById(req.params.id);
  let review=new Review(req.body.review);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash('success','created new review')
  res.redirect(`/campground/${campground._id}`);
}
))
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','deleted  review')
    res.redirect(`/campground/${id}`);
}))
module.exports=router;