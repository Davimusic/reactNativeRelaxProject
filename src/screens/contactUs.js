import emailjs from '@emailjs/browser';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Pressable, Platform, KeyboardAvoidingView } from 'react-native';
import { Icon } from 'react-native-vector-icons';
import styles from '../funciones/styles.js/globalStyles';
import Menu from '../components/menu';
import { useSelector, useDispatch } from 'react-redux';
import * as Animatable from 'react-native-animatable'; 

export default function ContactUS() {
  const mode = useSelector((state) => state.mode);
  console.log(useSelector((state) => state.actualScreen));

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isEnabled, setIsEnabled] = useState(mode === 'light' ? false : true);
  const [darkBackgoundcolor, setDarkBackgoundcolor] = useState(styles.generalStyles.fontColors.color6.backgroundColor);
  const [lightBackgoundcolor, setLightBackgoundcolor] = useState(styles.generalStyles.fontColors.color3.backgroundColor);
  const [isSendingEmail, setIsSendingEmail] = useState(false); // Nuevo estado para controlar la animación
  
  const handleSubmit = async () => {
    try {
      if(isSendingEmail === false){
        if(name === ''  || email === ''  || message === '' ){
          return alert('Fill all requirements like name, email and message please')
        }
        setIsSendingEmail(true); // Iniciar la animación
        await emailjs.send('service_tkqmgfu', 'template_m4yqh7d', { name: name, email: email, message: message }, 'DHzjPvol7LtoLFqev')
          .then((response) => {
            setIsSendingEmail(false); // Detener la animación
            setTimeout(() => alert('SUCCESS!', response.status, response.text), 1000)
          }, (error) => {
            setIsSendingEmail(false); // Detener la animación
            setTimeout(() => alert('FAILED...', error), 1000)
          });
      }
    } catch (error) {
      console.error(error);
      // Aquí puedes manejar el error como mejor te parezca.
    }
  };
  

  useEffect(() => {
    const dicc = {'dark': false, 'light': true}
    setIsEnabled(dicc[mode])
  }, [mode]);

  return (
      <View style={[{flex: 1},{paddingTop: Platform.OS === 'web' ? 0 : 30}, { backgroundColor: isEnabled ? lightBackgoundcolor : darkBackgoundcolor }]}>
        <Menu>
          <View style={[styles.contactUs.container]}>
            <View style={[styles.contactUs.containerChild, styles.generalStyles.fontColors.color4]}>
              <Text style={[styles.generalStyles.tittleText, styles.generalStyles.letterColors.color1]}>Contact Us</Text>
              <TextInput
                style={[styles.login.input, styles.generalStyles.letterColors.color1, styles.generalStyles.contentText]}
                placeholder="Name"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#ffffff"
              />
              <TextInput
                style={[styles.login.input, styles.generalStyles.letterColors.color1, styles.generalStyles.contentText]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#ffffff"
              />
              
              <TextInput
                style={[styles.login.input, styles.generalStyles.letterColors.color1, styles.contactUs.inputMessage,  styles.generalStyles.contentText]}
                placeholder="Message"
                value={message}
                multiline={true}
                numberOfLines={4}
                onChangeText={setMessage}
                placeholderTextColor="#ffffff"
              />
              
              <Pressable onPress={handleSubmit}>
                {isSendingEmail ? (
                  <Animatable.Text animation="zoomOut" iterationCount="infinite" direction="alternate">
                    <Text style={[styles.generalStyles.tittleText, styles.generalStyles.letterColors.color1, styles.login.boton, styles.generalStyles.fontColors.color1]}>Send</Text>
                  </Animatable.Text> // Muestra una animación mientras se envía el correo electrónico
                ) : (
                  <Text style={[styles.generalStyles.tittleText, styles.generalStyles.letterColors.color1, styles.login.boton, styles.generalStyles.fontColors.color1]}>Send</Text>
                )}
              </Pressable>
            </View>
          </View>
        </Menu>
      </View>
  );
};



