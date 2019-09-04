import React from "react";
import { Header, Icon, Button, Right } from "native-base";
import { Image } from "react-native";

export default class AppHeader extends React.Component {
  render() {
    return (
      <Header
        style={{ backgroundColor: "#232B2B", borderBottomWidth:2, borderColor:"#e67e22" }}
      >
        <Button
          transparent
          onPress={() => this.props.navigation.navigate("Home")}
          style={{
            width: "15%",
            padding: 0
          }}
        >
          <Image
            source={require("../img/logoDark.png")}
            style={{
              height: "100%",
              width: "100%",
              resizeMode: "contain",
            }}
          />
        </Button>
        <Right>
          <Button transparent onPress={this.props.openDrawer}>
            <Icon type="FontAwesome" name="bars" />
          </Button>
        </Right>
      </Header>
    );
  }
}
