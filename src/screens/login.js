import React, { useState, useEffect, useCallback, useRef  } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Dimensions, TouchableOpacity, ImageBackground, Pressable, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import store from '../funciones/redux/store';
import { updateActualScreen, updateAudioLike, updateTags } from '../funciones/redux/actions';
import styles from '../funciones/styles.js/globalStyles';
import { play } from '../funciones/player/play';
import { file } from '../funciones/dinamicFiles/dinamicFiles';
import loginFech from '../funciones/fetchRequestsFronted/loginFech';
import fechCreateNewAccount from '../funciones/fetchRequestsFronted/fechCreateNewAccount';
import * as Animatable from 'react-native-animatable'; 

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [urlPhoto, setUrlPhoto] = useState('https://res.cloudinary.com/dplncudbq/image/upload/v1692978375/mias/f5_khcjl4.png');
  const [screen, setScreen] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [stateLogin, setStateLogin] = useState('Login');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  

  const arrPhotos = [
    'https://res.cloudinary.com/dplncudbq/image/upload/v1696908662/f2_pm0tas_5_11zon_iuo7iq.webp',
    'https://res.cloudinary.com/dplncudbq/image/upload/v1696908663/f3_w6ble7_6_11zon_r9zfj1.webp',
    'https://res.cloudinary.com/dplncudbq/image/upload/v1696908664/f4_a6b89j_7_11zon_y00zoz.webp',
    'https://res.cloudinary.com/dplncudbq/image/upload/v1696908664/f6_kg2owd_8_11zon_qzgmse.webp',
    'https://res.cloudinary.com/dplncudbq/image/upload/v1696908665/h18_pppjp9_2_11zon_bmc02p.webp',
    'https://res.cloudinary.com/dplncudbq/image/upload/v1696994289/PhotoReal_awesome_city_4k_sun_shine_0_11zon_f6uqjp.webp',
  ];

  const bitRate = useSelector((state) => state.bitRate);
  useEffect(() => {
    play('', '', bitRate, 'preload')
  }, []);

  const actualScreen = useSelector((state) => state.actualScreen); 
  const screenRef = useRef(screen);

  useEffect(() => {
    setScreen(actualScreen);
    console.log(actualScreen);
  }, [actualScreen]);

  useEffect(() => {
    screenRef.current = screen;
    changeFontImage()
  }, [screen]);

  function changeFontImage() {
    console.log(screenRef.current);
    if (screenRef.current === 'Login') {
        const randomNum = Math.floor(Math.random() * (arrPhotos.length - 1)) + 1;
        console.log(randomNum);
        setUrlPhoto(arrPhotos[randomNum]);
        setTimeout(changeFontImage, 2000);
    }
  }

  async function handleLogin() {
    const isValid = validarEmailPassword(email, password);
    
    if (!isValid) {
      return;
    }

    if(stateLogin === 'Create account'){
      if(repeatPassword != password){
        return alert('The passwords entered did not match')
      }
    }
    
    try {
      setIsSendingEmail(true)
      console.log('fue true');
      if (stateLogin === 'Login') {
        const loginResult = await loginFech(email, password);
        console.log(loginResult);
        if (loginResult === true) {
          store.dispatch(updateActualScreen('MusicPlayer'));
          navigation.navigate('MusicPlayer');
          fetchs()
        } else {
          alert(loginResult);
        }
        //setIsSendingEmail(false)
      } else {
        const accountCreationResult = await fechCreateNewAccount(email, password);
        //setIsSendingEmail(false)
        if (accountCreationResult === true) {
          store.dispatch(updateActualScreen('MusicPlayer'));
          navigation.navigate('MusicPlayer');
          fetchs()
        } else {
          alert(accountCreationResult);
        }
      }
      setIsSendingEmail(false)
    } catch (error) {
      console.error('Error:', error);
    }
  }
  

  const changeStateLogin = () =>{
    const dicc = {'Create account': 'Login', 'Login': 'Create account'}
    setStateLogin(dicc[stateLogin])
  }

  function validarEmailPassword(email, password) {
    var regexEmail = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

    if (!regexEmail.test(email)) {
        alert("El campo de correo electrónico no es válido.");
        return false;
    }

    if (password.length <= 5) {
        alert("La contraseña debe tener más de 5 caracteres.");
        return false;
    }

    return true;
  }

  const screenWidth = Dimensions.get('window').width;
  let acc = screenWidth > 1200

  function fetchs(){
    //alert('XD')
    fetch(`https://back-relax-project.vercel.app/api/tags`, {
      method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      store.dispatch(updateTags(data));
    })
    .catch(error => console.error(error));


    /*fetch(`http://192.168.0.3:3000/api/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tags: 'meditar' }), // Aquí puedes cambiar el filtro
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        file().setArrePadre(data);
        setIsLoading(false);
        let audioLike = file().getArrePadre().map(doc => doc.meGusta);
        store.dispatch(updateAudioLike(audioLike));
      })
      .catch(error => console.error(error));*/

      // testeo
      fetch(`https://back-relax-project.vercel.app/api/tipos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tags: 'meditar' }), // Aquí puedes cambiar el filtro
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

  /*useEffect(() => {
    setIsSendingEmail(false)
          store.dispatch(updateActualScreen('MusicPlayer'));
          navigation.navigate('MusicPlayer');
          fetchs()
  }, []);*/

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
        <ActivityIndicator size="large" color="white" style={{ transform: [{ scale: 4 }] }}  />
      </View>
    );
  }

  return (
    <View style={styles.app.containerApp}>
      <View style={styles.login.container}>
          <View style={[styles.login.content, styles.generalStyles.fontColors.color4]}>
            {acc ? (
              <View style={{flexDirection: 'row'}}>
                <View style={[styles.login.loginBox, styles.generalStyles.fontColors.color1]}>
                  <Text style={[styles.generalStyles.tittleText, styles.generalStyles.letterColors.color1]}>{stateLogin}</Text>
                  <TextInput
                    style={[styles.login.input, styles.generalStyles.letterColors.color1, styles.generalStyles.contentText]}
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    placeholderTextColor="#ffffff"
                  />
                  <TextInput
                    style={[styles.login.input, styles.generalStyles.letterColors.color1, styles.generalStyles.contentText]}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    placeholderTextColor="#ffffff"
                  />
                  {stateLogin === 'Create account' ? <TextInput
                                                        style={[styles.login.input, styles.generalStyles.letterColors.color1, styles.generalStyles.contentText]}
                                                        placeholder="Repeat the password"
                                                        secureTextEntry
                                                        value={repeatPassword}
                                                        onChangeText={(text) => setRepeatPassword(text)}
                                                        placeholderTextColor="#ffffff"
                                                      /> : null}
                  {isSendingEmail ? (
                  <Animatable.Text animation="zoomOut" iterationCount="infinite" direction="alternate">
                    <Pressable onPress={handleLogin}>
                      <Text style={[styles.generalStyles.tittleText, styles.generalStyles.letterColors.color1, styles.login.boton, styles.generalStyles.fontColors.color1,]}>{stateLogin}</Text>
                    </Pressable>
                  </Animatable.Text> 
                  ) : (
                    <Pressable onPress={handleLogin}>
                      <Text style={[styles.generalStyles.tittleText, styles.generalStyles.letterColors.color1, styles.login.boton, styles.generalStyles.fontColors.color1,]}>{stateLogin}</Text>
                    </Pressable>
                  )}                               
                  <Pressable onPress={changeStateLogin} style={[]}>
                  <Text style={[styles.generalStyles.letterColors.color1, styles.generalStyles.contentText, styles.generalStyles.contentText,]}>{stateLogin === 'Login' ? 'Create account' : 'Login'}</Text>
                  </Pressable>
                  <Text style={[styles.generalStyles.letterColors.color1, styles.generalStyles.contentText, styles.generalStyles.contentText,]}>¿Did you forget your password?</Text>
                </View>
                <ImageBackground
                  source={{ uri: urlPhoto }}
                  style={[
                    styles.login.backgroundImageLogin,
                    {/*{ opacity: fadeInOpacity }*/},
                  ]}
                />
              </View>
            ) : (
              <ImageBackground
                source={{ uri: urlPhoto }}
                style={[
                  styles.login.backgroundImageLoginPhone,
                  {/*{ opacity: fadeInOpacity }*/}
                ]}
                blurRadius={5}
              >
                <View style={[styles.login.loginBoxPhone, styles.generalStyles.fontColors.color1]}>
                  <Text style={[styles.generalStyles.tittleText, styles.generalStyles.letterColors.color1]}>Login</Text>
                  <TextInput
                    style={[styles.login.input, styles.generalStyles.letterColors.color1, styles.generalStyles.contentText,]}
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    placeholderTextColor="#ffffff"
                  />
                  <TextInput
                    style={[styles.login.input, styles.generalStyles.letterColors.color1, styles.generalStyles.contentText,]}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    placeholderTextColor="#ffffff"
                  />
                  {stateLogin === 'Create account' ? <TextInput
                                                        style={[styles.login.input, styles.generalStyles.letterColors.color1, styles.generalStyles.contentText]}
                                                        placeholder="Repeat the password"
                                                        secureTextEntry
                                                        value={repeatPassword}
                                                        onChangeText={(text) => setRepeatPassword(text)}
                                                        placeholderTextColor="#ffffff"
                                                      /> : null}
                  <Pressable onPress={handleLogin}>
                    <Text style={[styles.generalStyles.tittleText, styles.generalStyles.letterColors.color1, styles.login.boton, styles.generalStyles.fontColors.color1,]}>{stateLogin}</Text>
                  </Pressable>
                  <Pressable onPress={changeStateLogin} style={[]}>
                    <Text style={[styles.generalStyles.letterColors.color1, styles.generalStyles.contentText, styles.generalStyles.contentText,]}>{stateLogin === 'Login' ? 'Create account' : 'Login'}</Text>
                  </Pressable>
                  <Text style={[styles.generalStyles.letterColors.color1, styles.generalStyles.contentText]}>¿Did you forget your password?</Text>
                </View>
              </ImageBackground>
            )}
          </View>
      </View>
    </View>
  );
}







