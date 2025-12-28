import { useState } from 'react';
import { PinataSDK } from 'pinata';
import { ethers } from 'ethers';
import TerraBlockABI from '../../../artifacts/contracts/terra_block.sol/TerraBlock.json'; 

const pinata = new PinataSDK({
  pinataJwt: import.meta.env.VITE_PINATA_JWT,
  pinataGateway: import.meta.env.VITE_GATEWAY_URL
})

const Form = () => {
    const [formData, setFormData] = useState({
        latitude: "",
        longitude: "",
        area: "",
        ownerAddress: ""
    })
    const [file, setFile] = useState(null)
    const [status, setStatus] = useState('') 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0])
        }
    }

   
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!file || !formData.latitude || !formData.longitude || !formData.area || !formData.ownerAddress) {
            alert("Please fill all fields and upload a deed.");
            return;
        }

        try {
          
            setStatus('Uploading Deed to IPFS...');
            const upload = await pinata.upload.public.file(file); 
            const ipfsHash = upload.cid; 
            console.log("IPFS Hash:", ipfsHash);

            
            setStatus('Waiting for Wallet Confirmation...');
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
            const contract = new ethers.Contract(contractAddress, TerraBlockABI.abi, signer);

            
            setStatus('Minting Land on Blockchain...');
            const tx = await contract.registerLand(
                formData.ownerAddress,
                formData.latitude,
                formData.longitude,
                parseInt(formData.area), 
                ipfsHash 
            );

            setStatus('Transaction sent! Waiting for confirmation...');
            await tx.wait(); 

            setStatus('Success! Land Registered.');
            alert("Land Registered Successfully!");
            
           
            setFormData({ latitude: "", longitude: "", area: "", ownerAddress: "" });
            setFile(null);

        } catch (error) {
            console.error(error);
            setStatus('Error: ' + (error.reason || error.message));
        }
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Register New Land</h2>
            
           
            {status && (
                <div className={`p-3 mb-4 rounded text-sm font-medium ${status.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {status}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                
               
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Latitude</label>
                        <input 
                            type="text" name="latitude" value={formData.latitude} onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                            placeholder="26.9124"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Longitude</label>
                        <input 
                            type="text" name="longitude" value={formData.longitude} onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                            placeholder="75.7873"
                        />
                    </div>
                </div>

              
                <div>
                    <label className="block text-sm font-medium text-gray-700">Area (Sq ft)</label>
                    <input 
                        type="number" name="area" value={formData.area} onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                        placeholder="2400"
                    />
                </div>

             
                <div>
                    <label className="block text-sm font-medium text-gray-700">Initial Owner Address</label>
                    <input 
                        type="text" name="ownerAddress" value={formData.ownerAddress} onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm font-mono text-sm"
                        placeholder="0x..."
                    />
                </div>

                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Deed Document</label>
                    <div className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-4 bg-gray-50">
                        <input 
                            type="file" 
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:bg-gray-400"
                    disabled={status.includes('Uploading') || status.includes('Waiting')}
                >
                    {status.includes('Uploading') ? 'Processing...' : 'Mint & Register Land'}
                </button>

            </form>
        </div>
    );  
}

export default Form;