// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";



/// @title MetaAds
/// @author Jonathan Iheme
/// @notice This contract is a prototype for the MetaAds marketplace.

contract MetaAds is ERC721Enumerable, ERC721URIStorage, Ownable{
    using Counters for Counters.Counter;

     /// Events
    event Mint(uint _price, uint _tokenId, string _uri, string _description, string _name);
    event SpaceSold(uint _price, address _newOwner, uint _endDate);
    event advertEnded(uint _id);
   
    // Constructor 
    constructor() ERC721("Spaces", "ANS") {}

    // Global variables
    Counters.Counter private _tokenIdCounter;
    Counters.Counter private allSpaces;
    uint publicGoodsFee = 0.00005 ether;
    address payable optimismPGAddress = payable(0x1eF9a73C675466e8f58da6bF4E9ce42DEA82AaE2);


    /// @dev this struct contains all property of an ad space
    struct Space{
        bool available;
        uint price;
        uint tokenId;
        uint dailyVisits;
        string description;
        string name;
        address owner;
        address subOwner;
    }



    /// @dev this struct contains the content of an ad space after it has been bought.
    struct adInfo{
        string headLine;
        string visualLink;
        string adDescription;
        uint endDate;
        address adOwner;
    }




    // mappings
    mapping (uint => Space) spaces; // mappings for spaces
    mapping (uint => adInfo) adsinformation; // mappings for ad content of spaces




    // modifier
    modifier onlySpaceOwner(uint _index) {
        require(msg.sender == spaces[_index].owner);
        _;
    }


    /** 
    @dev an ipfs url string should be passed to the function argument uri
    @notice this function facilitates the minting and creation of a new ad space.
    and owners of ad space has to pay the optimism public goods fee to mint a new ad space.
    */
    function mintSpace(
        string calldata uri,
        uint _price,
        uint _dailyVisits,
        string memory _description,
        string memory _name
    ) external payable {

        require(bytes(uri).length > 0, "Empty uri");
        require(msg.value == publicGoodsFee);
        (bool success, ) = payable(optimismPGAddress).call{value: publicGoodsFee}("");
        require(success, "Transfer failed");
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        newSpace(_price, tokenId, _dailyVisits, _description, _name); // creating the new space nft
        emit Mint(_price, tokenId, uri, _description, _name);
    }


    ///@notice this function facilitates the buying of spaces on the marketplace.
    function buySpace(
        uint _index, 
        uint _noOfDays, 
        string memory _headLine,
        string memory _visualLink,
        string memory _adDescription
        ) external payable{
        Space storage space = spaces[_index];
        require(msg.sender != space.owner);
        require(space.available == true);
        uint estimatedPrice = space.price * _noOfDays;
        require(msg.value == estimatedPrice);
        (bool success, bytes memory data ) = payable(space.owner).call{value: estimatedPrice}("");
        require(success, "Transfer failed");
        space.subOwner = msg.sender;
        space.available = false;
        uint _endDate = calculateEndDate(_noOfDays);
        setAdvert(_index, _headLine, _visualLink, _adDescription, _endDate);
        emit SpaceSold(space.price, msg.sender, _endDate);
    }


    /** 
    @dev only the owner of the space can end the advert after the end date has been reached.
    @notice this function facilitates the ending of an Advert in the metaverse
    */
    function endAdvert(uint _index) external onlySpaceOwner(_index) {
        require(block.timestamp > adsinformation[_index].endDate);
        Space storage space = spaces[_index];
        space.available = true;
        space.subOwner = address(0);
        setAdvert(_index, "Expired", "expired", " ", 0);
        emit advertEnded(_index);

    }

    /** 
    @dev only contract owner can call this function
    */
    function modifyPublicGoodsFee(uint _newFee) external onlyOwner{
        require(_newFee > 0);
        publicGoodsFee = _newFee;
    }


     /** 
    @dev only contract owner can call this function
    */
    function modifySpacePrice(uint _index, uint _newPrice) external onlySpaceOwner(_index){
        require(_newPrice > 0);
        spaces[_index].price = _newPrice;
    }



    /** 
    @dev returning a space with the token id param
    */
     function getSpace(uint _tokenId) public view returns (
        bool,
        uint,
        uint,
        uint,
        string memory, 
        string memory,  
        address, 
        address
    ) {
        Space memory data = spaces[_tokenId];
        return (
            data.available,
            data.price,
            data.tokenId,
            data.dailyVisits,
            data.description, 
            data.name,
            data.owner,
            data.subOwner
        );
    }



    /** 
    @dev retrieving the advert content of a space.
    @notice viewing the content of an advert space.
    */
    function getAdvert(uint _index) public view returns (
        string memory, 
        string memory, 
        string memory, 
        uint, 
        address
    ) {
        adInfo memory data = adsinformation[_index];
        return (
            data.headLine,
            data.visualLink,
            data.adDescription,
            data.endDate, 
            data.adOwner
        );
    }


    /** 
    @dev retrieving the end date of an advert.
    */
    function getEndDate(uint _index) public view returns(uint){
        return adsinformation[_index].endDate;
    }

    /** 
    @dev calculating the endDate of an advert by using block.timestamp as now and
    adding it to the number of days that is passed into the function.
    */
    function calculateEndDate(uint _days) private view returns(uint) {
        uint endDate = uint(block.timestamp + _days); 
        return endDate;
    }
    

    /** 
    @dev a private function to be called when minting a new space to add the minted space to the mapping.
    */
    function newSpace(  
        uint _price,
        uint _tokenId,
        uint _dailyVisits,
        string memory _description,
        string memory _name
    ) private {
        require(_price > 0);

        spaces[allSpaces.current()] = Space(
            true,
            _price,
            _tokenId,
            _dailyVisits,
            _description,
            _name,
            payable(msg.sender),
            address(0)
        );

       allSpaces.increment();
    }

    
    /** 
    @dev a private function to be called on the buySpace function
     to add the content and end date of the advertisement.
    */
    function setAdvert(  
        uint _index,
        string memory _headLine,
        string memory _visualLink,
        string memory _adDescription,
        uint _endDate
    )   private {
        require(msg.sender == spaces[_index].subOwner);
        adsinformation[_index] = adInfo(
            _headLine,
            _visualLink,
            _adDescription,
            _endDate,
            msg.sender
            
        );
    }


   
   
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    


  

}