const Review = require('../models/review');
const Product = require('../models/product')
const CustomError = require('../errors')
const {StatusCodes}=require('http-status-codes')
const {checkPermissions} = require('../utils')


const createReview = async(req,res)=>{
    const {product : productId} = req.body;
    const isValidProduct = await Product.findOne({_id : productId});
    if(!isValidProduct){
        throw new CustomError.NotFoundError(`no product with id ${productId}`)
    }
    const alreadySubmitted = await Review.findOne({
        product : productId ,
        user:req.user.userId
    })
    if(alreadySubmitted){
        throw new CustomError.BadRequest('Already submitted a review for this product')
    }
    req.body.user = req.user.userId;
    const review = await Review.create(req.body);
    res.status(StatusCodes.CREATED).json({review})
}
const getAllReviews = async(req,res)=>{
    const review = await Review.find({})
    .populate({path :'product' , select : 'name company price '})
    .populate({path : 'user' , select :'name email'});
    res.status(StatusCodes.OK).json({review})
}

const getSingleReview = async(req,res)=>{
    const{id:reviewId} = req.params
    const review = await Review.findOne({_id : reviewId}).populate({path : 'user',select : 'name email'}).populate({path : 'product' , select : 'name company price'})
    if(!review){
        throw new CustomError.NotFoundError(`no review with id ${reviewId}`)
    }
    res.status(StatusCodes.OK).json({review})
}
const updateReview = async(req,res)=>{
    const {params : {id : reviewId} , body :{title , comment , rating}}= req;
    const review = await Review.findOne({_id : reviewId});
    if(!review){
        throw new CustomError.NotFoundError(`no review with id ${reviewId}`)
    }
    checkPermissions(req.user, review.user)
    review.title = title
    review.comment = comment
    review.rating = rating,
    await review.save()
    res.status(StatusCodes.OK).json({review})
}   

const deleteReview = async(req,res)=>{
    const {id : reviewId} = req.params;
    const review = await Review.findOne({_id:reviewId});
    if(!review){
        throw new CustomError.NotFoundError(`no review with id ${reviewId}`)
    }
    checkPermissions(req.user , review.user)
    await review.deleteOne();
    res.status(StatusCodes.OK).json({msg : 'Review successfully deleted'})
}

const getSingleProductReviews = async(req,res)=>{
    const {id : productId} = req.params;
    const reviews = await Review.find({product : productId})
    .populate({path : 'user',select : 'name email'}).populate({path : 'product' , select : 'name company price'})    
    res.status(StatusCodes.OK).json({reviews , count : reviews.length})
}

module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    getSingleProductReviews
}