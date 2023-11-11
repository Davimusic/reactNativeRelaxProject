import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, FlatList, Pressable  } from 'react-native';
import { useSelector } from 'react-redux';
import { play } from '../funciones/player/play';
import store from '../funciones/redux/store';
import { updateAudioCurrentTime, updateIsPlaying, updateCoor, updateNextActionAudio, updateMode } from '../funciones/redux/actions';
import {file} from '../funciones/dinamicFiles/dinamicFiles'
import styles from '../funciones/styles.js/globalStyles';
import { seconToMinute } from '../funciones/time/seconToMinute';
import { Platform } from 'react-native';
import Slide from './slider';
import VolumeSlider from './volumeSlider';
//icons
import FontAwesome from '@expo/vector-icons/FontAwesome'; 
//import {Shuffle} from '@styled-icons/entypo'

//let localAudioCoor = 0;
let num = 0;
const Player = () => {
    const audioCurrentTime = useSelector((state) => state.audioCurrentTime);
    const audioDuration = useSelector((state) => state.audioDuration);
    const isplaying = useSelector((state) => state.isPlaying); 
    const bitRate = useSelector((state) => state.bitRate);
    const coor = useSelector((state) => state.coor);
    const nextActionAudio = useSelector((state) => state.nextActionAudio);
    const mode = useSelector((state) => state.mode);


    //const [meGustasColeccion, setMeGustasColeccion] = useState();
    const [startUsing, setStartUsing] = useState(false)
    const [screen, setScreen] = useState('')
    const [localAudioCoor, SetLocalAudioCoor] = useState(coor === -1 ? 0 : coor)
    const [audioUse, setAudioUse] = useState('next')
    const [isEnabled, setIsEnabled] = useState(mode === 'light'? true : false);
    const [darkBackgoundcolor, setDarkBackgoundcolor] = useState(styles.generalStyles.fontColors.color6.backgroundColor);
    const [lightBackgoundcolor, setLightBackgoundcolor] = useState(styles.generalStyles.fontColors.color3.backgroundColor);
    const arrePa = file().getArrePadre()

    
    
    const screenRef = useRef(screen);

    useEffect(() => {
      setScreen(audioCurrentTime);
      //console.log(audioCurrentTime);
    }, [audioCurrentTime]);

    useEffect(() => {
      if(startUsing === true){
        store.dispatch(updateIsPlaying('false'));
        store.dispatch(updateCoor(localAudioCoor));
        play(localAudioCoor, 'false', bitRate, '', '');
      }
    }, [localAudioCoor]);

    useEffect(() => {
      setIsEnabled(previousState => !previousState);
      const dicc = {false: 'dark', true: 'light'}
      store.dispatch(updateMode(dicc[isEnabled]));
    }, [mode]);

    useEffect(() => {
      if(coor != -1){
        setStartUsing(true)
        SetLocalAudioCoor(coor)
      }
    }, [coor]);

    useEffect(() => {
      screenRef.current = screen;
    }, [screen]);

    function accionMeGustaColeccion(){
        alert(isplaying)
    }
    
    function playActualAudio() {
      //console.log(`playActualAudio entra localAudioCoor: ${localAudioCoor}`);
      const togglePlayStatus = { 'false': 'true', 'true': 'false'};
      //const currentCoor = coor === -1 ? 0 : coor;
      const shouldTogglePlay = localAudioCoor === coor;
      const nextPlayStatus = shouldTogglePlay ? togglePlayStatus[isplaying] : 'true';
    
      if(startUsing === false){
        play(localAudioCoor, 'false', bitRate, '', '');
        store.dispatch(updateIsPlaying('false'));
      } else {
        play(localAudioCoor, nextPlayStatus, bitRate, '', '');
        store.dispatch(updateIsPlaying(nextPlayStatus));
      }
    
      if (coor === -1) {
        store.dispatch(updateCoor(0));
      }
    
      setStartUsing(true)
    }

    function nextAudio() {
      //console.log(`nextAudio entra localAudioCoor: ${localAudioCoor}`);
      let newLocalAudioCoor
      if (nextActionAudio === '' || nextActionAudio === 'next' || nextActionAudio === 'repeat') {
          newLocalAudioCoor = (arrePa.length > ((localAudioCoor === coor) 
          ? coor : localAudioCoor) + 1) 
          ? ((localAudioCoor === coor) 
          ? coor : localAudioCoor) + 1 : 0;
      } else if (nextActionAudio === 'random') {
          newLocalAudioCoor = Math.floor(Math.random() * (arrePa.length - 1)) + 1;
      }
      SetLocalAudioCoor(newLocalAudioCoor)
      /*store.dispatch(updateIsPlaying('false'));
      store.dispatch(updateCoor(localAudioCoor));
      play(localAudioCoor, 'false', bitRate, '', '');*/
      setStartUsing(true)
      //console.log(`nextAudio salida localAudioCoor: ${localAudioCoor}`);
    }

    function previousAudio() {
      //console.log(`previousAudio entra localAudioCoor: ${localAudioCoor}`);
      let newLocalAudioCoor
      if (nextActionAudio === '' || nextActionAudio === 'next' || nextActionAudio === 'repeat') {
          newLocalAudioCoor = (0 <= ((localAudioCoor === coor) 
          ? coor : localAudioCoor) - 1) 
          ? ((localAudioCoor === coor) 
          ? coor : localAudioCoor) - 1 : arrePa.length - 1;
      } else if (nextActionAudio === 'random') {
          newLocalAudioCoor = Math.floor(Math.random() * (arrePa.length - 1)) + 1;
      }
      SetLocalAudioCoor(newLocalAudioCoor)
      /*store.dispatch(updateIsPlaying('false'));
      store.dispatch(updateCoor(localAudioCoor));
      play(localAudioCoor, 'false', bitRate, '', '');*/
      setStartUsing(true)
      //console.log(`previousAudio salida localAudioCoor: ${localAudioCoor}`);
    }
  


const dicc = {0: 'next', 1: 'repeat', 2: 'random'}; 
const imageDicc = {
  'next':   <FontAwesome name='arrow-right'  size={24} color={isEnabled ? darkBackgoundcolor : lightBackgoundcolor} />,
  'repeat': <FontAwesome name='rotate-right' size={24} color={isEnabled ? darkBackgoundcolor : lightBackgoundcolor} />,
  'random': 'shuffle'}
function useAudio(){
  num = (num + 1) % 3; 
  setAudioUse(dicc[num]); 
  play('','','','',dicc[num])
  store.dispatch(updateNextActionAudio(dicc[num]));
}

//const screenWidth = Dimensions.get('window').width;
const styleImagesPlayer = { height: 40, width: 40, }//backgroundColor: 'trasnparent' 

  return (
    <View style={styles.audioPlayer.contenedorPlayer}>
      <View style={styles.audioPlayer.contenedoresPlayerHijos}>
        <Pressable onPress={accionMeGustaColeccion}>
          <FontAwesome name="heart" size={24}     color={isEnabled ? darkBackgoundcolor : lightBackgoundcolor} />
        </Pressable>
        <Pressable onPress={previousAudio}>
          {<FontAwesome name="backward" size={24} color={isEnabled ? darkBackgoundcolor : lightBackgoundcolor} />}
        </Pressable>
        <Pressable onPress={playActualAudio}>
          {isplaying === 'true'
          ? <FontAwesome name="play" size={24}  color={isEnabled ? darkBackgoundcolor : lightBackgoundcolor} />
          : <FontAwesome name="pause" size={24} color={isEnabled ? darkBackgoundcolor : lightBackgoundcolor} />}
        </Pressable>
        <Pressable onPress={nextAudio}>
          {<FontAwesome name="forward" size={24} color={isEnabled ? darkBackgoundcolor : lightBackgoundcolor} />}
        </Pressable>
        <Pressable onPress={useAudio}>
          {imageDicc[audioUse]}
        </Pressable>
      </View>
      
      {Platform.OS === 'web' ? 
        <View style={[styles.audioPlayer.contenedoresPlayerHijos, styles.audioPlayer.paddingBottomPlayer]}>
          <Text style={[styles.generalStyles.letterColors.color1, styles.generalStyles.contentText,]}>{audioCurrentTime !== null && !isNaN(audioCurrentTime) ? seconToMinute(audioCurrentTime) : '00:00'} min.</Text>
          <Slide newValue={audioCurrentTime} /> 
          <Text style={[styles.generalStyles.letterColors.color1, styles.generalStyles.contentText, ]}>{audioDuration !== null && isNaN(audioDuration) ? 0 : seconToMinute(audioDuration)} min.</Text>
        </View>:
        null}
        
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 30}}>
          <VolumeSlider indexAudio={0}/>
          <VolumeSlider indexAudio={1}/>
        </View>

      
    </View>
  );
};//{audioCurrentTime !== null && !isNaN(audioCurrentTime) ? seconToMinute(audioCurrentTime) : '00:00'}

export default Player;