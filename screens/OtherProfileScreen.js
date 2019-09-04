import React from "react";
import SideBar from "../components/SideBar.js";
import getTheme from "../native-base-theme/components";
import material from "../native-base-theme/variables/material";
import {
  StyleProvider,
  Container,
  Content,
  Drawer,
  Text,
  Icon,
  Tab,
  Tabs,
  TabHeading,
  List,
  ListItem,
  CardItem,
  Button,
  Item,
  Label,
  Input,
  Textarea,
  Toast
} from "native-base";
import {
  Dimensions,
  ImageBackground,
  View,
  CheckBox,
  FlatList,
  Image,
  TouchableOpacity
} from "react-native";
import AppHeader from "../components/AppHeader.js";
import LinearGradient from "react-native-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";
import LoadingPage from "../components/LoadingPage.js";
import PhotoGrid from "../components/PhotoGrid.js";
import Modal from "react-native-modal";
import AutoHeightImage from "react-native-auto-height-image";
import { HideWithKeyboard } from "react-native-hide-with-keyboard";
import axios from "../components/axios-instance.js";

import AsyncStorage from "@react-native-community/async-storage";
import Config from "react-native-config";

const win = Dimensions.get("window");
const styles = {
  item: {
    marginVertical: 5
  }
};

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showFinishedProblems: false,
      user: {},
      isLoading: true,
      tableRows: [],
      imageSource: [],
      openedImageSource: " ",
      isEditing: false,
      addingPhoto: false,
      selectedPhoto: {},
      profilePhoto: ""
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(item) {
    this.setState({openedImageSource: item.src});
  }
  closeDrawer() {
    this.drawer._root.close();
  }

  openDrawer() {
    this.drawer._root.open();
  }

  async componentDidMount() {
    let id;
    try {
      id = await AsyncStorage.getItem("id");
    } catch (err) {
      console.warn(err.message);
    }
    axios
      .get(Config.BACKEND_URL + "/climber/" + id)
      .then( async (responseJson) => {
        const profilePic = responseJson.data.profilePicPath;
        this.setState({
          user: responseJson.data,
          isLoading: false,
          tableRows: responseJson.data.myProblems.filter(problem => {
            return problem.finished === false;
          }),
          imageSource: responseJson.data.myImages.map((uri, index) => {
            return {
              id: index,
              src: Config.BACKEND_URL + "/picture/images_" + id + "/" + uri
            };
          }),
          profilePhoto: profilePic === null ? Config.BACKEND_URL + "/picture/default.png" : Config.BACKEND_URL + "/picture/images_" + id + "/" + profilePic
        });
        console.log(this.state.tableRows);
      })
      .catch(error => {
        logStuff("WARN", "Other Profile Get" + error.message.toString());
      });
  }

  
  renderImageThumbnail(item, itemSize, itemPaddingHorizontal) {
    return (
      <TouchableOpacity
        key={item.id}
        style={{
          width: itemSize,
          height: itemSize,
          paddingHorizontal: itemPaddingHorizontal
        }}
        onPress={() => {
          this.setState({ openedImageSource: item.src });
        }}
      >
        <Image
          resizeMode="cover"
          style={{ flex: 1 }}
          source={{ uri: item.src }}
        />
      </TouchableOpacity>
    );
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
            {this.state.isLoading ? (
              <LoadingPage />
            ) : (
              <Content
                contentContainerStyle={{
                  flex: 1,
                  heigth: "100%",
                  width: "100%",
                  backgroundColor: material.brandDark
                }}
              >
                <HideWithKeyboard style={{ width: "100%", heigth: "100%" }}>
                  <ImageBackground
                    source={{uri: this.state.profilePhoto}}
                    style={{
                      height: win.height * 0.4,
                      justifyContent: "flex-end"
                    }}
                  >
                    <LinearGradient
                      colors={["transparent", material.brandDark]}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0
                      }}
                      locations={[0.1, 1]}
                    />
                    <Text
                      style={{
                        color: material.brandLight,
                        margin: "2%",
                        marginBottom: 0,
                        fontSize: 24
                      }}
                    >
                      {this.state.user.nickname}
                    </Text>
                    <Text
                      style={{
                        color: material.brandLight,
                        margin: "2%",
                        marginTop: 0,
                        fontSize: 16
                      }}
                    >
                      {this.state.user.status}
                    </Text>
                  </ImageBackground>
                </HideWithKeyboard>
                <Tabs
                  style={{
                    flex: 1,
                    height: "100%",
                    width: "100%"
                  }}
                >
                  <Tab
                    heading={
                      <TabHeading>
                        <Text>Osobné údaje</Text>
                      </TabHeading>
                    }
                    style={{ flex: 1, height: "100%", width: "100%" }}
                  >
                    
                      <ScrollView>
                        <List>
                          <ListItem>
                            <Text>Meno: </Text>
                            <Text>{this.state.user.name}</Text>
                          </ListItem>
                          <ListItem>
                            <Text>Vek: </Text>
                            <Text>{this.state.user.age}</Text>
                          </ListItem>
                          <ListItem>
                            <Text>Pohlavie: </Text>
                            <Text>
                              {this.state.user.sex == "M" ? "Muž" : "Žena"}
                            </Text>
                          </ListItem>
                          <ListItem>
                            <Text>Najťažšia zlezená obtiažnosť: </Text>
                            <Text>{this.state.user.grade}</Text>
                          </ListItem>
                          <ListItem>
                            <Text>Kontakt: </Text>
                            <Text>{this.state.user.contact}</Text>
                          </ListItem>
                          <ListItem>
                            <Text>O mne: </Text>
                            <Text>{this.state.user.bio}</Text>
                          </ListItem>
                        </List>
                      </ScrollView>
                  </Tab>
                  <Tab
                    heading={
                      <TabHeading>
                        <Text style={{ textAlign: "center" }}>Moje fotky</Text>
                      </TabHeading>
                    }
                    style={{ flex: 1, height: "100%", width: "100%" }}
                  >
                    <ScrollView>
                    <PhotoGrid
                        items={this.state.imageSource}
                        itemsPerRow={2}
                        itemMargin={1}
                        onPress={this.handleClick}
                      />
                      <Modal
                        isVisible={this.state.openedImageSource != " "}
                        onBackdropPress={() =>
                          this.setState({ openedImageSource: " " })
                        }
                        style={{ flex: 1, margin: 0, justifyContent:"center"}}
                      >
                      <ScrollView contentContainerStyle={{backgroundColor:"transparent"}}>
                      <View style={{backgroundColor:"transparent", flexDirection:"row", justifyContent:"space-around", margin:10}}>
                        <Icon onPress={() => this.setState({ openedImageSource: " " })} type="FontAwesome" name="times" style={{color:material.brandLight}}/>
                      </View>
                        <AutoHeightImage
                          source={{ uri: this.state.openedImageSource }}
                          width={win.width}
                        />
                      </ScrollView>
                      </Modal>
                    </ScrollView>
                  </Tab>
                </Tabs>
              </Content>
            )}
          </Container>
        </Drawer>
      </StyleProvider>
    );
  }
}
