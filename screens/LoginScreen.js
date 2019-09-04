import React from 'react';
import {
  StyleProvider,
  Content,
  Container,
  Card,
  Item,
  Input,
  Label,
  Text,
  Button,
  H2,
  Toast,
} from 'native-base';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import {ImageBackground, Image, KeyboardAvoidingView, StyleSheet} from 'react-native';
import {HideWithKeyboard} from 'react-native-hide-with-keyboard';
import axios from '../components/axios-instance.js';
import AsyncStorage from '@react-native-community/async-storage';
import objectToXWWW from '../components/objectToXWWW-FROM.js';
import Config from 'react-native-config';
/*import stringoflanguages from './lang';*/

const styles = StyleSheet.create({
  input: {
    color: '#fff',
  },
  item: {
    width: '93%',
    color: '#fff',
    backgroundColor: 'transparent',
    margin: '3%',
  },
  label: {
    color: "#fff"
  }
});

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  login() {
    if (this.state.email === '' || this.state.password === '') {
      Toast.show({
        text: 'Vyplňte všetky polia',
        type: 'danger',
        buttonText: 'Ok',
      });
      return;
    }
    var details = {
      grant_type: 'password',
      password: this.state.password,
      username: this.state.email,
    };

    formBody = objectToXWWW(details);
    axios
      .post(Config.BACKEND_URL + '/oauth/token', formBody, {
        auth: {
          username: 'myClientPassword',
          password: 'secret',
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then(async res => {
        try {
          await AsyncStorage.setItem('access_token', res.data.access_token);
          await AsyncStorage.setItem('refresh_token', res.data.refresh_token);
          await AsyncStorage.setItem('id', JSON.stringify(res.data.id));
          await AsyncStorage.setItem(
            'profilePic',
            res.data.profilePic === null
              ? JSON.stringify(res.data.profilePic)
              : res.data.profilePic,
          );
          axios.defaults.headers.common['Authorization'] =
            'Bearer ' + res.data.access_token;
          this.setState({
            email: '',
            password: '',
          });
          this.props.navigation.navigate('Home');
        } catch (err) {
          console.warn("Login async storage problem" + err);
        }
      })
      .catch(err => {
        console.warn("Login axios error" + err);
        if (err.response.status == 401 || err.response.status == 400) {
          Toast.show({
            text: 'Nesprávne prihlasovacie údaje',
            type: 'danger',
            buttonText: 'Ok',
          });
        }
      });
  }

  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          <Content
            contentContainerStyle={{flex: 1, heigth: '100%', width: '100%'}}>
            <ImageBackground
              source={require('../img/backgroundImg.jpg')}
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
                resizeMode: 'stretch',
              }}
              blurRadius={0.7}>
              <KeyboardAvoidingView
                style={{
                  alignItems: 'center',
                  width: '100%',
                  height: '100%',
                }}>
                <HideWithKeyboard
                  style={{
                    width: '100%',
                    flex: 1,
                    justifyContent: 'space-around',
                  }}>
                  <Image
                    source={require('../img/logo.png')}
                    style={{
                      width: '80%',
                      resizeMode: 'contain',
                      alignSelf: 'center',
                    }}
                  />
                </HideWithKeyboard>

                <Card
                  style={{
                    flex: 0.9,
                    width: '90%',
                    backgroundColor: '#00000090',
                    padding: '5%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <H2 style={{color: '#fff'}}>Lezecká stena X</H2>
                  <Item floatingLabel underline style={styles.item}>
                    <Label style={styles.label}>Email</Label>
                    <Input
                      name="password"
                      onChangeText={text => this.setState({email: text})}
                      value={this.state.email}
                      style={styles.input}
                    />
                  </Item>
                  <Item floatingLabel underline style={styles.item}>
                    <Label style={styles.label}>Heslo</Label>
                    <Input
                      secureTextEntry
                      name="password"
                      onChangeText={text => this.setState({password: text})}
                      value={this.state.password}
                      style={styles.input}
                    />
                  </Item>
                  <Button
                    transparent
                    style={{
                      alignSelf: 'center',
                    }}
                    onPress={() => this.props.navigation.navigate('Register')}>
                    <Text style={{color: material.brandLight}}>
                      Registruj sa!
                    </Text>
                  </Button>
                  <Button
                    dark
                    style={{alignSelf: 'center'}}
                    onPress={this.login.bind(this)}>
                    <Text>Prihlás</Text>
                  </Button>
                </Card>
              </KeyboardAvoidingView>
            </ImageBackground>
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}
