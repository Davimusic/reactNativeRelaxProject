import React, { useState, useEffect, useRef } from 'react';//mirar
import { View, Text, TouchableOpacity, Pressable, StyleSheet, ScrollView, Image, Animated, Dimensions, LogBox   } from 'react-native';
import { Audio } from 'expo-av';
import Player from './player';
import store from '../funciones/redux/store';
import { updateAudioCurrentTime, updateIsPlaying, updateCoor, updateAudioLike } from '../funciones/redux/actions';
import { play } from '../funciones/player/play';
import { file } from '../funciones/dinamicFiles/dinamicFiles';
import { useSelector } from 'react-redux';
import styles from '../funciones/styles.js/globalStyles';
import { Platform, ActivityIndicator  } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome'; 

let alertShown = false
let count = 0
const AudioPlayer = () => {
  const arrePa = file().getArrePadre()
  //console.log(arrePa);
  //const [sound, setSound] = useState(undefined);
  const [scaleValue] = useState(new Animated.Value(1)); 
  const [isAnimating, setIsAnimating] = useState(false); 
  const [isLoading, setIsLoading] = useState(true);
  
  const contenidoCoor = useSelector((state) => state.coor); 
  const bitRate = useSelector((state) => state.bitRate);
  const audioCurrentTime = useSelector((state) => state.audioCurrentTime);
  const isPlaying = useSelector((state) => state.isPlaying);
  const audioLike = useSelector((state) => state.audioLike);

  /*if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }*/


  useEffect(() => {
    alertShown = true
  }, [audioCurrentTime]);

  function falseAlertShownMobile() {
    alertShown = true
  }
  

  async function loadAudio(d) {
    play(d, 'false', bitRate, '', '')
    alertShown = false
    store.dispatch(updateIsPlaying('true'));
    //setSound(objectAudio);
}

const playSound = async (d) => {
    store.dispatch(updateCoor(d));
    if (contenidoCoor == d) {
        //store.dispatch(updateIsPlaying('false'));
    } else {
        
        loadAudio(d);
        Platform.OS === 'android' || Platform.OS === 'ios' ? setTimeout(() => {falseAlertShownMobile()}, 2000) : null;

        if (!isAnimating) {
            setIsAnimating(true); 
            Animated.sequence([
                Animated.timing(scaleValue, {
                    toValue: 0.9,
                    useNativeDriver: false,
                    duration: 1000,
                }),
                Animated.timing(scaleValue, {
                    toValue: 1,
                    useNativeDriver: false,
                    duration: 1000,
                }),
            ]).start(() => {
                setIsAnimating(false); 
                repeatAnimation(); 
            });
        }
        
    }
};

const repeatAnimation = () => {
    if (!alertShown) {
        Animated.sequence([
            Animated.timing(scaleValue, {
                toValue: 0.9,
                useNativeDriver: false,
                duration: 1000, 
            }),
            Animated.timing(scaleValue, {
                toValue: 1,
                useNativeDriver: false,
                duration: 1000, 
            }),
        ]).start(() => {
            repeatAnimation(); 
        });
    }
};

/*async function getAudioDuration() {
    const { sound } = await Audio.Sound.createAsync({ uri: arrePa[count].linkAudio });
    if(count + 1 < arrePa.length){
        count += 1
        getAudioDuration()
    }
}*/

/*function stopLoad(){
  setIsLoading(false)
}

useEffect(() => {
    setTimeout(stopLoad, 2000)
}, [])*/

const scrollViewRef = useRef();
const itemHeights = useRef({});

useEffect(() => {
    if (scrollViewRef.current && itemHeights.current[contenidoCoor]) {
        let newHeight = 0
        for (let u = 0; u < contenidoCoor; u++) {
            newHeight += itemHeights.current[u]
        }
      scrollViewRef.current.scrollTo({
        y: newHeight,
        animated: true,
      });
    }
  }, [contenidoCoor]);

function audioHeart(index){
    let arr = audioLike.slice();
    arr[index] = !arr[index]
    store.dispatch(updateAudioLike(arr));
}

    return (
        <View style={{ flex: 1}}>
            <ScrollView ref={scrollViewRef} style={styles.audio.container} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                {arrePa.map((item, index) => (
                    <Animated.View  
                        onLayout={(event) => {
                            const { height } = event.nativeEvent.layout;
                            itemHeights.current[index] = height;
                        }}
                        key={index}
                        style={[
                            styles.audio.border,
                            contenidoCoor === index ? styles.generalStyles.fontColors.color1 : styles.generalStyles.fontColors.color2,
                            { transform: [{ scale: contenidoCoor === index ? scaleValue : 1 }]}, // Aplicamos la escala
                    ]} >

                        <Pressable style={[styles.audio.contentContainer, { flex: 1}]} onPress={() => {playSound(index);}}>
                            <Image source={{ uri: item.imagenAudio }} style={styles.audio.imageTitulo} />
                            <View style={styles.audio.textContainer}>
                                <Text style={[styles.generalStyles.tittleText, styles.generalStyles.letterColors.color1]}>{item.titulo}</Text>
                                <ScrollView style={styles.audio.padreConText}>
                                    <Text style={[styles.generalStyles.contentText, styles.generalStyles.letterColors.color1,]}>{item.contenido}</Text>
                                </ScrollView>
                            </View>
                            <Pressable onPress={() => {audioHeart(index);}}>
                                {audioLike[index] === true
                                        ? <FontAwesome name="heart" size={24} color="red" />
                                        : <FontAwesome name="heart" size={24} color="white" />}
                            </Pressable>
                        </Pressable>
                    
                    </Animated.View>

                ))}
            </ScrollView>
        </View>
    );
};

export default AudioPlayer;


