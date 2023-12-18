// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract DonorDarah {
    struct SUplyDarah {
        uint id;
        string golonganDarah;
        uint jumlahDonor;
    }
    mapping(address => bool) public paraPendonor;
    mapping(address => bool) public paraPenerima;

    mapping(uint => SUplyDarah) public suplyDarah;
    uint public jumlahSuply;

    constructor() public {
        tambahSuply("A");
        tambahSuply("B");
        tambahSuply("AB");
        tambahSuply("O");
    }

    function tambahSuply(string memory _nama) private {
        jumlahSuply++;
        suplyDarah[jumlahSuply] = SUplyDarah(jumlahSuply, _nama, 0);
    }

    function Donor(uint _SUplyDarahId) public {
        require(!paraPendonor[msg.sender]);
        require(_SUplyDarahId > 0 && _SUplyDarahId <= jumlahSuply);
        paraPendonor[msg.sender] = true;
        suplyDarah[_SUplyDarahId].jumlahDonor++;
    }

    function terimaDonor(uint _SUplyDarahId) public {
        require(paraPenerima[msg.sender]);
        require(_SUplyDarahId > 0 && _SUplyDarahId <= jumlahSuply);
        suplyDarah[_SUplyDarahId].jumlahDonor--;
        paraPenerima[msg.sender] = true;
    }
}
