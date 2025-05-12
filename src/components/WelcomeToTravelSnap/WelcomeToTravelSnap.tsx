import { View, Image } from "react-native"

const WelcomeToTravelSnap = () => {
  return (
    <View style={{display: "flex", justifyContent: 'center', alignItems: 'center'}}>
      <Image 
        source={require('../../../assets/laying_logo.png')}
        style={{ width: 300, height: 50, marginBottom: 32 }}
        resizeMode="contain"
      />
    </View>
  )
}

export default WelcomeToTravelSnap