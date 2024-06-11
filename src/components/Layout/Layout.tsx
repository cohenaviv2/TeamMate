import React, { ReactNode } from "react";
import { View, Text, Image } from "react-native";
import styles from "./Layout.scss";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <View style={styles.layout}>
      <View style={styles.logoHeader}>
        <Image source={require("../../assets/images/logo.png")} style={styles.logo}></Image>
      </View>
      {children}
    </View>
  );
}
