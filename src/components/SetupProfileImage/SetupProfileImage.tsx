import { ImageBackground, View, Text, TouchableOpacity } from "react-native";

type TSetupProfileImageProps = {
  onPress: () => void;
  image: string;
};

const SetupProfileImage: React.FC<TSetupProfileImageProps> = ({
  onPress,
  image,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <ImageBackground
        source={image ? { uri: image } : undefined}
        resizeMode="cover"
        style={{
          width: 175,
          height: 175,
          borderRadius: 175 / 2,
          overflow: "hidden",
          marginBottom: 16,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: image ? "transparent" : "#d9d9d9",
        }}
      >
        <View
          style={{
            backgroundColor: image
              ? "rgba(255, 255, 255, 0.4)"
              : "rgba(0,0,0,0.4)",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 24,
              textAlign: "center",
              color: "white",
              marginBottom: image ? 0 : 8,
            }}
          >
            {image ? "Tap to Edit" : "Profile Image?"}
          </Text>

          {!image && (
            <Text style={{ fontSize: 12, color: "white" }}>Tap to Add</Text>
          )}
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default SetupProfileImage;
