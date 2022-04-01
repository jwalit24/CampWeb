let Campground=require('../models');
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });




module.exports.index = async (req,res,next)=>{
    let CampGrounds=await Campground.find({});
    // console.log("jwalit");
    console.log(req.requestTime);
    res.render('campgrounds/index',{CampGrounds});
}

module.exports.renderNewForm = async (req,res,next)=>{
    
    
    res.render('campgrounds/new');
  
}

module.exports.createCampground = async (req,res,next)=>{
    // if(!req.body.campground) throw new ExpressError('invalid Campground dATA',400)
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
   
    let ncamp=new Campground(req.body.campground);
    ncamp.geometry = geoData.body.features[0].geometry;
    console.log(ncamp.geometry);
    ncamp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
   
    console.log(req.files);
    ncamp.author=req.user._id;
    await ncamp.save();
    req.flash('success',"Successfully made a new campground!")
    res.redirect(`/campground/${ncamp._id}`)
}

module.exports.showCampground = async (req,res,next)=>{
    const CampGround = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!CampGround){
        req.flash('error','Cannot find that campground');
        res.redirect('/campground');
    }
    
    // console.log("jwalit");
    res.render('campgrounds/show',{CampGround});
}

module.exports.renderEditForm = async (req,res,next)=>{
    let CampGround=await Campground.findById(req.params.id);
    if(!CampGround){
        req.flash('error','Cannot find that campground');
        res.redirect('/campground');
    }
    res.render('campgrounds/edit',{CampGround});
}

module.exports.updateCampground = async (req,res,next)=>{
    // let CampGround= await Campground.findByIdAndUpdate(req.params.id,req.body.campground);
    const { id } = req.params;
    console.log(req.body);
    const CampGround = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    CampGround.images.push(...imgs);
    await CampGround.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await CampGround.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    
    req.flash('success',"Sucessfully updatedbackground") 
    res.redirect(`/campground/${CampGround._id}`);
  }

module.exports.deleteCampground = async (req, res,next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','deleted Campground')
    res.redirect('/campground');
}