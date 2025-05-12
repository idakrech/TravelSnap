import { useState } from "react"
import { View, Text, TouchableOpacity, Image } from "react-native"
import ButtonGradient, { ButtonColor } from "../../components/Button/ButtonGradient"
import Input from "../../components/Input/Input"
import WelcomeToTravelSnap from "../../components/WelcomeToTravelSnap/WelcomeToTravelSnap"
import { LinearGradient } from "expo-linear-gradient"
import { auth } from "../../config/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native"
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"
import { TabStackParamList } from "../../components/Navigation/TabNavigator"
import { RootStackParamList } from "../../components/Navigation/RootNavigator"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

export type LoginScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, "Main">,
  NativeStackNavigationProp<RootStackParamList>
>

const LoginPage = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>()

  const [emailValue, setEmailValue] = useState<string>("")
  const [passwordValue, setPasswordValue] = useState<string>("")

  const handleEmailChange = (text: string) => {
    setEmailValue(text)
  }
  const handlePasswordChange = (text: string) => {
    setPasswordValue(text)
  }

  const waitForAuthInit = async () => {
    return new Promise<void>((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user !== null) {
          console.log("User is logged in");
        } else {
          console.log("User is logged out");
        }
        unsubscribe();
        resolve();
      });
    });
  };

  const handleLoginPress = async () => {

    await waitForAuthInit();

    signInWithEmailAndPassword(auth, emailValue, passwordValue)
      .then((userCredentials) => {
        const user = userCredentials.user
        console.log("Logged in with ", user.email)
        navigation.navigate("Main")
      })
      .catch((error) => alert(error.message))
  }

  const goToRegisterPage = () => {
    navigation.navigate("Register")
  }

  return (
    <LinearGradient
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      colors={["#ffc0a0", "#ffe7a0"]}
    >
      <View
        style={{
          width: "90%",
          height: "85%",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 36,
        }}
      >
        <WelcomeToTravelSnap />
        <Text>Log in</Text>
        <Input placeholderText="Email" onInputChange={handleEmailChange} />

        <Input
          placeholderText="Password"
          onInputChange={handlePasswordChange}
          secureTextEntry={true}
        />

        <View
          style={{ flex: 1, alignItems: "center" }}
        >
          <TouchableOpacity onPress={goToRegisterPage}>
            <Text
              style={{ padding: 4, color: "#4b5563", fontWeight: "bold" }}
            >
              No user? Click here to create a user
            </Text>
          </TouchableOpacity>
          <ButtonGradient label="Log in" onPress={handleLoginPress} color={ButtonColor.BLUE}/>
        </View>
      </View>
    </LinearGradient>
  )
}

export default LoginPage
