import React, { useState } from "react";
import PropTypes from "prop-types";
import { AccordionSection } from "../";

export default function Accordion({ children, allowMultipleOpen }) {
  const [openSections, setOpenSections] = useState('');
  Accordion.propTypes = {
    allowMultipleOpen: PropTypes.bool,
    children: PropTypes.instanceOf(Object).isRequired
  }

  Accordion.defaultProps = {
    allowMultipleOpen: false
  }

  function onClickHandler(label) {
    const isOpen = !!openSections[label];

    if (allowMultipleOpen) {
      setOpenSections({
        ...openSections,
        [label]: !isOpen
      });
    } else {
      setOpenSections({
        [label]: !isOpen
      });
    }
  }

  return (
    <div style={{ border: "2px solid #008f68" }}>
      {children.map((child, index) => (
        <AccordionSection
          key={index}
          isOpen={!!openSections[child.props.label]}
          label={child.props.label}
          onClick={onClickHandler}
        >
          {child.props.children}
        </AccordionSection>
      ))}
    </div>
  );
}
