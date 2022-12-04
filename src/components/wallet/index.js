import React from 'react';
import {Stack, Button} from 'react-bootstrap';
import { truncateAddress } from '../../utils';


const Wallet = ({ address }) => {
    if (address) {
        return <>

      <Button variant="outline-secondary">    
            <Stack direction="horizontal" gap={2}>
                <i className="bi bi-person-circle fs-4" />
                <span className="font-monospace">{truncateAddress(address)}</span>
            </Stack>
            </Button>
    
    </>
  }

  return null;
};

export default Wallet;