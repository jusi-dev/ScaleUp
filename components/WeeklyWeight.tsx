import { Text, View, StyleSheet, FlatList } from 'react-native'
import React, { Component, useEffect, useState } from 'react'

const WeeklyWeight = ({weeklyWeightsAndDates} : any) => {

    return (
      <View style={styles.weeklyContainer}>
        <View>
            <Text style={styles.weeklyText}>Your weight this {"\n"}week:</Text>
        </View>
        <View style={styles.weeklyHeight}>
            { weeklyWeightsAndDates.length > 0 
                ?
                    <FlatList 
                        data={weeklyWeightsAndDates}
                        showsVerticalScrollIndicator={true}
                        renderItem={({item}) => (
                            <View style={styles.weightList}>
                                <Text style={[styles.weightListText, styles.weightListDate]}>{item?.date}</Text>
                                <Text style={[styles.weightListText, styles.weightListMinus]}> - </Text>
                                <Text style={[styles.weightListText, styles.weightListWeight]}>{item?.weight} kg</Text>
                            </View>
                        )}
                    />
                :
                    <Text>No records this week.</Text>
            }
        </View>
      </View>
    )
}

export default WeeklyWeight

const styles = StyleSheet.create({
    weeklyContainer: {
        backgroundColor: '#FAA500',
        padding: 15,
        paddingTop: 20,
        marginTop: 10,
        borderRadius: 20,
        shadowColor: 'black',
        shadowRadius: 1,
        shadowOpacity: 0.2,
        shadowOffset: {width: -5, height: 5},
        paddingBottom: 25,
        width: '55%',
    },
    weeklyText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 18
    },
    weightList: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        textAlign: 'left',
    },
    weightListText: {
        color: '#FFF',
        marginTop: 10,
        fontWeight: '500',
        fontSize: 12
    },
    weightListDate: {
        marginRight: 'auto',
        width: '55%',
        // backgroundColor: 'yellow'
    },
    weightListMinus: {
        // backgroundColor: 'green',
        width: '10%',
    },
    weightListWeight: {
        marginRight: 'auto',
        // backgroundColor: 'red',
        flex: 1
    },
    weeklyHeight: {
        marginTop: 4,
        height: 100,
    }
})