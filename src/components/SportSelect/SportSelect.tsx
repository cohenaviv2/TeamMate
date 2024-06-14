import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, PanResponder, Animated } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SportType, sportTypeList } from "../../common/types";
import styles from "./SportSelect.scss";
import { sportTypeIconMap } from "./data";

interface SportSelectProps {
  onChange: (sportType: SportType) => void;
  theme: "primary" | "secondary";
  initialVal?: SportType;
}

const SportSelect: React.FC<SportSelectProps> = ({ onChange, theme, initialVal }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialVal ? sportTypeList.indexOf(initialVal) : 0);
  const [sportType, setSportType] = useState<SportType>(sportTypeList[currentIndex]);
  const translateX = useState(new Animated.Value(0))[0];

  useEffect(() => {
    setSportType(sportTypeList[currentIndex]);
    onChange(sportTypeList[currentIndex]);
  }, [currentIndex]);

  const panResponder = useState(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 5;
      },
      onPanResponderMove: (evt, gestureState) => {
        translateX.setValue(gestureState.dx * 0.1);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50) {
          handlePrev();
        } else if (gestureState.dx < -50) {
          handleNext();
        } else {
          resetPosition();
        }
      },
    })
  )[0];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + sportTypeList.length) % sportTypeList.length);
    resetPosition();
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sportTypeList.length);
    resetPosition();
  };

  const resetPosition = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View {...panResponder.panHandlers} style={styles.box}>
      <TouchableOpacity style={styles.button} onPress={handlePrev}>
        <MaterialIcons name="arrow-back-ios-new" style={theme === "primary" ? styles.buttonIcon : styles.buttonIcon2} />
      </TouchableOpacity>
      <Animated.View style={[theme === "primary" ? styles.sportBox : styles.sportBox2, { marginLeft: 10, marginRight: 10, transform: [{ translateX }] }]}>
        {sportTypeIconMap[sportType]}
        <Text style={[theme === "primary" ? styles.sportText : styles.sportText2, { marginLeft: 5, marginRight: 5 }]}>{sportType}</Text>
      </Animated.View>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <MaterialIcons name="arrow-forward-ios" style={theme === "primary" ? styles.buttonIcon : styles.buttonIcon2} />
      </TouchableOpacity>
    </View>
  );
};

export default SportSelect;
