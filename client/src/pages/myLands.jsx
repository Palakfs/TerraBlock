import { ethers } from 'ethers';
import TerraBlock from '../../../artifacts/contracts/terra_block.sol/TerraBlock.json';

const MyLands = ({ lands, account, refresh }) => {
    
    // filter to get lands of the current user
    const myLands = lands.filter(land => 
        account && land.owner.toLowerCase() === account.toLowerCase()
    );

    // function to open land for sale
    const handleSell = async (id) => {
        const price = prompt("Enter Price in ETH to sell:");
        if (!price) return;

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(import.meta.env.VITE_CONTRACT_ADDRESS, TerraBlock.abi, signer);

            // Convert ETH to Wei
            const priceInWei = ethers.parseEther(price);
            
            const tx = await contract.setLandOpenToSale(id, priceInWei);
            await tx.wait();
            
            alert("Land is now for Sale!");
            refresh(); 
        } catch (error) {
            console.error(error);
            alert("Transaction failed!");
        }
    };

    // 3. Transfer Handler
    const handleTransfer = async (id) => {
        const newOwner = prompt("Enter the Wallet Address of the new owner:");
        if (!newOwner) return;

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(import.meta.env.VITE_CONTRACT_ADDRESS, TerraBlock.abi, signer);

            const tx = await contract.transferLandOwnership(newOwner, id);
            await tx.wait();

            alert("Land Transferred!");
            refresh(); 
        } catch (error) {
            console.error(error);
            alert("Transfer failed!");
        }
    };

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-6">My Property Portfolio</h1>
            
            {!account ? (
                <p>Please connect your wallet to view your properties.</p>
            ) : myLands.length === 0 ? (
                <p>You do not own any registered land yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myLands.map((land) => (
                        <div key={land.id} className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                            
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Plot #{land.id.toString()}</h3>
                                    <p className="text-sm text-slate-500">
                                        {land.lat}, {land.long}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${land.forSale ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                                    {land.forSale ? "FOR SALE" : "PRIVATE"}
                                </span>
                            </div>

                            <div className="space-y-2 mb-6">
                                <p className="text-slate-600">Area: <span className="font-medium text-slate-900">{land.area.toString()} sqft</span></p>
                                {land.forSale && (
                                    <p className="text-green-600 font-bold">Price: {ethers.formatEther(land.price)} ETH</p>
                                )}
                                <a 
                                    href={`https://gateway.pinata.cloud/ipfs/${land.ipfsHash}`} 
                                    target="_blank" 
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    View Deed Document
                                </a>
                            </div>

                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleSell(land.id)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
                                >
                                    {land.forSale ? "Update Price" : "Sell Land"}
                                </button>
                                <button 
                                    onClick={() => handleTransfer(land.id)}
                                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 py-2 rounded-lg font-medium transition"
                                >
                                    Transfer
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyLands;