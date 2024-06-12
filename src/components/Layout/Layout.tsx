import React, { ReactNode, useContext } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "./Layout.scss";
import { AuthContext } from "../../context/AuthProvider";
import Spinner from "../Spinner/Spinner";

interface LayoutProps {
  children: ReactNode;
  navigation: any;
}

export default function Layout({ children, navigation }: LayoutProps) {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    return <Spinner size="l" />;
  }
  const { currentUser, loading } = authContext;
  return (
    <>
      {loading ? (
        <Spinner size="l" />
      ) : (
        <View style={styles.layout}>
          <View style={styles.logoHeader}>
            <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
            {currentUser && (
              <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                <Image source={{ uri: currentUser.dbUser.imageUrl }} style={styles.userImage} />
              </TouchableOpacity>
            )}
          </View>
          {children}
        </View>
      )}
    </>
  );
}
