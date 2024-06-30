


import type { DataPacket, WalletState} from "./types.js";
import * as StellarSDK from "@stellar/stellar-sdk";
import { MetaMaskInpageProvider } from "@metamask/providers";
declare global {
    interface Window{
      ethereum?:MetaMaskInpageProvider
    }
  }




export class MetaStellarWallet{
    State:WalletState;

    constructor(snapId?:string, network?:'mainnet'|'testnet'){
        if(!snapId){
            snapId = "npm:stellar-snap";
        }
        this.State = {
            snapId: snapId,
            connected: false,
            loading: false,
            address: "",
            assets: [],
            network: "mainnet",
            dataPacket: null,
            name: "",
            fedName: ""
        }
        if(network){
            this.State.network = network;
        }
        this.State.snapId = snapId;
        
    }

    isLoading():boolean{
        return this.State.loading;
    }

    async init(){
        try{
            if(!this.State.connected){
                if(window.ethereum !== undefined){
                    this.State.connected = await window.ethereum.request({
                        method: 'wallet_requestSnaps',
                        params: {
                        [`npm:stellar-snap`]: {}
                        },
                    }) as boolean;
                }
                else{
                    throw new Error("Metamask not installed");
                }
            }
            
            this.State.dataPacket = await this.getDataPacket();
            this.State.address = this.State.dataPacket.currentAddress;
            this.State.name = this.State.dataPacket.name || "Unknown";
            this.State.fedName = this.State.dataPacket.fedName || "Unknown";
            return this;
        }
        catch(e){
            console.error(e);
            throw e;
        }
    }
    async makeRPCRequest(method:string, params:any){
        try{
            if(!this.State.connected){
                await this.init();
            }
            const request = {
                method: 'wallet_invokeSnap',
                params: {snapId: this.State.snapId, 
                request:{
                    method: `${method}`,
                    params: params
                }
                }
            }
            this.State.loading = true;
            let response = null;
            if(window.ethereum !== undefined){
                response = await window.ethereum.request(request);
            }
            else{
                throw new Error("Metamask is not available or is not installed");
            }
            this.State.loading = false;
            return response;
        }
        catch(e){
            console.error(e);
            alert(e);
        }
        
    }
    async getDataPacket():Promise<DataPacket>{
        if(this.State.connected && this.State.dataPacket){
            return this.State.dataPacket;
        }
        else{
            let newDataPacket = await this.makeRPCRequest("getDataPacket", {}) as DataPacket;
            this.State.dataPacket = newDataPacket;
        }
        return this.State.dataPacket;
    }

    async syncAccount():Promise<WalletState>{
        return await this.syncAccount();
        return this.State;
    }

 


    async signTransaction(transaction:StellarSDK.Transaction):Promise<any>{
        const stringTxn = transaction.toEnvelope().toXDR();
        return await this.makeRPCRequest("signTransaction", {transaction: stringTxn, testnet: (this.State.network === "testnet")});
    }

    async signAndSubmitTransaction(transaction:StellarSDK.Transaction):Promise<string>{
        const stringTxn = transaction.toEnvelope().toXDR();
        return await this.makeRPCRequest("signAndSubmitTransaction", {transaction: stringTxn, testnet: (this.State.network === "testnet")}) as string;
    }

    async getBalance(){
        return await this.makeRPCRequest("getBalance", {testnet: (this.State.network === "testnet")});
    }

    async getAddress(){
        return this.State.address;
    }

    async importAccount():Promise<boolean>{
        return await this.makeRPCRequest("importAccount", {}) as boolean;
    }

    async exportAccount():Promise<boolean>{
        await this.makeRPCRequest("dispPrivateKey", {});
        return true;
    }

    async getAssets(){
        if(this.State.connected && this.State.dataPacket){
            if(this.State.network === "testnet"){
                return this.State.dataPacket.testnetAssets;
            }
            if(this.State.network === "mainnet"){
                return this.State.dataPacket.mainnetAssets;
            }
        }
        else{
            throw new Error("Not initialized");
        }
    }

    async transfer(recepientAddress:string, amount:string){
        return await this.makeRPCRequest("transfer", {
            to:recepientAddress, 
            amount:amount}
        );
    }

    async listAccounts(){
        return await this.makeRPCRequest("listAccounts", {});
    }

    async showAddress(){
        return await this.makeRPCRequest("showAddress", {});
    }


    exportState():WalletState{
        return this.State;
    }

    static loadFromState(state:WalletState):MetaStellarWallet{
        let wallet = new MetaStellarWallet(state.snapId, state.network);
        wallet.State = state;
        return wallet;
    }
}