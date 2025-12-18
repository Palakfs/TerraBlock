
const Navbar = ({ account, connectHandler }) => {
    return (
        <nav className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
            <div className="text-xl font-bold tracking-wide">TerraBlock</div>
            
            <div className="flex items-center space-x-6">
                <a href="#" className="hover:text-blue-400 transition">My Lands</a>
                
                <div>
                    {account ? (
                        <div className="bg-slate-800 px-4 py-2 rounded-full text-sm border border-slate-700">
                            <span className="text-green-400">●</span> {account.slice(0, 6)}...{account.slice(-4)}
                        </div>
                    ) : (
                        <button 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition font-medium" 
                            onClick={connectHandler} 
                        >
                            Connect Wallet
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;