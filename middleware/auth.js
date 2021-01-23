const jwt= require("jsonwebtoken");

const auth = (req,res,next) => {
    try {
        const token = req.header("authtoken")
        if(!token) return res.status(401).send("Access denied")
        jwt.verify(token,process.env.ACCESS_TOKEN,(err,user)=> {
            if (err) return res.status(400).send({msg:"Invalid authorisation"})
            req.user=user
            next()
        })
    } catch (error) {
        res.status(500).json({msg:error.message})
    }
}

module.exports = auth