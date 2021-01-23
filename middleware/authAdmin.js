const User = require ("../models/User")
const authAdmin = async (req,res,next) => {
    try {
        const user = await User.findOne({_id:req.user._id})
        if (user.role !==1) return res.status(403).json({msg:"Admin ressource access denied"})
        next()
    } catch (error) {
        res.status(500).json({msg:error.message})
    }
}
module.exports = authAdmin
