/// <reference types="nativewind/types" />

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getInventory, deleteItem, InventoryItem } from "../database/database";

export default function HomeScreen({ navigation }: any) {
  const [items, setItems] = useState<InventoryItem[]>([]);

  const loadData = useCallback(() => {
    const data = getInventory();
    setItems(data);
  }, []);

  useFocusEffect(loadData);

  const handleDelete = async (id: number, uri: string | null) => {
    try {
      await deleteItem(id, uri);
      loadData();
    } catch (error) {
      Alert.alert("Error", "Failed to delete item.");
    }
  };

  const EmptyState = () => (
    <View className="flex-1 justify-center items-center py-20 px-4">
      <View className="w-16 h-16 bg-slate-100 rounded-2xl items-center justify-center mb-4 border border-slate-200">
        <Text className="text-slate-300 font-bold text-xl">in</Text>
      </View>
      <Text className="text-slate-800 text-base font-semibold">
        Inventory is empty
      </Text>
      <Text className="text-slate-500 text-sm mt-1 text-center">
        Get started by adding your first item.
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: InventoryItem }) => (
    <View className="flex-row p-3 mb-3 bg-white border border-slate-200 rounded-2xl">
      {item.image_uri ? (
        <Image
          source={{ uri: item.image_uri }}
          className="w-16 h-16 rounded-xl mr-3"
        />
      ) : (
        <View className="w-16 h-16 bg-slate-50 rounded-xl mr-3 justify-center items-center border border-slate-200">
          <Text className="text-xs text-slate-400 font-medium">Empty</Text>
        </View>
      )}

      <View className="flex-1 justify-center">
        <Text className="text-base font-semibold text-slate-800 mb-0.5">
          {item.name}
        </Text>
        <Text className="text-sm text-slate-500 font-medium">
          Stock: {item.stock}
        </Text>
      </View>

      <View className="justify-center ml-2">
        <TouchableOpacity
          onPress={() => navigation.navigate("Add", { id: item.id })}
          className="bg-slate-100 px-4 py-1.5 rounded-lg mb-2 items-center"
        >
          <Text className="text-slate-700 text-sm font-semibold">Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDelete(item.id, item.image_uri)}
          className="bg-red-50 px-4 py-1.5 rounded-lg items-center"
        >
          <Text className="text-red-600 text-sm font-semibold">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50 px-4 pt-4">
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={EmptyState}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate("Add")}
        className="bg-slate-900 py-3.5 rounded-xl mb-4 items-center justify-center"
      >
        <Text className="text-white font-semibold text-base">Add New Item</Text>
      </TouchableOpacity>
    </View>
  );
}
