import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import {
  WalletConnectModal,
  useWalletConnectModal,
} from "@walletconnect/modal-react-native";
import { readTotalCertificates, payForCourse } from "../contract";
import { ethers } from "ethers";

const projectId = "4581e0153aee1b8a90841e4d418afbca";

const providerMetadata = {
  name: "YOUR_PROJECT_NAME",
  description: "YOUR_PROJECT_DESCRIPTION",
  url: "https://your-project-website.com/",
  icons: ["https://your-project-logo.com/"],
  redirect: {
    native: "YOUR_APP_SCHEME://",
    universal: "YOUR_APP_UNIVERSAL_LINK.com",
  },
};

export default function Connect({ navigation }) {
  const { open, isConnected, address, provider } = useWalletConnectModal();
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [totalCertificates, setTotalCertificates] = useState(null);
  console.log(address)

  useEffect(() => {
    const getSignerAddress = async () => {
      if (isConnected && provider) {
        const web3Provider = new ethers.providers.Web3Provider(provider);
        const signer = web3Provider.getSigner();
        const address = await signer.getAddress();
      }
    };
    getSignerAddress();
  }, [isConnected, provider]);

  useEffect(() => {
    if (isConnected) {
      setSnackMessage(`Connected: ${address}`);
      setSnackVisible(true);
      fetchTotalCertificates();
    } else {
    }
  }, [isConnected, address]);

  const fetchTotalCertificates = async () => {
    try {
      const total = await readTotalCertificates();
      setTotalCertificates(total);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      setSnackMessage("An error occurred while fetching certificates.");
      setSnackVisible(true);
    }
  };

  const handleButtonPress = async () => {
    try {
      if (isConnected) {
        await provider?.disconnect();
        setSnackMessage("Wallet disconnected.");
        setSnackVisible(true);
      } else {
        await open();
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      setSnackMessage("An error occurred while connecting to the wallet.");
      setSnackVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>WalletConnect Modal Tutorial</Text>
      <Text style={styles.infoText}>
        {isConnected ? `Connected: ${address}` : "Not Connected"}
      </Text>

      <TouchableOpacity
        onPress={handleButtonPress}
        style={[
          styles.button,
          { backgroundColor: isConnected ? "#FF5A5F" : "#4CAF50" },
        ]}
      >
        <Text style={styles.buttonText}>
          {isConnected ? "Disconnect Wallet" : "Connect Wallet"}
        </Text>
      </TouchableOpacity>

     

      <WalletConnectModal
        explorerRecommendedWalletIds={[
          "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
        ]}
        explorerExcludedWalletIds={"ALL"}
        projectId={projectId}
        providerMetadata={providerMetadata}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  infoText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  payButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    backgroundColor: "#007bff",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
