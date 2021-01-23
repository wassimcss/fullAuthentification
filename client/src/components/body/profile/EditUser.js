import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { showErrMsg, showSuccessMsg } from "../../utils/Notification";
import axios from "axios";

export default function EditUser() {
  const [editUser, setEditUser] = useState([]);
  const [checkAdmin, setCheckAdmin] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [num, setNum] = useState(0);

  const { id } = useParams();
  const history = useHistory();

  const token = useSelector((state) => state.tokenReducer);
  const users = useSelector((state) => state.usersReducer);

  useEffect(() => {
    if (users.length !== 0) {
      users.forEach((user) => {
        if (user._id === id) {
          setEditUser(user);
          setCheckAdmin(user.role === 1 ? true : false);
        }
      });
    } else {
      history.push("/profile");
    }
  }, [users, history, id]);
  const handleUpdate = async() => {
     try {
         if (num % 2 !== 0){
             const res = await axios.patch(`/user/update_role/${editUser._id}`,{role : checkAdmin ? 1 : 0},{headers: {authtoken: token}})
             setSuccess(res.data.msg)
             setNum(0)
         }

     } catch (error) {
         setErr(error.response.data.msg)
     }      
  };
  const handleCheck = () => {
      setErr("")
      setSuccess("")
      setCheckAdmin(!checkAdmin)
      setNum(num+1)
  };

  return (
    <div className="profile_page edit_user">
      <div className="row">
        <button onClick={() => history.goBack()} className="go_back">
          <i className="fas fa-long-arrow-alt-left"></i> Go Back
        </button>
      </div>

      <div className="col-left">
        <h2>Edit User</h2>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            defaultValue={editUser.name}
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            defaultValue={editUser.email}
            disabled
          />
        </div>

        <div className="form-group">
          <input
            type="checkbox"
            id="isAdmin"
            checked={checkAdmin}
            onChange={handleCheck}
          />
          <label htmlFor="isAdmin">isAdmin</label>
        </div>

        <button onClick={handleUpdate}>Update</button>

        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}
      </div>
    </div>
  );
}
