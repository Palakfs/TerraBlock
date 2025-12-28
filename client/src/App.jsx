import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react'
import Navbar from './pages/navbar'
import Form from './pages/form'
import Home from './pages/home'
import MyLands from './pages/myLands';
import { ethers } from 'ethers'
import TerraBlock from '../../artifacts/contracts/terra_block.sol/TerraBlock.json';

function App() {
  const [account, setAccount] = useState(null)
  const [lands, setLands] = useState([]);

  const handleWalletConnect = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setAccount(accounts[0])
      } catch (error) {
        console.error("Connection failed", error)
      }
    } else {
      alert("Please install MetaMask!")
    }
  }

  const fetchLands = async () => {
    if (window.ethereum) {
       const provider = new ethers.BrowserProvider(window.ethereum);
       const contract = new ethers.Contract(import.meta.env.VITE_CONTRACT_ADDRESS, TerraBlock.abi, provider);
       const data = await contract.getLands();
       setLands([...data]);
    }
  }

  useEffect(() => {
    fetchLands();
  }, []);

  return (
    <BrowserRouter>
    <div className="min-h-screen bg-slate-100">
      <Navbar account={account} connectHandler={handleWalletConnect} />
      <div className="">
        <Routes>
        <Route path="/home" element={<Home lands={lands} refresh={fetchLands}/>} />
        <Route path="/admin" element={<Form />} />
        <Route path="/my-lands" element={
             <MyLands 
                lands={lands} 
                account={account} 
                refresh={fetchLands} 
             />
          } />
        </Routes>
    </div>
    </div>
    </BrowserRouter>
  )
}

export default App