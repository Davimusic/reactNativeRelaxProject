import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { changeValumeAudio } from '../funciones/player/play';

export function VolumeSlider({indexAudio}) {
  const [volume, setVolume] = useState(99)

  const mostrarAlerta = (newValue) => {
    //alert(indexAudio);
    setVolume(newValue)
    changeValumeAudio(indexAudio,newValue)
  };

  const botones = [];
for (let i = 0; i < 100; i++) {
  botones.push(
    <TouchableOpacity key={i} onPress={() => mostrarAlerta(i)} style={styles.touchable}>
      <View style={[
        styles.view, 
        {backgroundColor: i <= volume ? 'white' : 'black'}, 
        i === 0 ? {borderTopLeftRadius: 50, borderBottomLeftRadius: 50} : {},
        i === 99 ? {borderTopRightRadius: 50, borderBottomRightRadius: 50} : {}
      ]} />
    </TouchableOpacity>
  );
}

  


  return (
    <View style={styles.container}>
      {botones}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        marginTop: Platform.OS === 'web' ? 10 : 50,
      width: '50%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    touchable: {
      width: '1%',
    },
    view: {
      height: Platform.OS === 'web' ? 3 : 10,
      width: '100%',
    },
  });

export default VolumeSlider;





