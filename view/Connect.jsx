import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {
  WalletConnectModal,
  useWalletConnectModal,
} from "@walletconnect/modal-react-native";
import { readTotalCertificates, payForCourse } from "../contract"; // Import hàm payForCourse
import { ethers } from "ethers";

// Thay thế bằng projectId của bạn
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
  const [totalCertificates, setTotalCertificates] = useState(null); // State để lưu tổng số chứng chỉ
  // console.log('isConnected', provider);
  // Cập nhật địa chỉ ví vào Redux khi kết nối
  useEffect(() => {
    const getSignerAddress = async () => {
      if (isConnected && provider) {
        // Tạo một ethers provider từ WalletConnect provider
        const web3Provider = new ethers.providers.Web3Provider(provider);
        const signer = web3Provider.getSigner(); // Lấy signer
        const address = await signer.getAddress(); // Lấy địa chỉ ví
        console.log("Địa chỉ ví:", address);
      }
    };
    getSignerAddress();
  }, [isConnected, provider]);
  useEffect(() => {
    if (isConnected) {
      console.log(`Kết nối thành công với ví: ${address}`);
      setSnackMessage(`Kết nối thành công: ${address}`);
      setSnackVisible(true);
      fetchTotalCertificates();
    } else {
      console.log("Chưa kết nối với ví.");
    }
  }, [isConnected, address]);

  const fetchTotalCertificates = async () => {
      try {
          const total = await readTotalCertificates(); // Gọi hàm từ contract.js
          console.log("Tổng số chứng chỉ:", total); // Log giá trị tổng số chứng chỉ
          setTotalCertificates(total); // Lưu tổng số chứng chỉ vào state
      } catch (error) {
          console.error("Lỗi khi gọi hàm:", error);
          setSnackMessage('Có lỗi xảy ra khi gọi hàm.');
          setSnackVisible(true);
      }
  };

  // Hàm gọi payForCourse
  const handlePayForCourse = async () => {
    try {
      const courseId = "course123";
      const studentId = "student456";
      const studentName = "Nguyen Van A";
      const organization = "0xCCE30abca3d711462214B4c3609d228bC5BF8bEa"; // Địa chỉ của tổ chức
      const organizationName = "Organization Name";
      const courseFee = ethers.utils.parseEther("0.00001"); // Số tiền thanh toán (0.1 ETH)

      // Gọi hàm payForCourse
      const tx = await payForCourse(
        provider,
        courseId,
        studentId,
        studentName,
        organization,
        organizationName,
        courseFee
      );
      console.log("Giao dịch thành công với hash:", tx.hash);
    } catch (error) {
      console.error("Lỗi khi thanh toán khóa học:", error);
    }
  };

  // Hàm xử lý nút kết nối
  const handleButtonPress = async () => {
    try {
      if (isConnected) {
        await provider?.disconnect();
        setSnackMessage("Bạn đã ngắt kết nối ví.");
        setSnackVisible(true);
      } else {
        console.log("Kết nối ví...");
        await open();
      }
    } catch (error) {
      console.error("Lỗi khi kết nối với ví:", error);
      setSnackMessage("Có lỗi xảy ra khi kết nối với ví.");
      setSnackVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>WalletConnect Modal RN Tutorial</Text>
      <Text>{isConnected ? address : "No Connected"}</Text>
      <TouchableOpacity
        onPress={handleButtonPress}
        style={styles.pressableMargin}
      >
        <Text style={styles.buttonText}>
          {isConnected ? "Disconnect" : "Connect"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={styles.pressableMargin}
      >
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>

      {/* Nút để thanh toán khóa học */}
      {isConnected && (
        <TouchableOpacity
          onPress={handlePayForCourse}
          style={styles.pressableMargin}
        >
          <Text style={styles.buttonText}>Pay for Course</Text>
        </TouchableOpacity>
      )}

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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  pressableMargin: {
    marginTop: 16,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
});
