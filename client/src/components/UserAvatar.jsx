import React from 'react';

const UserAvatar = ({ username, profilePicture, width, height }) => {
  const getInitial = (username) => {
    return username ? username.charAt(0).toUpperCase() : "";
  };

  const generateRandomColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
      colors.push(color);
    }
    return colors;
  };

  const colors = generateRandomColors(6);
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <div
      className="avatar"
      style={{
        backgroundColor: profilePicture ? "transparent" : randomColor,
        width: `${width}px`,
        height: `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${width / 2}px`,
        color: 'white',
        borderRadius: '50%',
      }}
    >
      {profilePicture ? (
        <img
          src={profilePicture}
          alt="Profile"
          width={width}
          height={height}
          style={{
            borderRadius: '50%',
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          }}
        />
      ) : (
        getInitial(username)
      )}
    </div>
  );
};

export default UserAvatar;
