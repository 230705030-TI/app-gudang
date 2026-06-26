import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initDB } from "./src/database/database";

import HomeScreen from "./src/screen/HomeScreen";
import AddScreen from "./src/screen/AddScreen";

export type RootStackParamList = {
  Home: undefined;
  Add: { id?: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    const setupDB = async () => {
      try {
        await initDB();
        setIsDbReady(true);
      } catch (error) {
        console.error("Failed to initialize database", error);
      }
    };

    setupDB();
  }, []);

  if (!isDbReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading Database...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Inventory List" }}
        />
        <Stack.Screen
          name="Add"
          component={AddScreen}
          options={{ title: "Manage Item" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
