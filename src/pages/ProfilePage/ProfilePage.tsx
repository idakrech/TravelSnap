import { Text, ScrollView, Image, View, Button, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import FeedPost, { FeedPostProps } from "../../components/FeedPost/FeedPost";
import {
  onSnapshot,
  collection,
  query,
  orderBy,
  QueryDocumentSnapshot,
  doc,
  where,
} from "firebase/firestore";
import { db, auth, storage } from "../../config/firebase";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../components/Navigation/RootNavigator";
import { useNavigation } from "@react-navigation/native";
import ButtonGradient from "../../components/Button/ButtonGradient";
import { LinearGradient } from "expo-linear-gradient";
import GalleryPost from "../../components/GalleryPost/GalleryPost";
import { signOut } from 'firebase/auth';

export type ProfilePageNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

function ProfilePage() {
  const navigation = useNavigation<ProfilePageNavigationProp>();
  const [posts, setPosts] = useState<FeedPostProps[]>([]);
  const userId = auth.currentUser!.uid;
  const [username, setUsername] = useState<string>("");
  const [profileImg, setProfileImg] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [locationName, setLocationName] = useState<string>("");
  

  useEffect(() => {

    const userDocRef = doc(db, `users`, userId);

    const unsubscribeUser = onSnapshot(userDocRef, (userDocSnapshot) => {
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        setUsername(userData?.username || "");
        setProfileImg(userData?.profileImg || "");
        setBio(userData?.profileBio || "");
      } else {
        setUsername("");
      }
    });

    const unsubscribePosts = onSnapshot(
      query(
        collection(db, 'posts'), //(db, `posts/${userId}/userPosts`)
        where("userID", "==", userId),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        setPosts(
          snapshot.docs.map((doc: QueryDocumentSnapshot) => {
            const data = doc.data();
            return {
              postID: doc.id,
              username: username,
              userImage: profileImg,
              image: data.image,
              caption: data.caption,
              timestamp: data.timestamp,
              latitude: data.coords.latitude,
              longitude: data.coords.longitude,
              city: data.city
            };
          })
        );
      }
    );

    return () => {
      unsubscribeUser();
      unsubscribePosts();
    };
  }, [db, userId, username, profileImg, bio]);

  const findLocationName = async (lat: number, long: number) => {
    let reverseGeocode = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: long,
    });

    if (reverseGeocode && reverseGeocode.length > 0) {
      setLocationName(reverseGeocode[0]?.city || "Unknown Location");
    }
  };

  const handleLogout = async () => {
    await signOut(auth)
    .then(() => {
      navigation.reset({
        index: 0, 
        routes: [{ name: "Login" }],
      });
    })
    .catch((error) => {
      console.log(error)
    });
  }

  return (
    <LinearGradient colors={['#ffc0a066', '#ffe7a066']}>
      <View>
        <View>
          <View style={{display: "flex", flexDirection: 'row', justifyContent: 'space-between'}}>
            <ButtonGradient label="Log out" onPress={() => handleLogout()}/>
            <ButtonGradient label="Edit profile" onPress={() => navigation.navigate("ProfileSetupPage")}/>
          </View>
          <View style={{display: "flex", flexDirection: 'row', padding: 16, justifyContent: 'space-between'}}>
            <View style={{height: 100}}>
              {profileImg ? 
                <Image source={{ uri: profileImg }} style={{width: 112, height: 112, borderRadius: 56, marginBottom: 8}}/> 
                : 
                <Image source={require('../../../assets/avatar.png')} style={{width: 112, height: 112, borderRadius: 56, marginBottom: 8}}/> }
            </View>
            <View style={{marginLeft: 16, flex: 1}}>
              <Text style={{fontWeight: 'bold', fontSize: 24, marginBottom: 4}}>{username}</Text>
              <View>
                <Text style={{fontWeight: 'normal', fontStyle: 'normal'}}> {bio}</Text>
              </View>
              </View>
            </View>
          </View>

          <FlatList
            numColumns={3}
            data={posts}
            keyExtractor={(item) => item.postID.toString()}
            refreshing={false}
            style={{height: "100%"}}
            renderItem={({ item }) => (
              <GalleryPost
                key={item.postID}
                postID={item.postID}
                username={item.username}
                userImage={item.userImage}
                image={item.image}
                caption={item.caption}
                timestamp={item.timestamp}
                latitude={item.latitude}
                longitude={item.longitude}
                locationName={item.city}
              />
            )}
         />

      </View>
    </LinearGradient>
  );
}

export default ProfilePage;
