import React from "react";
import { Text, Content, Header, H3, List, ListItem } from "native-base";
import axios from "./axios-instance.js";
import AsyncStorage from "@react-native-community/async-storage";
import material from "../native-base-theme/variables/material.js"
/*import stringoflanguages from '../screens/lang';*/


export default class SideBar extends React.Component {

  constructor(props)
  {
    super(props)
    this.state =
    {
      admin: false
    };
  }

async logout()
{
  axios.defaults.headers.common["Authorization"] = "";
  await AsyncStorage.removeItem("id");
  await AsyncStorage.removeItem("access_token");
  await AsyncStorage.removeItem("refresh_token");
  await AsyncStorage.removeItem("profilePic");
  this.props.navigation.navigate("Login");
}

/*changeLanguage(lang) {
  if (lang !== "sk" && lang !== "en") {
    console.log("Wrong language! Defaulting to english (\"en\").")
    changeLanguage("en");
  } else {
    stringoflanguages.setLanguage(lang);
    this.setState({ lang });
  }
}*/

  render() {
    
          return (
            <Content style={{ backgroundColor: "#FFFFFF" }}>
              <Header
                style={{
                  flex: 1,
                  flexDirection: "column",
                  backgroundColor: "#232B2B",
                  height: 100,
                  justifyContent: "flex-end",
                  paddingVertical: "10%"
                }}
              >
                <H3>Ahoj</H3>
              </Header>
              <List>
                {this.props.admin &&
                <ListItem button onPress={() => this.props.navigation.navigate("AddProblem")}>
                 <Text style={{color:material.brandDark}}>Pridaj problém</Text>
                </ListItem>
                }             
                <ListItem button onPress={() => this.logout()}>
                  <Text style={{color:material.brandDark}}>Odhlásiť sa!</Text>
                </ListItem>
                {/* <ListItem button onPress={() => this.changeLanguage("sk")}>
                  <Text style={{color:material.brandDark}}>SK</Text>
                </ListItem>
                <ListItem button onPress={() => this.changeLanguage("en")}>
                  <Text style={{color:material.brandDark}}>EN</Text>
                </ListItem> */}
              </List>
            </Content>
          );
    
  }
}