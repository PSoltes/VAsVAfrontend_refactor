import React from "react";
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
  Form,
  Picker,
  Drawer
} from "native-base";
import getTheme from "../native-base-theme/components";
import material from "../native-base-theme/variables/material";
import {
  Image,
  Icon,
  View,
  CheckBox,
  Dimensions,
  CameraRoll
} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import SideBar from "../components/SideBar.js";
import AppHeader from "../components/AppHeader.js";
import ImagePicker from "react-native-image-picker";
import axios from "../components/axios-instance.js";
import AsyncStorage from "@react-native-community/async-storage";
import objectToXWWW from "../components/help-scripts/objectToXWWW-FROM.js";
import Config from "react-native-config";
import AutoHeightImage from "react-native-auto-height-image";
import { identifier } from "@babel/types";
import toUrlEncoded from "../components/help-scripts/objectToXWWW-FROM.js"
import Modal from "react-native-modal";
import QRCode from "react-native-qrcode-svg";
import RNFS from "react-native-fs"
import stringoflanguages from './lang';

const win = Dimensions.get("window");

export default class AddProblemScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      grade: "",
      type: "",
      sector: "",
      overhang: "0",
      selectedPhoto: {
        uri: "",
        fileName: null
      },
      showQR: false,
      id: "22"
    };
  }

  async createProblem()
  {
    const id = await AsyncStorage.getItem("id");
    const details =
    {
      name: this.state.name,
      grade: this.state.grade,
      type: this.state.type,
      sector: this.state.sector,
      maximumOverhangDegree: this.state.overhang,
      setter: id,
      picturePath: this.state.selectedPhoto.fileName === null ? JSON.stringify(this.state.selectedPhoto.fileName) : this.state.selectedPhoto.fileName
    }
    const body = toUrlEncoded(details);
    axios
      .post(Config.BACKEND_URL + "/problem", body).then(res =>{
        
        this.setState({id:JSON.stringify(res.data)});

        const formData = new FormData();

        formData.append("file", {
          uri: this.state.selectedPhoto.uri,
          name: this.state.selectedPhoto.fileName,
          type: this.state.selectedPhoto.type
        });
    axios
      .post(
        Config.BACKEND_URL + "/picture/upload/problem/" +
          res.data,
        formData
      )
      .then(res => {
        this.setState({showQR: true});
      }).catch(err => console.warn(err.message));
    }).catch(err => console.warn(err));
  }

  addPhoto() {
    ImagePicker.launchImageLibrary({ noData: true }, response => {
      this.setState({
        selectedPhoto: response
      });
    });
  }

  saveQR()
  {
    this.svg.toDataURL( data =>
      {
        RNFS.writeFile(RNFS.CachesDirectoryPath + "/problemQR_" + this.state.id + ".png", data, "base64").
        then( sucess => {return CameraRoll.saveToCameraRoll(RNFS.CachesDirectoryPath +"/problemQR_" + this.state.id + ".png", "photo")})
        .then(() =>{
          this.setState({showQR: false})
          Toast.show({
            text:stringoflanguages.qrSaved,
            type:"success",
            buttonText:"Ok"
          })
        });
      })
  }


  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <Drawer
          ref={ref => {
            this.drawer = ref;
          }}
          content={
            <SideBar
              navigation={this.props.navigation}
              closeDrawer={() => this.props.closeDrawer()}
            />
          }
          onClose={() => this.closeDrawer()}
        >
          <Container>
            <AppHeader
              openDrawer={() => this.openDrawer()}
              navigation={this.props.navigation}
            />
            <Content
              contentContainerStyle={{ flex: 1, heigth: "100%", width: "100%", backgroundColor: material.brandDark }}
            >
              <ScrollView
                contentContainerStyle={{
                  backgroundColor: material.brandDark,
                }}
              >
                <H2 style={{ alignSelf: "center", margin: 5 }}>
                  {`${stringoflanguages.addProblem}`}
                </H2>
                <Form>
                  <Item floatingLabel underline style={{ marginVertical: 5 }}>
                    <Label>{`${stringoflanguages.name}`}</Label>
                    <Input
                      name="name"
                      onChangeText={text => this.setState({ name: text })}
                      value={this.state.name}
                      style={{ color: "#fff" }}
                    />
                  </Item>
                  <Item floatingLabel underline style={{ marginVertical: 5 }}>
                    <Label>{`${stringoflanguages.maxOverhang}`}</Label>
                    <Input
                      name="overhang"
                      onChangeText={text => this.setState({ overhang: text })}
                      value={this.state.overhang}
                      style={{ color: "#fff" }}
                    />
                  </Item>
                  <Item floatingLabel underline style={{ marginVertical: 5 }}>
                    <Label>{`${stringoflanguages.sector}`}</Label>
                    <Input
                      name="sector"
                      onChangeText={text => this.setState({ sector: text })}
                      value={this.state.sector}
                      style={{ color: "#fff" }}
                    />
                  </Item>
                  <Item picker style={{ width: "96%", alignSelf: "flex-end" }}>
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ width: undefined }}
                      placeholder="Obtiažnosť"
                      placeholderStyle={{ color: "#bfc6ea" }}
                      placeholderIconColor="#007aff"
                      selectedValue={this.state.grade}
                      onValueChange={value => this.setState({ grade: value })}
                      style={{ color: material.brandLight }}
                    >
                      <Picker.Item label="5a" value="5a" />
                      <Picker.Item label="5b" value="5b" />
                      <Picker.Item label="5c" value="5c" />
                      <Picker.Item label="6a" value="6a" />
                      <Picker.Item label="6b" value="6b" />
                      <Picker.Item label="6c" value="6c" />
                      <Picker.Item label="7a" value="7a" />
                      <Picker.Item label="7b" value="7b" />
                      <Picker.Item label="7c" value="7c" />
                      <Picker.Item label="8a" value="8a" />
                      <Picker.Item label="8b" value="8b" />
                      <Picker.Item label="8c" value="8c" />
                    </Picker>
                  </Item>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignContent: "center",
                      alignSelf: "flex-end",
                      borderBottomColor: material.brandLight,
                      borderBottomWidth: 1,
                      width: "96%",
                      padding: 15
                    }}
                  >
                    <Text>Boulder</Text>
                    <CheckBox
                      value={this.state.type === "boulder"}
                      onValueChange={text => this.setState({ type: "boulder" })}
                    />
                    <Text>Stena</Text>
                    <CheckBox
                      value={this.state.type === "stena"}
                      onValueChange={text => this.setState({ type: "stena" })}
                    />
                  </View>
                  <Button dark onPress={() => this.addPhoto()} style={{alignSelf:"center", margin:10}}>
                    <Text>{`${stringoflanguages.addPhoto}`}</Text>
                  </Button>
                  {this.state.selectedPhoto.uri !== "" && (
                    <AutoHeightImage
                      source={{ uri: this.state.selectedPhoto.uri }}
                      width={win.width - 50}
                      style={{alignSelf:"center", margin:15}}
                    />
                  )}
                  <Button dark onPress={() => this.createProblem()} style={{alignSelf:"center", margin:10}}>
                    <Text>{`${stringoflanguages.createProblem}`}</Text>
                  </Button>
                </Form>
              </ScrollView>
              <Modal isVisible={this.state.showQR}>
                    <View style={{backgroundColor:"transparent", justifyContent:"center", alignItems:"center"}}>
                      <QRCode value={this.state.id} size={250} getRef={(ref?) => (this.svg = ref)}/>
                      <View style={{flexDirection:"row", justifyContent:"space-around"}}>
                        <Button transparent onPress={() => this.saveQR()}><Text style={{color: material.brandLight}}>{`${stringoflanguages.saveQr}`}</Text></Button>
                        <Button transparent onPress={() => { this.setState({showQR:false}); this.props.navigation.navigate("ProblemDetails", {id:this.state.id});}}><Text style={{color: material.brandLight}}> {`${stringoflanguages.goToProblem}`}</Text></Button>
                      </View>
                    </View>
              </Modal>
            </Content>
          </Container>
        </Drawer>
      </StyleProvider>
    );
  }
}
