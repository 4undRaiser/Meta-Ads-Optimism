
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import AddNfts from "./Add";
import Nft from "./Card";
import { MDBBtn } from 'mdb-react-ui-kit';
import Loader from "../ui/Loader";
import { NotificationSuccess, NotificationError } from "../ui/Notifications";
import { Row } from "react-bootstrap";

const NftList = ({addNFT, getNfts, getAds, buyySpace, EndAdvert, address, uploadImage}) => {


  

  /* performActions : used to run smart contract interactions in order
  *  address : fetch the address of the connected wallet
  */
  const [nfts, setNfts] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableSpaces, setAvailableSpaces] = useState(false)
  



  const getAssets = useCallback(async () => {
    try {
      setLoading(true);

      // fetch all nfts from the smart contract
      const allNfts = await getNfts();
      if (!allNfts) return
      setNfts(allNfts);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, [getNfts]);

  const getAdsAssets = useCallback(async () => {
    try {
      setLoading(true);

      // fetch all nfts from the smart contract
      const allAds = await getAds();
      if (!allAds) return
      setAds(allAds);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, [getAds]);


  

  const addNft = async (price, dailyVisits, name, description, ipfsurl, address) => {
    try {
      setLoading(true);
      await addNFT(price, dailyVisits, name, description, ipfsurl, address);

     
      toast(<NotificationSuccess text="Updating NFT list...."/>);
      getAssets();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create an NFT." />);
    } finally {
      setLoading(false);
    }
  };


  const BuySpace = async (index, days, headline, visualLink, adDescription, price) => {
    try {
      setLoading(true);
      await buyySpace(index, days, headline, visualLink, adDescription, price);

     
      toast(<NotificationSuccess text="Buying Space..."/>);
      getAssets();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to buy space." />);
    } finally {
      setLoading(false);
    }
  };


  const endAd = async (tokenId) => {
    try {
      setLoading(true);
      await EndAdvert(tokenId);
      toast(<NotificationSuccess text="Ending Ads"/>);
      getAssets();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to end Ads." />);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    try {
      if (address) {
        getAssets();
        getAdsAssets();
      
      }
    } catch (error) {
      console.log({ error });
    }
  }, [address, getAssets, getAdsAssets]);
  if (address) {
    return (
      <>
        {!loading ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">

              
              <MDBBtn
                  noRipple
                  className="rounded-pill px-2 py-2"
                  outline color='dark'
                  variant="dark"
                  onClick={() => {
                    setAvailableSpaces(false);
                   }}
                  style={{ background: 'linear-gradient(to right, rgba(255, 0, 128, 0.5), rgba(99, 50, 206, 0.5))' }}
      
              >
               <h2 className="fs-5 fw-bold m-2 text-white">{"View All Spaces"}</h2> 
              </MDBBtn>

              <MDBBtn
                  noRipple
                  className="rounded-pill px-2 py-2"
                  outline color='dark'
                  variant="dark"
                  onClick={() => {
                    setAvailableSpaces(true);
                   }}
                  style={{ background: 'linear-gradient(to right, rgba(255, 0, 128, 0.5), rgba(99, 50, 206, 0.5))' }}
      
              >
               <h2 className="fs-5 fw-bold m-2 text-white">{"View Available Spaces"}</h2> 
              </MDBBtn>

              <AddNfts save={addNft} address={address} uploadImage={uploadImage}/>
            

            </div>
            <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">

              {/* display all NFTs */}
              {!availableSpaces ? nfts.map((_nft,) => (
                  <Nft
                      key={_nft.index}
                      isOwner={address === _nft.owner}
                      BuySpace={BuySpace}
                      endAd={endAd}
                      ads={ads}
                      nft={{
                        ..._nft,
                      }}
                  />
              ))
              : nfts.filter((_nft) => _nft.available === true).map((_nft) =>(
                <Nft
                key={_nft.index}
                isOwner={address === _nft.owner}
                BuySpace={BuySpace}
                endAd={endAd}
                ads={ads}
                nft={{
                  ..._nft,
                }}
            />
              ))
            }
            </Row>
          </>
        ) : (
          <Loader />
        )}
      </>
    );
  }
  return null;
};



export default NftList;
