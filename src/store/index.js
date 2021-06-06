import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
const { SkynetClient, genKeyPairFromSeed } = require("skynet-js");
import biddingContract from "../../contracts/embarkArtifacts/contracts/BidContract";
import tokenContract from "../../contracts/embarkArtifacts/contracts/TokenContract";
import swal from "sweetalert2";

Vue.use(Vuex);
console.log("biddingContract.options.address: ",biddingContract.options.address)
/* eslint-disable no-new */
const store = new Vuex.Store({
  state: {
    userAddress:"",
    connected:false,
    tokenAddress:tokenContract.options.address,
    biddingContract: biddingContract,
    biddingContractAddress:biddingContract.options.address,
    tokenContract:tokenContract,
    skyClient: new SkynetClient("https://siasky.net/"),
    ownedNFTS:[],
    bidNFTS:[],
    selectedNFT:{},
    bidDialog: false,
    currentPrice: 0,
    transferDialog: false,
    isLoading: false,
    whiteColor: "white",
    purpleColor: `rgba(221, 71, 209, 0.5)`,
    selectedNFTS: [],
    tabActive: true,
    selectedTab: 0,
    primaryColor: "black accent-1",
    tabs: [
      {
        name: "Market",
        icon: "mdi-fire",
        to: "/market",
      },
      {
        name: "Liked",
        icon: "mdi-star-four-points",
        to: "/liked",
      },
      {
        name: "Profile",
        icon: "mdi-account",
        to: "/profile",
      },
    ],
  },
  plugins: [createPersistedState()],
  modules: {},
  actions: {
    success(context, message) {
      console.log("shwoing success message: ", message);
      swal.fire("Success", message, "success");
    },
    error(context, message) {
      console.log("shwoing error message: ", message);
      swal.fire("Error!", message, "error");
    },
    successWithFooter(context, message) {
      console.log("shwoing successWithFooter message: ", message);
      swal.fire({
        icon: "success",
        title: "Success",
        text: message.message,
        footer: `<a href= https://testnet.bscscan.com/tx/${message.txHash}> View on Binance Explorer</a>`,
      });
    },
    errorWithFooterMetamask(context, message) {
      console.log("shwoing successWithFooter message: ", message);
      swal.fire({
        icon: "error",
        title: "Error!",
        text: message,
        footer: `<a href= https://metamask.io> Download Metamask</a>`,
      });
    }
  },
});

export default store;
