import { View, Text } from "react-native";
import styles from "./MapTooltip.scss";
import { sportTypeIconMap } from "../SportSelect/data";
import { SportType } from "../../common/types";
import React from "react";

interface MapTooltipProps {
  sportType: SportType;
  title: string;
}

export default function MapTooltip({ sportType, title }: MapTooltipProps) {
  const sportTypeIcon = React.cloneElement(sportTypeIconMap[sportType], {
    style: { ...sportTypeIconMap[sportType].props.style, fontSize: 18 },
  });
  return (
    <View style={styles.calloutContainer}>
      {sportTypeIcon}
      <Text style={styles.calloutDescription}>{title}</Text>
    </View>
  );
}
