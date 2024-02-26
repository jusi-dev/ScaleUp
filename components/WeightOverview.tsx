import { Text, View, StyleSheet } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import ProgressBar from 'react-native-progress/Bar';

const WeightOverview = ({ actualWeight, oldWeight, aimWeight, weightProgress, avgWeight, sex, heightInCm, age, activityLvl, goal } :any) => {

    const [kcal, setKcal] = useState(1938);
    const [weightLeft, setWeightLeft] = useState("");

    useEffect(() => {
        calculateCalories()
        calculateWeightLeft()
      }, [actualWeight, heightInCm, age, activityLvl, goal, sex, aimWeight])
    
    function calculateWeightLeft() {
        setWeightLeft(aimWeight > actualWeight ? (aimWeight - actualWeight).toFixed(2) : (actualWeight - aimWeight).toFixed(2))
    }

    function calculateCalories() {
        let tempKcal : string = "";
        let pal : number = 0;

        if (activityLvl == 'Sedentary') {
            pal = 1.1
        } else if (activityLvl == 'Lightly active') {
            pal = 1.3
        } else if (activityLvl == 'Moderately active') {
            pal = 1.5
        } else if (activityLvl == 'Very active') {
            pal = 1.8
        }

        if (sex == 'Male') {
            tempKcal = (pal * (66.47 + (13.7 * parseFloat(actualWeight)) + (5 * parseFloat(heightInCm)) - (6.8 * parseFloat(age)))).toFixed(0)
        } else if (sex == 'Female') {
            tempKcal = (pal * (655.1 + (9.6 * parseFloat(actualWeight)) + (1.8 * parseFloat(heightInCm)) - (4.7 * parseFloat(age)))).toFixed(0)
        }

        if (goal == 'Fast weight loss') {
            setKcal(parseFloat(tempKcal) - 1000)
        } else if (goal == 'Weight loss') {
            setKcal(parseFloat(tempKcal) - 500)
        } else if (goal == 'Hold weight') {
            setKcal(parseFloat(tempKcal))
        }else if (goal == 'Weight gain') {
            setKcal(parseFloat(tempKcal) + 500)
        } else if (goal == 'Fast weight gain') {
            setKcal(parseFloat(tempKcal) + 1000)
        }
    }

    return (
      <View style={styles.weightOverviewContainer}>

        {/* Weight Text */}
        <View style={styles.displayWeight}>
            <Text style={styles.yourWeightText}>Your last recorded {"\n"} weight:</Text>
            <Text style={styles.weightText}>{actualWeight} kg</Text>
        </View>

        {/* Progress bar */}
        <View>
            <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                    <Text style={styles.progressWeight}>{oldWeight} kg</Text>
                    <ProgressBar progress={weightProgress} width={180} height={20} color={'#7DFF2D'} unfilledColor={'#FFF'} borderRadius={20} borderWidth={0}/>
                    <Text style={styles.progressWeight}>{aimWeight} kg</Text>
                </View>
                <Text style={[styles.weightLeft]}>{weightLeft} kg left to your goal!</Text>
            </View>
        </View>

        {/* Calories and weight difference */}
        <View style={styles.caloriesAndWeightContainer}>
            {/* Daily calories */}
            <View>
                <Text style={styles.caloriesAndWeightText}>Your daily {"\n"}calories:</Text>
                <Text style={styles.caloriesAndWeightSubText}>{kcal} kcal</Text>
            </View>
            {/* Weight difference */}
            <View>
                {/* ØØØØØ */}
                <Text style={styles.caloriesAndWeightText}>Ø Weight difference {"\n"} this week:</Text>
                <Text style={styles.caloriesAndWeightSubText}>{avgWeight} kg</Text>
            </View>
        </View>
      </View>
    )
}

export default WeightOverview

const styles = StyleSheet.create({
    weightOverviewContainer: {
        backgroundColor: '#5CB724',
        padding: 20,
        paddingTop: 25,
        marginTop: 10,
        borderRadius: 20,
        shadowColor: 'black',
        shadowRadius: 1,
        shadowOpacity: 0.2,
        shadowOffset: {width: -5, height: 5},
        paddingBottom: 25
    },
    displayWeight: {
        alignItems: 'center'
    },
    yourWeightText: {
        color: '#FFF',
        fontSize: 25,
        fontWeight: '500',
        textAlign: 'center'
    },
    weightText: {
        color: '#FFF',
        fontSize: 50,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 15
    },
    progressBarContainer: {
        marginTop: 20,
        width: '100%',
        justifyContent: 'space-evenly'
    },
    progressWeight: {
        color: '#FFF',
        fontWeight: '800',
        fontSize: 15
    },
    progressBar: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly'
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
    centerText: {
        textAlign: 'center',
    },
    textWhite: {
        color: '#FFF'
    }
})