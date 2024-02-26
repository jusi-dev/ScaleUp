import { Text, View, StyleSheet } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import { Svg, Rect, Line } from 'react-native-svg';
import { scaleLinear } from 'd3-scale';

const renderBarChart = (value, minValue, maxValue) => {
    const width = 100; // Breite des Diagramms
    const height = 10; // Höhe des Diagramms
    const margin = 5; // Abstand zwischen den Balken
    const indicatorHeight = 5;
  
    const colorRanges = [
      { range: [0, 18.5], color: '#0F6477' }, // Untergewicht
      { range: [18.5, 24.9], color: '#00FF00' }, // Normalgewicht
      { range: [24.9, 29.9], color: '#FFA500' }, // Übergewicht
      { range: [29.9, 40], color: '#E42222' }, // Adipös
    ];
  
    const xScale = scaleLinear()
      .domain([minValue, maxValue])
      .range([0, width]);
  
    const bars = colorRanges.map((colorRange, index) => {
      const [rangeMin, rangeMax] = colorRange.range;
      const color = colorRange.color;
      const x = xScale(rangeMin);
      const barWidth = xScale(rangeMax) - x;

      const indicatorLineHeight = indicatorHeight; // Höhe des Indikatorstrichs über und unter dem Balken
  
      return (
        <Rect
          key={index}
          x={x}
          y={indicatorLineHeight / 2}
          width={barWidth}
          height={height}
          fill={color}
        />
      );
    });

    const indicatorLineHeight = indicatorHeight; // Höhe des Indikatorstrichs über und unter dem Balken
  
    const indicatorLineX = xScale(value); // x-Koordinate des Indikatorstrichs
  
    return (
      <Svg width={width} height={height + indicatorLineHeight * 2}>
        <Rect
          x={0}
          y={-indicatorLineHeight}
          width={width}
          height={height + indicatorLineHeight * 2}
          fill="none" // Hintergrundfarbe des Diagramms
        />
        {bars}
        <Line
          x1={indicatorLineX}
          y1={-indicatorLineHeight}
          x2={indicatorLineX}
          y2={height + indicatorLineHeight}
          stroke="#FFF" // Farbe des Indikatorstrichs
          strokeWidth={1.5} // Breite des Indikatorstrichs
        />
      </Svg>
    );
  };
  
  

const BMIOverview = ({ height, weight }) => {
    const [bmiValue, setBMIValue] = useState(22.5);
    const minValue = 0; // Minimalwert des Bereichs
    const maxValue = 40; // Maximalwert des Bereichs

    const underweight = (18 * ((height / 100) * (height / 100))).toFixed(0)
    const optimalweight = (21.75 * ((height / 100) * (height / 100))).toFixed(0)
    const overweight = (25 * ((height / 100) * (height / 100))).toFixed(0)
    const obese = (30 * ((height / 100) * (height / 100))).toFixed(0)

    useEffect(() => {
      calculateBMI()
    }, [weight, height])

    function calculateBMI () {
      setBMIValue((weight / ((height / 100) * (height / 100))).toFixed(2))
    }
    

    return (
      <View style={styles.bmiOverviewContainer}>
        <Text style={styles.bmiText}>Your BMI:</Text>
        <View style={styles.bmiChart}>
            {renderBarChart(bmiValue, minValue, maxValue)}
        </View>
        <Text style={styles.bmiValue}>{bmiValue}</Text>
        <View>
            <View style={styles.bmiInfoText}>
                <Text style={styles.bmiCatText}>Underweight: </Text>
                <Text style={styles.bmiCatWeight}>{'< '}{underweight} kg</Text>
            </View>
            <View style={styles.bmiInfoText}>
                <Text style={styles.bmiCatText}>Normal weight: </Text>
                <Text style={styles.bmiCatWeight}>{optimalweight} kg</Text>
            </View>
            <View style={styles.bmiInfoText}>
                <Text style={styles.bmiCatText}>Overweight: </Text>
                <Text style={styles.bmiCatWeight}>{'> '}{overweight} kg</Text>
            </View>
            <View style={styles.bmiInfoText}>
                <Text style={styles.bmiCatText}>Obese: </Text>
                <Text style={styles.bmiCatWeight}>{'> '}{obese} kg</Text>
            </View>
        </View>
      </View>
    )
}

export default BMIOverview

const styles = StyleSheet.create({
    bmiOverviewContainer: {
        backgroundColor: '#3DB9D4',
        padding: 15,
        paddingTop: 20,
        marginTop: 10,
        borderRadius: 20,
        shadowColor: 'black',
        shadowRadius: 1,
        shadowOpacity: 0.2,
        shadowOffset: {width: -5, height: 5},
        paddingBottom: 25,
        width: '40%',
        marginLeft: 'auto'
    },
    bmiText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 18,
        textAlign: 'center'
    },
    bmiChart: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    bmiValue: {
        color: '#FFF',
        textAlign: 'center',
        fontSize: 16,
        marginTop: 3
    },
    bmiInfoText: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 6
    },
    bmiCatText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 12
    },
    bmiCatWeight: {
        color: '#FFF',
        fontSize: 12
    }
})