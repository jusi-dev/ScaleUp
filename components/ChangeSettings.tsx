import { Modal, Text, View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Pressable, TextInput, Animated, Keyboard } from 'react-native'
import React, { Component, useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SelectDropdown from 'react-native-select-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, updateDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../firebaseConfig';

const ChangeSettings = ({ modalVisible, setModalVisibilty, whichOption, optionTxt, 
                          setName, setHeight, setSex, setOldWeight, setWeight, setAimWeight,
                          setAge, setActivityLvl, setGoal, resetOption, setNotificationActive, setNotificationHour,
                          setNotificationMinute, setNotification, user, setPopUpText, setPopUpVisible
                        }:any) => {

    const [saveValue, setSaveValue] = useState('');
    const [saveValue2, setSaveValue2] = useState('');
    const [errorMessageVisible, setErrorMessageVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const animation = new Animated.Value(0);
    const inputRange = [0, 1];
    const outputRange = [1, 0.8];
    const scale = animation.interpolate({inputRange, outputRange});

    const gender = ['Male', 'Female']
    const goal = ['Fast weight loss', 'Weight loss', 'Hold weight', 'Weight gain', 'Fast weight gain']
    const activityLvl = ['Sedentary', 'Lightly active', 'Moderately active', 'Very active']
    const notificationOn = ["On", "Off"] 
    const notificationHour : string[] = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]
    const notificationMinute : string[] = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']

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

    useEffect(() => {
        if (modalVisible === false) {
            setModalVisibilty(false)
            resetOption(0)
        };
    },[modalVisible])

    function hideModal () {
        setModalVisibilty(false)
    }

    function showPopUp () {
        setPopUpText('Changes saved!')
        setPopUpVisible(true)
        hideModal()
    }

    function checkInput (inputValue : any, errorMessage : string) {
        if (inputValue) {
            showPopUp()
            return true
        } else {
            setErrorMessageVisible(true)
            setErrorMessage(errorMessage)
            return false
        }
    }

    function changeValueTo(inputValue : any) {
        if (whichOption === 1) {
            if (checkInput(inputValue, 'Please enter a name')) {
                setName(inputValue)
                updateDoc(doc(FIRESTORE_DB, 'Users', user.uid), { 
                    name: inputValue
                })
            }
        } else if (whichOption === 2) {
            if (checkInput(inputValue, 'Please enter a height')) {
                setHeight(inputValue)
                updateDoc(doc(FIRESTORE_DB, 'Users', user.uid), { 
                    height: parseInt(inputValue)
                })
            }
        } else if (whichOption === 3) {
            if (checkInput(inputValue, 'Please select a gender')) {
                setSex(inputValue)
                updateDoc(doc(FIRESTORE_DB, 'Users', user.uid), { 
                    gender: inputValue
                })
            }
        } else if (whichOption === 4) {
            if (checkInput(inputValue, 'Please enter an age')) {
                setAge(inputValue)
                updateDoc(doc(FIRESTORE_DB, 'Users', user.uid), { 
                    age: parseInt(inputValue)
                })
            }
        } else if (whichOption === 5) {
            if (checkInput(inputValue, 'Please enter an old weight')) {
                setOldWeight(inputValue)
                updateDoc(doc(FIRESTORE_DB, 'Users', user.uid), { 
                    startWeight: parseInt(inputValue)
                })
            }
        } else if (whichOption === 6) {
            setWeight(inputValue)
        } else if (whichOption === 7) {
            if (checkInput(inputValue, 'Please enter an aim weight')) {
                setAimWeight(inputValue)
                updateDoc(doc(FIRESTORE_DB, 'Users', user.uid), { 
                    aimWeight: parseInt(inputValue)
                })
            }
        } else if (whichOption === 8) {
            if (checkInput(inputValue, 'Please select a goal')) {
                setGoal(inputValue)
                updateDoc(doc(FIRESTORE_DB, 'Users', user.uid), { 
                    goal: inputValue
                })
            }
        } else if (whichOption === 9) {
            if (checkInput(inputValue, 'Please select an activity level')) {
                setActivityLvl(inputValue)
                updateDoc(doc(FIRESTORE_DB, 'Users', user.uid), { 
                    activityLvl: inputValue
                })
            }
        } else if (whichOption === 10) {
            if (checkInput(inputValue, 'Please select an option')) {
                if (inputValue == "On") {
                    setNotificationActive(true)
                    updateDoc(doc(FIRESTORE_DB, 'Users', user.uid), { 
                        notificationActive: true
                    })
                } else {
                    setNotificationActive(false)
                    updateDoc(doc(FIRESTORE_DB, 'Users', user.uid), { 
                        notificationActive: false
                    })
                }
            }
        } else if (whichOption === 11) {
            if (inputValue && saveValue2) {
                if (checkInput(inputValue, 'Please select an time')) {
                    setNotificationHour(inputValue)
                    setNotificationMinute(saveValue2)
                    AsyncStorage.setItem("notificationHour", inputValue)
                    AsyncStorage.setItem("notificationMinute", saveValue2)
                    updateDoc(doc(FIRESTORE_DB, 'Users', user.uid), { 
                        notificationHour: parseInt(inputValue),
                        notificationMinute: parseInt(saveValue2)
                    })
                    setNotification(inputValue, saveValue2)
                }
            } else {
                setErrorMessageVisible(true)
                setErrorMessage('Please select an time')
            }
        }
    }

    return (
        <Modal
            animationType='fade'
            visible={true}
            transparent={true}
        >
            <Pressable style={styles.modalBackground} onPress={() => hideModal()}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalText}>{optionTxt}</Text>
                        <TouchableOpacity onPress={() => hideModal()} style={styles.cancelBtn}>
                            <Text style={{color: 'white', fontSize: 20, fontWeight: '700', textAlign: 'center'}}>X</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text></Text>
                        {
                            whichOption == 1 || whichOption == 2 || whichOption == 4 || whichOption == 5 || whichOption == 6 || whichOption == 7  
                            ?
                                <TextInput 
                                    keyboardType={whichOption == 1  ? 'default' : whichOption == 4 ? 'number-pad' : 'decimal-pad'}
                                    style={styles.input} 
                                    placeholder={'Value'}
                                    onChangeText={(text: any) => setSaveValue(text)} 
                                    value={saveValue}
                                />
                            :
                            whichOption == 3 || whichOption == 8 || whichOption == 9 || whichOption == 10
                            ?
                                <View style={styles.dropDownContainer}>
                                    <SelectDropdown
                                        
                                        data={whichOption == 3 ? gender : whichOption == 8 ? goal : whichOption == 9 ? activityLvl : notificationOn}
                                        onSelect={(selectedItem, index) => {
                                            setSaveValue(selectedItem)
                                        }}
                                        buttonTextAfterSelection={(selectedItem, index) => {
                                            // text represented after item is selected
                                            // if data array is an array of objects then return selectedItem.property to render after item is selected
                                            return selectedItem
                                        }}
                                        rowTextForSelection={(item, index) => {
                                            // text represented for each item in dropdown
                                            // if data array is an array of objects then return item.property to represent item in dropdown
                                            return item
                                        }}
                                    />
                                </View>
                            :
                            whichOption == 11
                            ?
                                <View style={styles.dropDownContainerHor}>
                                    <SelectDropdown
                                        
                                        data={notificationHour}
                                        onSelect={(selectedItem, index) => {
                                            setSaveValue(selectedItem)
                                        }}
                                        buttonTextAfterSelection={(selectedItem, index) => {
                                            return selectedItem
                                        }}
                                        rowTextForSelection={(item, index) => {
                                            return item
                                        }}
                                        defaultButtonText='HH'
                                        showsVerticalScrollIndicator={true}
                                        buttonStyle={{backgroundColor: 'white', width: 110}}
                                    />
                                    <Text style={styles.timeSeperator}> : </Text>
                                    <SelectDropdown
                                        
                                        data={notificationMinute}
                                        onSelect={(selectedItem, index) => {
                                            setSaveValue2(selectedItem)
                                        }}
                                        buttonTextAfterSelection={(selectedItem, index) => {
                                            return selectedItem
                                        }}
                                        rowTextForSelection={(item, index) => {
                                            return item
                                        }}
                                        defaultButtonText='MM'
                                        showsVerticalScrollIndicator={true}
                                        buttonStyle={{backgroundColor: 'white', width: 110}}
                                    />
                                </View>
                            :
                            <><Text>Gagi</Text></>
                        }
                        {
                            errorMessageVisible ? <Text style={{color: 'red', textAlign: 'center'}}>{errorMessage}</Text> : <></>
                        }
                        
                        <Animated.View style={[{transform: [{scale}]}]}>
                            <Pressable 
                                onPress={() => {
                                    changeValueTo(saveValue);
                                    setSaveValue('')
                                    Keyboard.dismiss()
                                }}
                                style={[styles.formBtn]}
                                onPressIn={onPressIn}
                                onPressOut={onPressOut}
                            >
                                <Text style={styles.formBtnTxt}>Save Changes</Text>
                            </Pressable>
                        </Animated.View>
                    </View>
                </View>
            </Pressable>
        </Modal>
    )
}

export default ChangeSettings

const styles = StyleSheet.create({
    modalBackground: {
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, .3)',
    },
    modalContainer: {
        backgroundColor: '#5CB724',
        zIndex: 1000,
        marginHorizontal: 20,
        marginTop: 'auto',
        marginBottom: 'auto',
        borderRadius: 20,
        height: 250
    },
    modalText: {
        color: '#FFF',
        fontSize: 23,
        padding: 15,
        fontWeight: '700'
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
        marginTop: 40,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    formBtnTxt: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '800',
        padding: 15,
        textAlign: 'center'
    },
    cancelBtn: {
        marginLeft: 'auto', 
        marginRight: 20,
        backgroundColor: 'rgba(250,165,0,1)', 
        borderRadius: 50, 
        width: 40, 
        height: 40, 
        justifyContent: 'center',
        shadowColor: 'black',
        shadowRadius: 1,
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 5},
    },
    input: {
        height: 50,
        width: '90%',
        borderRadius: 15,
        padding: 10,
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: '#fff',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    dropDownContainer: {
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    dropDownContainerHor: {
        marginLeft: 'auto',
        marginRight: 'auto',
        flexDirection: 'row',
        alignItems: 'center'
    },
    timeSeperator: {
        color: "white",
        fontSize: 20,
        fontWeight: "800",
        paddingHorizontal: 5
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    }
})