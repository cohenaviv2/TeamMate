import React, { ReactNode, useContext, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "./Layout.scss";
import { AuthContext } from "../../context/AuthProvider";
import Spinner from "../Spinner/Spinner";
import Loading from "../../screens/Loading/Loading";

interface LayoutProps {
  children: ReactNode;
  navigation: any;
  loading?:boolean;
}

export default function Layout({ children, navigation, loading }: LayoutProps) {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    return <Loading spinnerSize="l" />;
  }
  const { currentUser, loading: authLogin } = authContext;
  return (
    <View style={styles.layout}>
      <View style={styles.logoHeader}>
        <View style={styles.headerBox}>
          <Image source={require("../../assets/images/logo2.png")} style={styles.logo} />
        </View>
        <TouchableOpacity onPress={() => currentUser && navigation.navigate("Profile")} style={styles.headerBox}>
          {loading ? (
            <View style={styles.spinnerBox}>
              <Spinner size="m" theme="primary" />
            </View>
          ) : currentUser ? (
            <Image source={{ uri: currentUser.dbUser.imageUrl }} style={styles.userImage} />
          ) : (
            <></>
          )}
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
}
