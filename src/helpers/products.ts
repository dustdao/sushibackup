import kashiLogo from "./../imports/images/products/kashi.png";
import bentoBoxLogo from "./../imports/images/products/bentoBox.png";
import sushiMakerLogo from "./../imports/images/products/sushiMaker.png";
import kashiABI from "./../imports/abis/kashi.json";
import bentoBoxABI from "./../imports/abis/bento.json";
import boringHelperABI from "./../imports/abis/boringhelper.json";
import sushiFactoryABI from "./../imports/abis/sushiFactory.json";
import { CHAIN_IDS } from "./network";

export interface IProduct {
    name: string,
    link: string,
    logo: string, //logo path
    description: string,
    active: boolean,
    networks: {[id: number]: string}
    ABI: any
}

export enum PRODUCT_IDS {
    KASHI = 0,
    BENTOBOX = 1,
    BORING_HELPER = 2,
    SUSHI_MAKER = 3
}

export const PRODUCTS: {[id: number]: IProduct} = {
    [PRODUCT_IDS.KASHI]: {
        name: "Kashi",
        link: "kashi",
        logo: kashiLogo,
        description: "Isolated lending and borrowing.",
        active: true,
        networks: {
            [CHAIN_IDS.ETHEREUM]: "0x2cba6ab6574646badc84f0544d05059e57a5dc42",
            [CHAIN_IDS.ARBITRUM]: "0xa010ee0226cd071bebd8919a1f675cae1f1f5d3e",
            [CHAIN_IDS.BSC]: "0x2cba6ab6574646badc84f0544d05059e57a5dc42",
            [CHAIN_IDS.POLYGON]: "0xb527c5295c4bc348cbb3a2e96b2494fd292075a7",
            [CHAIN_IDS.XDAI]: "0x7a6da9903d0a481f40b8336c1463487bc8c0407e"
        },
        ABI: kashiABI
    },
    [PRODUCT_IDS.BENTOBOX]: {
        name: "BentoBox",
        link: "bentobox",
        logo: bentoBoxLogo,
        description: "Interest bearing vault.",
        active: true,
        networks: {
            [CHAIN_IDS.ETHEREUM]: "0xf5bce5077908a1b7370b9ae04adc565ebd643966",
            [CHAIN_IDS.ARBITRUM]: "0x74c764D41B77DBbb4fe771daB1939B00b146894A",
            [CHAIN_IDS.BSC]: "0xf5bce5077908a1b7370b9ae04adc565ebd643966",
            [CHAIN_IDS.POLYGON]: "0x0319000133d3ada02600f0875d2cf03d442c3367",
            [CHAIN_IDS.XDAI]: "0xE2d7F5dd869Fc7c126D21b13a9080e75a4bDb324"
        },
        ABI: bentoBoxABI
    },
    [PRODUCT_IDS.BORING_HELPER]: {
        name: "BoringHelper",
        link: "",
        logo: "",
        description: "",
        active: false,
        networks: {
            [CHAIN_IDS.AVALANCHE]: "0xbc2c69175e9b379ECF64Dc23CcA70Bd7DC99093e",
            [CHAIN_IDS.ARBITRUM]: "0x37B3287292De241278fB5FCa514a756E0BE924f8",
            [CHAIN_IDS.BSC]: "0x11Ca5375AdAfd6205E41131A4409f182677996E6",
            [CHAIN_IDS.CELO]: "0x07C9040Cd1bA51e7D062442BA9b0B6794b3Cda6B",
            [CHAIN_IDS.ETHEREUM]: "0x11Ca5375AdAfd6205E41131A4409f182677996E6",
            [CHAIN_IDS.FANTOM]: "0xB46217aF1Eb975e616108af0bEe28D9FD22D6F2C",
            [CHAIN_IDS.HARMONY]: "0xF06EE11dDc521c6F1Fb4542cCd8162BE8c54bDc9",
            [CHAIN_IDS.MOONRIVER]: "0xafB28FC404B8F8837713bd60416E566c3720Ed9f",
            [CHAIN_IDS.POLYGON]: "0xA77a7fD5a16237B85E0FAd02C51f459D18AE93Cd",
            [CHAIN_IDS.XDAI]: "0x97e4a0fb71243A83A6FbaEF7Cf73617594e4cF2F",
        },
        ABI: boringHelperABI
    },
    [PRODUCT_IDS.SUSHI_MAKER]: {
        name: "SushiMaker",
        link: "sushimaker",
        logo: sushiMakerLogo,
        description: "See how much fees available for the SushiBar.",
        active: true,
        networks: {
            [CHAIN_IDS.ARBITRUM]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
            [CHAIN_IDS.AVALANCHE]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
            [CHAIN_IDS.BSC]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
            [CHAIN_IDS.CELO]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
            [CHAIN_IDS.ETHEREUM]: "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac",
            [CHAIN_IDS.FANTOM]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
            [CHAIN_IDS.HARMONY]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
            [CHAIN_IDS.MOONRIVER]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
            [CHAIN_IDS.POLYGON]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
            [CHAIN_IDS.XDAI]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
        },
        ABI: sushiFactoryABI
    }
};