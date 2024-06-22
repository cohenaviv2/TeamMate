import { View, Image } from 'react-native'
import Octicons from "@expo/vector-icons/Octicons";
import styles from "./LoadingBox.scss"
import Spinner from '../Spinner/Spinner';

interface LoadingBoxProps {
    success:boolean;
}

export default function LoadingBox({success}:LoadingBoxProps) {
  return (
    <View style={styles.loadingBox}>
      <Image source={require("../../assets/images/logo2.png")} style={styles.logo} />
      <View style={styles.spinnerBox}>{success ? <Octicons name="check-circle-fill" style={styles.successIcon} /> : <Spinner size="l" theme="primary" />}</View>
    </View>
  );
}