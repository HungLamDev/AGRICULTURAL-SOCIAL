import React from "react";

const Icons = ({ setContent, content, theme }) => {
  const emoji = [
    "🙂","😄","😆","😅","😂","🤣","😊","👍","😌","😉",
    "😏","😍","😘","😗","😙","😚","🤗","😳","🙃","👻",
    "💀","👽","🤖","💩"
  ];

  return (
    <li
      className="nav-item dropdown align-items-center d-flex"
    >
      <span
        className="nav-link position-relative"
        id="navbarDropdown"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        aria-haspopup="true"
        style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
      >
        <span>😍</span>
      </span>
      <div
        className="dropdown-menu position-absolute dropdown-menu-end"
        aria-labelledby="navbarDropdown"
        style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
        
      >
        <div className="emoji" >
          {emoji.map((icon) => (
            <span key={icon} onClick={() => setContent(content + icon)}>{icon}</span>
          ))}
        </div>
      </div>
    </li>
  );
};

export default Icons;
