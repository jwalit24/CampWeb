// if (process.env.NODE_ENV !== "production") {
//     require('dotenv').config();
// }

// let express=require('express');
// let session=require('express-session');
// let mongoose=require('mongoose');
// let Campground=require('./models');
// let ejsMate=require('ejs-mate');
// let Review=require('./Review');
// let campgroundsroutes=require('./route/campgrounds');
// let reviewsroutes=require('./route/reviews');
// const methodOverride = require('method-override');
// const flash = require('connect-flash');
// let {campgroundSchema}=require('./schemas');
// let {reviewSchema}=require('./schemas');
// let Joi=require('joi');
// let path =require('path');
// let ExpressError=require('./utils/ExpressError');
// let catchAsync=require('./utils/catchAsync');
// const morgan = require('morgan');
// const { findById } = require('./models');
// const passport = require('passport');
// const LocalStrategy = require('passport-local');
// const User = require('./user');
// const userRoutes = require('./route/user');
// const mongoSanitize = require('express-mongo-sanitize');



// mongoose.connect('mongodb://localhost:27017/yelp-camp', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,

// });

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//     console.log("Database connected");
// });
// let app=express();
// app.engine('ejs',ejsMate);
// app.set('views',path.join(__dirname,'views'));
// app.set('view engine','ejs');
// app.use(express.urlencoded({extended:true}));
// app.use(methodOverride('_method'));
// app.use(morgan('common'));
// app.use(express.static(path.join(__dirname,'public')))
// app.use((req,res,next)=>{
//     console.log("first middlewere");
//     req.requestTime=Date.now();
//     next();
// })
// app.use(mongoSanitize({
//     replaceWith: '_'
// }))

// let sessionConfig=
// {
//     name:"session",
//     secret:"thisshouldbebettersecret!",
//     resave:false,
//     // secure:true,
//     saveUninitialized:true,
//     cookie: {
//         httpOnly: true,
//         expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
//         maxAge: 1000 * 60 * 60 * 24 * 7
//     }
    
// }



// app.use(session(sessionConfig));
// app.use(flash());
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.use((req, res, next) => {
//     res.locals.currentUser=req.user;
//     res.locals.success = req.flash('success');
//     res.locals.error = req.flash('error');
//     next();
// })
// // let verify=(req,res,next)=>{
// //     let {password}=req.query;
// //     if(password=='hello')
// //     {
// //         next();
// //     }
// //     else{
// //         console.log("i am first");
// //         res.status(400);
// //         throw new AppError('password required',401);
// //     }
// // }
// // let validatecampground=(req,res,next)=>{
 
// //     let {error}=campgroundSchema.validate(req.body);
// //      if(error){
// //          let msg=error.details.map(el=>el.message).join(',');
// //          throw new ExpressError(msg,400);
// //      }
// //      else
// //      {
// //          next();
// //      }
// // }
// let validatecampgroundreview=(req,res,next)=>{
 
//     let {error}=reviewSchema.validate(req.body);
//      if(error){
//          let msg=error.details.map(el=>el.message).join(',');
//          throw new ExpressError(msg,400);
//      }
//      else
//      {
//          next();
//      }
// }
// app.use('/', userRoutes);
// app.use('/campground',campgroundsroutes);
// app.use('/campground/:id/reviews',reviewsroutes);

// app.get('/',(req,res)=>{
//     res.render("home");
// })


// // app.use((req,res)=>{
// //     res.status(404).send("NOt found");
// // })
// // app.get('/dogs',(req,res)=>{
// //     may();
// // })
// app.all('*',(req,res,next)=>{
//     next(new ExpressError('page Not found',404));
  
// })
// app.use((err,req,res,next)=>{
//  let {status=500,}=err;
//  if(!err.message) err.message="Oh noo something is wrong";
//  res.status(status).render('error',{err});


// })
// // app.use((err,req,res,next)=>{
// //    let {status=500,message="Something wrong"}=err;
 
// //    res.status(status).send(message);
 
// // })
// app.listen(3000,()=>{
//     console.log("we started");
// })
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./user');

const MongoStore = require('connect-mongo');
let dburl=process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

const userRoutes = require('./route/user');
const campgroundRoutes = require('./route/campgrounds');
const reviewRoutes = require('./route/reviews');

mongoose.connect(dburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true,
    // useFindAndModify: false

});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

let secret=process.env.SECRET || 'thisshouldbeabettersecret!'
const store = MongoStore.create({
    mongoUrl: dburl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret 
    }
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})


const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);
app.use('/campground', campgroundRoutes)
app.use('/campground/:id/reviews', reviewRoutes)


app.get('/', (req, res) => {
    res.render('home')
});


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})