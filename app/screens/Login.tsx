import { SafeAreaView, Text, View, StyleSheet, TextInput, Button, KeyboardAvoidingView, Image  } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { ActivityIndicator} from 'react-native-paper';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore'
import Checkbox from 'expo-checkbox';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ showSplash, setShowSplash} :any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [emailCache, setEmailCache] = useState('');
    // const [passwordCache, setPasswordCache] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [createAccount, setCreateAccount] = useState(false);
    const [checked, setChecked] = useState(false);
    const [acceptTOS, setAcceptTOS] = useState(false);
    const [acceptDataPrivacy, setAcceptDataPrivacy] = useState(false);
    const auth = FIREBASE_AUTH;

    // useEffect(() => {
    //     getCredentials()
    // }, [])

    // useEffect(() => {
    //     if (emailCache && passwordCache) {
    //         try {
    //             console.log("getting credentials")
    //             const response = signInWithEmailAndPassword(auth, emailCache, passwordCache)
    //         } catch (error) {
    //             alert(error)
    //         } finally {
    //             console.log("Logged in user automatically")
    //         }
    //     } else {
    //         console.log("Didn't found credentials")
    //         // setShowSplash(false)
    //     }
    // }, [emailCache, passwordCache])

    const saveCredentials = () => {
        if (email) {
            AsyncStorage.setItem('email', email);
        }
        if (password) {
            AsyncStorage.setItem('password', password);
        }
    }

    // const getCredentials = () => {
    //     AsyncStorage.getItem('email', (error, storedEmail) => {
    //         if (storedEmail) {
    //             setEmailCache(storedEmail)
    //         }
    //     })

    //     AsyncStorage.getItem('password', (error, storedPassword) => {
    //         if(storedPassword) {
    //             setPasswordCache(storedPassword);
    //         }
    //     })
    // }

    const signIn = async () => {
        setLoading(true);
        if (checked) saveCredentials();
        try {
            const response = await signInWithEmailAndPassword(auth, email, password)
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    }

    const signUp = async () => {
        setLoading(true)
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password)
            alert('Check your mail')
            const user = await FIREBASE_AUTH.currentUser;
            if (user) {
                const document = await setDoc(doc(FIRESTORE_DB, 'Users', user.uid), { name: name})
            }
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
        { !showSplash
            ?
                <SafeAreaView style={styles.container}>
                    <View >
                    <Text>Login</Text> 
                    <KeyboardAvoidingView behavior='padding'>
                        { createAccount 
                        ? 
                            <TextInput value={name} style={styles.input} placeholder="Your name" onChangeText={(text :any) => setName(text)}/>
                        :
                            <></>
                        }
                        <TextInput keyboardType='email-address' value={email} style={styles.input} placeholder="Email" autoCapitalize='none' onChangeText={(text :any) => setEmail(text)}/>
                        <TextInput secureTextEntry={true} value={password} style={styles.input} placeholder="password" autoCapitalize='none' onChangeText={(text :any) => setPassword(text)}/>

                            { loading ? <ActivityIndicator size="large" color='#0000ff' />
                            : !createAccount ?

                                <>
                                    <View style={styles.keepLoggedIn}>
                                        <Checkbox
                                            style={styles.checkbox}
                                            value={checked}
                                            onValueChange={setChecked}
                                            color={checked ? '#5CB724' : undefined}
                                        />
                                        <Text>Keep me signed in</Text>
                                    </View>
                                    <Button title="login" onPress={signIn} />
                                    <Button title="Create account" onPress={() => setCreateAccount(true)} />
                                </>
                                :
                                <>
                                    <View style={styles.keepLoggedIn}>
                                        <Checkbox
                                            style={styles.checkbox}
                                            value={acceptTOS}
                                            onValueChange={setAcceptTOS}
                                            color={acceptTOS ? '#5CB724' : undefined}
                                        />
                                        <Text>I read the Term of Service and accept them</Text>
                                    </View>
                                    <View style={styles.keepLoggedIn}>
                                        <Checkbox
                                            style={styles.checkbox}
                                            value={acceptDataPrivacy}
                                            onValueChange={setAcceptDataPrivacy}
                                            color={acceptDataPrivacy ? '#5CB724' : undefined}
                                        />
                                        <Text>I read the Data Privacy and accept them</Text>
                                    </View>
                                    <Button title="Create account" onPress={signUp} />
                                    <Button title="login" onPress={() => setCreateAccount(false)} />
                                </>
                            }
                        </KeyboardAvoidingView>
                    </View>
                    
                </SafeAreaView>
            :
                <Image 
                    source={require('../../assets/splash.png')}
                />
        }
      </>
    )
}

export default Login;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center'
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff'
    },
    keepLoggedIn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    checkbox: {
        borderColor: 'black',
        borderWidth: 2,
        margin: 0,
        marginRight: 10,
    }
})