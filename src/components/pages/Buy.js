/* eslint-disable react/jsx-filename-extension */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import { MDBBtn } from 'mdb-react-ui-kit';



const BuyAdSpace = ({ save, index, text, price, days}) => {
  const [headline, setHeadline] = useState("");
  const [visualLink, setVisualLink] = useState("");
  const [adDescription, setAdDescription] = useState("");

  
  
  const [show, setShow] = useState(false);


  // check if all form data has been filled
  const isFormFilled = () =>
      headline && visualLink && adDescription;

  // close the popup modal
  const handleClose = () => {
    setShow(false);
  };

  // display the popup modal
  const handleShow = event => {
    // 👇️ prevent page refresh
    event.preventDefault();
    setShow(true);
    console.log(event);
  };

  return (
    <>
      <MDBBtn
            noRipple
            className="rounded-pill m-2 "
            outline color='dark'
            onClick={handleShow}
            style={{ background: 'linear-gradient(to right, rgba(255, 0, 128, 0.5), rgba(99, 50, 206, 0.5))' }}

        >
         <h2 className="fs-6 fw-semi bold m-2 text-white">{"Buy Space"}</h2> 
        </MDBBtn>

      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Buy this space</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>

            <FloatingLabel
            controlId="inputHeadline"
            label="Headline"
            className="mb-3"
                        >
           <Form.Control
            type="text"
            placeholder="Headline"
            onChange={(e) => {
            setHeadline(e.target.value);
            }}
            />
            </FloatingLabel>


            <FloatingLabel
              controlId="inputVisual"
              label="visual link"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="visual Link"
                onChange={(e) => {
                  setVisualLink(e.target.value);
                }}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="inputDescription"
              label="Description"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="description"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setAdDescription(e.target.value);
                }}
              />
            </FloatingLabel>

          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            disabled={!isFormFilled()}
            onClick={() => {
              save(
                index,
                days,
                headline,
                visualLink,
                adDescription,
                price,
              );
              handleClose();
            }}
          >
            Buy Ad Space
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

BuyAdSpace.propTypes = {

  // props passed into this component
  save: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  days: PropTypes.number.isRequired,
};

export default BuyAdSpace;
