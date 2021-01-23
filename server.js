require("dotenv").config({path:"./config/.env"})
const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")
const fileUpload = require("express-fileupload")
const { appengine_v1alpha } = require("googleapis")
const cookieParser = require("cookie-parser")
const userRoute = require("./routes/userRoute")

const app = express();
app.use(express.json());
app.use(cors())
app.use(cookieParser())
app.use(fileUpload({useTempFiles:true}))

//Routes
app.use("/user",userRoute)
app.use("/api",require("./routes/upload"))
//connnect to Database 
const DB_URI = process.env.DB_URI
mongoose.connect(DB_URI, {useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex:true } , (err) => {
    if (err) console.log(err)
    else console.log("connected to database")
  })

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=> {
    console.log("server is runnig on",PORT)
})