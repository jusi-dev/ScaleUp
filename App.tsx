import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { View, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import Overview from './app/screens/Overview';
import Friends from './app/screens/Friends';
import AddWeight from './app/screens/AddWeight';
import WeightChart from './app/screens/WeightChart';
import AppSettings from './app/screens/AppSettings';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './app/screens/Login';
import { FIREBASE_AUTH, FIRESTORE_DB } from './firebaseConfig';
import { User, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import Profile from './app/screens/Profile';

import {
  CopilotProvider,
  CopilotStep,
  walkthroughable,
  useCopilot,
} from "react-native-copilot";

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    // console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}


const AddWeightButton = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('AddWeight');
  };

  return (
    <TouchableOpacity style={styles.addButtonContainer} onPress={handlePress}>
      <Image source={require('./assets/img/addBtn.png')} style={{ width: 80, height: 80 }} />
    </TouchableOpacity>
  );
};

export default function App() {

  // Notification setup

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      // console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function schedulePushNotification(notiHour: number, notiMinute : number) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "ScaleUp!",
        body: "It's your daily weight time! Go and stand on the scale. 😎",
        // data: { data: 'goes here' },
      },
      trigger: { 
        hour: notiHour,
        minute: notiMinute,
        repeats: true
      },
    });
  }

  async function cancelAllNotification() {
    Notifications.cancelAllScheduledNotificationsAsync()
  }


  // Define all states
  const [weight, setWeight] = useState(0);
  const [oldWeight, setOldWeight] = useState(0);
  const [aimWeight, setAimWeight] = useState(-1);
  const [weightProgess, setWeightProgess] = useState(0)
  const [activityLvl, setActivityLvl] = useState('Lightly active')
  const [goal, setGoal] = useState('Hold weight')
  const [notificationActive, setNotificationActive] = useState(false)
  const [notificationHour, setNotificationHour] = useState("00")
  const [notificationMinute, setNotificationMinute] = useState("00")
  const [sex, setSex] = useState('')
  const [name, setName] = useState('');
  const [heightInCm, setHeightInCm] = useState(0)
  const [age, setAge] = useState(0)
  const [weights, setWeights] = useState([0])
  const [dates, setDates] = useState([])
  const [weeklyWeight, setWeeklyWeight] = useState([0])
  const [weeklyWeightDates, setWeeklyWeightDates] = useState([""])
  const [weeklyWeightsAndDates, setWeeklyWeightsAndDates] = useState<any[]>([{}])
  const [skipCount, setSkipCount] = useState(true);

  const [login, setLogin] = useState(false)
  const [user, setUser] = useState<User | null>(null);

  const [showSplash, setShowSplash] = useState(true)
  const [emailCache, setEmailCache] = useState('');
  const [passwordCache, setPasswordCache] = useState('');
  const auth = FIREBASE_AUTH;

  function getCredentialsForUser() {
    AsyncStorage.getItem('email', (error, storedEmail) => {
        if (storedEmail) {
            setEmailCache(storedEmail)
        }
    })

    AsyncStorage.getItem('password', (error, storedPassword) => {
        if(storedPassword) {
            setPasswordCache(storedPassword);
        }
    })
  }

  // Inital tasks

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user)
    })
    getCredentialsForUser()
    // getWeightsFromThisWeek
  },[])

  useEffect(() => {
    if (skipCount) setSkipCount(false);
    if (!skipCount) getWeightsFromThisWeek();
    if (!skipCount) console.log(weeklyWeightsAndDates);
  }, [weights, dates])

  // Get all dates from this week in the format DD-MM-YYYY
  function getWeekDates() {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    const monday = new Date(today.setDate(diff));
    const weekDates = [];

    const options = { day: 'numeric', month: 'numeric', year: 'numeric', minimumIntegerDigits: 2 };

    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      const formattedDate = nextDay.toLocaleDateString('en-GB', options).split('/').join('-');
      weekDates.push(formattedDate);
    }
    return weekDates;
  }

  function getWeightsFromThisWeek() {
    while (!weights) {
      console.log("Waiting for weights")
    }
    const weekDates2 = getWeekDates();
    const duplicates : any[] = [];
    const indexes : number[] = [];
    const weekWeights : number[] = [];
    const weekWeightsDates : string[] = [];
    const wWaD : any[] = [];
    let id : number = 0;
    dates.forEach((date, index) => {
      if (weekDates2.includes(date)) {
        duplicates.push({ date, index });
        indexes.push(index);
        weekWeightsDates.push(date);
        wWaD.push({ id: id, date: date, weight: weights[index] })
        id++;
      }
    });
    // weeklyWeightsAndDates.push(wWaD);
    setWeeklyWeightsAndDates(wWaD)
    setWeeklyWeightDates(weekWeightsDates)

    indexes.forEach((index) => {
      weekWeights.push(weights[index]);
    })
    setWeeklyWeight(weekWeights)
  };

  // Auto sign in

  useEffect(() => {
    getData()
  }, [user])

  useEffect(() => {
      if (emailCache && passwordCache) {
          try {
              // console.log("getting credentials")
              const response = signInWithEmailAndPassword(auth, emailCache, passwordCache)
          } catch (error) {
              alert(error)
          } finally {
              // console.log("Logged in user automatically")
          }
      } else {
          // console.log("Didn't found credentials")
          setShowSplash(false)
      }
  }, [emailCache, passwordCache])

  // Calculate weight progress

  useEffect(() => {
    calucateWeightProgress()
  }, [weight, oldWeight, aimWeight])

  function calucateWeightProgress() {
    setWeightProgess(((weight - oldWeight) / (aimWeight - oldWeight)))
  }

  // Get user data

  async function getData() {
    if (user) {
      console.log("Getting user data")
      const docRef = doc(FIRESTORE_DB, "Users", user.uid);
      const docSnap = await getDoc(docRef);

      const name = docSnap?.data()?.name;
      const gender = docSnap?.data()?.gender;
      const age = docSnap?.data()?.age;
      const height = docSnap?.data()?.height;
      const startWeight = docSnap?.data()?.startWeight;
      const aimWeight = docSnap?.data()?.aimWeight;
      const goal = docSnap?.data()?.goal;
      const activityLvl = docSnap?.data()?.activityLvl;
      const notiActive = docSnap?.data()?.notificationActive;
      const notiHour = docSnap?.data()?.notificationHour;
      const notiMinute = docSnap?.data()?.notificationMinute;
      const weights = docSnap?.data()?.weightHistory;
      const dates = docSnap?.data()?.weightDates;

      if (name) {
        setName(name)
      }
      if (gender) {
        setSex(gender)
      }
      if (age) {
        setAge(age)
      }
      if (height) {
        setHeightInCm(height)
      }
      if (startWeight) {
        setOldWeight(startWeight)
      }
      if (aimWeight) {
        setAimWeight(aimWeight)
      }
      if (goal) {
        setGoal(goal)
      }
      if (activityLvl) {
        setActivityLvl(activityLvl)
      }
      if (notiActive) {
        setNotificationActive(notiActive)
      }
      if (notiHour) {
        setNotificationHour(notiHour)
      }
      if (notiMinute) {
        setNotificationMinute(notiMinute)
      }
      if (weights) {
        setWeights(weights)
      }
      if (dates) {
        setDates(dates)
      }

      setShowSplash(false)
    }
  }



  const theme = useTheme();
  theme.colors.secondaryContainer = "transperent"

  return (
    !user 
    ?
    showSplash ?  
      <Image 
        source={require('./assets/splash.png')}
      />
      :
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'>
          <Stack.Screen name='Login' children={() => <Login showSplas={showSplash} setShowSplash={setShowSplash}/>} options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    :
    showSplash ?  
      <Image 
        source={require('./assets/splash.png')}
      />
      :
    <CopilotProvider stopOnOutsideClick androidStatusBarVisible>
    <>
    <NavigationContainer>
      <View style={styles.container}>
        <Tab.Navigator
          initialRouteName="Home"
          activeColor="#7DFF2D"
          inactiveColor="white"
          barStyle={styles.tabBar}
          shifting={false}
          labeled={false}
        >
          <Tab.Screen
            name="Home"
              children={()=><Overview 
                              weight={weight} 
                              weightProgess={weightProgess} 
                              name={name}
                              heightInCm={heightInCm}
                              oldWeight={oldWeight}
                              aimWeight={aimWeight}
                              sex={sex}
                              age={age}
                              activityLvl={activityLvl}
                              goal={goal}
                              user={user}
                              setWeight={setWeight}
                              expoToken={expoPushToken}
                              cancelAllNotification={cancelAllNotification}
                              setShowSplash={setShowSplash}
                              weeklyWeight={weeklyWeight}
                              weeklyWeightDates={weeklyWeightDates}
                              weeklyWeightsAndDates={weeklyWeightsAndDates}
                            />}
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="person" color={color} size={30} />
              ),
            }}
          />
          <Tab.Screen
            name="Chart"
              children={() => <WeightChart 
                                user={user}
                                actualWeight={weight} 
                                weights={weights}
                                dates={dates}
                                setWeights={setWeights}
                                setDates={setDates}
                              />}
            options={{
              tabBarIcon: ({ color }) => (
                <AntDesign name="linechart" color={color} size={30} />
              ),
            }}
          />
          <Tab.Screen 
            name="AddWeight" 
              children={()=><AddWeight setWeight={setWeight} user={user}/>}
            options={{
              tabBarIcon: ({color}) => (
                <View
                  style={{
                    height: 10,
                    width: 10,
                  }}
                >
                </View>
                
              ),
            }}
          />
          <Tab.Screen
            name="Friends"
            component={Friends}
            options={{
              tabBarIcon: ({ color }) => (
                <FontAwesome5 name="user-friends" size={26} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Settings"
              children={()=><AppSettings 
                              name={name} 
                              setName={setName}
                              heightInCm={heightInCm}
                              setHeightInCm={setHeightInCm}
                              oldWeight={oldWeight}
                              setOldWeight={setOldWeight}
                              aimWeight={aimWeight}
                              setAimWeight={setAimWeight}
                              weight={weight}
                              setWeight={setWeight}
                              activityLvl={activityLvl}
                              setActivityLvl={setActivityLvl}
                              goal={goal}
                              setGoal={setGoal}
                              sex={sex}
                              setSex={setSex}
                              age={age}
                              setAge={setAge}
                              notificationActive={notificationActive}
                              setNotificationActive={setNotificationActive}
                              notificationHour={notificationHour}
                              setNotificationHour={setNotificationHour}
                              notificationMinute={notificationMinute}
                              setNotificationMinute={setNotificationMinute}
                              schedulePushNotification={schedulePushNotification}
                              cancelAllNotification={cancelAllNotification}
                              user={user}
                            />}
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="settings" size={26} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
        <AddWeightButton />
      </View>
    </NavigationContainer>
    </>
    </CopilotProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: '#5CB724',
    height: 90,
    elevation: 8,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonContainer: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'transparent',
    bottom: 40,
    zIndex: 10,
  },
});
