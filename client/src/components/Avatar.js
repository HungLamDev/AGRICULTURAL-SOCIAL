import React from "react";
import { useSelector } from "react-redux";

const Avatar = ({ src, size }) => {
  const theme = useSelector((state) => state.theme);
  
  const avatarSrc = src || "https://res.cloudinary.com/duw0njssy/image/upload/v1695198799/image_default_AgricultureVN/logo_only_s3ioxv.png";

  return (
    <img
      src={avatarSrc}
      alt="avatar"
      className={size}
      style={{ filter: theme ? "invert(1)" : "invert(0)" }}
    />
  );
};

export default Avatar;
