const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    name:{
        type : String,
        required:[true,'must provide name'],
        trim:true,
        minlength:[3,'name cannot be more than 20 characters'],
        maxlength:[50 , 'name cant be more than 50 characters']
    },
    email:{
        type:String,
        required:[true,'must provide email'],
        validate:{
            validator: validator.isEmail,
            message : 'please provide a valid email',
        },
        unique:true
    },
    password:{
        type:String,
        required:[true,'must provide password'],
        minlength : [3 , 'password cannot be less than 3 characters for security reasons']
    },
    role:{
        type : String,
        enum:['admin','user'],
        default : 'user',
    }
},{toJSON:{virtuals:true} , toObject:{virtuals:true}})

UserSchema.virtual('products' , {
    ref : 'Product',
    localField : '_id',
    foreignField:'user',
    justOne : false
})

UserSchema.pre('save' , async function(){
    if(!this.isModified('password')) return
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
})
UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword , this.password)
    return isMatch;
}

// UserSchema.methods.createJWT = async function(){
//     return jwt.sign({userId :this._id , name :this.name} , process.env.JWT_SECRET , {expiresIn : process.env.JWT_LIFETIME})
// }

module.exports = mongoose.model('User',UserSchema)