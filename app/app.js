App = {
    loading: false,
    web3Provider: null,
    contracts: {},
    account: null,

    load: async () => {
        await App.loadWeb3();
        await App.loadAccount();
        await App.loadContract();
        await App.render();
    },

    loadWeb3: async () => {
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            console.error('No web3 provider detected. Please install MetaMask.');
        }
    },

    loadAccount: async () => {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        App.account = accounts[0];
    },

    loadContract: async () => {
        const DonorDarahJson = await $.getJSON('DonorDarah.json');
        App.contracts.DonorDarah = TruffleContract(DonorDarahJson);
        App.contracts.DonorDarah.setProvider(App.web3Provider);
        App.DonorDarah = await App.contracts.DonorDarah.deployed();
    },

    render: async () => {
        if (App.loading) {
            return;
        }
        App.setLoading(true);
        $('#accountAddress').html("Alamat Akun: " + App.account);
        await App.renderDonor();
        App.setLoading(false);
    },

    setLoading: (bool) => {
        App.loading = bool;
        const loader = $('#loader');
        const content = $('#content');
        if (bool) {
            loader.show();
            content.hide();
        } else {
            loader.hide();
            content.show();
        }
    },

    renderDonor: async () => {
        const jumlahSuply = await App.DonorDarah.jumlahSuply();
        $("#candidatesResults").empty();
        for (var i = 1; i <= jumlahSuply; i++) {
            const SUplyDarah = await App.DonorDarah.suplyDarah(i);
            const SUplyDarahid = SUplyDarah[0];
            const SUplyDarahGolongan = SUplyDarah[1];
            const SUplyDarahJumlahDonor = SUplyDarah[2];
            var candidateTemplate = "<tr><th>" + SUplyDarahid + "</th><td>" + SUplyDarahGolongan + "</td><td>" + SUplyDarahJumlahDonor + "</td></tr>";
            $("#candidatesResults").append(candidateTemplate);
        }

        const isDonor = await App.DonorDarah.paraPendonor(App.account);
        if (isDonor) {
            $('#btnDonor').prop("disabled", true);
            $('#btnTerimaDonor').prop("disabled", false);
            $('#DonorStatus').html("Anda sudah memberikan DonorDarah!");
        } else {
            $('#btnDonor').prop("disabled", false);
            $('#btnTerimaDonor').prop("disabled", true);
            $('#DonorStatus').html("");
        }
    },

    castDonor: async () => {
        var SUplyDarahid = $('#candidatesSelect').val();
        await App.DonorDarah.Donor(SUplyDarahid, { from: App.account });
        window.location.reload();
    },

    castTerimaDonor: async () => {
        var SUplyDarahid = $('#candidatesSelect').val();
        
        // Check the supply for the selected blood type
        const SUplyDarah = await App.DonorDarah.suplyDarah(SUplyDarahid);
        const SUplyDarahJumlahDonor = SUplyDarah[2];
        
        if (SUplyDarahJumlahDonor > 0) {
            // If supply is greater than zero, accept the donor
            await App.DonorDarah.terimaDonor(SUplyDarahid, { from: App.account });
            window.location.reload();
        } else {
            // If supply is zero, show an error message or handle accordingly
            alert("Maaf, stok darah untuk golongan ini telah habis. Silakan pilih golongan darah lain.");
        }
    }
    
}

$(document).ready(function () {
    App.load();
    ethereum.on('accountsChanged', function (accounts) {
        App.account = accounts[0];
        window.location.reload();
    });
});
