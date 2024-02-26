import { Text, View, StyleSheet } from 'react-native'
import React, { Component } from 'react'

const Navigator = () => {
    return (
        <NavigationContainer>
        <View style={styles.container}>
          <Tab.Navigator
            initialRouteName="Home"
            activeColor="#7DFF2D"
            inactiveColor="white"
            barStyle={styles.tabBar}
            shifting={false}
            labeled={false}
          >
            <Tab.Screen
              name="Home"
                children={()=><Overview weight={weight}/>}
              options={{
                tabBarIcon: ({ color }) => (
                  <Ionicons name="person" color={color} size={30} />
                ),
              }}
            />
            <Tab.Screen
              name="Chart"
              component={WeightChart}
              options={{
                tabBarIcon: ({ color }) => (
                  <AntDesign name="linechart" color={color} size={30} />
                ),
              }}
            />
            <Tab.Screen 
              name="AddWeight" 
              component={AddWeight}
              options={{
                tabBarIcon: ({color}) => (
                  <View
                    style={{
                      height: 10,
                      width: 10,
                    }}
                  >
                  </View>
                  
                ),
              }}
            />
            <Tab.Screen
              name="Friends"
              component={Friends}
              options={{
                tabBarIcon: ({ color }) => (
                  <AntDesign name="linechart" color={color} size={30} />
                ),
              }}
            />
            <Tab.Screen
              name="Settings"
              component={AppSettings}
              options={{
                tabBarIcon: ({ color }) => (
                  <AntDesign name="linechart" color={color} size={30} />
                ),
              }}
            />
          </Tab.Navigator>
          <AddWeightButton />
        </View>
      </NavigationContainer>
    )
}

export default Navigator

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    tabBar: {
      backgroundColor: '#5CB724',
      height: 90,
      elevation: 8,
    },
    screenContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addButtonContainer: {
      position: 'absolute',
      alignSelf: 'center',
      backgroundColor: 'transparent',
      bottom: 40,
      zIndex: 10,
    },
  });