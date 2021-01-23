const User = require("../models/User");
const {
  registerValidation,
  loginValidation,
} = require("../validation/userValidation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const sendMail = require("./sendMail");

const { CLIENT_URL } = process.env;

const { google } = require("googleapis");
const { OAuth2 } = google.auth;

const fetch = require('node-fetch')

const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID);

const userCtrl = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      // lets validate a user
      const { error } = registerValidation(req.body);
      if (error) return res.status(400).send(error.details[0].message);
      // check email existance
      const user = await User.findOne({ email: req.body.email });
      if (user)
        return res.status(400).send({ msg: "you are already registred" });

      // hash password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      // add new user
      const newUser = {
        ...req.body,
        password: hashPassword,
      };
      // activation token
      const activation_token = create_activation_token(newUser);

      const url = `${CLIENT_URL}/user/activate/${activation_token}`;
      sendMail(email, url, "Verify your email address");

      res.json({
        msg: "Register Success! Please activate your email to start.",
      });
    } catch (error) {
      res.status(500).send({ msg: error.message });
    }
  },
  activateEmail: async (req, res) => {
    try {
      const { activation_token } = req.body;
      const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN);
      const { name, email, password } = user;
      const check = await User.findOne({ email });
      if (check)
        return res.status(400).json({ msg: "this email already exist" });

      const newUser = new User({ name, email, password });

      await newUser.save();

      res.json({ msg: "Account has been activated" });

      //console.log(user);
    } catch (error) {
      res.status(500).send({ msg: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      // let validate a User
      const { error } = loginValidation(req.body);
      if (error) return res.status(400).send({ msg: error.details[0].message });
      //check email
      const user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ msg: "This email dosn't exist" });

      // check  password
      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass) return res.status(400).send({ msg: "wrong password" });
      const refresh_token = create_refresh_token({ _id: user._id });
      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
      });
      res.json({ msg: "Login success" });
      //console.log(user);
    } catch (error) {
      res.status(500).send({ msg: error.message });
    }
  },
  getAccessToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) return res.status(400).json({ msg: "Please login now!" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) res.status(400).send({ msg: "Please login now" });
        const accessToken = create_access_token({ _id: user._id });
        res.json({ accessToken });
        //console.log(accessToken);
      });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ msg: "This email dosn't exist" });

      const accessToken = create_access_token({ _id: user._id });
      const url = `${CLIENT_URL}/user/reset/${accessToken}`;
      sendMail(email, url, "Reset your password");
      res.json({ msg: "Re-send the password, please check your email" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { password } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: { password: hashPassword } },
        { new: true, useFindAndModify: false }
      );
      res.json({ msg: "Password restarted successflly" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  getUserInfo: async (req, res) => {
    try {
      const user = await User.findById({ _id: req.user._id }).select(
        "-password"
      );
      res.json(user);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  getAllUserInfo: async (req, res) => {
    try {
      users = await User.find().select("-password");
      res.json(users);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  logout: (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      return res.json({ msg: "you are Looged out" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      // const { name, avatar } = req.body;
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.user._id },
        { name: req.body.name, avatar: req.body.avatar },
        { new: true, useFindAndModify: false }
      );
      //res.json({ msg: "Update Success!" });
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },
  updateUsersRole: async (req, res) => {
    try {
      const { role } = req.body;

      await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          role,
        },
        { new: true, useFindAndModify: false }
      );

      res.json({ msg: "Update Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      await User.findByIdAndDelete({ _id: req.params.id });

      res.json({ msg: "Deleted Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  googleLogin: async (req, res) => {
    try {
      const { tokenId } = req.body;
      const verify = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.MAILING_SERVICE_CLIENT_ID,
      });
      const { email_verified, email, name, picture } = verify.payload;
      const password = email + process.env.GOOGLE_SECRET;
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      if (!email_verified)
        return res.status(400).json({ msg: "Email verification failed." });
      const user = await User.findOne({ email });
      if (user) {
        // const isMatch = bcrypt.compare(password, user.password);
        // if (!isMatch)
        //   return res.status(400).json({ msg: "Password is incorrect" });
        const refresh_token = create_refresh_token({ _id: user._id });
        res.cookie("refreshtoken", refresh_token, {
          httpOnly: true,
          path: "/user/refresh_token",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ msg: "Login success!" });
      } else {
        const newUser = new User({
          name,
          email,
          password: hashPassword,
          avatar: picture,
        });

        await newUser.save();

        const refresh_token = create_refresh_token({ id: newUser._id });
        res.cookie("refreshtoken", refresh_token, {
          httpOnly: true,
          path: "/user/refresh_token",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ msg: "Login success!" });
      }
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  facebookLogin: async (req,res) => {
    try {
      const { accessToken,userID } = req.body;
      const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`
            
      const data = await fetch(URL).then(res => res.json() ).then(res => {return res})
      console.log(data)
      const {  email, name, picture } = data;
      const password = email + process.env.FACEBOOK_SECRET;
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
    
      const user = await User.findOne({ email });
      if (user) {
        // const isMatch = bcrypt.compare(password, user.password);
        // if (!isMatch)
        //   return res.status(400).json({ msg: "Password is incorrect" });
        const refresh_token = create_refresh_token({ _id: user._id });
        res.cookie("refreshtoken", refresh_token, {
          httpOnly: true,
          path: "/user/refresh_token",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ msg: "Login success!" });
      } else {
        const newUser = new User({
          name,
          email,
          password: hashPassword,
          avatar: picture.data.url,
        });

        await newUser.save();

        const refresh_token = create_refresh_token({ id: newUser._id });
        res.cookie("refreshtoken", refresh_token, {
          httpOnly: true,
          path: "/user/refresh_token",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ msg: "Login success!" });
      }
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
};
const create_activation_token = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN, { expiresIn: "5m" });
};
const create_refresh_token = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN, { expiresIn: "7d" });
};
const create_access_token = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: "15m" });
};

module.exports = userCtrl;
