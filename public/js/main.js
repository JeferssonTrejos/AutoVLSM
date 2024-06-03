document.getElementById('subnetForm').addEventListener('submit', function (event) {
    event.preventDefault();
    let baseIp = document.getElementById('baseIp').value;
    let hostCounts = document.getElementById('hostCounts').value.split(',').map(Number);
    let resultsTable = document.getElementById('results');
    resultsTable.innerHTML = ''; // Limpiar resultados previos

    function calculateSubnetMask(hosts) {
        let bitsNeeded = Math.ceil(Math.log2(hosts + 2));
        return 32 - bitsNeeded;
    }

    function calculateHosts(subnetMask) {
        return Math.pow(2, 32 - subnetMask) - 2;
    }

    function ipToBinary(ip) {
        return ip.split('.').map(Number).reduce((acc, octet) => (acc << 8) | octet);
    }

    function binaryToIp(binary) {
        return [
            (binary >>> 24) & 0xFF,
            (binary >>> 16) & 0xFF,
            (binary >>> 8) & 0xFF,
            binary & 0xFF
        ].join('.');
    }

    function calculateBroadcastAddress(networkIp, subnetMask) {
        let binaryIp = ipToBinary(networkIp);
        let broadcastBinary = binaryIp | ((1 << (32 - subnetMask)) - 1);
        return binaryToIp(broadcastBinary);
    }

    function nextNetworkAddress(ip, subnetMask) {
        let binaryIp = ipToBinary(ip);
        let increment = 1 << (32 - subnetMask);
        binaryIp += increment;
        return binaryToIp(binaryIp);
    }

    function incrementIp(ip) {
        return binaryToIp(ipToBinary(ip) + 1);
    }

    function decrementIp(ip) {
        return binaryToIp(ipToBinary(ip) - 1);
    }

    function subnetMaskToDecimal(subnetMask) {
        let mask = (0xFFFFFFFF << (32 - subnetMask)) >>> 0;
        return binaryToIp(mask);
    }

    function subnetting(baseIp, hostCounts) {
        hostCounts.sort((a, b) => b - a); // Ordenar en orden decreciente
        let results = [];
        let currentIp = baseIp;

        for (let hosts of hostCounts) {
            let subnetMask = calculateSubnetMask(hosts);
            let hostsFound = calculateHosts(subnetMask);
            let networkAddress = currentIp;
            let broadcastAddress = calculateBroadcastAddress(networkAddress, subnetMask);
            let firstUsableIp = incrementIp(networkAddress);
            let lastUsableIp = decrementIp(broadcastAddress);
            let netmask = subnetMaskToDecimal(subnetMask);

            results.push({
                hostsRequested: hosts,
                hostsFound: hostsFound,
                subnetMask: subnetMask,
                networkAddress: networkAddress,
                netmask: netmask,
                broadcastAddress: broadcastAddress,
                firstUsableIp: firstUsableIp,
                lastUsableIp: lastUsableIp
            });

            currentIp = nextNetworkAddress(networkAddress, subnetMask);
        }

        return results;
    }

    let subnets = subnetting(baseIp, hostCounts);

    subnets.forEach(subnet => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${subnet.hostsRequested}</td>
            <td>${subnet.hostsFound}</td>
            <td>${subnet.networkAddress}</td>
            <td>/${subnet.subnetMask}</td>
            <td>${subnet.netmask}</td>
            <td>${subnet.firstUsableIp}</td>
            <td>${subnet.lastUsableIp}</td>
            <td>${subnet.broadcastAddress}</td>
        `;
        resultsTable.appendChild(row);
    });
});