import { Text, View, Modal, StyleSheet, TouchableWithoutFeedback, Dimensions } from 'react-native'
import React, { Component } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ProgressBar from './ProgressBar'

const PopUpNew = ({ popUpText, modalVisible, setModalVisibilty, durationInSeconds }: any) => {

    return (
        <View 
            // visible={modalVisible}
            // transparent={true}
            style={styles.newModal}
            
        >
            <View style={styles.modalContainer}>
                <Text style={styles.modalText}>{ popUpText }</Text>
                <View>
                    <ProgressBar durationInSeconds={durationInSeconds} setModalVisibilty={setModalVisibilty}/>
                </View>
            </View>
        </View>
    )
}

export default PopUpNew

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: '#5CB724',
        zIndex: 1000,
        marginTop: 45,
    },
    modalText: {
        color: '#FFF',
        fontSize: 20,
        padding: 15,
        fontWeight: '700'
    },
    newModal: {
        position: 'absolute',
        zIndex: 100,
        height: 100,
        width: Dimensions.get('window').width
    }
})