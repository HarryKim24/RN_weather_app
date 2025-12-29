import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {

  return (
    <View style={styles.container}>
      <Text style={{ ...styles.text, color: 'blue' }}>리액트 네이티브</Text>
      <Text style={{ ...styles.text }}>리액트 네이티브</Text>
      {/* <StatusBar backgroundColor='red' barStyle='dark-content' hidden={true} /> */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 50,
    color: 'red',
    fontWeight: 'bold',
  }
});
