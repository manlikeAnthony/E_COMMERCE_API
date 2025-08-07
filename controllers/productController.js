const Product = require('../models/product')
const CustomError = require('../errors')
const {StatusCodes} = require('http-status-codes')
const  path = require('path')

const createProduct = async (req,res)=>{
    req.body.user = req.user.userId;
    const product = await Product.create(req.body) ;
    res.status(StatusCodes.CREATED).json({product})
}

const getAllProducts = async (req,res)=>{
    const product = await Product.find({}).populate({path:'user' , select : 'name email'})
    res.status(StatusCodes.OK).json({product})
}

const getSingleProduct = async (req,res)=>{
    const {id : productId} = req.params;
    const product = await Product.findOne({_id :productId}).populate('reviews').populate({path:'user' , select : 'name email'});
    if(!product){
        throw new CustomError.NotFoundError(`no product with id ${productId}`)
    }
    res.status(StatusCodes.OK).json({product})
}

const updateProduct = async (req,res)=>{
    const {id : productId} = req.params;
    const product = await Product.findOneAndUpdate({_id:productId} , req.body,{
        new:true,
        runValidators:true
    });
    if(!product){
        throw new CustomError.NotFoundError(`no product with id ${productId}`)
    }
    res.status(StatusCodes.OK).json({product})
}

const deleteProduct = async (req,res)=>{
    const {id : productId} = req.params;
    const product = await Product.findOne({_id : productId});
    if(!product){
        throw new CustomError.NotFoundError(`no product with id ${productId}`)
    }
    await product.deleteOne();
    res.status(StatusCodes.OK).json({msg:'success product removed'})
}

const uploadImage = async (req,res)=>{
    if(!req.files){
        throw new CustomError.BadRequest('no file uploaded')
    }
    const productImage= req.files.image;
    if(!productImage.mimetype.startsWith('image')){
        throw new CustomError.BadRequest('please Upload image')
    }
    const maxSize = 1024*1024;
    if(productImage.size > maxSize){
        throw new CustomError.BadRequest('max size limit exceeded , size must be smaller than 1MB')
    }
const imagePath = path.join(__dirname,'../public/uploads.' + `${productImage}`)
await productImage.mv(imagePath)
    res.status(StatusCodes.OK).json({src : `/uploads/${productImage.name}`})
}
module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
}