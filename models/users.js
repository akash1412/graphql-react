const mongoose=require('mongoose');
const bcrypt=require('bcryptjs')

const Schema=mongoose.Schema

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:[true,'User with this email already exist\'s ']
    }
    ,
    password:{
        type:String,
        required:true
    }
    ,
    createdEvents:[
        {
            type:Schema.Types.ObjectId,
            ref:'Events'
        }
    ]
});

userSchema.pre('save',async function(next){
 this.password =await bcrypt.hash(this.password,12);

 next()
})

const User = mongoose.model('User',userSchema);

module.exports=User;