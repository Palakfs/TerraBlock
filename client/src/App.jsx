import { useState } from 'react'
import Navbar from './pages/navbar'
import { ethers } from 'ethers'

function App() {
  const [account, setAccount] = useState(null)

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

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar account={account} connectHandler={handleWalletConnect} />
    </div>
  )
}

export default App