import { Audio } from 'expo-av';
import axios from 'axios';
import { file } from '../dinamicFiles/dinamicFiles';
import store from '../redux/store';
import { updateAudioCurrentTime, updateIsPlaying, updateCoor, updateSoundObject, updateAudioDuartion } from '../redux/actions';
import { preload } from './preload';
import { Platform } from 'react-native';

let useId = 0;
let localSoundObject;
let localVolumeSoundObject = 1
let localSecundarySoundObject;
let localVolumeSecundarySoundObject = 1
let localIsplaying;
let localbitRate;
let soundObjects = []; 
let localNextActionAudio = '';
let nextSoundObject;
let isRunning = false;
let canCall = true;

export async function play(coor, isplaying, bitRate, preload, nextActionAudio) {
    console.log(`llamado: coor: ${coor}, isplaying: ${isplaying}, bitRate: ${bitRate}`);
    localbitRate = bitRate
    localIsplaying = isplaying;
    const arrePa = file().getArrePadre(); 

    async function getAudioFileWithLowerBitRate(originalUrl) {       
        const fileUrl = originalUrl.split('https://res.cloudinary.com/dplncudbq/video/upload/')[1];
        return `https://res.cloudinary.com/dplncudbq/video/upload/br_${bitRate}/${fileUrl}`;
    }
    
    /*if (localSecundarySoundObject && localIsplaying === 'true'){
        localSecundarySoundObject.pauseAsync()
    }*/

    if (localSecundarySoundObject){
        localSecundarySoundObject.pauseAsync()
    }



    if(preload === `preload`){
        for (let i = 0; i < arrePa.length; i++) {
            if (!soundObjects[i]) {
                const { sound } = await Audio.Sound.createAsync(
                    { uri: await getAudioFileWithLowerBitRate(arrePa[i].linkAudio),
                        shouldCorrectPitch: false, }
                );
                soundObjects[i] = sound;
            }
        }
    } else if(nextActionAudio != ''){
        localNextActionAudio = nextActionAudio
        //alert(`actualizò: ${nextActionAudio}`)
    } else {    
        if (localIsplaying === 'true') {
            if (localSoundObject) {
                localSoundObject.pauseAsync();
            }
        } else {
            if (localSoundObject) {
                await localSoundObject.unloadAsync();
            }
            
            const { sound } = await Audio.Sound.createAsync(
                { uri: await getAudioFileWithLowerBitRate(arrePa[coor].linkAudio),
                    //shouldCorrectPitch: true,
                    //rate: 0.5,
                    }, 
                {},
                (status) => {
                    if (status.didJustFinish) {
                        if(localNextActionAudio === '' || localNextActionAudio === 'next'){
                            useId = (arrePa.length > coor + 1) ? coor + 1 : 0;
                        } else if(localNextActionAudio === 'repeat'){
                            useId = coor
                        } else if(localNextActionAudio === 'random'){
                            useId = Math.floor(Math.random() * (arrePa.length - 1)) + 1;
                        }
                        //alert(`coor: ${coor}`);
                        //alert(`useId: ${useId}`);
                        store.dispatch(updateCoor(useId));
                        play(useId, 'false', localbitRate, '', '')
                    }
                }
            );
            localSoundObject = sound;
            secondAudio()
            store.dispatch(updateSoundObject(localSoundObject));
            let isPlaying = false;
            let attempts = 0;

            const timer = setInterval(async () => {
                if (isPlaying || attempts >= 10) {
                clearInterval(timer);
                if (!isPlaying) {
                    alert('No se pudo reproducir el sonido');
                }
                } else {
                try {
                    const status = await localSoundObject.getStatusAsync();
                    if (status.isLoaded) {
                    await localSoundObject.playAsync();
                    await localSoundObject.setVolumeAsync(localVolumeSoundObject)
                    isPlaying = true; // Si se reproduce correctamente, sal del bucle
                    } else {
                    console.error('El sonido no se ha cargado aún');
                    }
                } catch (error) {
                    console.error('Error al reproducir el sonido:', error);
                    // Aquí puedes manejar el error como mejor te parezca
                }
                attempts++;
                }
            }, 1000);
            
            Platform.OS === 'web' ? hola() : null;
            useId = coor;
        }
    
        function hola() {
            if (isRunning) return; // If hola is already running, don't start another instance
        
            isRunning = true; // Set the flag to true as hola is now running
        
            console.log('hola');
            console.log(`coor: ${coor}, useId: ${useId}`);
            (localSoundObject._key && localSoundObject._key.currentTime != null) ? store.dispatch(updateAudioCurrentTime(localSoundObject._key.currentTime)) : 0;
            (localSoundObject._key && localSoundObject._key.duration != null) ? store.dispatch(updateAudioDuartion(localSoundObject._key.duration)) : 0;
        
            if (localIsplaying === 'false') {
                setTimeout(() => {
                    isRunning = false; // Reset the flag as hola has finished running
                    hola(); // Call hola again
                }, 1000);
            } else {
                isRunning = false; // Reset the flag as hola has finished running
            }
        }
    }

    async function secondAudio(){
        let arreRelaxSounds = ['https://res.cloudinary.com/dplncudbq/video/upload/v1699541584/n3_mlrx1n.mp3',
                                'https://res.cloudinary.com/dplncudbq/video/upload/v1699541559/n2_gbo4z8.mp3',
                                'https://res.cloudinary.com/dplncudbq/video/upload/v1699541533/n9_f7idw9.mp3',
                                'https://res.cloudinary.com/dplncudbq/video/upload/v1699541528/n10_yhgepz.mp3',
                                'https://res.cloudinary.com/dplncudbq/video/upload/v1699541483/n5_qdufhp.mp3',
                                'https://res.cloudinary.com/dplncudbq/video/upload/v1699541461/n11_dcpomq.mp3',
                                'https://res.cloudinary.com/dplncudbq/video/upload/v1699541453/n4_z3kor4.mp3',
                                'https://res.cloudinary.com/dplncudbq/video/upload/v1699541450/n7_wvf4if.mp3',
                                'https://res.cloudinary.com/dplncudbq/video/upload/v1699541446/n12_sk8ytz.mp3',
                                'https://res.cloudinary.com/dplncudbq/video/upload/v1699541446/n6_x6dtpc.mp3',
                                'https://res.cloudinary.com/dplncudbq/video/upload/v1699541444/n8_yt4qnz.mp3',
                                'https://res.cloudinary.com/dplncudbq/video/upload/v1699541429/n1_g0bnqy.mp3'
        ]

        if (localSecundarySoundObject) {
            localSecundarySoundObject.pauseAsync();
        }

        if (!canCall) return; 

        canCall = false; 
        setTimeout(() => { canCall = true; }, 3000);
        
            //if (localIsplaying === 'true') {
                
            //} else {
                let random = Math.floor(Math.random() * arreRelaxSounds.length);
                console.log(random);
                const { sound } = await Audio.Sound.createAsync(
                    { uri: await getAudioFileWithLowerBitRate(arreRelaxSounds[random]),
                        //shouldCorrectPitch: true,
                        //rate: 0.5,
                        }, 
                    {},
                    (status) => {
                        if (status.didJustFinish) {
                            //alert('acabo second');
                            if(localIsplaying === 'true'){
                                secondAudio()
                            }
                        }
                    }
                );
                localSecundarySoundObject = sound
                await sound.playAsync();
                await localSecundarySoundObject.setVolumeAsync(localVolumeSecundarySoundObject)
                //alert(localIsplaying)
            //}
        
    }
}

export async function changeValumeAudio(indexAudio, newVolume){
    const value = (newVolume/ 100)
    if(indexAudio === 0){
        await localSoundObject.setVolumeAsync(value)
        localVolumeSoundObject = value
    } else {
        await localSecundarySoundObject.setVolumeAsync(value)
        localVolumeSecundarySoundObject= value
    }
    
}






