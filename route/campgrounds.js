let expreess=require('express');
let router=expreess.Router();
let ExpressError=require('../utils/ExpressError');
let catchAsync=require('../utils/catchAsync');

let {campgroundSchema}=require('../schemas');

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
let Campground=require('../models');
const campgrounds = require('../controllers/campgrounds');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
.get(catchAsync( campgrounds.index))
.post(isLoggedIn,upload.array('image'),validateCampground,catchAsync( campgrounds.createCampground))


router.get('/new',isLoggedIn,catchAsync(campgrounds.renderNewForm))


router.route('/:id',)
.get(catchAsync(campgrounds.showCampground))
.put(isLoggedIn,isAuthor,upload.array('image'), validateCampground,catchAsync(campgrounds.updateCampground))
.delete(isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground ))


router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm))



module.exports=router;