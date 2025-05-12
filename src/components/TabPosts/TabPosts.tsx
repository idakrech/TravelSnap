import { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import {
  QueryDocumentSnapshot,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  or,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { LinearGradient } from "expo-linear-gradient";
import GalleryPost from "../GalleryPost/GalleryPost";
import Input from "../Input/Input";
import ButtonGradient from "../Button/ButtonGradient";

export type postsProps = {
  tabName: string;
  countryName: string;
};

export type FeedPostProps = {
  postID: string;
  username: string;
  userImage: string;
  image: string;
  caption: string;
  timestamp: any;
  latitude: number;
  longitude: number;
  city: string;
};

const TabPosts = ({ tabName, countryName }: postsProps) => {
  const [posts, setPosts] = useState<FeedPostProps[]>([]);
  const [isFromSearchBar, setIsFromSearchBar] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (tabName === "New") {
      setIsFromSearchBar(false);
      unsubscribe = onSnapshot(
        query(collection(db, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          const fetched = snapshot.docs.map((doc: QueryDocumentSnapshot) => {
            const data = doc.data();
            return {
              postID: doc.id,
              username: data.username,
              userImage: data.profileImg,
              image: data.image,
              caption: data.caption,
              timestamp: data.timestamp,
              latitude: data.coords.latitude,
              longitude: data.coords.longitude,
              city: data.city,
            };
          });
          setPosts(fetched);
        }
      );
    } else if (tabName === "Nearby") {
      setIsFromSearchBar(false);
      unsubscribe = onSnapshot(
        query(
          collection(db, "posts"),
          where("country", "==", countryName),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => {
          const fetched = snapshot.docs.map((doc: QueryDocumentSnapshot) => {
            const data = doc.data();
            return {
              postID: doc.id,
              username: data.username,
              userImage: data.profileImg,
              image: data.image,
              caption: data.caption,
              timestamp: data.timestamp,
              latitude: data.coords.latitude,
              longitude: data.coords.longitude,
              city: data.city,
            };
          });
          setPosts(fetched);
        }
      );
    } else if (tabName === "Search") {
      setIsFromSearchBar(true);
      setPosts([]);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [tabName, countryName]);

  const searchPostsByKeyword = async (keyword: string) => {
    const trimmed = keyword.trim().toLowerCase();
    const prepared =
      trimmed.charAt(0).toUpperCase() + trimmed.slice(1);

    const unsubscribe = onSnapshot(
      query(
        collection(db, "posts"),
        or(
          where("caption", "==", prepared),
          where("city", "==", prepared),
          where("country", "==", prepared),
          where("username", "==", prepared)
        ),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        const fetched = snapshot.docs.map((doc: QueryDocumentSnapshot) => {
          const data = doc.data();
          return {
            postID: doc.id,
            username: data.username,
            userImage: data.profileImg,
            image: data.image,
            caption: data.caption,
            timestamp: data.timestamp,
            latitude: data.coords.latitude,
            longitude: data.coords.longitude,
            city: data.city,
          };
        });
        setPosts(fetched);
      }
    );

    return () => unsubscribe();
  };

  return (
    <LinearGradient colors={['#ffc0a066', '#ffe7a066']} style={{ flex: 1 }}>
      {isFromSearchBar && (
        <View style={{ padding: 10 }}>
          <Input
            placeholderText="Search 'Oslo' or 'Norway'"
            onInputChange={(text) => setSearchKeyword(text)}
          />
          <ButtonGradient
            label="Search"
            onPress={() => searchPostsByKeyword(searchKeyword)}
          />
        </View>
      )}

      <FlatList
        numColumns={3}
        data={posts}
        keyExtractor={(item) => item.postID}
        refreshing={false}
        onRefresh={() => console.log("Refreshed")}
        contentContainerStyle={{ flexGrow: 1 }}
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
    </LinearGradient>
  );
};

export default TabPosts;
