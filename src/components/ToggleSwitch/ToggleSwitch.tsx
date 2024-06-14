import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import styles from "./ToggleSwitch.scss";

interface ToggleSwitchProps {
  initial?: boolean;
  onToggle: (isEnabled: boolean) => void;
  firstLabel?: string;
  secondLabel?: string;
  firstIcon?: React.JSX.Element;
  secondIcon?: React.JSX.Element;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ initial = false, onToggle, firstLabel, secondLabel, firstIcon, secondIcon }) => {
  const [isEnabled, setIsEnabled] = useState(initial);

  const toggleSwitch = () => {
    setIsEnabled((prev) => {
      const newValue = !prev;
      onToggle(newValue);
      return newValue;
    });
  };

  return (
    <TouchableOpacity onPress={toggleSwitch} style={[styles.switchContainer, isEnabled ? styles.enabled : styles.disabled]} activeOpacity={0.7}>
      <View style={styles.labelsBox}>
        <View style={styles.labelBox}>
          {firstIcon && firstIcon}
          {firstLabel && <Text style={styles.label}>{firstLabel}</Text>}
        </View>

        <View style={styles.labelBox}>
          {secondIcon && secondIcon}
          {secondLabel && <Text style={styles.label}>{secondLabel}</Text>}
        </View>
      </View>
      <View style={[styles.toggleCircle, isEnabled ? styles.enabledCircle : styles.disabledCircle]} />
    </TouchableOpacity>
  );
};

export default ToggleSwitch;
