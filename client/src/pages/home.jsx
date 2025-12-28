import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ethers } from 'ethers';
import TerraBlock from '../../../artifacts/contracts/terra_block.sol/TerraBlock.json';

const Home = () => {
    const [lands,setLands] = useState([]);

    useEffect(() => {
        const fetchLands = async () => {
            if(window.ethereum){
                const provider = new ethers.BrowserProvider(window.ethereum);
                const contract = new ethers.Contract(import.meta.env.VITE_CONTRACT_ADDRESS,TerraBlock.abi,provider);
                try{
                    const data = await contract.getLands();
                    console.log("Lands fetched : ",data);
                    setLands(data);
                }
            catch (err) {
                console.error("Error fetching lands:", err);
            }
        }
        }
        fetchLands();
    },[]);

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

        {lands.map((land) => (
        <Marker 
        key={land.id} 
        position={[land.lat, land.long]} 
        icon={land.forSale ? greenIcon : redIcon} 
        >
        <Popup>
         <p>Area: {land.area.toString()} sq ft</p>
         <p>Owner: {land.owner}</p>
        </Popup>
        </Marker>
))}
      </MapContainer>
    </div>
    );
};

export default Home;