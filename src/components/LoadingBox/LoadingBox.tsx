import { View, Image } from 'react-native'
import Octicons from "@expo/vector-icons/Octicons";
import styles from "./LoadingBox.scss"
import Spinner from '../Spinner/Spinner';

interface LoadingBoxProps {
    success:boolean;
    useDefaultBackgroud?:boolean;
}

export default function LoadingBox({ success, useDefaultBackgroud }: LoadingBoxProps) {
  return (
    <View style={useDefaultBackgroud ? styles.primaryLoadingBox : styles.loadingBox}>
      <Image source={require("../../assets/images/logo2.png")} style={styles.logo} />
      <View style={styles.spinnerBox}>{success ? <Octicons name="check-circle-fill" style={styles.successIcon} /> : <Spinner size="l" theme={useDefaultBackgroud ? "secondary" : "primary"} />}</View>
    </View>
  );
}