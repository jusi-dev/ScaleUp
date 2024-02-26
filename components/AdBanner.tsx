import { Text, View, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const AdBanner = () => {
    return (
      <View style={styles.adContainer}>
        <Text style={styles.adText}>Here could be your ad</Text>
      </View>
    )
}

export default AdBanner

const styles = StyleSheet.create({
    adContainer: {
        backgroundColor: 'gray',
    },
    adText: {
        color: 'black',
        textAlign: 'center',
        padding: 30
    }
})