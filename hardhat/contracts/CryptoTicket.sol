// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "erc721a/contracts/ERC721A.sol";
import "erc721a/contracts/extensions/ERC721ABurnable.sol";
import "erc721a/contracts/extensions/ERC721AQueryable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @custom:security-contact alexandru.vasilescu01@gmail.com
contract CryptoTicket is
    ERC721A,
    ERC721AQueryable,
    ERC721ABurnable,
    AccessControl
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC721A("CryptoTicket", "TKT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "http://localhost:9000/tickets/";
    }

    function safeMint(address to, uint256 quantity)
        public
        onlyRole(MINTER_ROLE)
    {
        require(quantity <= 1000, 'Please mint less than 1000 tokens at a time');
        _safeMint(to, quantity);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721A, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
