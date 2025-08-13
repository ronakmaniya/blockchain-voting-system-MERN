// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Simple Voting (beginner-friendly)
/// @notice Admin deploys with initial candidates. One vote per address.
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

    constructor(string[] memory initialCandidates) {
        admin = msg.sender;

        for (uint256 i = 0; i < initialCandidates.length; i++) {
            candidates.push(Candidate({name: initialCandidates[i], voteCount: 0}));
            emit CandidateAdded(i, initialCandidates[i]);
        }

        // Start active for simplicity (we can switch this off later)
        electionActive = true;
        emit ElectionStarted();
    }

    function addCandidate(string memory name) external onlyAdmin {
        require(!electionActive, "End election to add candidates");
        candidates.push(Candidate(name, 0));
        emit CandidateAdded(candidates.length - 1, name);
    }

    function startElection() external onlyAdmin {
        require(!electionActive, "Already active");
        electionActive = true;
        emit ElectionStarted();
    }

    function endElection() external onlyAdmin {
        require(electionActive, "Already ended");
        electionActive = false;
        emit ElectionEnded();
    }

    function vote(uint256 candidateId) external whenActive {
        require(!hasVoted[msg.sender], "Already voted");
        require(candidateId < candidates.length, "Invalid candidate");

        hasVoted[msg.sender] = true;
        candidates[candidateId].voteCount += 1;

        emit Voted(msg.sender, candidateId);
    }

    function getCandidate(uint256 index) external view returns (string memory name, uint256 votes) {
        require(index < candidates.length, "Invalid candidate");
        Candidate storage c = candidates[index];
        return (c.name, c.voteCount);
    }

    function getCandidateCount() external view returns (uint256) {
        return candidates.length;
    }
}
