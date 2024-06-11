import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SportType, sportTypeList } from "../../common/types";
import { AntDesign } from "@expo/vector-icons";
import styles from "./SportSelect.scss";
import { sportTypeIconMap } from "./data";

interface SportSelectProps {
  onChange: (sportType: SportType) => void;
}

export default function SportSelect({ onChange }: SportSelectProps) {
  const [sportType, setSportType] = useState<SportType>(sportTypeList[0]);

  const handlePrev = () => {
    const currentIndex = sportTypeList.indexOf(sportType);
    const prevIndex =
      (currentIndex - 1 + sportTypeList.length) % sportTypeList.length;
    const newSportType = sportTypeList[prevIndex];
    setSportType(newSportType);
    onChange(newSportType);
  };

  const handleNext = () => {
    const currentIndex = sportTypeList.indexOf(sportType);
    const nextIndex = (currentIndex + 1) % sportTypeList.length;
    const newSportType = sportTypeList[nextIndex];
    setSportType(newSportType);
    onChange(newSportType);
  };

  return (
    <View style={styles.box}>
      <TouchableOpacity style={styles.button} onPress={handlePrev}>
        <AntDesign name="caretleft" style={styles.buttonIcon} />
      </TouchableOpacity>
      <View style={styles.sportBox}>
        {sportTypeIconMap[sportType]}
        <Text style={styles.sportText}>{sportType}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <AntDesign name="caretright" style={styles.buttonIcon} />
      </TouchableOpacity>
    </View>
  );
}
