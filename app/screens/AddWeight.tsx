import { Button, Text, TextInput, View, StyleSheet, Image, Pressable, Animated, Keyboard, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native'
import React, { Component, useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native';
import PopUp from '../../components/PopUp';
import AdBanner from '../../components/AdBanner';
import { Firestore, addDoc, collection, deleteDoc, onSnapshot, updateDoc, setDoc, doc, arrayUnion, getDoc, arrayRemove, deleteField } from 'firebase/firestore'
import { FIRESTORE_DB } from '../../firebaseConfig';
import PopUpNew from '../../components/PopUpNew';


const AddWeight = ({ setWeight, user }: any) => {

    const animation = new Animated.Value(0);
    const inputRange = [0, 1];
    const outputRange = [1, 0.8];
    const scale = animation.interpolate({inputRange, outputRange});
    const [dates, setDates] = useState([] as string[])
    // const [weights, setWeights] = useState([] as number[])
    const [arrWeights, setArrWeights] = useState<number[]>([]);
    const [firstRender, setFirstrender] = useState(true);

    const onPressIn = () => {
        Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
        speed: 30,
        }).start();
    };
    const onPressOut = () => {
        Animated.spring(animation, {
        toValue: 0,
        useNativeDriver: true,
        speed: 30,
        }).start();
    };

    const getCurrentDate=()=>{
         // Create a new Date object
        const currentDate = new Date();

        // Get the day, month, and year components
        const day = String(currentDate.getDate()).padStart(2, '0'); // Add leading zero if needed
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = currentDate.getFullYear();

        // Format the date as DD-MM-YYYY
        const formattedDate = `${day}-${month}-${year}`;


        // setDates(prevDates => [...prevDates, date + '-' + month + '-' + year]);
        // setDates(prevDates => [...prevDates, formattedDate]);
        return formattedDate;
  }

  const setCurrentDateToDates = () => {
    // Create a new Date object
    const currentDate = new Date();

    // Get the day, month, and year components
    const day = String(currentDate.getDate()).padStart(2, '0'); // Add leading zero if needed
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = currentDate.getFullYear();

    // Format the date as DD-MM-YYYY
    const formattedDate = `${day}-${month}-${year}`;

    let newDates: string[] = dates;

    console.log(dates)

    newDates.push(formattedDate);

    console.log("New array", newDates)
    return newDates;
  }

    useEffect(() => {
        console.log("useEffect")
        getData()
    }, [])

    // useEffect(() => {
    //     firstRender ? setFirstrender(false) : setCurrentDateToDates()
    // }, [dates])

    const docRef = doc(FIRESTORE_DB, "Users", user.uid);

    
    async function getData() {
        const docSnap = await getDoc(docRef);
        const dates = docSnap?.data()?.weightDates;
        const weights = docSnap?.data()?.weightHistory;
        const lastWeightUpdate = docSnap?.data()?.lastWeightUpdate;
        if (dates) {
            await setDates(dates)
        }
        if (weights) {
            setArrWeights(weights.map((x: number) => x));
        }
        if (lastWeightUpdate) {
            if (lastWeightUpdate == getCurrentDate()) {
                console.log("Already set weight today")
                setAddedTodaysWeight(true)
            } else {
                setAddedTodaysWeight(false)
            }
        }
        
        // getCurrentDate()
        // setCurrentDateToDates()
      }
    
    async function setData(newWeight : string) {
        // getData()
        // let weights: number[] = arrWeights;
        // weights.push(parseFloat(newWeight))
        let updatedWeights = [...arrWeights, parseFloat(newWeight)];

        updateDoc(doc(FIRESTORE_DB, 'Users', user.uid), { 
            actualWeight: parseFloat(newWeight),
            weightHistory: updatedWeights,
            weightDates: setCurrentDateToDates(),
            lastWeightUpdate: getCurrentDate()
        })
        updatedWeights = [0]
    }

    // const navigation = useNavigation();

    const [saveWeight, setSaveWeight] = useState('');
    const [modalVisible, setModalVisibilty] = useState(false)
    const [addedTodaysWeight, setAddedTodaysWeight] = useState(false)

    return (
        <>
        {modalVisible 
        ?   <PopUpNew 
                popUpText={"Today's weight successfully added!"} 
                modalVisible={modalVisible}
                setModalVisibilty={setModalVisibilty}
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

        {/* <PopUp 
            popUpText={"Today's weight successfully added!"} 
            modalVisible={modalVisible}
            setModalVisibilty={setModalVisibilty}
            durationInSeconds={2}
        /> */}

        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.weightOverviewContainer}>
            <Text style={styles.yourWeightText}>Add your today's {"\n"}weight:</Text>
                <View style={styles.form}>
                    <TextInput 
                        keyboardType='decimal-pad'
                        style={styles.input} 
                        placeholder='Your weight in kg...' 
                        onChangeText={(text: any) => setSaveWeight(text)} 
                        value={saveWeight}
                        editable={!addedTodaysWeight}
                    />
                    <Text style={styles.formText}>kg</Text>
                </View>
            <View>
                {addedTodaysWeight ? <Text style={styles.addedWeightTxt}>You already set your todays weight!</Text> : <Text style={styles.addedWeightTxt}></Text>}
            </View>
            <View style={styles.btnView}>
                <Animated.View style={[{transform: [{scale}]}]}>
                    <Pressable 
                        onPress={() => {
                            setWeight(saveWeight);
                            setSaveWeight('')
                            setData(saveWeight)
                            Keyboard.dismiss()
                            setModalVisibilty(true)
                            setAddedTodaysWeight(true) 
                        }}
                        disabled={saveWeight === ''}
                        style={[!addedTodaysWeight ? styles.formBtn : styles.formBtnFalse]}
                        onPressIn={onPressIn}
                        onPressOut={onPressOut}
                    >
                        <Text style={styles.formBtnTxt}>Add today's weight</Text>
                    </Pressable>
                </Animated.View>
            </View>
            <View>
                <Text style={styles.noteText}>Note:</Text>
                <Text style={styles.noteList}>
                    - You can add your weight only once a day. {"\n"}
                    - Always weight yourself at the same time. {"\n"}
                    - Don't cheat on yourself!
                </Text>
            </View>
        </View>
        </TouchableWithoutFeedback>
        <View style={styles.adBannerContainer}>
            <AdBanner />
        </View>
      </SafeAreaView>
      </>
    )
}

export default AddWeight

const styles = StyleSheet.create({
    overviewContainer: {
        margin: 20,
        marginVertical: 13
      },
    weightOverviewContainer: {
        backgroundColor: '#5CB724',
        padding: 20,
        paddingTop: 25,
        marginTop: 30,
        borderRadius: 20,
        shadowColor: 'black',
        shadowRadius: 1,
        shadowOpacity: 0.2,
        shadowOffset: {width: -5, height: 5},
        paddingBottom: 25
    },
    yourWeightText: {
        color: '#FFF',
        fontSize: 28,
        fontWeight: '900',
        textAlign: 'center'
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
    caloriesAndWeightText: {
        color: '#FFF',
        fontWeight: '700',
        textAlign: 'center',
        fontSize: 16
    },
    caloriesAndWeightSubText: {
        color: '#FFF',
        textAlign: 'center',
        fontSize: 15,
        marginTop: 5
    },
    caloriesAndWeightContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
        marginTop: 30,
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
    formBtnFalse: {
        backgroundColor: 'gray',
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
    noteText: {
        color: '#FFF',
        textAlign: 'center',
        fontSize: 15,
        marginTop: 45,
        fontWeight: '800'
    },
    noteList: {
        color: '#FFF',
        textAlign: 'center',
        fontSize: 12,
        marginTop: 8,
    },
    adBannerContainer: {
        marginTop: 30
    },
    addedWeightTxt: {
        color: '#FFF',
        textAlign: 'center',
        fontSize: 10,
        marginTop: 8
    }
})