const User = require('../models/user')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const {createTokenUser , attachCookiesToResponse , checkPermissions} = require('../utils')

const getAllAdmins = async (req,res)=>{
    const admins = await User.find({role : 'admin'}).select('-password');
    res.status(StatusCodes.OK).json({admins})
}
const getAllUsers = async (req,res)=>{
    const users = await User.find({role : 'user'}).select('-password');
    res.status(StatusCodes.OK).json({users})
}
const getSingleUser = async (req,res)=>{
    const user = await User.findOne({_id : req.params.id}).select('-password').populate('products');
    if(!user){
        throw new CustomError.NotFoundError(`no user with id ${req.params.id}`)
    }
    checkPermissions(req.user , user._id)
    res.status(StatusCodes.OK).json({user})
}

const showCurrentUser = async (req,res)=>{
    res.status(StatusCodes.OK).json({user : req.user})
}
// update with .save()
const updateUser = async (req,res)=>{
    const {name , email} = req.body;
    if(!name || !email){
        throw new CustomError.BadRequest('please provide both values')
    }
    const user = await User.findOne({_id : req.user.userId});
    user.email = email;
    user.name = name;
    await user.save()
     const tokenUser = createTokenUser(user);
     attachCookiesToResponse({res,user : tokenUser});

     res.status(StatusCodes.OK).json({user : tokenUser})    

}

const updateUserPassword = async (req,res)=>{
    const {oldPassword , newPassword} = req.body;
    if(!oldPassword || !newPassword){
        throw new CustomError.BadRequest('please provide both values')
    }
    const user = await User.findOne({_id:req.user.userId});
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError('invalid credentials')
    }
    user.password = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json({msg : 'success password changed'})
}
const deleteUser = async(req,res)=>{
    const user = await User.findOne({_id:req.user.params})
    if(!user){
        throw new CustomError.NotFoundError(`no user with id ${req.params.id}`)
    }
    checkPermissions(req.user, user._id);
    await user.deleteOne();
    res.status(StatusCodes.OK).json({msg : 'User successfully deleted'})
}

// update with find one and update
// const updateUser = async (req,res)=>{
//     const {name , email} = req.body;
//     if(!name || !email){
//         throw new CustomError.BadRequest('please provide both values')
//     }
//     const user = await User.findOneAndUpdate({
//         _id : req.user.userId },
//         {email , name} ,
//         {new:true , runValidators:true}
//      )
//      const tokenUser = createTokenUser(user);
//      attachCookiesToResponse({res,user : tokenUser});

//      res.status(StatusCodes.OK).json({user : tokenUser})    

// }
module.exports = {
    getAllAdmins,
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
    deleteUser
}