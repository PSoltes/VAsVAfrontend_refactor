
import React from 'react';
import {Root} from 'native-base';
import { createStackNavigator, createAppContainer } from "react-navigation";
import LoginScreen from "./screens/LoginScreen.js";
import RegisterScreen from "./screens/RegisterScreen.js";
import HomeScreen from "./screens/HomeScreen.js";
import ProfileScreen from "./screens/ProfileScreen.js";
import BoulderScreen from "./screens/BoulderProblemScreen.js";
import WallScreen from "./screens/WallProblemScreen.js";
import HighscoreScreen from "./screens/HighscoreScreen.js";
import OtherProfileScreen from "./screens/OtherProfileScreen.js";
import ProblemDetailsScreen from "./screens/ProblemDetailsScreen.js"



const MyStackNavigator = createStackNavigator(
  {
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        header: null
      }
    },
    Register: {
      screen: RegisterScreen,
      navigationOptions: {
        header: null
      }
    },
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        header: null
      }
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        header: null
      }
    },
    Boulder: {
      screen: BoulderScreen,
      navigationOptions: {
        header: null
      }
    },
    Wall: {
      screen: WallScreen,
      navigationOptions: {
        header: null
      }
    },
    Highscore: {
      screen: HighscoreScreen,
      navigationOptions: {
        header: null
      }
    },
    OtherProfile: {
      screen: OtherProfileScreen,
      navigationOptions: {
        header: null
      }
    },
    ProblemDetails: {
      screen: ProblemDetailsScreen,
      navigationOptions: {
        header: null
      }
    },
    AddProblem: {
      screen: AddProblemScreen,
      navigationOptions: {
        header: null
      }
    },
  },
  {
    initialRouteName: "Login"
  }
);

const MyAppContainer = createAppContainer(MyStackNavigator);
const App = () => {
  return (
    <Root>
      <MyAppContainer/>
    </Root>
  );
};

export default App;
