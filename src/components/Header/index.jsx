import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { authActions } from "../../redux/authSlice";

const Header = () => {
  const { isLoggedIn, credentials } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogOut = async () => {
    dispatch(authActions.logout());
    localStorage.clear();
  };

  return (
    <div className="flex h-20 justify-around shadow-lg">
      <Link to="/" className="uppercase font-bold text-4xl flex items-center">
        Voucher Hunter
      </Link>
      {isLoggedIn ? (
        <div className="flex gap-10 items-center text-xl font-bold">
          <p>Xin Chào, {credentials.name}</p>
          <img
            src="./img/avatar.jpg"
            alt="not-found"
            className="w-12 h-12 rounded-full"
          />
          <button
            onClick={() => handleLogOut()}
            className="bg-green-neon hover:bg-green-neon-hover w-32 h-10 rounded-lg "
          >
            Log out
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-10 items-center text-xl font-bold">
          <Link to="/register">
            <button className="bg-green-neon hover:bg-green-neon-hover w-32 h-10 rounded-lg  ">
              Sign Up
            </button>
          </Link>
          <Link to="/login">
            <button className="bg-green-neon hover:bg-green-neon-hover w-32 h-10 rounded-lg ">
              Sign In
            </button>
          </Link>
          <Link to="/admin">
            <img
              src="./img/avatar.jpg"
              alt="not-found"
              className="w-12 h-12 rounded-full"
            />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Header;
