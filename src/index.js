import React from "react";
import { StyleSheet, Text, View } from "react-native";

// Nama fungsinya diubah menjadi Index agar sesuai aturan Expo Router
export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>SembakoTrack 🛒</Text>
      <Text style={styles.textSub}>
        Aplikasi Digitalisasi Inventaris Sembako
      </Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>
          Selamat! Aplikasi Expo kamu sudah berhasil berjalan di Emulator Pixel
          9 🎉
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  textTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  textSub: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 30,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "100%",
    alignItems: "center",
  },
  cardText: {
    fontSize: 15,
    color: "#34495e",
    textAlign: "center",
    lineHeight: 22,
  },
});
