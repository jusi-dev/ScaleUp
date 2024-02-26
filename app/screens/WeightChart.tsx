import { Button, Dimensions, Text, View, StyleSheet, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdBanner from '../../components/AdBanner';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { ActivityIndicator} from 'react-native-paper';


const WeightChart = ({ user, actualWeight, weights, dates, setDates, setWeights }: any) => {
  let loadingData = false;

  useEffect(() => {
    getData()
    refetchData()
  }, [actualWeight])

  async function getData() {
    loadingData = true;
    while (!weights) {
      console.log('Waiting for data')
    }
    loadingData = false;
  }

  async function refetchData() {
    const docRef = doc(FIRESTORE_DB, "Users", user.uid);
    const docSnap = await getDoc(docRef);
    const weights = docSnap?.data()?.weightHistory;
    const dates = docSnap?.data()?.weightDates;
    if (weights) {
      setWeights(weights)
    }
    if (dates) {
      setDates(dates)
    }
  }

  function calculateChartWidth() {
    while (loadingData) {
      console.log('Waiting for data')
    }
    let width;
    let i = 1;
    for (i=1; i<weights.length; i++) {
      i+=1
    }
    if (i >= 4) {
      width = 100 * i
    } else {
      width = Dimensions.get('window').width - 80
    }

    return width;
  }

  return (
      <SafeAreaView style={styles.overviewContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoFront}>Scale</Text><Text style={styles.logoBack}>Up</Text>
          </View>
          <View>
            <Image source={require('../../assets/img/profilepicture.png')} style={{ width: 55, height: 55 }} />
          </View>
        </View>
        <View style={styles.weightContainer}>
          <Text style={styles.title}>Your weight {"\n"}progress</Text>
          {loadingData ?
          <View>
            <Text>Getting data...</Text>
            <ActivityIndicator size="large" color='#0000ff' />
          </View>
          :
          <ScrollView horizontal={true}>
            <LineChart
              data={{
                labels: dates,
                datasets: [
                  {
                    data: weights,
                    strokeWidth: 3
                  }
                ]
              }}
              width={calculateChartWidth()} // from react-native
              height={350}
              yAxisLabel=""
              yAxisSuffix=" kg"
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#ffa726",
                decimalPlaces: 1, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 20,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726"
                },
              }}
              style={{
                paddingTop: 20,
                borderRadius: 16
              }}
            />
          </ScrollView>
        }
        </View>
        <View style={styles.adBannerContainer}>
            <AdBanner />
        </View>
      </SafeAreaView>
    )
};

export default WeightChart;

const styles = StyleSheet.create({
  overviewContainer: {
      margin: 20,
      marginVertical: 13,
    },
  title: {
      color: '#FFF',
      fontSize: 24,
      fontWeight: '800',
      textAlign: 'left',
      marginBottom: 3,
  },
  subTitle: {
    color: '#FFF',
      fontSize: 17,
      fontWeight: '700',
      textAlign: 'left',
      marginBottom: 3,
      marginTop: 15
  },
  weightText: {
      color: '#FFF',
      fontSize: 50,
      fontWeight: '700',
      textAlign: 'center',
      marginTop: 15
  },
  weightLeft: {
      textAlign: 'center',
      color: '#FFF',
      fontWeight: '500',
      marginTop: 10
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
  weightContainer: {
    backgroundColor: '#FAA500',
    paddingTop: 25,
    marginTop: 30,
    borderRadius: 20,
    shadowColor: 'black',
    shadowRadius: 1,
    shadowOpacity: 0.2,
    shadowOffset: {width: -5, height: 5},
    padding: 20
  },
  adBannerContainer: {
    marginTop: 30
  },
})