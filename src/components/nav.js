import React from 'react';
import PropTypes from 'prop-types';
import Wallet from './wallet';
import {Navbar, Container } from 'react-bootstrap';
import logo from '../assets/logo.png';
import { MDBBtn } from 'mdb-react-ui-kit';




const NavigationBar = ({ address, connect }) => {
    return (
        <Navbar expand="lg" className='pt-3 pb-2 align-items-center mb-4'>
          <Container className='m-3'>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src={logo}
              width="160"
              height="100"
            />{' '}
          </Navbar.Brand>
        </Container>

            {address ? (
                 <Wallet className="px-3 mt-3" address={address} />
                 ):(
                
            <MDBBtn
            noRipple
            className="rounded-pill px-2 "
            outline color='dark'
            onClick={() => connect().catch((e) => console.log(e))}
            style={{ background: 'linear-gradient(to right, rgba(255, 0, 128, 0.5), rgba(99, 50, 206, 0.5))' }}

        >
         <h2 className="fs-6 fw-bold m-2 text-white">{"Connect Wallet"}</h2> 
        </MDBBtn>
            )}
                       
        </Navbar>
    );
};


NavigationBar.propTypes = {
  // props passed into this component
  address: PropTypes.string,
  connect: PropTypes.func,
};


export default NavigationBar;
