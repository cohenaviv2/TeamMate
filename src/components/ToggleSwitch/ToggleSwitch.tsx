import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import styles from "./ToggleSwitch.scss";

interface ToggleSwitchProps {
  labels: string[];
  showLabels:boolean;
  icons?: React.JSX.Element[];
  onToggle: (label: string) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ onToggle, labels, icons, showLabels }) => {
  const [selectedLabel, setSelectedLabel] = useState<string>(labels[0]);

  const toggleSwitch = (label: string) => {
    setSelectedLabel(label);
    onToggle(label);
  };

  const width = (100 / labels.length).toString();
  return (
    <View style={styles.switchContainer}>
      <View style={styles.labelsBox}>
        {labels.map((label, index) => (
          <TouchableOpacity style={[label === selectedLabel ? styles.selectedLabelBox : styles.labelBox, { width: `${width}%` }]} key={index} onPress={() => toggleSwitch(label)} activeOpacity={0.7}>
            {icons && icons[index]}
            {showLabels && <Text style={styles.label}>{label}</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ToggleSwitch;
