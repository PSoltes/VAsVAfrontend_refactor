import React from "react";
import SideBar from "../components/SideBar.js";
import getTheme from "../native-base-theme/components";
import material from "../native-base-theme/variables/material";
import {
  StyleProvider,
  Container,
  Content,
  Drawer,
  Button,
  Icon,
  Text,
  Thumbnail
} from "native-base";
import { ImageBackground, View, StyleSheet} from "react-native";
import AppHeader from "../components/AppHeader.js";
import { Col, Row, Grid } from "react-native-easy-grid";
import { createIconSetFromFontello } from "react-native-vector-icons";
import fontelloConfig from "../config.json";
import TintedOpacity from "../components/TintedOpacity.js";
const CustomIcon = createIconSetFromFontello(fontelloConfig);
import Config from "react-native-config";
import AsyncStorage from "@react-native-community/async-storage";
/*import stringoflanguages from './lang';*/
import axiosInstance from "../components/axios-instance.js";

const styles = StyleSheet.create( {
  button: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%"
  }
});

export default class HomeScreen extends React.Component {
  constructor()
  {
    super()
    this.state = 
    {
      profilePicSource: " ",
      admin: false
    }
  }
  closeDrawer() {
    /*this.setState({lang: "changed"});*/
    this.drawer._root.close();
  }

  openDrawer() {
    this.drawer._root.open();
  }

  async componentDidMount()
  {
    try{
      const id = await AsyncStorage.getItem("id");
      AsyncStorage.getItem("profilePic").then(profilePicName =>{

        axiosInstance.get(Config.BACKEND_URL+ "/climber/" + id + "/permissions")
        .then(res => {
        this.setState({
          profilePicSource: profilePicName !== "null" ? Config.BACKEND_URL + "/picture/images_" + id + "/" + profilePicName : Config.BACKEND_URL + "/picture/default.png"
        });
        if(res.data.includes("ADMIN"))
        {
          this.setState({admin:true});
        }
      });
    });
    }catch(error)
    {
      console.warn(error);
    }

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
              admin={this.state.admin}
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
              contentContainerStyle={{ flex: 1, heigth: "100%", width: "100%" }}
            >
              <ImageBackground
                source={require("../img/backgroundImg.jpg")}
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  resizeMode: "stretch"
                }}
                blurRadius={0.7}
              >
               <TintedOpacity/>
                <Grid style={{ margin: "2%" }}>
                  <Row size={11} style={{ marginVertical: "1%" }}>
                    <Col style={{ marginRight: "2%" }}>
                      <Button
                        dark
                        style={styles.button
                        }
                        onPress={() => this.props.navigation.navigate("Profile")}
                      >
                        <Thumbnail
                          extra-large
                          source={{uri: this.state.profilePicSource}}
                          style={{ margin: "10%" }}
                        />
                        <Text>Môj Profil</Text>
                      </Button>
                    </Col>
                    <Col style={{ marginLeft: "2%" }}>
                      <Row style={{ marginBotom: "3%" }}>
                        <Button
                          style={[
                            styles.button,
                            {backgroundColor: "#f1c40f"}
                          ]}
                          onPress={() => this.props.navigation.navigate("Boulder")}
                        >
                          <Text
                            style={{
                              textAlign: "center",
                              fontSize: 16,
                              color: "#232B2B"
                            }}
                          >
                            Bouldre
                          </Text>
                          <Icon
                            type="FontAwesome5"
                            name="hand-rock"
                            style={{ fontSize: 50, color: "#232B2B" }}
                          />
                        </Button>
                      </Row>
                      <Row style={{ marginTop: "3%" }}>
                        <Button
                          style={[
                            styles.button,
                            {backgroundColor: "#2980b9"}
                          ]}
                          onPress={() => this.props.navigation.navigate("Wall")}
                        >
                          <CustomIcon name="climber" size={60} color="white" />
                          <Text style={{ textAlign: "center", fontSize: 16 }}>
                            Stena
                          </Text>
                        </Button>
                      </Row>
                    </Col>
                  </Row>
                  <Row size={5} style={{ marginVertical: "1%" }}>
                    <Col size={2} style={{ marginRight: "2%" }}>
                      <Button
                        style={[
                          styles.button,
                          {backgroundColor: "#2980b9"}
                        ]}
                      >
                        <Text style={{ fontSize: 20 }}>MAPA</Text>
                        <Icon
                          type="FontAwesome5"
                          name="map-marked-alt"
                          style={{ fontSize: 45 }}
                        />
                      </Button>
                    </Col>
                    <Col size={3} style={{ marginLeft: "2%" }}>
                      <Button
                        style={[
                          styles.button,
                          {backgroundColor: "#d35400"}
                        ]}
                        onPress={() => this.props.navigation.navigate("Qr")}
                      >
                        <Icon
                          type="FontAwesome"
                          name="qrcode"
                          style={{ fontSize: 60, color: "#232B2B" }}
                        />
                        <Text style={{ color: "#232B2B" }}>Skenuj QR kód</Text>
                      </Button>
                    </Col>
                  </Row>
                  <Row size={4} style={{ marginVertical: "1%" }}>
                    <Button
                      dark
                      style={styles.button}
                      onPress={() => this.props.navigation.navigate("Highscore")}
                    >
                      <Icon type="FontAwesome5" name="bars" />
                      <Text style={{ fontSize: 26 }}>Tabuľka skóre</Text>
                    </Button>
                  </Row>
                </Grid>
              </ImageBackground>
            </Content>
          </Container>
        </Drawer>
      </StyleProvider>
    );
  }
}
