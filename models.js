let mongoose=require('mongoose');
let Review=require("./Review");
let Schema=mongoose.Schema;
const CampgroundSchema = new Schema({
    title: String,
    image:String,
    price: Number,
    description: String,
    location: String,
    reviews:
    [{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }]
});
CampgroundSchema.post('findOneAndDelete',async function(doc){
if(doc){
   await Review.remove({
       _id:{
           $in:doc.reviews
       }
   })
}
})
let Campground=mongoose.model('Campground', CampgroundSchema);
module.exports=Campground;