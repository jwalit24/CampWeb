const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,

    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        let price=Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author:'61f98969bacc5846c6c5a820',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            // image:'https://source.unsplash.com/collection/483251', 
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate ea dolores aliquid iusto eligendi consequatur officia expedita ab molestias quaerat ipsum incidunt beatae unde veniam, sed fuga? Corporis, aliquam repellat!',
            price,
            geometry:{
                type: 'Point',
             coordinates: [ cities[random1000].longitude,
                            cities[random1000].latitude ] 
            },
            images: [
                {
                    url:  'https://res.cloudinary.com/dbhplbhos/image/upload/v1648562120/YelpCamp/wsdczy6l0fqfosls8y9s.jpg',
                    filename: 'YelpCamp/wsdczy6l0fqfosls8y9s'

                },
                {
                    url:  'https://res.cloudinary.com/dbhplbhos/image/upload/v1648562120/YelpCamp/roc24vemwas21ebqj9tu.jpg',
                    filename: 'YelpCamp/roc24vemwas21ebqj9tu'
                }
            ]
            
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})