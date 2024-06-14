import {  Text, TouchableOpacity, View } from 'react-native'
import { AuthService } from '../../services/AuthService';
import Layout from "../../components/Layout/Layout";
import styles from "./Profle.scss"

export default function ProfileScreen({ navigation }: { navigation: any }) {
    const handleLogout = async () => {
      try {
        await AuthService.logout();
      } catch (error) {
        console.log(error);
      }
    };
  
  return (
    <Layout navigation={navigation}>
      <View style={styles.profileBox}>
        <Text style={{ fontSize: 30 }}>Profile</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
}