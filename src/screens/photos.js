import React, { Component, useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, Pressable, Image, Platform } from 'react-native';
import {Video, ResizeMode} from 'expo-av'
import styles from '../funciones/styles.js/globalStyles';
import Menu from '../components/menu';
import * as Animatable from 'react-native-animatable';
import { useSelector, useDispatch } from 'react-redux';
import { updateActualScreen } from '../funciones/redux/actions';
import store from '../funciones/redux/store';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;



export default function Photos() {
    const mode = useSelector((state) => state.mode);
    const video = React.useRef(null);

    const [urlPhoto, setUrlPhoto] = useState('https://res.cloudinary.com/dplncudbq/image/upload/v1692978375/mias/f5_khcjl4.png');
    const [urlVideo, setUrlVideo] = useState('https://res.cloudinary.com/dplncudbq/video/upload/v1692931684/mias/v2_ceuddl.mp4');
    const [screen, setScreen] = useState('')
    const [animationState, setAnimationState] = useState('fadeIn')
    const [animate, setAnimate] = useState(false);
    const [actualUse, setActualUse] = useState('image');//image, video
    const [imageArr, setImageArr] = useState( ['https://res.cloudinary.com/dplncudbq/image/upload/v1696908670/h17_piclf3_1_11zon_y4l9uo.webp',
    'https://res.cloudinary.com/dplncudbq/image/upload/v1696908666/h9_mjweif_3_11zon_if4xvg.webp',
    'https://res.cloudinary.com/dplncudbq/image/upload/v1696908665/h1_j5kvru_4_11zon_mussck.webp',
    'https://res.cloudinary.com/dplncudbq/image/upload/v1696908665/h18_pppjp9_2_11zon_bmc02p.webp',
    'https://res.cloudinary.com/dplncudbq/image/upload/v1696908664/f6_kg2owd_8_11zon_qzgmse.webp',
    'https://res.cloudinary.com/dplncudbq/image/upload/v1696908664/f5_khcjl4_9_11zon_ut4umb.webp',
    'https://res.cloudinary.com/dplncudbq/image/upload/v1696908664/f4_a6b89j_7_11zon_y00zoz.webp',
    'https://res.cloudinary.com/dplncudbq/image/upload/v1696908663/f3_w6ble7_6_11zon_r9zfj1.webp',
    'https://res.cloudinary.com/dplncudbq/image/upload/v1696908662/f2_pm0tas_5_11zon_iuo7iq.webp']);


    const [isEnabled, setIsEnabled] = useState(mode === 'light' ? false : true);
    const [darkBackgoundcolor, setDarkBackgoundcolor] = useState(styles.generalStyles.fontColors.color6.backgroundColor);
    const [lightBackgoundcolor, setLightBackgoundcolor] = useState(styles.generalStyles.fontColors.color3.backgroundColor);
    const [index, setIndex] = useState(3); 
    const [videosArr, setVideosArr] = useState([
        'https://res.cloudinary.com/dplncudbq/video/upload/v1655386285/samples/sea-turtle.mp4',
        'https://res.cloudinary.com/dplncudbq/video/upload/v1655386287/samples/elephants.mp4',
        'https://res.cloudinary.com/dplncudbq/video/upload/v1657564051/mias/v1_vysohb.mp4',
        'https://res.cloudinary.com/dplncudbq/video/upload/v1657565053/mias/v4_dediay.mp4',
        'https://res.cloudinary.com/dplncudbq/video/upload/v1692931660/mias/v4_mhcssu.mp4',
        'https://res.cloudinary.com/dplncudbq/video/upload/v1692931684/mias/v2_ceuddl.mp4',
        'https://res.cloudinary.com/dplncudbq/video/upload/v1657988513/mias/y1_b0pxvc.mp4'

    ]);

    const animations = [
        "zoomOut",
        "zoomOutDown",
        "zoomOutUp",
        "zoomOutLeft",
        "zoomOutRight",
        "zoomIn",
        "zoomInDown",
        "zoomInUp",
        "zoomInLeft",
        "zoomInRight",
        "slideOutDown",
        "slideOutUp",
        "slideOutLeft",
        "slideOutRight",
        "slideInDown",
        "slideInUp",
        "slideInLeft",
        "slideInRight",
        "lightSpeedIn",
        "lightSpeedOut",
        "flipInX",
        "flipInY",
        "flipOutX",
        "flipOutY",
        "fadeOut",
        "fadeOutDown",
        "fadeOutDownBig",
        "fadeOutUp",
        "fadeOutUpBig",
        "fadeOutLeft",
        "fadeOutLeftBig",
        "fadeOutRight",
        "fadeOutRightBig",
        "fadeIn",
        "fadeInDown",
        "fadeInDownBig",
        "fadeInUp",
        "fadeInUpBig",
        "fadeInLeft",
        "fadeInLeftBig",
        "fadeInRight",
        "fadeInRightBig", 
        "bounceOut", 
        "bounceOutDown", 
        "bounceOutUp", 
        "bounceOutLeft", 
        "bounceOutRight", 
        "bounceIn", 
        "bounceInDown", 
        "bounceInUp", 
        "bounceInLeft", 
        "bounceInRight"
    ];
    

    const actualScreen = useSelector((state) => state.actualScreen); 
    const screenRef = useRef(screen);

    const handleVideoPress = (videoUrl) => {
        //setCurrentVideo(videoUrl);
    };

    useEffect(() => {
        setScreen(actualScreen);
        console.log(actualScreen);
    }, [actualScreen]);
    
    useEffect(() => {
        screenRef.current = screen;
        if (screenRef.current === 'Photos') {
            if(actualUse === 'image'){
                setAnimate(true); // Activa la animación cuando cambias la imagen
                changeFontImage()
            } else {
                changeFontVideo()
            }
        }
    }, [screen]);

    useEffect(() => {
        // images
        Promise.all(imageArr.map(url => Image.prefetch(url)))
        .then(preloadedImages => {
            console.log('All images preloaded');
            setImageArr(preloadedImages);
        })
        .catch(err => console.error('Error preloading images', err)); 
        /*/ videos 
        (async () => {
            const bitRate = 100; // Define tu bit rate aquí
            const newVideosArr = await Promise.all(videosArr.map(url => getVideoFileWithLowerBitRate(url, bitRate)));
            console.log(toString(newVideosArr));
            setVideosArr(newVideosArr);
        })();*/
    }, []);


    function changeFontImage() {
        console.log(screenRef.current + ' image');
        if (screenRef.current === 'Photos') {
            const randomNum = Math.floor(Math.random() * (imageArr.length - 1)) + 1;
            console.log(randomNum);
            //const newLink = await getImageFileWithLowerQuality(arrPhotos[randomNum])
            if(urlPhoto != imageArr[randomNum]){
                setUrlPhoto(imageArr[randomNum]);
                const randomNumAnimation = Math.floor(Math.random() * (animations.length - 1)) + 1;
                setAnimationState(animations[randomNumAnimation])
            } else {
                alert('iguales')
            }
            setTimeout(changeFontImage, 5000);
        }
    }

    function changeFontVideo() {
        console.log(screenRef.current + ' video');
        if (screenRef.current === 'Photos') {
            console.log(screenRef.current);
            const randomNum = Math.floor(Math.random() * (videosArr.length - 1)) + 1;
            setIndex(randomNum);
            setTimeout(changeFontVideo, 5000);
        }
    }

    /*async function getImageFileWithLowerQuality(originalUrl) {       
        const fileUrl = originalUrl.split('https://res.cloudinary.com/dplncudbq/image/upload/')[1];
        return `https://res.cloudinary.com/dplncudbq/image/upload/q_50/${fileUrl}`;
    }*/
    async function getVideoFileWithLowerBitRate(originalUrl, bitRate) {
    const fileUrl = originalUrl.split('https://res.cloudinary.com/dplncudbq/video/upload/')[1];
    return `https://res.cloudinary.com/dplncudbq/video/upload/br_${bitRate}/${fileUrl}`;
    }
    
    // video
    useEffect(() => {
        const dicc = {'dark': false, 'light': true}
        setIsEnabled(dicc[mode])
    }, [mode]);


    const handleVideoEnd = () => {
        index < videosArr.length - 1 ? setIndex(index + 1) : setIndex(0)
    };

    async function getVideoFileWithLowerBitRate(originalUrl, bitRate) {
        const fileUrl = originalUrl.split('https://res.cloudinary.com/dplncudbq/video/upload/')[1];
        console.log(`https://res.cloudinary.com/dplncudbq/video/upload/q_auto:eco,br_${bitRate}/${fileUrl}`);
        return `https://res.cloudinary.com/dplncudbq/video/upload/q_auto:eco,br_${bitRate}/${fileUrl}`;
    }

    useEffect(() => {
        console.log('pre');
        // Preload all videos.
        const preloadVideos = async () => {
          const promises = [];
          for (const videoUrl of videosArr) {
            promises.push(getVideoFileWithLowerBitRate(videoUrl, 100)); // Define your bit rate here.
          }
      
          await Promise.all(promises);
        };
      
        preloadVideos();
      }, [videosArr]);
    
    return (
        <View style={[{ paddingTop: Platform.OS === 'web' ? 0 : 30 }, styl.container, { backgroundColor: isEnabled ? lightBackgoundcolor : darkBackgoundcolor }]}>
            <Menu>
                {actualUse === 'image' ? (
                    <View style={styles.photos.container}>
                        <Pressable onPress={() => handleVideoPress(arrVideos[0])}>
                            <Animatable.View
                                animation={animationState}
                                duration={5000}
                                iterationCount={1000}
                                style={styles.photos.photoContainer}
                            >
                                <Image source={{ uri: urlPhoto }} style={styles.photos.photo} />
                            </Animatable.View>
                        </Pressable>
                    </View>
                ) : (
                    
                        <Video
                            ref={video}
                            style={[styl.video]}
                            source={{ uri: videosArr[index] }}
                            useNativeControls
                            resizeMode={ResizeMode.CONTAIN}
                            isLooping
                            shouldPlay
                            onError={(e) => {
                                alert(e);
                            }}
                            
                        />
                    
                )}
            </Menu>
        </View>
    );    
}


const styl = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
    },
    video: {
      flex:1,
      width: screenWidth,
      height: screenHeight,
    },
});




