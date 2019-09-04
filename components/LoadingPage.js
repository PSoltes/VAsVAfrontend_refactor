import React from "react";
import { Spinner, Content } from "native-base";
import material from "../native-base-theme/variables/material";

export default function LoadingPage() {
  return (
    <Content contentContainerStyle={{ flex: 1, backgroundColor: material.brandDark, justifyContent:"center", alignItems:"center" }}>
      <Spinner color={material.brandLight} />
    </Content>
  );
}
