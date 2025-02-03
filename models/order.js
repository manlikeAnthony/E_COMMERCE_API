const { required } = require('joi');
const mongoose = require('mongoose');

const SingleOrderItemSchema =  mongoose.Schema({
    name:{type:String , required:true},
    image:{type:String , required:true},
    price:{type:Number , required:true},
    amount:{type:Number, required:true},
    product:{
        type : mongoose.Types.ObjectId,
        ref : 'Product',
        required:true
    }
})

const OrderSchema = mongoose.Schema({
    tax : {
        type:Number,
        required:true
    },
    shippingFee : {
        type:Number,
        required:true
    },
    subtotal : {
        type:Number,
        required:true
    },
    total :{
        type : Number,
        required:true
    },
    orderItems:[SingleOrderItemSchema],
    status:{
        type : String,
        enum:{
            values : ['pending' ,'failed', 'paid'],
            message : '{VALUE} is not supported status',
        },
        default:'pending'
    },
    user:{
        type : mongoose.Types.ObjectId,
        ref : 'User',
        required:[true , 'must log in first']
    },
    clientSecret :{
        type : String,
        required:[true , 'must log in first']
    },
    paymentId:{
        type : String,
    }
},{timestamps:true})


module.exports = mongoose.model('Order' , OrderSchema)