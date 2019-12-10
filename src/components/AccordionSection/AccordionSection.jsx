import React from "react";
import PropTypes from "prop-types";

export default function AccordionSection({ children, isOpen, label, onClick }) {
  AccordionSection.propTypes = {
    children: PropTypes.instanceOf(Object).isRequired,
    isOpen: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  }

  function onClickHandler() {
    onClick(label);
  }

  return (
    <div
      style={{
        background: isOpen ? "#fae042" : "#6db65b",
        border: "1px solid #008f68",
        padding: "5px 10px"
      }}
    >
      <div onClick={onClickHandler} style={{ cursor: "pointer" }}>
        {label}
        <div style={{ float: "right" }}>
          {!isOpen && <span>&#9650;</span>}
          {isOpen && <span>&#9660;</span>}
        </div>
      </div>
      {isOpen && (
        <div
          style={{
            background: "#6db65b",
            border: "2px solid #008f68",
            marginTop: 10,
            padding: "10px 20px"
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
