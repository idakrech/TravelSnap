import React, { useEffect, useState } from "react"
import * as Location from "expo-location"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import TabPosts from "../../components/TabPosts/TabPosts"
import { View } from "react-native"

type BottomTabStackParamList = {
  New: undefined
  Nearby: undefined
  Search: undefined
}

const BottomTab = createBottomTabNavigator<BottomTabStackParamList>()

const ExplorePage: React.FC = () => {
  const [countryName, setCountryName] = useState<string>("Unknown")

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        console.warn("Location permission denied")
        return
      }
      const loc = await Location.getCurrentPositionAsync({})
      const geo = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      })
      setCountryName(geo[0]?.country ?? "Unknown")
    })()
  }, [])

  const NewTab = () => <TabPosts tabName="New" countryName={countryName} />
  const NearbyTab = () => (
    <TabPosts tabName="Nearby" countryName={countryName} />
  )
  const SearchTab = () => (
    <TabPosts tabName="Search" countryName={countryName} />
  )

  return (
    <View style={{ flex: 1, paddingTop: 0 }}>
    <BottomTab.Navigator
      detachInactiveScreens={true}
      screenOptions={{
        tabBarActiveTintColor: "#fa8861",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
        tabBarPosition: 'top',
        tabBarStyle: {
          backgroundColor: "#f7ded1",
          elevation: 0,
          borderBottomWidth: 0,
        },
      }}
    >
      <BottomTab.Screen name="New" component={NewTab} />
      <BottomTab.Screen name="Nearby" component={NearbyTab} />
      <BottomTab.Screen name="Search" component={SearchTab} />
    </BottomTab.Navigator>
    </View>
  )
}

export default ExplorePage
