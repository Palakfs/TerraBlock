pragma solidity ^0.8.27;

contract TerraBlock {
    string public name;
    uint public landCount = 0;

    struct Land {
        uint id;
        address payable owner;
        string location;
        uint area;
        uint price;
        bool forSale;
        string ipfsHash;
    }

    mapping (uint => Land) public lands;
    mapping (address -> uint[]) public ownerLands;


}