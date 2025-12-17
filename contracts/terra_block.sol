// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract Ownable {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), _owner);
    }

    function owner() public view returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(owner() == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

contract TerraBlock is Ownable {
    uint256 public landCount = 0;
    address public government;

    struct Land {
        uint256 id;
        address payable owner;
        string lat;
        string long;
        uint256 area;
        uint256 price;
        bool forSale;
        string ipfsHash;
    }

    Land[] public lands;
    
    mapping(bytes32 => bool) public registeredLocations;

    constructor() {
        government = msg.sender;
    }

    function setGovernmentAddress(address _address) external onlyOwner {
        government = _address;
    }

    function registerLand(
        address payable _owner,
        string memory _lat,
        string memory _long,
        uint256 _area,
        string memory _ipfsHash
    ) public {
        require(msg.sender == government, "Only Govt can register");

        bytes32 locHash = keccak256(abi.encodePacked(_lat, _long));
        require(!registeredLocations[locHash], "Land at this location already registered");

        uint256 _id = lands.length; 
        
        Land memory _newLand = Land({
            id: _id,
            owner: _owner,
            lat: _lat,
            long: _long,
            area: _area,
            price: 0,
            forSale: false,
            ipfsHash: _ipfsHash
        });

        lands.push(_newLand);
        registeredLocations[locHash] = true;
        landCount++;

    }

    function setLandOpenToSale(uint256 _landId, uint256 _price) public {
        require(_landId < lands.length, "Invalid Land Id"); 
        require(msg.sender == lands[_landId].owner, "Not the land owner");
        
        Land storage _land = lands[_landId];
        _land.price = _price;
        _land.forSale = true;
    }

    function buyLand(uint256 _landId) public payable {
        require(_landId < lands.length, "Invalid Land Id");
        
        Land storage _land = lands[_landId];
        
        require(_land.forSale == true, "Land not for sale");
        require(msg.value >= _land.price, "Insufficient funds");
        require(msg.sender != _land.owner, "You already own this land");

        address payable oldOwner = _land.owner;
        address payable newOwner = payable(msg.sender);

        (bool sent, ) = oldOwner.call{value: msg.value}("");
        require(sent, "Transaction failed");

        _land.owner = newOwner;
        _land.forSale = false;

    }

    function getLands() public view returns (Land[] memory) {
        return lands;
    }

    function transferLandOwnership(address payable _newOwner,uint _landId) public {
        require(_landId < lands.length, "Invalid Land Id");
        require(msg.sender == lands[_landId].owner,"Only land owner can transfer the ownership");
        require(_newOwner != address(0), "Cannot transfer to zero address");
        Land storage _land = lands[_landId];
        _land.owner = _newOwner;
        _land.forSale = false;
    }

}