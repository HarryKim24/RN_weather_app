import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { weatherDescMap, weatherIconMap } from './WeatherDescKo';

import * as Location from 'expo-location';

const SCREEN_WIDTH = Dimensions.get('window').width;

const myApiKey = process.env.EXPO_PUBLIC_GOOGLE_GEOLOCATION_API_KEY;

const App = () => {

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [permitted, setPermitted] = useState(true);

  const [city, setCity] = useState(null);
  const [dailyWeather, setDailyWeather] = useState([]);

  const locationData = async() => {
    const { granted } = await Location.requestForegroundPermissionsAsync();

    if (!granted) {
      setPermitted(false);
      setErrorMsg('위치에 대한 권한 부여가 거부되었습니다.');

      return;
    };

    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${myApiKey}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    const dataRs = data.results[7];
    const addressComponents = dataRs.address_components[0];
    const cityAddress = addressComponents.short_name;
    setCity(cityAddress);

    const weatherApiUrl =`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Asia/Seoul`;
    const respToWeather = await fetch(weatherApiUrl);
    const jsonForWeather = await respToWeather.json();
    setDailyWeather(jsonForWeather);
  }

  useEffect(() => {
    locationData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.cityCon}>
        <Text style={styles.city}>{city}</Text>
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
        {!dailyWeather.daily ? (
          <View style={styles.weatherInner}>
            <ActivityIndicator size='large' color='#000' />
          </View>
        ) : (
          dailyWeather.daily.time.map((day, index) => (
            <View key={index} style={styles.weatherInner}>
              <View style={styles.day}>
                <Text style={styles.desc}>
                  {weatherDescMap[dailyWeather.daily.weathercode[index]]}
                  <MaterialCommunityIcons
                    name={weatherIconMap[dailyWeather.daily.weathercode[index]]}
                    size={33}
                    color='#000'
                    style={{ paddingLeft: 10 }}
                  />
                </Text>
              </View>
              <View style={styles.tempCon}>
                <Text style={styles.temp}>
                  {Math.round(dailyWeather.daily.temperature_2m_max[index])}
                </Text>
                <Text style={{ fontSize: 100, fontWeight: 900, position: 'absolute', top: 65, right: 50 }}>°</Text>
              </View>
            </View>
          ))
        )} 
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
    flex: 0.15,
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
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  temp: {
    fontSize: 200,
  }
});

export default App;