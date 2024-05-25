import { Text, Button } from 'react-native'
import React from 'react'
import Layout from '../../components/Layout/Layout';

export default function HomeScreen({ navigation }: { navigation: any }) {
  return (
    <Layout>
      <Text>Login</Text>
      <Button title='Go To Settings' onPress={()=>navigation.navigate("Settings")} />
    </Layout>
  );
}