import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function App() {

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'red' }}></View>
      <View style={{ flex: 2, backgroundColor: 'darkorange' }}></View>
      <View style={{ flex: 3, backgroundColor: 'green' }}></View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({});
