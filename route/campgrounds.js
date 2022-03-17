let expreess=require('express');
let router=expreess.Router();
let ExpressError=require('../utils/ExpressError');
let catchAsync=require('../utils/catchAsync');
let Campground=require('../models');
let {campgroundSchema}=require('../schemas');
const { isLoggedIn } = require('../middleware');

let validatecampground=(req,res,next)=>{
 
    let {error}=campgroundSchema.validate(req.body);
     if(error){
         let msg=error.details.map(el=>el.message).join(',');
         throw new ExpressError(msg,400);
     }
     else
     {
         next();
     }
}


router.get('/',catchAsync( async (req,res,next)=>{
    let CampGrounds=await Campground.find({});
    // console.log("jwalit");
    console.log(req.requestTime);
    res.render('campgrounds/index',{CampGrounds});
}))

router.get('/new',isLoggedIn,catchAsync(async (req,res,next)=>{
    
    
    res.render('campgrounds/new');
    console.log("new");
}))
router.post('/',isLoggedIn,validatecampground,catchAsync( async (req,res,next)=>{
    // if(!req.body.campground) throw new ExpressError('invalid Campground dATA',400)
   
    let newcamp=req.body.campground;
    let ncamp=new Campground(newcamp);
    await ncamp.save();
    req.flash('success',"Successfully made a new campground!")
    res.redirect(`/campground/${ncamp._id}`)
}))
router.get('/:id',catchAsync(async (req,res,next)=>{
    let CampGround=await Campground.findById(req.params.id).populate('reviews');
    if(!CampGround){
        req.flash('error','Cannot find that campground');
        res.redirect('/campground');
    }
    
    // console.log("jwalit");
    res.render('campgrounds/show',{CampGround});
}))

router.get('/:id/edit',isLoggedIn,catchAsync(async (req,res,next)=>{
    let CampGround=await Campground.findById(req.params.id);
    if(!CampGround){
        req.flash('error','Cannot find that campground');
        res.redirect('/campground');
    }
    res.render('campgrounds/edit',{CampGround});
}))
router.put('/:id',isLoggedIn,validatecampground,catchAsync(async (req,res,next)=>{
    console.log("jwalit");
   
  let CampGround= await Campground.findByIdAndUpdate(req.params.id,req.body.campground);
  req.flash('success',"Sucessfully updatedbackground") 
  res.redirect(`/campground/${CampGround._id}`);
}))
router.delete('/:id',isLoggedIn,catchAsync( async (req, res,next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','deleted Campground')
    res.redirect('/campground');
}))
module.exports=router;