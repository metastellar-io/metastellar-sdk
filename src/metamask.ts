


import type { DataPacket } from "./types.js";
import * as StellarSDK from "@stellar/stellar-sdk";
import { MetaMaskInpageProvider } from "@metamask/providers";
declare global {
    interface Window{
      ethereum?:MetaMaskInpageProvider
    }
  }

export class MetamaskWallet{
    snapId:string;
    connected:boolean = false;
    loading:boolean = false;
    address:string = "";
    assets:any = [];
    network:'mainnet'|'testnet' = "mainnet";
    dataPacket:DataPacket|null = null;
    name:string = "";
    fedName:string = "";

    constructor(snapId:string, network?:'mainnet'|'testnet'){
        if(network){
            this.network = network;
        }
        this.snapId = snapId;
        
    }

    isLoading():boolean{
        return this.loading;
    }

    async init(){
        try{
            if(!this.connected){
                if(window.ethereum !== undefined){
                    this.connected = await window.ethereum.request({
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
            
            this.dataPacket = await this.getDataPacket();
            this.address = this.dataPacket.currentAddress;
            this.name = this.dataPacket.name || "Unknown";
            this.fedName = this.dataPacket.fedName || "Unknown";
            return this;
        }
        catch(e){
            console.error(e);
            throw e;
        }
    }
    async makeRPCRequest(method:string, params:any){
        try{
            if(!this.connected){
                await this.init();
            }
            const request = {
                method: 'wallet_invokeSnap',
                params: {snapId: this.snapId, 
                request:{
                    method: `${method}`,
                    params: params
                }
                }
            }
            this.loading = true;
            let response = null;
            if(window.ethereum !== undefined){
                response = await window.ethereum.request(request);
            }
            else{
                throw new Error("Metamask is not available or is not installed");
            }
            this.loading = false;
            return response;
        }
        catch(e){
            console.error(e);
            alert(e);
        }
        
    }
    async getDataPacket():Promise<DataPacket>{
        if(this.connected && this.dataPacket){
            return this.dataPacket;
        }
        else{
            return await this.makeRPCRequest("getDataPacket", {}) as DataPacket;
        }
    }

    async syncAccount():Promise<MetamaskWallet>{
        return await this.syncAccount();
    }

    async signTransaction(transaction:StellarSDK.Transaction):Promise<any>{
        const stringTxn = transaction.toEnvelope().toXDR();
        return await this.makeRPCRequest("signTransaction", {transaction: stringTxn, testnet: (this.network === "testnet")});
    }

    async signAndSubmitTransaction(transaction:StellarSDK.Transaction):Promise<string>{
        const stringTxn = transaction.toEnvelope().toXDR();
        return await this.makeRPCRequest("signAndSubmitTransaction", {transaction: stringTxn, testnet: (this.network === "testnet")}) as string;
    }

    async getBalance(){
        return await this.makeRPCRequest("getBalance", {testnet: (this.network === "testnet")});
    }

    async getAddress(){
        return this.address;
    }

    async importAccount():Promise<boolean>{
        return await this.makeRPCRequest("importAccount", {}) as boolean;
    }

    async exportAccount():Promise<boolean>{
        await this.makeRPCRequest("dispPrivateKey", {});
        return true;
    }

    async getAssets(){
        if(this.connected && this.dataPacket){
            if(this.network === "testnet"){
                return this.dataPacket.testnetAssets;
            }
            if(this.network === "mainnet"){
                return this.dataPacket.mainnetAssets;
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
}