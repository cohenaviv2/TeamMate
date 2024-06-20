import { View, Text, Image } from 'react-native'
import styles from "./UserTag.scss"

interface UserTagProps {
    fullName:string;
    imageUrl:string;
    id:string;
}

export default function UserTag({fullName,imageUrl}:UserTagProps) {
  return (
    <View style={styles.userBox}>
        <Image source={{uri:imageUrl}} style={styles.userImage} />
      <Text style={styles.nameText}>{fullName}</Text>
    </View>
  )
}