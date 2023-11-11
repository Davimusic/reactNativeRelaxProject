import React, { useState, useEffect } from "react";
import { PanResponder, View, Dimensions } from "react-native";
import { useSelector } from 'react-redux';
import styles from "../funciones/styles.js/globalStyles";

export default function Slide(val) {
  const screenWidth = Dimensions.get("window").width;
  const soundObject = useSelector((state) => state.soundObject); 
  const audioDuration = useSelector((state) => state.audioDuration);
  const [value, setValue] = useState(0);
  const [range, setRange] = useState([0, audioDuration]); // Nuevo estado para el rango

  const handleValueChange = (value) => {
    if(typeof soundObject === 'object' && soundObject._key){
      setValue(value)
      soundObject._key.currentTime = value
    }
  };

  /*/ Nueva función para manejar el cambio de rango
  const handleRangeChange = (range) => {
    if(typeof soundObject === 'object' && soundObject._key){
      setRange(range)
      soundObject._key.currentTime = range[0]
    }
  };*/

  

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      let newValue = gestureState.moveX / screenWidth * audioDuration;
      handleValueChange(newValue);
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if(typeof soundObject === 'object' && soundObject._key){
        console.log(value / audioDuration * ((screenWidth / 100) * 60));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    //console.log(val['newValue']);
    setValue(val['newValue'])
  }, [val]);

  const widthSlide = screenWidth <= 1200 ? 40 : 60;
  
  
  return (
    <View
      style={{
        width: (screenWidth / 100) * widthSlide,
        height: 3,
        justifyContent: "center",
        backgroundColor: styles.generalStyles.fontColors.color3.backgroundColor,
      }}
    >
      <View
        {...panResponder.panHandlers}
        style={{
          width: audioDuration ? value / audioDuration * ((screenWidth / 100) * widthSlide) : 0,
            height: 3,
            backgroundColor: styles.generalStyles.fontColors.color1.backgroundColor,
        }}
      />
    </View>
  );
}





