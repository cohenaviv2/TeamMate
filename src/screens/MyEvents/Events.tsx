import {  Text } from 'react-native'
import React from 'react'
import Layout from "../../components/Layout/Layout";

export default function EventsScreen({ navigation }: { navigation: any }) {
  return (
    <Layout navigation={navigation}>
      <Text>Events</Text>
    </Layout>
  );
}