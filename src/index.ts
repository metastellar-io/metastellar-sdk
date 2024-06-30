
export type * from "./types.js";
export {MetamaskWallet} from "./metamask.js";
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window{
    ethereum?:MetaMaskInpageProvider
  }
}