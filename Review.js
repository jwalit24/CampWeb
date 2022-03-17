let mongoose=require('mongoose');
let Schema=mongoose.Schema;
const ReviewSchema = new Schema({
    
    body: String,
    rating: Number
});
let Review=mongoose.model('Review', ReviewSchema);
module.exports=Review;