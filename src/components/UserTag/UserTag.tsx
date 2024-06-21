import { View, Text, Image } from 'react-native'
import styles from "./UserTag.scss"
import { IUserDetails } from '../../common/types'

interface UserTagProps {
    user:IUserDetails;
}

export default function UserTag({user}:UserTagProps) {
  const {fullName,imageUrl,id} = user;
  return (
    <View style={styles.userBox}>
        <Image source={{uri:imageUrl}} style={styles.userImage} />
      <Text style={styles.nameText}>{fullName}</Text>
    </View>
  )
}