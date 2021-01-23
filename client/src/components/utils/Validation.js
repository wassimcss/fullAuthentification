export const isEmpty = value => {
    if(!value) return true
    return false
}

export const isEmail = email => {
    // eslint-disable-next-line
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export const isLength = password => {
    if(password.length < 6) return true
    return false
}

export const isMatch = (password, cf_password) => {
    if(password === cf_password) return true
    return false
}


// const yup = require("yup");
// //import * as Yup from 'yup';

// export const userShema = yup.object().shape({
//   name: yup.string().required("Required"),
 
//   email: yup.string().email("Invalid email").required("Required"),
//   password: yup
//     .string()
//     .min(2, "Too Short!")
//     .max(50, "Too Long!")
//     .required("Required"),
//     cf_password: yup.string()
//      .oneOf([yup.ref('password'), null], 'Passwords must match')
 
// });

