<template>
  <!-- App.vue -->

  <v-app>
    <v-app-bar app>
      <v-app-bar-title>NFTINDER</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn
        v-if="!$store.state.connected && $store.state.userAddress.length === 0"
        @click="connectWallet"
        text
      >
        <v-icon left>
          mdi-ethereum
        </v-icon>
        Connect
      </v-btn>
      <v-btn
        v-if="$store.state.connected || $store.state.userAddress.length > 0"
        text
      >
        <v-icon left>
          mdi-ethereum
        </v-icon>
        {{
          $store.state.userAddress.substring(0, 5) +
            ".." +
            $store.state.userAddress.substring(
              $store.state.userAddress - 3,
              $store.state.userAddress.length
            )
        }}
      </v-btn>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>
    <v-overlay :value="$store.state.isLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
import Web3 from "web3";
import EmbarkJS from "../contracts/embarkArtifacts/embarkjs";
export default {
  name: "App",

  data: () => ({}),
  methods: {
    connectWallet: async function() {
      if (typeof ethereum !== "undefined") {
        try {
          await ethereum.enable();
          this.$store.state.userAddress = window.web3.eth.getDefaultAccount;
          this.$store.state.connected = true;
          console.log("found default account: ", this.$store.state.userAddress);
        } catch (error) {
          this.$store.dispatch(
            "error",
            "There was an error getting enabling metamask"
          );
        }
      } else {
        this.$store.dispatch(
          "errorWithFooterMetamask",
          "Seems like you dont have metamask installed please use the below link to download"
        );
      }
    },
    init: async function() {
      let _this = this;
      if (window.performance) {
        console.info("window.performance works fine on this browser");
      }
      console.info(performance.navigation.type);
      if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
        console.info("This page is reloaded");
        this.$router.push({ name: "market" });
      } else {
        console.info("This page is not reloaded");
      }
      EmbarkJS.onReady(async (error) => {
        var accounts = await require('../contracts/embarkArtifacts/embarkjs').default.enableEthereum();
        console.log("accounts; ", accounts);
        this.$store.state.userAddress = accounts[0];
        if (typeof ethereum !== "undefined") {
          // Supports EIP-1102 injected Ethereum providers.
          window.web3 = new Web3(ethereum);
          console.log("in 1st if");
        } else if (typeof web3 !== "undefined") {
          console.log("in 2nd if");
          // Supports legacy injected Ethereum providers.
          window.web3 = new Web3(web3.currentProvider);
        } else {
          // Your preferred fallback.
          console.log("in 3rd if");
          window.web3 = new Web3(
            new Web3.providers.HttpProvider("http://localhost:8546")
          );
        }
        window.web3.eth.net.getId((err, netId) => {
          console.log("netId: ", netId);
          switch (netId) {
            case 3:
              console.log("this is ropsten");
              break;
            default:
              require("sweetalert2")
                .fire({
                  title:
                    "Incompatible network detected please switch to the ropsten test network",
                  confirmButtonText: `Close`,
                })
                .then((result) => {
                  window.location.reload();
                });
              break;
          }
        });
        window.ethereum.on("accountsChanged", function(accounts) {
          _this.$store.state.userAddress = accounts[0];
          window.location.reload();
        });
        window.ethereum.on("networkChanged", function(netId) {
          _this.$store.state.userAddress = accounts[0];
          window.location.reload();
        });
      });
    },
    assignAccount: async function() {
      return new Promise((resolve) => {
        window.web3.eth.getAccounts((accounts) => {
          // this.$store.state.userAddress = accounts[0];
          console.log("found accounts: ", accounts);
        });
        console.log("found default account: ", window.web3.eth);
        resolve(true);
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>
