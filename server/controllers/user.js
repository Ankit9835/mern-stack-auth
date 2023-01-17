const User = require('../models/User')

exports.singleUser = async (req,res) => {
    try{
        const id = req.params.id
        const  user = await User.findById(id)
        user.hashed_password = undefined
        user.salt = undefined
        if(!user){
            return res.status(402).json({
                error:`User no found with the given this ${id} id`
            })
        }
        return res.status(200).json({
            message:'User exists',
            user
        })
    } catch(err){
        return res.status(400).json({
            error:err.message
        })
    }
}

exports.updateUser = async (req,res) => {
   // console.log(req.auth)
   try{
    console.log(req.profile)
    const {name,password} = req.body
    if(!name){
        res.status(200).json({
            error:'Name field is required',
        })
    }
     const user = await User.findOne({_id:req.auth._id})
     user.hashed_password = undefined
     user.salt = undefined
     if(user){
        user.name = name
        user.hashed_password = password
        await user.save()
        res.status(200).json({
            message:'user updated successfully',
            user
        })
     }
   } catch(err){
    res.status(402).json({
       error:err.message
    })
   }
    
}