import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import { weatherMap } from './WeatherDescKo';
import * as Location from 'expo-location';

const SCREEN_WIDTH = Dimensions.get('window').width;
const myApiKey = process.env.EXPO_PUBLIC_GOOGLE_GEOLOCATION_API_KEY;

const useRegDate = () => {
  const [currentDate, setCurrentDate] = useState(null);

  useEffect(() => {
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let date2 = date.getDate();
    let day = date.getDay();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    const ampm = hours > 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;

    const hoursString = hours < 10 ? `0${hours}` : hours;
    const minutesString = minutes < 10 ? `0${minutes}` : minutes;

    const dayOfTheWeek = ['일', '월', '화', '수', '목', '금', '토'];

    const formattedDate = `${year}, ${month}월 ${date2}일 ${hoursString}:${minutesString}${ampm}, ${dayOfTheWeek[day]}`;
    setCurrentDate(formattedDate);
  }, []);

  return currentDate;
};

const App = () => {
  const [city, setCity] = useState(null);
  const [dailyWeather, setDailyWeather] = useState([]);
  const currentDate = useRegDate();

  const locationData = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) return;

    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${myApiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    const cityAddress =
      data.results?.[7]?.address_components?.[0]?.short_name;
    setCity(cityAddress);

    const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=precipitation_probability,visibility,windspeed&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Asia/Seoul`;

    const respToWeather = await fetch(weatherApiUrl);
    const jsonForWeather = await respToWeather.json();
    setDailyWeather(jsonForWeather);
  };

  useEffect(() => {
    locationData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.cityCon}>
        <Text style={styles.city}>{city}</Text>
      </View>

      <View style={styles.regDateCon}>
        <Text style={styles.regDate}>{currentDate}</Text>
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {!dailyWeather.daily ? (
          <View style={styles.weatherInner}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : (
          dailyWeather.daily.time.map((day, index) => {
            const dayOfMonth = Number(day.split('-')[2]);

            const dayHourlyIndexes = dailyWeather.hourly.time
              .map((t, i) => (t.startsWith(day) ? i : null))
              .filter(i => i !== null);

            const dayPrecipitation = dayHourlyIndexes.length
              ? Math.max(
                  ...dayHourlyIndexes.map(
                    i => dailyWeather.hourly.precipitation_probability[i]
                  )
                )
              : null;

            const dayVisibility = dayHourlyIndexes.length
              ? dayHourlyIndexes.reduce(
                  (sum, i) => sum + dailyWeather.hourly.visibility[i],
                  0
                ) / dayHourlyIndexes.length
              : null;

            const dayWindSpeed = dayHourlyIndexes.length
              ? dayHourlyIndexes.reduce(
                  (sum, i) => sum + dailyWeather.hourly.windspeed[i],
                  0
                ) / dayHourlyIndexes.length
              : null;

            const code = Number(dailyWeather.daily.weathercode[index]);
            const weather = weatherMap[code] ?? {
              desc: '알 수 없음',
              icon: 'weather-cloudy-alert',
            };

            return (
              <View key={index} style={styles.weatherInner}>
                <View style={styles.day}>
                  <View style={styles.descRow}>
                    <Text style={styles.desc}>{weather.desc}</Text>
                    <MaterialCommunityIcons
                      name={weather.icon}
                      size={33}
                      color="#000"
                      style={{ marginLeft: 10 }}
                    />
                  </View>
                </View>

                <View style={styles.tempCon}>
                  <Text style={styles.temp}>
                    {Math.round(dailyWeather.daily.temperature_2m_max[index])}
                  </Text>
                  <Text style={styles.degree}>°</Text>
                </View>

                <View style={styles.forecastCon}>
                  <View style={styles.forecastTextBox}>
                    <Text style={styles.forecastTitle}>Week Forecast</Text>
                    <Text style={styles.weekDayText}>{dayOfMonth}th</Text>
                  </View>

                  <View style={styles.infoBox}>
                    <View style={styles.infoInner}>
                      <Feather name="wind" size={40} color="#fff" />
                      <Text style={styles.infoValue}>
                        {dayWindSpeed !== null
                          ? `${dayWindSpeed.toFixed(0)} km/h`
                          : '-'}
                      </Text>
                      <Text style={styles.infoLabel}>풍속</Text>
                    </View>

                    <View style={styles.infoInner}>
                      <Ionicons name="water-outline" size={40} color="#fff" />
                      <Text style={styles.infoValue}>
                        {dayPrecipitation !== null
                          ? `${dayPrecipitation}%`
                          : '-'}
                      </Text>
                      <Text style={styles.infoLabel}>강수확률</Text>
                    </View>

                    <View style={styles.infoInner}>
                      <Feather name="eye" size={40} color="#fff" />
                      <Text style={styles.infoValue}>
                        {dayVisibility !== null
                          ? `${(dayVisibility / 1000).toFixed(1)} km`
                          : '-'}
                      </Text>
                      <Text style={styles.infoLabel}>시야</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe01a',
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
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'black',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: 20,
    overflow: 'hidden',
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
  descRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  desc: {
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
  },
  forecastCon: {
    flex: 0.6,
    alignItems: 'center',
  },
  forecastTextBox: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  forecastTitle: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  weekDayText: {
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
    height: '100%',
    textAlign: 'right',
    paddingTop: 10,
    paddingRight: 10,
  },
  infoBox: {
    flex: 0.6,
    backgroundColor: 'black',
    width: '80%',
    borderRadius: 10,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  infoInner: {
    width: '30%',
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoValue: {
    fontSize: 20,
    color: '#fff',
    paddingTop: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: '#fff',
    paddingTop: 10,
  },
  degree: {
    position: 'absolute',
    top: 65,
    right: 50,
    fontSize: 100,
    fontWeight: '900',
  },
});

export default App;