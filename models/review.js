const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    rating:{
        type: Number,
        min:1,
        max:5,
        required:[true , 'please provide rating']
    },
    title:{
        type:String,
        trim : true,
        required : [true , 'Please provide a review title'],
        maxlength : 100
    },
    comment :{
        type:String,
        required: [true , 'please provide a review text']
    },
    user :{
        type: mongoose.Types.ObjectId,
        ref:'User',
        required:[true , 'Must provide a user']
    },
    product :{
        type :mongoose.Types.ObjectId,
        ref : 'Product',
        required: [true , 'Must review a Product']
    }
},{timestamps:true})

ReviewSchema.index({product : 1 , user :1}, {unique : true})

ReviewSchema.statics.calculateAverageRating = async function(productId) {
    const result = await this.aggregate([
        {$match : {product : productId}},
        {$group : {
            _id:null,
            averageRating:{$avg : '$rating'},
            numOfReviews : {$sum : 1}
        }}
    ])
    try {
        await this.model('Product').findOneAndUpdate({_id:productId},{
            averageRating:Math.ceil(result[0]?.averageRating || 0),
            numOfReviews: result[0]?.averageRating || 0,
        })
    } catch (error) {
        console.log(error)
    }
}

ReviewSchema.post('save' , async function(){
    await this.constructor.calculateAverageRating(this.product);
    console.log('post save hook triggered')
})
ReviewSchema.post('deleteOne' , { document: true, query: false },async function(){
    await this.constructor.calculateAverageRating(this.product)
    console.log('post deleteOne hook triggered')
})

module.exports = mongoose.model('Review', ReviewSchema)