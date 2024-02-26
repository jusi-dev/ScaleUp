import { Text, View, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { Component, useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AdBanner from '../../components/AdBanner'
import ChangeSettings from '../../components/ChangeSettings'
import { FIREBASE_AUTH } from '../../firebaseConfig'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PopUpNew from '../../components/PopUpNew'



const AppSettings = ({ name, setName, heightInCm, setHeightInCm, 
                       oldWeight, setOldWeight, aimWeight, setAimWeight,
                       weight, setWeight, activityLvl, setActivityLvl,
                       goal, setGoal, sex, setSex, age, setAge, notificationActive,
                       setNotificationActive, notificationHour, setNotificationHour, notificationMinute, setNotificationMinute,
                       schedulePushNotification, cancelAllNotification, user
                     } : any) => {
    const [modalVisible, setModalVisibilty] = useState(false)
    const [popUpVisible, setPopUpVisible] = useState(false)
    const [popUpText, setPopUpText] = useState('')
    const [value, setValue] = useState();
    const [optionTxt, setOptionTxt] = useState('');
    const isFirstRender = useRef(true)

    useEffect(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false // toggle flag after first render/mounting
        return;
      }
      setModalVisibilty(true) // do something after state has updated
    }, [value])

    useEffect(() => {
      if (!notificationActive) {
        cancelAllNotification
      }
    }, [notificationActive])

    function showModal (valueToSet : any, optionTxt : any) {
      setValue(valueToSet)
      setOptionTxt(optionTxt)
      setModalVisibilty(true)
    }

    const logOut = () => {
      AsyncStorage.removeItem('email')
      AsyncStorage.removeItem('password')
      FIREBASE_AUTH.signOut()
    }

    const setNotification = (notiHour: string, notiMinute : string) => {
      cancelAllNotification()
      schedulePushNotification(parseInt(notiHour), parseInt(notiMinute))
    }
    

    return (
      <>
      {popUpVisible 
        ?   <PopUpNew 
                popUpText={popUpText} 
                modalVisible={popUpVisible}
                setModalVisibilty={setPopUpVisible}
                durationInSeconds={2}
            />
        : <></>
      }

      <SafeAreaView style={styles.overviewContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoFront}>Scale</Text><Text style={styles.logoBack}>Up</Text>
          </View>
          <View>
            <Image source={require('../../assets/img/profilepicture.png')} style={{ width: 55, height: 55 }} />
          </View>
        </View>

        {modalVisible 
        ?
        <ChangeSettings 
          modalVisible={modalVisible}
          setModalVisibilty={setModalVisibilty}
          whichOption={value}
          resetOption={setValue}
          setName={setName}
          setHeight={setHeightInCm}
          setAge={setAge}
          setSex={setSex}
          setOldWeight={setOldWeight}
          setWeight={setWeight}
          setAimWeight={setAimWeight}
          setGoal={setGoal}
          setActivityLvl={setActivityLvl}
          optionTxt={optionTxt}
          setNotificationActive={setNotificationActive}
          setNotificationHour={setNotificationHour}
          setNotificationMinute={setNotificationMinute}
          setNotification={setNotification}
          user={user}
          setPopUpText={setPopUpText}
          setPopUpVisible={setPopUpVisible}
        />
        :
        <></>
        }

        <View style={styles.settingsContainer}>
          <ScrollView>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subTitle}>About you:</Text>
            <TouchableOpacity style={styles.optionContainer} onPress={() => showModal(1, 'Change Name')}>
              <Text style={styles.settingOptionTxt}>Your name: </Text>
              <Text style={styles.settingOptionOptionTxt}>{name}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionContainer} onPress={() => showModal(3, 'Change Gender')}>
              <Text style={styles.settingOptionTxt}>Gender: </Text>
              <Text style={styles.settingOptionOptionTxt}>{sex}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionContainer} onPress={() => showModal(4, 'Change Age')}>
              <Text style={styles.settingOptionTxt}>Age: </Text>
              <Text style={styles.settingOptionOptionTxt}>{age}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionContainer} onPress={() => showModal(2, 'Change Height')}>
              <Text style={styles.settingOptionTxt}>Height: </Text>
              <Text style={styles.settingOptionOptionTxt}>{heightInCm} cm</Text>
            </TouchableOpacity>

            <Text style={styles.subTitle}>Your weight:</Text>
            <TouchableOpacity style={styles.optionContainer} onPress={() => showModal(5, 'Change start weight')}>
              <Text style={styles.settingOptionTxt}>Start weight: </Text>
              <Text style={styles.settingOptionOptionTxt}>{oldWeight} kg</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.optionContainer} onPress={() => showModal(6, 'Change weight (test)')}>
              <Text style={styles.settingOptionTxt}>Actual weight (Dev Test): </Text>
              <Text style={styles.settingOptionOptionTxt}>{weight} kg</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.optionContainer} onPress={() => showModal(7, 'Change aim weight')}>
              <Text style={styles.settingOptionTxt}>Aim weight: </Text>
              <Text style={styles.settingOptionOptionTxt}>{aimWeight} kg</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionContainer} onPress={() => showModal(8, 'Change goal')}>
              <Text style={styles.settingOptionTxt}>Goal: </Text>
              <Text style={styles.settingOptionOptionTxt}>{goal}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionContainer} onPress={() => showModal(9, 'Change activity level')}>
              <Text style={styles.settingOptionTxt}>Activity level: </Text>
              <Text style={styles.settingOptionOptionTxt}>{activityLvl}</Text>
            </TouchableOpacity>

            <Text style={styles.subTitle}>Notifications:</Text>
            <TouchableOpacity style={styles.optionContainer} onPress={() => showModal(10, 'Change notification activity')}>
              <Text style={styles.settingOptionTxt}>Notification active: </Text>
              {notificationActive 
              ? <Text style={styles.settingOptionOptionTxt}>On</Text>
              : <Text style={styles.settingOptionOptionTxt}>Off</Text>
              }
            </TouchableOpacity>

            {notificationActive 
            ?
              <TouchableOpacity style={styles.optionContainer} onPress={() => showModal(11, 'Change notification time')}>
                <Text style={styles.settingOptionTxt}>Notification time: </Text>
                <Text style={styles.settingOptionOptionTxt}>{notificationHour} : {notificationMinute}</Text>
               </TouchableOpacity>
            : <></>}
            

            <Text style={styles.subTitle}>Sign out:</Text>
            <TouchableOpacity style={styles.optionContainer} onPress={() => logOut()}>
              <Text style={styles.settingOptionTxt}>Sign Out </Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
        <View style={styles.adBannerContainer}>
            <AdBanner />
        </View>
      </SafeAreaView></>
    )
}

export default AppSettings

const styles = StyleSheet.create({
    overviewContainer: {
        margin: 20,
        marginVertical: 13
      },
    settingsContainer: {
        backgroundColor: '#5CB724',
        padding: 20,
        paddingTop: 25,
        marginTop: 30,
        borderRadius: 20,
        shadowColor: 'black',
        shadowRadius: 1,
        shadowOpacity: 0.2,
        shadowOffset: {width: -5, height: 5},
        paddingBottom: 25,
        height: 450
    },
    title: {
        color: '#FFF',
        fontSize: 28,
        fontWeight: '800',
        textAlign: 'left',
        marginBottom: 3
    },
    subTitle: {
      color: '#FFF',
        fontSize: 19,
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
      input: {
        height: 50,
        width: 150,
        borderRadius: 15,
        padding: 10,
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: '#fff'
    },
    form: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
    },
    formText: {
        color: '#FFF',
        fontSize: 23,
        fontWeight: '700',
        textAlign: 'center',
        marginLeft: 20
    },
    formBtn: {
        backgroundColor: '#FAA500',
        color: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        width: 200,
        shadowColor: 'black',
        shadowRadius: 1,
        shadowOpacity: 0.3,
        shadowOffset: {width: 0, height: 5},
    },
    formBtnTxt: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '800',
        padding: 15,
        textAlign: 'center'
    },
    btnView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 35
    },
    adBannerContainer: {
        marginTop: 30
    },
    settingOptionTxt: {
      color: '#FFF',
      fontSize: 15,
      fontWeight: '700',
      paddingTop: 15,
      paddingBottom: 15,
      paddingLeft: 10,
    },
    settingOptionOptionTxt: {
      color: '#FFF',
      fontSize: 15,
      fontWeight: '500',
      paddingTop: 15,
      paddingBottom: 15,
      paddingRight: 20,
      textAlign: 'right',
      marginLeft: 'auto'
    },
    optionContainer: {
      borderColor: '#FFF',
      borderWidth: 0.2,
      justifyContent: 'flex-start',
      marginTop: 10,
      flexDirection: 'row',
      backgroundColor: 'rgba(255, 255, 255, .2)'
    }
})