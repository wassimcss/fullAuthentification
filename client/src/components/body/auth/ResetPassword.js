import axios from 'axios'
import React , {useState} from 'react'
import { useParams } from 'react-router-dom'
import { showErrMsg, showSuccessMsg } from '../../utils/Notification'
import {  isLength, isMatch } from '../../utils/Validation'
const initialState = {
    password:"",
    cf_password:"",
    err:"",
    success:""
}
export const ResetPassword = () => {
    const [data, setData] = useState(initialState)
    const {token} = useParams()
    const {password,cf_password,err,success} = data
    const handleChangeInput = (e) => {
        const {name,value} = e.target
        setData({...data,[name]:value , err:"" , success:""})
    }
    const handleResetPass = async() => {
        if (isLength(password)) return setData({...data,err:"Password must be at least 6 caracters" , success:""})
        if (!isMatch(password,cf_password)) return setData({...data,err:"Password did not match",success:""})
        try {
            const res = await axios.post("/user/reset",{password},{ headers: {authtoken: token}})
            setData({...data,err:"",success:res.data.msg})
        } catch (error) {
            setData({...data,err:error.response.data.msg,success:""})
        }
    }
    


    //console.log(token)
    return (
        <div className="fg_pass">
            <h2>Reset Your Password</h2>

            <div className="row">
                {err && showErrMsg(err)}
                {success && showSuccessMsg(success)}

                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" value={password}
                onChange={handleChangeInput} />

                <label htmlFor="cf_password">Confirm Password</label>
                <input type="password" name="cf_password" id="cf_password" value={cf_password}
                onChange={handleChangeInput} />         

                <button onClick={handleResetPass}>Reset Password</button>
            </div>
        </div>
    )
}
