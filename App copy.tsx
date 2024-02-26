import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import Overview from './app/screens/Overview'
import Friends from './app/screens/Friends';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

const Tab = createMaterialBottomTabNavigator();

export default function App() {
  const theme = useTheme();
  theme.colors.secondaryContainer = "transperent"
  return (
    <>
      <NavigationContainer>
        <Tab.Navigator 
          sceneAnimationEnabled={false}
          shifting={false}
          labeled={false}
          initialRouteName='Overview' 
          activeColor='lime'
          inactiveColor='white'
          barStyle={{ backgroundColor: '#5CB724', height: 80}}
        >
          
          <Tab.Screen 
            name="Home" 
            component={Overview}
            options={{
              tabBarColor: '#FF0022',
              tabBarIcon: ({color}) => (
                <Ionicons name="person" color={color} size={26} />
              ),
            }}
          />
          <Tab.Screen 
            name="Chart" 
            component={Friends}
            options={{
              tabBarIcon: ({color}) => (
                <AntDesign name="linechart" color={color} size={26} />
              ),
            }}
          />
          <Tab.Screen 
            name="AddWeight" 
            component={Overview}
            options={{
              tabBarIcon: ({color}) => (
                <View
                  style={{
                    position: 'absolute',
                    bottom: 40,
                    height: 80,
                    width: 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 10000,
                    overflow: 'visible',
                    backgroundColor: 'yellow'
                  }}
                >
                  <AntDesign name="pluscircleo" size={60} color={color} />
                </View>
                
              ),
            }}
          />
          <Tab.Screen 
            name="Friends" 
            component={Friends}
            options={{
              tabBarIcon: ({color}) => (
                <FontAwesome5 name="user-friends" size={26} color={color} />
              ),
            }}
          />
          <Tab.Screen 
            name="Settings" 
            component={Friends}
            options={{
              tabBarIcon: ({color}) => (
                <Ionicons name="settings" size={26} color={color} />
              ),
            }}
          />

        </Tab.Navigator>
      </NavigationContainer>
      {/* <AddWeightButton/> */}
      </>
  );
}

const styles = StyleSheet.create({
  addButtonContainer: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'transparent',
    bottom: 70,
    zIndex: 10,
  },
});
