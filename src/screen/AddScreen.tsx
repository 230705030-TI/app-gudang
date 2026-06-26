import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { addItem, updateItem, getInventory } from "../database/database";

export default function AddScreen({ route, navigation }: any) {
  const itemId = route.params?.id;
  const isEditing = !!itemId;

  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [oldImageUri, setOldImageUri] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing) {
      const allItems = getInventory();
      const currentItem = allItems.find((item) => item.id === itemId);

      if (currentItem) {
        setName(currentItem.name);
        setStock(currentItem.stock.toString());
        setImageUri(currentItem.image_uri);
        setOldImageUri(currentItem.image_uri);
      }
    }
  }, [itemId, isEditing]);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Denied",
        "You need to allow gallery access to pick an image!",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !stock.trim()) {
      Alert.alert("Validation Error", "Name and stock are required!");
      return;
    }

    const stockNumber = parseInt(stock, 10);
    if (isNaN(stockNumber) || stockNumber < 0) {
      Alert.alert("Validation Error", "Stock must be a valid positive number!");
      return;
    }

    try {
      if (isEditing) {
        await updateItem(itemId, name, stockNumber, imageUri, oldImageUri);
      } else {
        await addItem(name, stockNumber, imageUri);
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert("Database Error", "Failed to save the item.");
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.label}>Item Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g., Lenovo ThinkPad"
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>Stock Quantity</Text>
        <TextInput
          style={styles.input}
          value={stock}
          onChangeText={setStock}
          placeholder="e.g., 15"
          keyboardType="numeric"
          placeholderTextColor="#94a3b8"
        />

        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>No Image Selected</Text>
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={pickImage} style={styles.btnPick}>
              <Text style={styles.btnPickText}>Pick Image</Text>
            </TouchableOpacity>

            {imageUri && (
              <TouchableOpacity
                onPress={() => setImageUri(null)}
                style={styles.btnClear}
              >
                <Text style={styles.btnClearText}>Clear Image</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity onPress={handleSave} style={styles.btnSave}>
          <Text style={styles.btnSaveText}>
            {isEditing ? "Update Item" : "Save Item"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
    backgroundColor: "#f8fafc",
    color: "#1e293b",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  imagePreview: {
    width: "100%",
    height: 192,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  imagePlaceholder: {
    width: "100%",
    height: 192,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#cbd5e1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  placeholderText: {
    color: "#94a3b8",
    fontWeight: "500",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
    justifyContent: "center",
    marginTop: 8,
  },
  btnPick: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flex: 1,
    alignItems: "center",
  },
  btnPickText: {
    color: "#334155",
    fontWeight: "600",
    fontSize: 14,
  },
  btnClear: {
    backgroundColor: "#fef2f2",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fee2e2",
    flex: 1,
    alignItems: "center",
  },
  btnClearText: {
    color: "#dc2626",
    fontWeight: "600",
    fontSize: 14,
  },
  btnSave: {
    backgroundColor: "#0f172a",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  btnSaveText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
});
