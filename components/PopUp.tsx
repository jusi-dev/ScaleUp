import { Text, View, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import React, { Component } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ProgressBar from './ProgressBar'

const PopUp = ({ popUpText, modalVisible, setModalVisibilty, durationInSeconds }: any) => {
    const hideModal = () => {
        setModalVisibilty(false)
    }

    return (
        <TouchableWithoutFeedback onPress={() => hideModal()}>
        <Modal 
            visible={modalVisible}
            transparent={true}
            
        >
            <SafeAreaView style={styles.modalContainer}>
                <Text style={styles.modalText}>{ popUpText }</Text>
                <View>
                    <ProgressBar durationInSeconds={durationInSeconds} setModalVisibilty={setModalVisibilty}/>
                </View>
            </SafeAreaView>
        </Modal>
        </TouchableWithoutFeedback>
    )
}

export default PopUp

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: '#5CB724',
        zIndex: 1000,
        marginTop: 45
    },
    modalText: {
        color: '#FFF',
        fontSize: 20,
        padding: 15,
        fontWeight: '700'
    }
})