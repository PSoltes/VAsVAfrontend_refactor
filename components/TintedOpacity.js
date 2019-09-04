import React, { Component } from "react";
import { View } from "react-native";

export default class TintedOpacity extends Component {
  render() {
    return (
      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.65)",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      />
    );
  }
}
