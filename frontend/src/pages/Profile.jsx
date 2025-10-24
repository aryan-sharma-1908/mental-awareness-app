import React, { useContext } from "react";
import { MdEdit } from "react-icons/md";
import Button from "@mui/material/Button";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const { selectedAvatar, username, isAuthenticated } = useContext(AuthContext);

  const navigate = useNavigate();
  return isAuthenticated ? (
    <div className="h-[400px] w-[800px] rounded-lg shadow-md bg-white mx-auto my-20 flex flex-col ">
      <div className="avatar-wrapper rounded-full overflow-hidden w-[80px] h-[80px] mt-5 mx-auto">
        <img src={selectedAvatar || "/boy.png"} alt="" />
      </div>
      <div className="setupProfile rounded-md shadow-md p-4 w-[80%] ml-5 flex justify-between">
        <h2 className="text-[25px] font-bold]">Username: {username}</h2>
        <Button className="!bg-green-500 !rounded-full !min-w-[40px] !w-[40px] !h-[40px]">
          <MdEdit className="p-2 !text-white text-[15px] w-[10px] h-[10px]" />
        </Button>
      </div>
      <div className="emailWrapper"></div>
    </div>
  ) : (
    navigate("/login")
  );
};

export default Profile;
