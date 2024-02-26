import { Button, SafeAreaView, Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import WeightOverview from '../../components/WeightOverview';
import WeeklyWeight from '../../components/WeeklyWeight';
import BMIOverview from '../../components/BMIOverview';
import { Firestore, addDoc, collection, deleteDoc, onSnapshot, updateDoc, setDoc, doc, arrayUnion, getDoc } from 'firebase/firestore'
import { FIRESTORE_DB } from '../../firebaseConfig';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  CopilotProvider,
  CopilotStep,
  walkthroughable,
  useCopilot,
} from "react-native-copilot";

  const WalkthroughableText = walkthroughable(Text);
  const WalkthroughableImage = walkthroughable(Image);

const Overview = ({ weight, weightProgess, name, heightInCm, oldWeight, aimWeight, sex, age, activityLvl, goal, user, setWeight, 
                    sendPush, expoToken, cancelAllNotification, setShowSplash, weeklyWeight, weeklyWeightDates, weeklyWeightsAndDates
                  }: any) => {
  const [avgWeight, setAvgWeight] = useState("")
  const navigation = useNavigation();
  const [firstRender, setFirstrender] = useState(true);

  const docRef = doc(FIRESTORE_DB, "Users", user.uid);

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    firstRender ? setFirstrender(false) : calculateWeightDifference()
  }, [weeklyWeight])

  async function getData() {
    const docSnap = await getDoc(docRef);
    const actualWeight = docSnap?.data()?.actualWeight;
    if (actualWeight) {
      setWeight(actualWeight)
    }
  }

  const calculateWeightDifference = () => {
    const average = weeklyWeight.reduce((a, b) => a + b, 0) / weeklyWeight.length;
    const weightDifference = weeklyWeight[0] > average ? ((weeklyWeight[0]) - average).toFixed(2) : "+" + (average - weeklyWeight[0]).toFixed(2)
    setAvgWeight(weightDifference)
  }

  const { start, copilotEvents } = useCopilot();
  const [secondStepActive, setSecondStepActive] = useState(true);
  const [lastEvent, setLastEvent] = useState("");

  useEffect(() => {
    copilotEvents.on("stepChange", (step : any) => {
      setLastEvent(`stepChange: ${step.name}`);
    });
    copilotEvents.on("start", () => {
      setLastEvent(`start`);
    });
    copilotEvents.on("stop", () => {
      setLastEvent(`stop`);
    });
  }, [copilotEvents]);

  return (
      <SafeAreaView style={[styles.overviewContainer, { zIndex: -10}]}>
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoFront}>Scale</Text><Text style={styles.logoBack}>Up</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Friends')}>
            <View>
              <Image source={require('../../assets/img/profilepicture.png')} style={{ width: 55, height: 55 }} />
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.welcomeText}>Hey {name},</Text>
        </View>

        <CopilotStep
        text="Hey! This is the first step of the tour!"
        order={1}
        name="openApp"
        >
          <WeightOverview 
            actualWeight={weight}
            oldWeight={oldWeight}
            aimWeight={aimWeight}
            weightProgress={weightProgess}
            avgWeight={avgWeight}
            sex={sex}
            heightInCm={heightInCm}
            age={age}
            activityLvl={activityLvl}
            goal={goal}
          />
        </CopilotStep>
        <View style={styles.weeklyAndBMIContainer}>
          <CopilotStep
          text="Hey! This is the first step of the tour!"
          order={2}
          name="open"
          >
            <WeeklyWeight 
              weeklyWeightsAndDates={weeklyWeightsAndDates}
            />
          </CopilotStep>
          <BMIOverview 
            height={heightInCm}
            weight={weight}
          />
        </View>
      </SafeAreaView>
    )
};

export default Overview;

const styles = StyleSheet.create({
  overviewContainer: {
    margin: 20,
    marginVertical: 60
  },
  headerContainer: {
    flexDirection: 'row'
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  logoFront: {
    fontSize: 35,
    fontWeight: '900',
    color: '#5CB724'
  },
  logoBack: {
    fontSize: 35,
    fontWeight: '900',
    color: '#FAA500'
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2D2B2B',
    marginTop: 15
  },
  weeklyAndBMIContainer: {
    flexDirection: 'row'
  }
})