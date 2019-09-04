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
import {View, StyleSheet, ScrollView, Dimensions} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import {ImageBackground, Image, KeyboardAvoidingView} from 'react-native';
import {HideWithKeyboard} from 'react-native-hide-with-keyboard';
import axios from '../components/axios-instance.js';
import Config from 'react-native-config';
import toUrlEncoded from '../components/objectToXWWW-FROM.js';
/*import stringoflanguages from './lang';*/

const {height, width} = Dimensions.get('window');

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
    color: '#fff',
  },
  text: {
    color: '#fff',
  },
});

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      repeatPassword: '',
      sex: 'M',
    };
  }

  register() {
    if (this.state.password !== this.state.repeatPassword) {
      Toast.show({
        text: 'Heslá sa nezhodujú!',
        type: 'danger',
        buttonText: 'Ok',
      });
      return;
    }
    if (
      this.state.password === '' ||
      this.state.email === '' ||
      this.state.repeatPassword === ''
    ) {
      Toast.show({
        text: 'Musia byť vyplnené všetky polia!',
        type: 'danger',
        buttonText: 'Ok',
      });
      return;
    }
    const details = {
      name: this.state.email,
      password: this.state.password,
      sex: this.state.sex,
    };
    const formBody = toUrlEncoded(details);
    console.warn(Config.BACKEND_URL);
    axios
      .post('http://192.168.1.54:8080' + '/register', formBody)
      .then(res => {
        Toast.show({
          text: res.data,
          type: 'success',
          buttonText: 'Ok',
        });
        this.props.navigation.navigate('Login');
      })
      .catch(err => {
        console.warn(err.message);
        Toast.show({
          text: err.response.data,
          type: 'danger',
          buttonText: 'ok',
        });
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
              <ScrollView
                contentContainerStyle={{
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  width: '100%',
                  marginTop:"15%"
                }}>
                <Card
                  style={{
                    width: '90%',
                    backgroundColor: '#00000090',
                    padding: '5%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: height * 0.8
                  }}>
                  <H2 style={{color: '#fff'}}>Registrácia</H2>
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
                  <Item floatingLabel underline style={styles.item}>
                    <Label style={styles.label}>Potvrdenie hesla</Label>
                    <Input
                      secureTextEntry
                      name="repeatPassword"
                      onChangeText={text =>
                        this.setState({repeatPassword: text})
                      }
                      value={this.state.repeatPassword}
                      style={styles.input}
                    />
                  </Item>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignContent: 'center',
                      borderBottomColor: material.brandLight,
                      borderBottomWidth: 1,
                      backgroundColor: 'transparent',
                      height: 50,
                      width: '93%',
                    }}>
                    <Text style={styles.text}>Muž</Text>
                    <CheckBox
                      value={this.state.sex === 'M'}
                      onValueChange={text => this.setState({sex: 'M'})}
                      tintColors={{true: 'green', false: '#fff'}}
                    />
                    <Text style={styles.text}>Žena</Text>
                    <CheckBox
                      value={this.state.sex === 'F'}
                      onValueChange={text => this.setState({sex: 'F'})}
                      tintColors={{true: 'green', false: '#fff'}}
                    />
                  </View>
                  <Button
                    dark
                    style={{alignSelf: 'center', margin: 10}}
                    onPress={this.register.bind(this)}>
                    <Text>Registruj sa!</Text>
                  </Button>
                </Card>
              </ScrollView>
            </ImageBackground>
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}
