import './App.css';
import React from "react";
import { useState, useCallback } from 'react';
import Cover from "./components/Cover";
import {Notification} from "./components/ui/Notifications";
import Nfts from "./components/pages";
import NavigationBar from './components/nav';
import {Container} from "react-bootstrap";
import MetaAds from "./contracts/MetaAds.json";
import MetaAdsAddress from "./contracts/MetaAds-address.json";
import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import axios from "axios";
import { ethers } from 'ethers';
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'
require('dotenv').config({path: '.env'});


function App() {
  
  

  const [address, setAddress] = useState(null);

  const Web3 = createAlchemyWeb3("https://opt-goerli.g.alchemy.com/v2/kjfozJzIY6OubYNqxNP1nIuAi0z-wCIk");
  const minterContract = new Web3.eth.Contract(MetaAds.abi, MetaAdsAddress.MetaAds);
  
  const getAccessToken = () => { return process.env.REACT_APP_STORAGE_API_KEY }
  const makeStorageClient = () => { return new Web3Storage({ token: getAccessToken() }) }
  
  
  const upload = (file) => {
    const client = makeStorageClient();
    const file_cid = client.put(file);
  
    return file_cid;
  }
  
  const makeFileObjects = (file, file_name) => {
    const blob = new Blob([JSON.stringify(file)], { type: "application/json" })
    const files = [new File([blob], `${file_name}.json`)]
  
    return files
  }


   const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAddress(addressArray[0]);
        const obj = {
          status: "",
          address: addressArray[0],
        };
       
        return obj;
      } catch (err) {
        return {
          address: "",
          status: "😞" + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a target="_blank" href="https://metamask.io/download.html">
                You must install MetaMask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
  };


  const addNFT = async ( price, dailyVisits, name, description, ipfsurl, address )=>{
     

     // convert NFT metadata to JSON format
     const data = JSON.stringify({
         name: name,
         ipfsurl: ipfsurl,
         owner: address,
     });

     try {

      const files = makeFileObjects(data, name);
      const file_cid = await upload(files);

      const fee = ethers.utils.parseUnits(String(0.00005), "ether");

      const _price = ethers.utils.parseUnits(String(price), "ether");
      const url = `https://${file_cid}.ipfs.w3s.link/${name}.json`;
      console.log(url);

       
        // mint the NFT and save the IPFS url to the blockchain
         await minterContract.methods
         .mintSpace(url, _price, dailyVisits, description, name)
         .send({ from: address, value: fee });
         
       
     } catch (error) {
         console.log("Error uploading file: ", error);
     }

  }

  const uploadImage = async (e) => {
    const image = e.target.files;
    const image_name = image[0].name;
  
    if (!image) return;
    // Pack files into a CAR and send to web3.storage
    const cid = await upload(image) // Promise<CIDString>
    const image_url = `https://${cid}.ipfs.w3s.link/${image_name}`
  
    return image_url;
  };

  // get the metedata for an NFT from IPFS
 const fetchNftMeta = async (ipfsUrl) => {
  try {
      if (!ipfsUrl) return null;
      const meta = await axios.get(ipfsUrl);
      const data = JSON.parse(meta.data)
      return data;
  } catch (e) {
      console.log({e});
  }
};

  const getNfts = useCallback( async () => {
   
    try {
        const nfts = [];
        const nftsLength = await minterContract.methods.totalSupply().call();
        for (let i = 0; i < Number(nftsLength); i++) {
            const nft = new Promise(async (resolve) => {
              const space_nft = await minterContract.methods.getSpace(i).call();
                const res = await minterContract.methods.tokenURI(space_nft[2]).call();
                const meta = await fetchNftMeta(res);
                
                
                resolve({
                    index: i,
                    available: space_nft[0],
                    price: space_nft[1],
                    tokenId: space_nft[2],
                    dailyVisits: space_nft[3],
                    description: space_nft[4],
                    name: meta.name,
                    owner: meta.owner,
                    ipfsurl: meta.ipfsurl,
                    
                });
            });
            nfts.push(nft);
        }
        return Promise.all(nfts);
    } catch (e) {
        console.log({e});
    }
});


const getAds = useCallback( async () => {
   
  try {
      const ads = [];
      const adsLength = await minterContract.methods.totalSupply().call();
      for (let i = 0; i < Number(adsLength); i++) {
          const adinfo = new Promise(async (resolve) => {
              const _ads = await minterContract.methods.getAdvert(i).call();
              
              resolve({
                  headline: _ads[0],
                  visualLink: _ads[1],
                  adDescription: _ads[2],
                  endDate: _ads[3],
                  adOwner: _ads[4]
              });
          });
          ads.push(adinfo);
      }
      return Promise.all(ads);
  } catch (e) {
      console.log({e});
  }
});


const buyySpace = async (
  index,
  days,
  headline,
  visualLink,
  adDescription,
  price,
) => {
      try {
        const _price = ethers.utils.parseUnits(String(price), "ether");
        await minterContract.methods.buySpace(index, days, headline, visualLink, adDescription).send({ from: address, value: _price });
      } catch (error) {
        console.log({ error });
      }
  } 


const EndAdvert = async (
  index
) => {
  
      try {
        await minterContract.methods.endAdvert(index).send({ from: address });
      } catch (error) {
        console.log({ error });
      }
};

  
  

   
  
     

    return (
      <>

            <Notification />
            <NavigationBar address={address} connect={connectWallet}/>
            
            {address ? (
                <Container fluid="md">
                  
                    <main>

                        {/*list NFTs*/}
                        <Nfts
                            addNFT={addNFT}
                            getNfts={getNfts}
                            getAds={getAds}
                            buyySpace={buyySpace}
                            EndAdvert={EndAdvert}
                            name="Meta Ads"
                            minterContract={minterContract}
                            address={address} 
                            uploadImage={uploadImage}
                        />
                    </main>
                </Container>
            ) : (
                //  if user wallet is not connected display cover page
                <Cover name="META ADS MARKETPLACE"  connect={connectWallet}/>
            )}
        </>
    );
}

export default App;
