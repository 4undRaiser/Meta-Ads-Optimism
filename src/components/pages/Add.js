/* eslint-disable react/jsx-filename-extension */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import { MDBBtn } from 'mdb-react-ui-kit';



const AddNfts = ({ save, address, uploadImage }) => {
  const [price, setPrice] = useState(0);
  const [dailyVisits, setDailyVisits] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ipfsurl, setIpfsUrl] = useState("");
  

  
  const [show, setShow] = useState(false);


  // check if all form data has been filled
  const isFormFilled = () =>
      name && ipfsurl && description;

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
      className="rounded-pill px-2 py-2"
      outline color='dark'
      variant="dark"
      onClick={handleShow}
      style={{ background: 'linear-gradient(to right, rgba(255, 0, 128, 0.5), rgba(99, 50, 206, 0.5))' }}
      
    >
     <h2 className="fs-5 fw-bold m-2 text-white">{"Mint New Space"}</h2> 
    </MDBBtn>
      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Mint Ad Space</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>

          <FloatingLabel
            controlId="inputPrice"
            label="Price"
            className="mb-3"
                        >
           <Form.Control
            type="number"
            placeholder="Price"
            onChange={(e) => {
            setPrice(e.target.value);
            }}
            />
            </FloatingLabel>

            <FloatingLabel
            controlId="inputdailyVisits"
            label="dailyVisits"
            className="mb-3"
                        >
           <Form.Control
            type="number"
            placeholder="Daily Visits"
            onChange={(e) => {
            setDailyVisits(e.target.value);
            }}
            />
            </FloatingLabel>


            <FloatingLabel
              controlId="inputNAME"
              label="Name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Name of Platform"
                onChange={(e) => {
                  setName(e.target.value);
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
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>

            <Form.Control
              type="file"
              className={"mb-3"}
              onChange={async (e) => {
                const imageUrl = await uploadImage(e);
                if (!imageUrl) {
                  alert("failed to upload image");
                  return;
                }
                setIpfsUrl(imageUrl);
              }}
              placeholder="Enter visual link of location"
            ></Form.Control>
            

          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              save(
                price,
                dailyVisits,
                name,
                description,
                ipfsurl,
                address,
              );
              handleClose();
            }}
          >
            Create Ad Space
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddNfts.propTypes = {

  // props passed into this component
  save: PropTypes.func.isRequired,
  address: PropTypes.string.isRequired,
};

export default AddNfts;
