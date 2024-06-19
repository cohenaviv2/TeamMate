import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import styles from "./NumberInput.scss";

interface NumberInputProps {
  min: number;
  max: number;
  initialVal?: string | number;
  onChange: (val: number | undefined) => void;
}

const NumberInput = ({ min, max, initialVal, onChange }: NumberInputProps) => {
  const [number, setNumber] = useState(min);
  const [displayInitialVal, setDisplayInitVal] = useState(initialVal !== undefined);

  function handleDecrease() {
    if (number == min && initialVal) {
      setDisplayInitVal(true);
      onChange(undefined);
    } else if (number > min) {
      const newNumber = number - 1;
      setNumber(newNumber);
      onChange(newNumber);
    }
  }

  function handleIncrease() {
    if (displayInitialVal) {
      setDisplayInitVal(false);
      onChange(number);
    } else if (number < max) {
      const newNumber = number + 1;
      setNumber(newNumber);
      onChange(newNumber);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, { marginRight: "auto" }]} onPress={handleDecrease} activeOpacity={0.6}>
        <FontAwesome5 name="minus" style={styles.icon} />
      </TouchableOpacity>
      <Text style={displayInitialVal ? styles.initValueText : styles.valueText}>{displayInitialVal ? initialVal : number}</Text>
      <TouchableOpacity style={[styles.button, { marginLeft: "auto" }]} onPress={handleIncrease} activeOpacity={0.6}>
        <FontAwesome5 name="plus" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

export default NumberInput;
