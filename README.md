# TerraBlock - Decentralized Land Registry System 🌍

TerraBlock is a blockchain-based application that digitizes land ownership records to prevent fraud, eliminate paperwork, and ensure transparent, instant property transfers. Built with **React**, **Ethereum (Hardhat)**, and **IPFS**.

## 🚀 The Problem

Traditional land registry systems suffer from:

* **Fragmented Records:** Ownership data is often kept in disparate paper-based silos, making it difficult for buyers to trace the true history of a property (Chain of Title).
* **Fraud:** Double-spending (selling the same land to multiple people).
* **Lost Documents:** Paper deeds can be forged, lost, or destroyed.
* **Intermediaries:** High costs and delays due to lawyers, banks, and manual verification.
* **Opaque Data:** Hard to visualize or verify real-time ownership status.

## 💡 The Solution

TerraBlock uses the **Ethereum Blockchain** as the single source of truth:

* **Unified Digital Ledger:** Anyone can query a plot of land and instantly see the current wallet address holding the ownership rights.
* **Fraud-Proof Logic:** The system mechanically prevents double-selling. Once a land is sold, the ledger updates instantly, and the previous owner loses all control.
* **Immutable Records:** Once registered, land data cannot be altered.
* **Visual Map Interface:** Interactive map showing land status (Green: For Sale, Red: Private).
* **Smart Contracts:** "Buy" transactions instantly swap ownership and funds (Atomic Swap).
* **Decentralized Storage:** Deed documents are stored securely on **IPFS**.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite, Tailwind CSS
* **Maps:** Leaflet.js, React-Leaflet
* **Blockchain:** Solidity, Hardhat
* **Interaction:** Ethers.js
* **Storage:** IPFS (InterPlanetary File System) for decentralized, permanent storage.

---

## ✨ Key Features

1. **Government Admin Panel:**
* Register new lands with Latitude/Longitude, Area, and Deed Documents.
* Automatic duplicate-location checks (Geo-hashing).


2. **Interactive Map:**
* View all registered lands as pins.
* **Green Pin:** Open for Sale | **Red Pin:** Private Property.
* Click pins to view details, owner address, and document links.


3. **Property Dashboard ("My Lands"):**
* View personal property portfolio.
* List land for sale (Set Price in ETH).
* Transfer ownership directly to another wallet.


4. **Secure Buying:**
* One-click purchase using MetaMask.
* The Smart Contract acts as an automated escrow: it only transfers the land if the exact funds are received.

---

## ⚙️ Installation & Setup Guide

Follow these steps to run the project locally.

### 1. Prerequisites

* Node.js installed.
* MetaMask browser extension installed.

### 2. Clone the Repository

```bash
git clone https://github.com/your-username/terrablock.git
cd terrablock

```

### 3. Smart Contract Setup (Backend)

Open a terminal in the root directory:

```bash
# Install dependencies
npm install

# Start the local Hardhat Node (Keep this terminal running!)
npx hardhat node

```

Open a **second terminal** to deploy the contract:

```bash
# Deploy the contract to the local network
npx hardhat run scripts/deploy.js --network localhost

```

> **IMPORTANT:** Copy the `Contract Address` that appears in the terminal. You will need this for the Frontend.

### 4. Frontend Setup

Navigate to the client folder (or root, depending on your structure):

```bash
# Install React dependencies
npm install

```

**Configure Environment Variables:**
Create a `.env` file in the root of your React project:

```env
VITE_CONTRACT_ADDRESS="PASTE_YOUR_CONTRACT_ADDRESS_HERE"

```

**Start the App:**

```bash
npm run dev

```
---

**Demo Video**

https://github.com/user-attachments/assets/2fcc6389-b7da-4845-ab62-c0a63d38d1cc

