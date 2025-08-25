// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Simple Voting (Admin-managed)
/// @notice Admin deploys empty. Admin adds candidates before starting election. One vote per address.
contract Voting {
    address public admin;
    bool public electionActive;

    struct Candidate {
        string name;
        uint256 voteCount;
    }

    Candidate[] public candidates;
    mapping(address => bool) public hasVoted;

    event CandidateAdded(uint256 indexed candidateId, string name);
    event Voted(address indexed voter, uint256 indexed candidateId);
    event ElectionStarted();
    event ElectionEnded();

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    modifier whenActive() {
        require(electionActive, "Election not active");
        _;
    }

    constructor() {
        admin = msg.sender;
        electionActive = false; // start as inactive
    }

    /// @notice Admin adds candidate before starting election
    function addCandidate(string memory name) external onlyAdmin {
        require(!electionActive, "Cannot add while election is active");
        candidates.push(Candidate(name, 0));
        emit CandidateAdded(candidates.length - 1, name);
    }

    /// @notice Admin starts election
    function startElection() external onlyAdmin {
        require(!electionActive, "Already active");
        require(candidates.length > 0, "No candidates added");
        electionActive = true;
        emit ElectionStarted();
    }

    /// @notice Admin ends election
    function endElection() external onlyAdmin {
        require(electionActive, "Already ended");
        electionActive = false;
        emit ElectionEnded();
    }

    /// @notice Voters cast vote while election is active
    function vote(uint256 candidateId) external whenActive {
        require(!hasVoted[msg.sender], "Already voted");
        require(candidateId < candidates.length, "Invalid candidate");

        hasVoted[msg.sender] = true;
        candidates[candidateId].voteCount += 1;

        emit Voted(msg.sender, candidateId);
    }

    /// @notice View candidate info
    function getCandidate(uint256 index) external view returns (string memory name, uint256 votes) {
        require(index < candidates.length, "Invalid candidate");
        Candidate storage c = candidates[index];
        return (c.name, c.voteCount);
    }

    /// @notice Number of candidates
    function getCandidateCount() external view returns (uint256) {
        return candidates.length;
    }
}
