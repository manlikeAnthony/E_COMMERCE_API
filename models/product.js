const { required } = require('joi');
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name :{
        type: String,
        trim : true,
        required:[true , 'please provide a product name'],
        maxlength: [100 , 'name cannot be more than 100 characters']
    },
    price :{
        type: Number,
        required:[true , 'please provide a product price'],
        default : 0
    },
    description :{
        type: String,
        required:[true , 'please provide a product description'],
        maxlength: [1000 , 'description cannot be more than 1000 characters']
    },
    image :{
        type: String,
        default : '/uploads/example.jpeg'
    },
    category :{
        type: String,
        required:[true , 'please provide a product category'],
        enum :{
           values :['office' , 'kitchen' , 'bedroom'],
           message : '{VALUE} is not supported in category'
        } 
    },
    company :{
        type: String,
        required:[true , 'please provide a company'],
        enum : {
            values : ['ikea' , 'liddy' , 'marcos'],
            message : '{VALUE} is not a supported company'
        }
    },
    colors :{
        type: [String],
        default:['#222'],
        required: true ,
    },
    featured :{
        type: Boolean,
        default : false,
    },
    freeShipping :{
        type: Boolean,
        default : false
    },
    inventory :{
        type: Number,
        required : true,
        default : 15
    },
    averageRating :{
        type: Number,
        min : [0 , 'average rating cannot be less than 0'],
        max : [5 , 'average rating cannot be more than 5'],
        default : 0,
    },
    numOfReview:{
        type:String,
        default:0
    },
    user :{
        type: mongoose.Types.ObjectId,
        ref : 'User',
        required: true,
    }
},{timestamps:true , toJSON :{virtuals : true}, toObject:{virtuals: true}})

ProductSchema.virtual('reviews' , {
    ref:'Review',
    localField:'_id',
    foreignField: 'product',
    justOne : false,
})
// ProductSchema.virtual('ratings' , {
//     ref : 'Review',
//     localField:'_id',
//     foreignField: 'product',
//     justOne:false,
//     options :{
//         select : 'name rating'
//     }
// })
ProductSchema.pre('deleteOne' ,{ document: true, query: false }, async function(next){
    await this.model('Review').deleteMany({product: this._id})
})
module.exports = mongoose.model('Product' , ProductSchema)