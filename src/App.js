import logo from './logo.svg';
import './App.css';
import {Contract, ethers} from "ethers";
import {useState, useEffect} from "react";
import FaucetAbi from "./abis/Faucet.json"
import Swal from "sweetalert2";


const faucetContractAddress = "0x186B9d0ef2e584384C950632535dfF63FB9376FB";

function App() {

    const [walletAddress, setWalletAddress] = useState("");

  const [provider,setProvider] = useState("");
  

    useEffect(() => {connectWallet();},
      [walletAddress]);



    const connectWallet = async  () => {
        if(typeof window.ethereum != "undefined"){
            try{
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await provider.send("eth_requestAccounts");
                setProvider(provider);
                //walletlardan ilkini seçme
                setWalletAddress(accounts[0])
                console.log(accounts);

               // await window.ethereum.request({method: "eth_requestAccounts"});
            }catch(err){
                console.log(err);
            }
        }
    }

    const getToken = async () => {


      try{
        const contract = new ethers.Contract(faucetContractAddress,FaucetAbi,provider.getSigner());

        const transaction = await contract.requestToken()
        console.log("transaction: ", transaction);

        if(transaction.hash){
          Swal.fire({
            title: 'Success!',
            html:
                `Check transaction hash 
                <a href="https://sepolia.etherscan.io/tx/${transaction.hash}" target="_blank">"Click Here!"</a> 
                at etherscan`,
            icon: 'success',
            confirmButtonText: 'Ok'
          })
        }
      
      } catch(err){
        console.log(err.message);
        Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        })
      }
    }



  return (
    <>
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">
          <h1 className = "navbar-item is-size-4">My Token (MTK) Faucet</h1>
        </div>
        <div className="navbar-menu">
          <div className="navbar-end">
          <button id="navbar-menu" className="button is-white connect-wallet" onClick={connectWallet}> 
           {walletAddress ? `connected: ${walletAddress.substring(0,5)}...${walletAddress.substring(38)}` : "Connect Wallet"}
          </button>
          </div>
        </div>       
      </div>
    </nav>

    <section className="hero">
      <div className="faucet-hero-body">
          <div className="box">
            
                <input 
                type="text"
                className="input"
                value={walletAddress}
                placeholder="enter your wallet address"/>

                <button
                className="button" onClick={getToken}>Get Tokens</button>


          </div>


      </div>
    </section>
    
    </>
  );
}

export default App;
