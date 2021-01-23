const fs = require("fs")
module.exports = async  (req,res,next) => {
    try {
        if (!req.files || Object.keys(req.files)=== 0)
        return res.status(500).json({msg:"No file to upload"})

        const file = req.files.file 
        
        if (file.size > 1024*1024) {
            removeTmp(file.tempFilePath)
            return res.status(400).send({msg:"size should be lower than 1Mb"})
        }

       
        if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png'){
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: "File format is incorrect."})
        }
       

        next()

    } catch (error) {
        res.status(500).json({msg:error.message})
    }
    
    
}
const removeTmp = (path) => {
    fs.unlink(path,(err) => {
        if (err) throw err
    })
}