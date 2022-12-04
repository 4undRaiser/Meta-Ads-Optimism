/* eslint-disable react/jsx-filename-extension */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Badge} from "react-bootstrap";
import { MDBBtn } from 'mdb-react-ui-kit';




const ViewInfo = ({ ad }) => {
    const { headLine, visualLink, adDescription, endDate } =ad

    const moment = require('moment');
   var parsed = moment.unix(endDate)
  
  const [show, setShow] = useState(false);

  // close the popup modal
  const handleClose = () => {
    setShow(false);
 
  };

  // display the popup modal
  const handleShow = () => setShow(true);

  return (
    <>
      <MDBBtn
            noRipple
            className="rounded-pill mt-2 "
            outline color='dark'
             onClick={handleShow}
            style={{ background: 'linear-gradient(to right, rgba(255, 0, 128, 0.5), rgba(99, 50, 206, 0.5))' }}

        >
         <h2 className="fs-6 fw-bold m-2 text-white">{"View current Campaign"}</h2> 
        </MDBBtn>

      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Current running ad</Modal.Title>
        </Modal.Header>

        <Modal.Body>
        <h5>Headline: {headLine}</h5>

        <Badge bg="dark" className="ms-auto">
              End Date : {parsed.toString()}
            </Badge>
        <div className=" ratio ratio-4x3">
          <img src={visualLink} alt={adDescription} style={{ objectFit: "cover" }} />
        </div>
       
          <p className="flex-grow-1"> Description: {adDescription}</p>
         
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

ViewInfo.propTypes = {

  // props passed into this component
  ad: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default ViewInfo;
