import React, { useEffect, useRef, useState } from 'react';
import { View, Animated } from 'react-native';

const ProgressBar = ({ durationInSeconds, setModalVisibilty }) => {
  const [barWidth, setBarWidth] = useState(new Animated.Value(0));
  const barAnimation = useRef<any>(null);

  useEffect(() => {
    const fillProgressBar = () => {
      barAnimation.current = Animated.timing(barWidth, {
        toValue: 1,
        duration: durationInSeconds * 1000, // Convert to milliseconds
        useNativeDriver: false,
      }).start(() => {
        // Animation completed
        setModalVisibilty(false);
      });
    };

    fillProgressBar();

    return () => {
      if (barAnimation.current) {
        barAnimation.current.stop();
      }
    };
  }, [barWidth, durationInSeconds, setModalVisibilty]);

  const barColor = barWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['white', 'orange'],
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: 'white', height: 10, overflow: 'hidden' }}>
        <Animated.View
          style={{
            backgroundColor: barColor,
            height: '100%',
            width: '100%',
            transform: [{ translateX: barWidth.interpolate({ inputRange: [0, 1], outputRange: [-100, 0] }) }],
          }}
        />
      </View>
    </View>
  );
};

export default ProgressBar;
