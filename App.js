import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

const App = () => {

  return (
    <View style={styles.container}>
      <View style={styles.cityCon}>
        <Text style={styles.city}>Suwon</Text>
      </View>
      <View style={styles.regDateCon}>
        <Text style={styles.regDate}>12월 29일, 월, 22:32</Text>
      </View>
      <ScrollView
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        <View style={styles.weatherInner}>
          <View style={styles.day}>
            
            <Text style={styles.desc}>맑음</Text>
          </View>
          <View style={styles.tempCon}>
            <Text style={styles.temp}>-1</Text>
          </View>
        </View>

        <View style={styles.weatherInner}>
          <View style={styles.day}>
            <Text style={styles.desc}>맑음</Text>
          </View>
          <View style={styles.tempCon}>
            <Text style={styles.temp}>-1</Text>
          </View>
        </View>

        <View style={styles.weatherInner}>
          <View style={styles.day}>
            <Text style={styles.desc}>맑음</Text>
          </View>
          <View style={styles.tempCon}>
            <Text style={styles.temp}>-1</Text>
          </View>
        </View>

        <View style={styles.weatherInner}>
          <View style={styles.day}>
            <Text style={styles.desc}>맑음</Text>
          </View>
          <View style={styles.tempCon}>
            <Text style={styles.temp}>-1</Text>
          </View>
        </View>
      </ScrollView>
      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe01a'
  },
  cityCon: {
    flex: 0.3,
  },
  city: {
    flex: 1,
    marginTop: 50,
    paddingTop: 20,
    fontSize: 40,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  regDateCon: {
    alignItems: 'center',
  },
  regDate: {
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 15,
    backgroundColor: 'black',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: 20,
    overflow: 'hidden',
  },
  weather: {
  },
  weatherInner: {
    flex: 3,
    width: SCREEN_WIDTH,
  },
  day: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  desc: {
    flex: 1.5,
    marginTop: 20,
    fontSize: 25,
    fontWeight: 'bold',
  },
  tempCon: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  temp: {
    fontSize: 120,
  }
});

export default App;