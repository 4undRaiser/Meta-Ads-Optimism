import React from 'react';
import PropTypes from 'prop-types';
import metaverse from '../assets/metaverse.png';
import { MDBBtn } from 'mdb-react-ui-kit';


const Cover = ({connect }) => {
    return (
      <div
          className="d-flex justify-content-center flex-column text-center"
        >
          <div className="mt-auto text-light">
          <h1 class="htext">Decentralized Metaverse Advertising</h1>
          <h4 class="text">A decentralized way of runing ads in the metaverse with NFT's <br/>
           open for anyone with a platform</h4>
          <img
              alt=""
              src={metaverse}
              width="400"
              height="400"
              
            
            />
            <p>Please connect your wallet to view ad Spaces.</p>

            <MDBBtn
                  noRipple
                  className="rounded-pill px-3 py-2"
                  outline color='dark'
                  onClick={() => connect().catch((e) => console.log(e))}
                  style={{ background: 'linear-gradient(to right, rgba(255, 0, 128, 0.5), rgba(99, 50, 206, 0.5))' }}
      
              >
               <h2 className="fs-5 fw-bold m-1 text-white">{"Get Started"}</h2> 
              </MDBBtn>
          </div>

          <p className="mt-auto text-secondary ">Powered by Web3</p>
        </div>
    );
};


Cover.propTypes = {
  // props passed into this component
  name: PropTypes.string,
};

Cover.defaultProps = {
  name: '',
};

export default Cover;
