import React, { useLayoutEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfilePage from "../../pages/ProfilePage/ProfilePage";
import ExplorePage from "../../pages/ExplorePage/ExplorePage";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CameraComponent from "../CameraComponent/CameraComponent";
import { SafeAreaView } from "react-native-safe-area-context";


export type TabStackParamList = {
  Main: undefined;
  Profile: undefined;
  Upload: undefined;
  Explore: undefined;
};

const Tab = createBottomTabNavigator<TabStackParamList>();

const TabNavigator = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: "#f7ded1", borderTopWidth: 0},
        tabBarActiveTintColor: "#ff6b22",
        tabBarInactiveTintColor: "gray",
        headerTitle: "",
        headerStyle: {
          backgroundColor: "#f7ded1",
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 55
        },
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Profile") {
            return (
              <Icon
                name="account"
                size={size}
                color={focused ? "#fa8861" : "gray"}
              />
            );
          } else if (route.name === "Upload") {
            return (
              <Icon
                name="camera-plus"
                size={size}
                color={focused ? "#fa8861" : "gray"}
              />
            );
          } else {
            return (
              <Icon
                name="magnify"
                size={size}
                color={focused ? "#fa8861" : "gray"}
              />
            );
          }
        },
      })}
    >
      <Tab.Screen name="Explore" component={ExplorePage} options={{ headerShown: false }}/>
      <Tab.Screen name="Upload" component={CameraComponent} />
      <Tab.Screen name="Profile" component={ProfilePage}/>
    </Tab.Navigator>
  );
};

export default TabNavigator;
