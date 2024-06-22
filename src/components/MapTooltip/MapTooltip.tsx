import { View, Text } from 'react-native'
import styles from "./MapTooltip.scss"
import { sportTypeIconMap } from '../SportSelect/data';
import { SportType } from '../../common/types';

interface MapTooltipProps {
    sportType:SportType;
    title:string;
}

export default function MapTooltip({sportType,title}:MapTooltipProps) {
  return (
    <View style={styles.calloutContainer}>
      {sportTypeIconMap[sportType]}
      <Text style={styles.calloutDescription}>{title}</Text>
    </View>
  );
}