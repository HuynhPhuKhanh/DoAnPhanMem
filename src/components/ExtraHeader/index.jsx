import React from "react";
import { Link } from "react-router-dom";

const ExtraHeader = () => {
  const userId = sessionStorage.getItem("id");

  return (
    <div className="h-20 w-full flex justify-center">
      <div className="w-[70%] flex justify-between items-center text-base uppercase font-medium">
        <Link to="/">Giao diện khách hàng</Link>
        {userId ? (
          <Link to="/my-voucher">
            <button className="bg-green-neon hover:bg-green-neon-hover w-32 h-10 rounded-lg ">
              Ví Voucher
            </button>
          </Link>
        ) : (
          <button
            onClick={() => {
              alert("Bạn hãy đăng nhập để xem danh sách Voucher");
            }}
            className="bg-gray-500 w-32 h-10 rounded-lg"
          >
            Ví Voucher
          </button>
        )}
      </div>
    </div>
  );
};

export default ExtraHeader;
