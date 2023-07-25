import "./css/App.css";
import { Banana, Chains } from "@rize-labs/banana-wallet-sdk";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { SampleAbi } from "./contract/SampleAbi";
import { SAMPLE_CONTRACT_ADDRESS } from "./utils/constants";

/**
 * App Component
 */
function App() {
  
  const [walletAddress, setWalletAddress] = useState("");
  const [bananaSdkInstance, setBananSdkInstance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [walletInstance, setWalletInstance] = useState(null);
  const [output, setOutput] = useState("Welcome to Banana Demo");


  /**
   * bananaインスタンスを取得する method
   */
  const getBananaInstance = () => {
    const bananaInstance = new Banana(Chains.shibuyaTestnet);
    setBananSdkInstance(bananaInstance);
  };

  /**
   * createWallet method
   */
  const createWallet = async () => {
    setIsLoading(true);
    const wallet = await bananaSdkInstance.createWallet();
    setWalletInstance(wallet);
    const address = await wallet.getAddress();
    setWalletAddress(address);
    setOutput("Wallet Address: " + address);
    setIsLoading(false);
  };

  /**
   * walletに接続
   */
  const connectWallet = async () => {
    const walletName = bananaSdkInstance.getWalletName();

    // もし見つからなければ新たにウォレットを作成する。
    if (walletName) {
      setIsLoading(true);
      const wallet = await bananaSdkInstance.connectWallet(walletName);
      setWalletInstance(wallet);
      const address = await wallet.getAddress();
      setWalletAddress(address);
      setOutput("Wallet Address: " + address);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      alert("You don't have wallet created!");
    }
  };

  const makeTransaction = async () => {
    setIsLoading(true);
    const signer = walletInstance.getSigner();
    const amount = "0.05";
    // トランザクションデータを作成
    const tx = {
      gasLimit: "0x55555",
      to: SAMPLE_CONTRACT_ADDRESS,
      value: ethers.utils.parseEther(amount),
      data: new ethers.utils.Interface(SampleAbi).encodeFunctionData(
        "stake",
        []
      ),
    };

    try {
      // トランザクションを送信する。
      const txn = await signer.sendTransaction(tx);
      setOutput(JSON.stringify(txn));
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  /**
   * signMessage method
   */
  const signMessage = async () => {
    setIsLoading(true);
    const sampleMsg = "Hello World";
    const signer = walletInstance.getSigner();
    const signMessageResponse = await signer.signBananaMessage(sampleMsg);
    setOutput(JSON.stringify(signMessageResponse));
    setIsLoading(false);
  };

  /**
   * getChainId method
   */
  const getChainId = async () => {
    setIsLoading(true);
    const signer = walletInstance.getSigner();
    const chainid = await signer.getChainId();
    setOutput(JSON.stringify(chainid));
    setIsLoading(false);
  };

  /**
   * getNetwork method
   */
  const getNetwork = async () => {
    setIsLoading(true);
    const provider = walletInstance.getProvider();
    const network = await provider.getNetwork();
    setOutput(JSON.stringify(network));
    setIsLoading(false);
  };

  useEffect(() => {
    getBananaInstance();
  }, []);

  return (
    <div className="App">
      <h1>Banana SDK Demo</h1>
      {walletAddress && <p> Wallet Address: {walletAddress}</p>}
      <button 
        className="btn" 
        onClick={() => createWallet()}
      >
        Create Wallet
      </button>
      <button 
        className="btn" 
        onClick={() => connectWallet()}
      >
        Connect Wallet
      </button>
      <button 
        className="btn" 
        onClick={() => getChainId()}
      >
        ChainId
      </button>
      <button 
        className="btn" 
        onClick={() => getNetwork()}
      >
        Network
      </button>
      <button 
        className="btn" 
        onClick={() => makeTransaction()}
      >
        Make transaction
      </button>
      <button 
        className="btn" 
        onClick={() => signMessage()}
      >
        Sign message
      </button>
      <h1> Output Panel</h1>
      <div className="output-div">
        <p>{isLoading ? "Loading.." : output}</p>
      </div>
    </div>
  );
}

export default App;
