//ASSETS ---------------------------------------------------------------------------------------------------------------------------------------
//SnapAssets these are assets as read from the horizion server on xlm
export type SnapAsset = {
  balance: string;
  limit: string;
  buying_liabilities: string;
  selling_liabilities: string;
  last_modified_ledger?: number;
  is_authorized?: boolean;
  is_authorized_to_maintain_liabilites?: boolean;
  asset_type: "credit_alphanum4" | "native" | "credit_alphanum12";
  asset_issuer?: string;
  asset_code: string;
  is_clawback_enabled?: boolean;
};

//these are assets that have been converted to a more readable format. this is how they are read from the stellarExpert endpoint
export type DispAsset = {
  image: string;
  asset: string | undefined;
  code: string;
  domain: string;
  score: number;
  supply: number | string;
  price?: Array<number[]> | undefined;
  balance?: string;
  limit?: string;
};

//special type for tracking mouse movement
export type MouseTrackDataType = {
  point: { x: number; y: number };
  timestamp: number;
};

const xs = "xs";
const sm = "sm";
const md = "md";
const lg = "lg";
const xl = "xl";
export declare type SizeType =
  | typeof xs
  | typeof sm
  | typeof md
  | typeof lg
  | typeof xl;

//special display asset for the native xlm
export const xlm_display: DispAsset = {
  image:
    "https://upload.wikimedia.org/wikipedia/commons/5/56/Stellar_Symbol.png",
  asset: "native",
  code: "XLM",
  domain: "stellar.org",
  score: 10,
  supply: "28271090270",
};

//special type that includes a liquidity pool id optionally
export interface NativeBalance {
  balance: string;
  liquidity_pool_id?: string;
  limit: string;
  buying_liabilites: string;
  selling_liabilites: string;
  sponser?: string;
  last_modified_ledger: number;
  is_authorized: boolean;
  is_authorized_to_maintain_liabilites: boolean;
  is_clawback_enabled: boolean;
  asset_type: "native";
  asset_issuer: "native";
  asset_code: "XLM";
}

//special type that includes a liquidity pool id optionally
export interface AssetBalance {
  balance: string; //number
  liquidity_pool_id?: string; //number
  limit: string; //number
  buying_liabilites: string; //number
  selling_liabilites: string; //number
  sponser?: string; //address
  last_modified_ledger: number;
  is_authorized: boolean;
  is_authorized_to_maintain_liabilites: boolean;
  is_clawback_enabled: boolean;
  asset_type: "credit_alphanum4" | "credit_alphanum12";
  asset_code: string;
  asset_issuer: string; //address
}

export const emptyNativeBalance: SnapAsset = {
  balance: "0",
  limit: "Infinity",
  buying_liabilities: "0",
  selling_liabilities: "0",
  last_modified_ledger: Date.now(),
  is_authorized: true,
  is_authorized_to_maintain_liabilites: true,
  is_clawback_enabled: false,
  asset_type: "native",
  asset_issuer: "native",
  asset_code: "XLM",
};

// END ASSETS ---------------------------------------------------------------------------------------------------------------------------------------

//ACCOUNTS ---------------------------------------------------------------------------------------------------------------------------------------
export interface walletInfo {
  name: string;
  currentAddress: string;
  mainnetAssets?: SnapAsset[];
  testnetAssets?: SnapAsset[];
  accounts: Array<{ name: String; address: String }>;
  mainnetXLMBalance: string;
  testnetXLMBalance: string;
}

export interface user {
  id: string;
  fName?: string;
  lName?: string;
  username: string;
  email: string;
  dataConesent: boolean; //false by default
  profilePic?: string;
  walletInfo: walletInfo;
  posts?: Array<string>;
  friends?: Array<string>;
  chats?: Array<string>;
}

// END ACCOUNTS ---------------------------------------------------------------------------------------------------------------------------------------

//Social ---------------------------------------------------------------------------------------------------------------------------------------

export interface post {
  id: string;
  type: "text" | "image" | "video" | "nft" | "token";
  text?: string;
  url?: string;
  title?: string;
  posterId: string;
  likes: string[]; //array of user ids
  comments: comment[];
}

export interface comment {
  id: string;
  text: string;
  posterId: string;
  likes: string[]; //array of user ids
  timestamp: Date;
}

export interface conversation {
  id: string;
  members: string[]; //array of user ids
  messages: message[];
  createdTimestamp: Date;
  creator: string; //user id
}

export interface message {
  senderId: string; //user id
  receiverId: string; //user id or conversation id
  text: string;
  timestamp: Date;
  img?: string;
}

export interface Toml {
  href: string
}

export interface links {
  toml: Toml
}

export interface AssetExtra {
  authorized: number,
  authorized_to_maintain_liabilities: number,
  unauthorized: number
}

export interface AssetFlag {
  auth_required: boolean,
  auth_revocable: boolean,
  auth_immutable: boolean
}

// FT Token
export interface AssetRaw {
  asset_type: string, // This asset's type. Either credit_alphanum4 or credit_alphanum12.
  asset_code: string, // This asset's code
  asset_issuer: string, // The Stellar address of this asset’s issuer.
  accounts: AssetExtra, // The number of accounts grouped by each trustline flag state.
  num_claimable_balances: number, // The current number of claimable_balances for this asset.
  num_contracts: number, // The current number of Soroban contracts holding this asset.
  num_liquidity_pools: number, // The current number of liquidity pools holding this asset.
  balances: AssetExtra, // The number of units issued for this asset grouped by each trustline flag state.
  claimable_balances_amount: string, // The number of units for this asset held by all claimable balances.
  contracts_amount: string, // The number of units for this asset held by all Soroban contracts.
  liquidity_pools_amount: string, // The number of units for this asset held by all liquidity pools.
  amount: string, // The number of authorized units issued for this asset. This will be deprecated in Horizon v3.
  num_accounts: number, // The number of accounts that have issued a trustline to this asset. If the auth_required flag for this asset's issuer is set to true, this number only includes the accounts who have both set up a trustline to the asset and have been authorized to hold the asset. This will be deprecated in Horizon v3.
  flags: AssetFlag,
  _links: links,
}

export interface AssetMetaData {
  code: string | undefined;
  issuer: string | undefined;
  decimals?: string | undefined;
  anchored?: boolean;
  name: string | undefined;
  desc: string | undefined;
  image: string | undefined;
}

// FT Token
export interface StellarAsset {
  code: string, // This asset's code
  issuer: string, // The Stellar address of this asset’s issuer.
}

// Token Ends ---------------------------------------------------------------------------------------------------------------------------------------


// canvas ---------------------------------------------------------------------------------------------------------------------------------------
export interface Point {
  x: number;
  y: number;
}
export type DrawData = Point[][];

// metamasktypes ------------------------------------------------------------------------------------------------------------------------

export interface NativeBalance{
  balance:string,
  liquidity_pool_id?:string,
  limit: string,
  buying_liabilites: string,
  selling_liabilites: string,
  sponser?: string,
  last_modified_ledger: number,
  is_authorized: boolean,
  is_authorized_to_maintain_liabilites: boolean,
  is_clawback_enabled: boolean,
  asset_type: "native",
  asset_issuer: "native"
  asset_code: "XLM"
}

export interface AssetBalance{
  balance:string, //number
  liquidity_pool_id?:string, //number
  limit: string, //number
  buying_liabilites: string, //number
  selling_liabilites: string, //number
  sponser?: string, //address
  last_modified_ledger: number,
  is_authorized: boolean,
  is_authorized_to_maintain_liabilites: boolean,
  is_clawback_enabled: boolean,
  asset_type: "credit_alphanum4"|"credit_alphanum12"
  asset_code: string,
  asset_issuer: string, //address
}

export type walletAsset = AssetBalance | NativeBalance


export interface DataPacket{
  name:string,
  currentAddress:string,
  mainnetAssets?: walletAsset[],
  testnetAssets?: walletAsset[],
  accounts: Array<{name:String, address:String}>
  mainnetXLMBalance: string,
  testnetXLMBalance: string,
  fedName: string | null
}