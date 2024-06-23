import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import styles from "./CustomAlert.scss";

interface Button {
  text: string;
  onPress: () => void;
  style?: any;
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  content: string;
  buttons: Button[];
  onClose: () => void;
}

const CustomAlert = ({ visible, title, content, buttons, onClose }: CustomAlertProps) => {
  return (
    <Modal transparent={true} animationType="slide" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.title}>{title}</Text>
          <Text style={[styles.content,{textAlignVertical:"center"}]}>{content}</Text>
          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity key={index} style={[styles.button, button.style]} onPress={button.onPress}>
                <Text style={styles.buttonText}>{button.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
