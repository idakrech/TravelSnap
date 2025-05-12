import { TextInput } from "react-native"
import {
  QueryDocumentSnapshot,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore"
import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Button,
  ScrollView,
} from "react-native"
import { auth, db } from "../../config/firebase"
import { RouteProp, useRoute } from "@react-navigation/native"
import { RootStackParamList } from "../../components/Navigation/RootNavigator"
import { LinearGradient } from "expo-linear-gradient"
import * as Location from "expo-location"
import MapView, { Marker } from "react-native-maps"
import { formatDistanceToNow } from "date-fns"
import Icon from "react-native-vector-icons/AntDesign"

export type ImageDetailPageProps = {
  postID: string
  username: string
  userImage: string
  image: string
  caption: string
  timestamp: Timestamp
  latitude: number
  longitude: number
  locationName: string
}

type ImageDetailScreenRouteProp = RouteProp<RootStackParamList, "ImageDetail">

const ImageDetailPage = () => {
  const {
    params: {
      postID,
      username,
      userImage,
      image,
      caption,
      timestamp,
      latitude,
      longitude,
      locationName,
    },
  } = useRoute<ImageDetailScreenRouteProp>()
  const [cityName, setCityName] = useState<string>("")
  const [comment, setComment] = useState<string>("")
  const [comments, setComments] = useState<QueryDocumentSnapshot[]>([])
  const [commentersUsername, setCommentersUsername] =
    useState<string>("unknown user")
  const [commentersProfileImg, setCommentersProfileImg] =
    useState<string>("unknown user")

  useEffect(() => {
    const unsubscribeComments = onSnapshot(
      query(
        collection(db, "posts", postID, "comments"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => setComments(snapshot.docs)
    )

    const unsubscribeUsers = onSnapshot(
      doc(db, `users`, auth.currentUser!.uid),
      (snapshot) => {
        const userData = snapshot.data()
        setCommentersUsername(userData?.username || "")
        setCommentersProfileImg(userData?.profileImg || "")
      }
    )

    findCityName(latitude, longitude)

    return () => {
      unsubscribeComments()
      unsubscribeUsers()
    }
  }, [db])

  const findCityName = async (lat: number, long: number) => {
    let reverseGeocode = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: long,
    })

    if (reverseGeocode && reverseGeocode.length > 0) {
      setCityName(reverseGeocode[0]?.city || "Unknown Location")
    }
  }

  // const convertTimestamp = (timestamp: Timestamp): string => {
  //   const date = timestamp.toDate()

  //   const year = date.getFullYear()
  //   const month = (date.getMonth() + 1).toString().padStart(2, "0")
  //   const day = date.getDate().toString().padStart(2, "0")

  //   return `${day}.${month}.${year}`
  // }

  const sendComment = async () => {
    const commentToSend = comment
    setComment("")
    await addDoc(collection(db, "posts", postID, "comments"), {
      comment: commentToSend,
      username: commentersUsername,
      profileImg: commentersProfileImg,
      timestamp: serverTimestamp(),
    })
  }

  const deleteComment = async (commentID: string) => {
    try {
      const commentDocRef = doc(db, "posts", postID, "comments", commentID)
      await deleteDoc(commentDocRef)
    } catch (error) {
      console.error("Error deleting comment")
    }
  }

  return (
    <LinearGradient
      colors={["#ffc0a066", "#ffe7a066"]}
      style={{ height: "100%", justifyContent: "center", paddingBottom: 48 }}
    >
      <ScrollView>
        <View style={{ width: "100%" }}>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 8,
              paddingVertical: 8,
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: userImage }}
              style={{ width: 32, height: 32, borderRadius: 16 }}
            />
            <Text style={{ fontSize: 16, paddingLeft: 8 }}>{username}</Text>
          </View>
          <Image
            source={{ uri: image }}
            style={{ width: "100%", height: 450 }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            paddingVertical: 8,
            justifyContent: "space-between",
            paddingRight: 8,
          }}
        >
          <Text style={{ fontSize: 14, marginLeft: 8 }}>
            📍 {cityName ? cityName : "Unknown"}
          </Text>
          <Text style={{ fontSize: 14, marginLeft: 8 }}>
            {timestamp?.toDate().toLocaleDateString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
              timeZone: "Europe/Warsaw",
            })}
          </Text>
        </View>

        <View style={{ paddingHorizontal: 8, paddingVertical: 8 }}>
          <Text style={{ marginRight: 8 }}>
            <Text style={{ fontWeight: "bold" }}>{username}</Text> {caption}
          </Text>
        </View>

        <MapView
          style={{ height: 200, margin: 12 }}
          key={Math.random()}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          {latitude && longitude && (
            <Marker
              coordinate={{
                latitude: latitude,
                longitude: longitude,
              }}
              title="Photo location"
              identifier="Photo location"
            />
          )}
        </MapView>

        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 4,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              marginBottom: 12,
            }}
          >
            <Image
              source={{ uri: commentersProfileImg }}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                marginRight: 8,
              }}
            />
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Write a comment..."
              placeholderTextColor="#7a7a7a"
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 20,
                paddingVertical: 8,
                paddingHorizontal: 16,
                width: "75%",
                marginRight: 8,
              }}
            />
            <TouchableOpacity
              onPress={sendComment}
              disabled={!comment.trim()}
              style={{
                backgroundColor: "#f5e8d9",
                borderWidth: 1,
                borderColor: "#ccc",
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon name="arrowup" size={20} color="#7a7a7a" />
            </TouchableOpacity>
          </View>
        </View>

        {/** COMMENTS */}
        {comments.length > 0 && (
          <View
            style={{
              justifyContent: "flex-start",
              paddingHorizontal: 8,
              paddingVertical: 4,
              marginBottom: 64,
            }}
          >
            {comments.map((comment) => (
              <View key={comment.id} style={{ paddingVertical: 8 }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 16,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center"}}>
                    <Image
                      source={{ uri: comment.data().profileImg }}
                      style={{ width: 32, height: 32, borderRadius: 16 }}
                    />
                    <Text style={{ paddingHorizontal: 8, width: "85%" }}>
                      <Text style={{ fontWeight: "bold" }}>
                        {comment.data().username}{" "}
                      </Text>
                      {comment.data().comment}
                    </Text>
                  </View>

                  <View>
                    {commentersUsername == comment.data().username && (
                      <TouchableOpacity
                        onPress={() => {
                          deleteComment(comment.id)
                        }}
                      >
                        <Icon name="delete" size={20} color="#ff6b22" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <Text style={{color: "#7a7a7a"}}>
                  {comment.data().timestamp &&
                  comment.data().timestamp.toDate() instanceof Date &&
                  !isNaN(comment.data().timestamp.toDate().getTime())
                    ? formatDistanceToNow(comment.data().timestamp.toDate(), {
                        addSuffix: true,
                      })
                    : ""}
                </Text>
              </View>
            ))}
          </View>
        )}
        {/** COMMENTS END */}
      </ScrollView>
    </LinearGradient>
  )
}

export default ImageDetailPage
