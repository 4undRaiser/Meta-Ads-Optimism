import {create as ipfsHttpClient} from "ipfs-http-client";
import {Web3Storage} from 'web3.storage/dist/bundle.esm.min.js'
import axios from "axios";




// get the metedata for an NFT from IPFS
export const fetchNftMeta = async (ipfsUrl) => {
    try {
        if (!ipfsUrl) return null;
        const meta = await axios.get(ipfsUrl);
        return meta;
    } catch (e) {
        console.log({e});
    }
};




  
