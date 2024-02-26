import { Button, Text, View, Image, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

const Friends = ({ navigation }: any) => {
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
        <View style={styles.friendsContainer}>
          <View>
            <Text style={styles.header}>We are just as excited{"\n"}as you are!</Text>
            <Text style={styles.subHeader}>But unfortunately we also have to wait...</Text>
          </View>
          <View style={styles.introductionContainer}>
            <Text style={styles.introduction1}>Here we present the biggest feature of our app!</Text>
            <Text style={styles.introduction}>The friends and profile function contains:</Text>
          </View>
          <Text style={styles.bulletPoints}>
            - Create your own profile. {"\n"}
            - Add your friends and see their progress. {"\n"}
            - Do challenges with your friends. {"\n"}
            - Motivate each other!
          </Text>
          {/* <Button onPress={() => navigation.navigate('Overview')} title='Overview' /> */}
          <Image source={require('../../assets/img/wait.png')} style={{ width: Dimensions.get('window').width / 1.2, height: 220 }} />
        </View>
      </SafeAreaView>
    )
};

export default Friends;

const styles = StyleSheet.create({
  overviewContainer: {
      margin: 20,
      marginVertical: 13,
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
    friendsContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 30
    },
    header: {
      fontSize: 25,
      fontWeight: '800',
      textAlign: 'center',
      marginBottom: 5,
      color: '#5CB724'
    },
    subHeader: {
      fontSize: 12,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 10,
      color: '#FAA500'
    },
    introduction1: {
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '600',
      color: '#232323'
    },
    introduction: {
      textAlign: 'center',
      fontSize: 20,
      fontWeight: '700',
      color: '#232323',
      marginTop: 15
    },
    introductionContainer: {
      marginTop: 5,
    },
    bulletPoints: {
      textAlign: 'center',
      fontSize: 14,
      fontWeight: '600',
      color: '#232323',
      marginTop: 15,
      marginBottom: 55
    },
})