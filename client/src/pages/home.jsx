import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ethers } from 'ethers';
import TerraBlock from '../../../artifacts/contracts/terra_block.sol/TerraBlock.json';


const Home = ({lands,refresh}) => {

//function to buy land   
const handleBuy = async (landId, price) => {
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(import.meta.env.VITE_CONTRACT_ADDRESS, TerraBlock.abi, signer);

        const tx = await contract.buyLand(landId, { value: price });
        
        alert("Transaction Sent! Waiting for confirmation...");
        
        await tx.wait();
        
        alert("Congratulations! You now own this land.");
        await refresh();
    } catch (error) {
        console.error(error);
        alert("Purchase failed: " + (error.reason || error.message));
    }
}

    const greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    });

    const redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    });

    return (
        <div style={{ height: '90vh', width: '100%' }}>
      
      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }}>
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {lands && lands.map((land) => (
        <Marker 
        key={land.id} 
        position={[land.lat, land.long]} 
        icon={land.forSale ? greenIcon : redIcon} 
        >
        <Popup>
            <div className="min-w-[200px] p-1">
   
            <h3 className="font-bold text-lg text-slate-800 mb-1">Plot #{land.id.toString()}</h3>
    
            <div className="text-sm text-slate-600 space-y-1 mb-3">
            <p>📐 Area: <span className="font-semibold text-slate-900">{land.area.toString()} sq ft</span></p>
            <p className="truncate" title={land.owner}>
           👤 Owner: {land.owner.slice(0,6)}...{land.owner.slice(-4)}
            </p>
            </div>

        <div className="flex flex-col border-t pt-3 border-slate-100">
     
      <a 
        href={`https://gateway.pinata.cloud/ipfs/${land.ipfsHash}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center gap-1 mb-1 transition-colors"
      >
        📄 View Deed Document
      </a>

     
      {land.forSale && (
        <button 
            onClick={() => handleBuy(land.id,land.price)}
            className="mt-2 w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-2.5 px-4 rounded-lg font-bold shadow-md hover:shadow-lg transform transition-all duration-200 active:scale-95 flex justify-center items-center gap-2"
        >
           🛒 Buy for {ethers.formatEther(land.price)} ETH
        </button>
      )}
    </div>
  </div>
</Popup>
        </Marker>
))}
      </MapContainer>
    </div>
    );
};

export default Home;