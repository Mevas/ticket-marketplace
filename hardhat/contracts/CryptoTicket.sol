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
    mapping(uint256 => uint256) public tokenIdToPrice;
    mapping(uint256 => address) public eventIdToAddress;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC721A("CryptoTicket", "TKT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "http://localhost:9000/tickets/";
    }

    function safeMint(address to, uint256 quantity) internal {
        require(
            quantity <= 1000,
            "Please mint less than 1000 tokens at a time"
        );
        _safeMint(to, quantity);
    }

    function getTicketPrice(uint256 ticketId) external view returns (uint256) {
        return tokenIdToPrice[ticketId];
    }

    function setTicketPrice(uint256 ticketId, uint256 newPrice) public {
        require(msg.sender == ownerOf(ticketId), "Not the owner of this token");
        tokenIdToPrice[ticketId] = newPrice;
    }

    function setOrganizerOfEventId(uint256 eventId, address organizer)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        eventIdToAddress[eventId] = organizer;
    }

    modifier onlyOrganizer(uint256 eventId) {
        require(
            eventIdToAddress[eventId] == msg.sender,
            "Only the organizer is allowed to do this operation"
        );
        _;
    }

    function safeMintForEvent(
        address to,
        uint256 quantity,
        uint256 eventId,
        uint256 price
    ) public onlyOrganizer(eventId) {
        // Emit minting event to let the backend know what event these tickets belong to
        emit MintingForEvent(eventId);

        // Remember the starting token id for pricing purposes
        uint256 startTokenId = _nextTokenId();

        safeMint(to, quantity);

        // Set the price of the newly minted tickets
        uint256 end = startTokenId + quantity;
        for (
            uint256 ticketIndex = startTokenId;
            ticketIndex < end;
            ticketIndex++
        ) {
            setTicketPrice(ticketIndex, price);
        }
    }

    // Function that allows for direct transfer of tickets, without approval from the owner
    function _directApproveMsgSenderFor(uint256 tokenId) internal {
        assembly {
            mstore(0x00, tokenId)
            mstore(0x20, 6) // `_tokenApprovals` is at slot 6.
            sstore(keccak256(0x00, 0x40), caller())
        }
    }

    function buyTicket(uint256 _ticketId) external payable {
        require(msg.value >= tokenIdToPrice[_ticketId], "ETH amount too low");
        // Automatically approve the transfer
        _directApproveMsgSenderFor(_ticketId);

        // Transfer the ticket to the sender, as in the payee
        address seller = ownerOf(_ticketId);
        safeTransferFrom(seller, msg.sender, _ticketId);

        // Transfer the funds to the original seller
        payable(seller).transfer(msg.value);
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

    event MintingForEvent(uint256 eventId);
}
