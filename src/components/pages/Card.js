import React from "react";
import { Card, Col, Badge, Stack, Form, FloatingLabel, ListGroup } from "react-bootstrap";
import BuyAdSpace from "./Buy"
import ViewInfo from "./AdsInfomation";
import { useState } from "react";
import { truncateAddress } from "../../utils";
import Identicon from ".././ui/Identicon";
import { MDBBtn } from 'mdb-react-ui-kit';





const NftCard = ({ nft, ads, isOwner, BuySpace, endAd }) => {
  const { index, available, price, tokenId, dailyVisits, description, name, owner, ipfsurl } = nft;

  const [count, setCount] = useState(1)
  const _price = price / 10 ** 18;
  const totalPrice = _price * count;

  return (
    <Col key={index}>
      <Card style={{ width: '20rem' }} bg='dark' className="p-2">
        <Card.Header>
          <Stack direction="horizontal" gap={2}>

          <Identicon address={owner} size={28} />
            <span className="font-monospace text-light">
             Owner: {truncateAddress(owner)}
            </span>

           
          </Stack>
        </Card.Header>

        <div className=" ratio ratio-4x3">
          <img src={ipfsurl} alt={description} style={{ objectFit: "cover" }} />
        </div>

        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title className="text-light">{name}</Card.Title>
          <Card.Text className="flex-grow-1 text-light">{description}</Card.Text>

      <ListGroup variant="dark">
      <ListGroup.Item variant='dark'> <Badge bg="dark" className="ms-auto">
              Token ID {tokenId}
            </Badge></ListGroup.Item>
        <ListGroup.Item variant='dark'><Badge bg="dark" className="ms-auto">
               {_price} eth per day
            </Badge></ListGroup.Item>
        <ListGroup.Item variant='dark'> <Badge bg="dark" className="ms-auto">
              {dailyVisits} Daily Visits {available}
            </Badge></ListGroup.Item>
        
      </ListGroup>
        </Card.Body>
        {available === false &&
        ads.map((ad)=> (
        <ViewInfo ad={ad} name={name} />
         ))}
            {isOwner !== true && available === true &&
             <Form className="d-flex align-content-stretch flex-row gap-2">
                        <FloatingLabel
                            controlId="inputCount"
                            label="Days"
                            className="w-25 mt-3"
                        >
                            <Form.Control
                                type="number"
                                value={count}
                                min="1"
                                max="60"
                                onChange={(e) => {
                                    setCount(Number(e.target.value));
                                }}
                            />
                        </FloatingLabel>
                        
                         <>
                         <BuyAdSpace save={BuySpace} index={index}  price={totalPrice} days={count}/>
                       </>
                        
                        </Form>
}
        {isOwner === true && available === false && (
          <>

        <MDBBtn
            noRipple
            className="rounded-pill mt-2 "
            outline color='dark'
            onClick={() => {endAd(index)}}
            style={{ background: 'linear-gradient(to right, rgba(255, 0, 128, 0.5), rgba(99, 50, 206, 0.5))' }}

        >
         <h2 className="fs-6 fw-bold m-2 text-white">{"End Campaign"}</h2> 
        </MDBBtn>
          
          </>
        )}

<Card.Footer>
          {
            available === false ?(
              <small className="text-muted">Not Available: Campaign Already running</small>
            ): (
              <small className="text-muted">"Space Available: Campaign Expired"</small>
            )
          } 
        </Card.Footer>
            
      </Card>
    </Col>

    
  );
};

export default NftCard;
