import { useState } from 'react'
import Navbar from './pages/navbar'
import Form from './pages/form'
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
      <div className="p-10">
        <Form/>
    </div>
    </div>
  )
}

export default App