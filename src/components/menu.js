import React, { useState, useEffect  } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, Dimensions, StatusBar, Platform, Pressable, Animated, ActivityIndicator } from 'react-native';
import { Switch } from 'react-native-paper';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import styles from '../funciones/styles.js/globalStyles';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { updateActualScreen, updateMode, updateAudioLike } from '../funciones/redux/actions';
import store from '../funciones/redux/store';
import { Picker } from '@react-native-picker/picker';
import { file } from '../funciones/dinamicFiles/dinamicFiles';


//icons
import FontAwesome from '@expo/vector-icons/FontAwesome'; 
/*import {Message} from '@styled-icons/boxicons-solid/Message'
import {LogoutCircle} from '@styled-icons/remix-fill/LogoutCircle'
import {MusicPlayerFill} from '@styled-icons/bootstrap/MusicPlayerFill'
import {Collections} from '@styled-icons/fluentui-system-filled/Collections'
import {MusicNote2Play} from '@styled-icons/fluentui-system-filled/MusicNote2Play'*/

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Menu = ({ children }) => {
  const actualScreen = useSelector((state) => state.actualScreen);
  const mode = useSelector((state) => state.mode);
  const tags = useSelector((state) => state.tags);

  const [isViewVisible, setViewVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(mode === 'light' ? false : true);
  const [darkBackgoundcolor, setDarkBackgoundcolor] = useState(styles.generalStyles.fontColors.color6.backgroundColor);
  const [lightBackgoundcolor, setLightBackgoundcolor] = useState(styles.generalStyles.fontColors.color3.backgroundColor);
  const [tagNames, setTagNames] = useState([]);
  const [selectedValue, setSelectedValue] = useState('dormir');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigation = useNavigation();

  useEffect(() => {
    setTagNames(tags)
  }, [tags]);

  const changeDimension = {
    width: screenWidth,
    height: screenHeight,//screenHeight - 70,
    position: 'absolute',
    top: 0,
    zIndex: 31,
    alignItems: 'center',
    justifyContent: 'center',
    display: isViewVisible ? 'flex' : 'none',
    //opacity: new Animated.Value(1),
  };

  const toggleView = () => {
    setViewVisible(!isViewVisible);
  };

  const animateOpacity = (value, duration = 500) => {
    Animated.timing(value, {
      toValue: isViewVisible ? 1 : 0,
      duration: duration,
      useNativeDriver: true,
    }).start();
  };

  const menuAcc = () => {
    toggleView();
    //animateOpacity(changeDimension.opacity);
  };

  const arr = [
    { title: 'Log out', route: 'Login', image: '../../assets/images/logo.png' },
    { title: 'Contact', route: 'ContactUs', image: '../../assets/images/logo.png' },
    { title: 'Music player', route: 'MusicPlayer', image: '../../assets/images/logo.png' },
    { title: 'Mis Favoritos', route: 'Photos', image: '../../assets/images/logo.png' },
    { title: 'Mis Más Reproducidos', route: 'link5', image: '../../assets/images/logo.png' },
  ];

  const link = (route) => {
    navigation.navigate(route);
    store.dispatch(updateActualScreen(route));
    toggleView()
  };

  const renderMenuItems = () => {
    return arr.map((item, index) => (
      <Pressable key={index} onPress={() => link(item.route)} style={[styles.menu.itemsContainer, styles.menu.paddingTop]}>
        <View style={{ flexDirection: 'row', width: (screenWidth / 100) * 40 }}>
          
          <Text style={[styles.generalStyles.tittleText, { color: isEnabled ? lightBackgoundcolor : darkBackgoundcolor }]}>
            {item.title}
          </Text>
        </View>
      </Pressable>
    ));
  };

  const handleChange = (itemValue) => {
    setSelectedValue(itemValue);
    setIsLoading(true)
    fetch(`https://back-relax-project.vercel.app/api/tipos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tags: itemValue }), // Aquí puedes cambiar el filtro
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        file().setArrePadre(data);
        setIsLoading(false);
        let audioLike = file().getArrePadre().map(doc => doc.meGusta);
        store.dispatch(updateAudioLike(audioLike));
      })
      .catch(error => console.error(error));
  }

  const renderTagsOption = () =>{
    return (
      <View style={[styles.menu.containerPiker]}>
          <Picker
              selectedValue={selectedValue}
              style={[styles.menu.picker, styles.generalStyles.contentText, {borderColor: 'transparent', backgroundColor: isEnabled ? darkBackgoundcolor : lightBackgoundcolor }, { color: isEnabled ? lightBackgoundcolor : darkBackgoundcolor }]}
              onValueChange={handleChange}
          >
              {tagNames.map((item, index) => (
                  <Picker.Item key={index} label={item.charAt(0).toUpperCase() + item.slice(1)} value={item} />
              ))}
          </Picker>
      </View>
    );
  };


  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    const dicc = {false: 'dark', true: 'light'}
    store.dispatch(updateMode(dicc[isEnabled]));
  };
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#80000000' }}>
        <ActivityIndicator size="large" color="white" style={{ transform: [{ scale: 4 }] }}  />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.menu.containerMenu]}>
      <View style={[styles.menu.header, { backgroundColor: isEnabled ? darkBackgoundcolor : lightBackgoundcolor }]}>
        <FontAwesome name="pagelines" size={50} color="green" />
        
        <Switch
          value={isEnabled}
          onValueChange={toggleSwitch}
          color={isEnabled ? '#FFFFFF' : '#000000'}
        />

        {renderTagsOption()}
        <Pressable onPress={menuAcc}>
        <FontAwesome name="bars" size={50} color={isEnabled ? lightBackgoundcolor : darkBackgoundcolor} />
        </Pressable>
      </View>
        <View style={[changeDimension, { backgroundColor: isEnabled ? darkBackgoundcolor : lightBackgoundcolor }]}>
          {renderMenuItems()}
        </View>
        {children}
    </SafeAreaView>
  );
};

export default Menu;






