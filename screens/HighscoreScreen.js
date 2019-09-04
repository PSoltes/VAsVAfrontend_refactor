import React from 'react';
import SideBar from "../components/SideBar.js";
import getTheme from "../native-base-theme/components";
import material from "../native-base-theme/variables/material";
import {ListItem, SearchBar} from 'react-native-elements';
import {
    StyleProvider,
    Container,
    Content,
    Drawer,
    List,
} from "native-base";
import {FlatList, StyleSheet, View} from "react-native";
import AppHeader from "../components/AppHeader.js";
import {createIconSetFromFontello} from "react-native-vector-icons";
import fontelloConfig from "../config.json";
import axios from "../components/axios-instance.js";
import Config from "react-native-config";


const CustomIcon = createIconSetFromFontello(fontelloConfig);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});

function logStuff(severity, msg) {
    msg = msg.replace(" ", "%20");
    axios.get(Config.BACKEND_URL + `/log/${severity}/${msg}`).catch(err => {
      console.log(err, "ERROR: Could not send log to server.");
    });
  }

// Obrazovka reprezentujúca rebríček, kde sú všetkci lezci zoradný na základe ich doteraz
// získaných skór
export default class HighscoreScreen extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            loading: false,      
            data: [],      
            error: null,
            search: "", 
        };

        this.arrayholder = [];

        logStuff("TRACE", "Highscore screen created.");
    }

    // Po načítaní obrazovky sa posielajú požiadavky pre každého jedného lezca.
    componentDidMount() {
        logStuff("INFO", "Request for climbers sent.");

        this.setState({loading: true});

        axios
        .get(Config.BACKEND_URL + "/climbers")
            .then(response =>
                response.data
            )
            .then((climbers) => {
                logStuff("INFO", "Respond for climbers received.");
                const data = climbers.map((climber, i) => {
                    return {
                        key: i,
                        id: climber.id,
                        name: climber.name,
                        problem_count: climber.myProblems.length,
                        score: climber.myProblems.length * i * 100,
                    };
                }).sort((a, b) => a.score < b.score);

                this.setState({
                    data: data,   
                    loading: false,
                });

                this.arrayholder = data;
            })
            .catch(err => {
                logStuff("WARN", "Could not get climbers.");

                console.log(err);
                this.setState({
                    error: err,
                    loading: false,
                });
            });
    }

    closeDrawer() {
        this.setState({lang: "changed"});
        this.drawer._root.close();
    }

    openDrawer() {
        this.drawer._root.open();
    }

    // Tu sa filtruje obsah zoznamu na základe zadaného výrazu v hornej časti obrazovky
    searchFilterFunction = text => {
        logStuff("DEBUG", `Filtering climbers (${text})`);

        const newData = this.arrayholder
            .filter(climber => {
                return climber.name.indexOf(text) > -1;
            });
        
        logStuff("DEBUG", `Climbers found (${newData.length})`);

        this.setState({
            data: newData,
            search: text,
        });
      };

        // Zobrazenie vyhľadávania
      renderSearch = () => {    
        return (      
          <SearchBar        
            placeholder="Type Here..."        
            lightTheme        
            round        
            onChangeText={text => this.searchFilterFunction(text)}
            autoCorrect={false}
            value={this.state.search}           
          />    
        );  
      };

      // Renderovanie obrazovky
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
                        <List contentContainerStyle={{flex: 1, heigth: "100%", width: "100%"}}>
                            <FlatList
                                ListHeaderComponent={this.renderSearch}                       
                                data={this.state.data}
                                renderItem={({item}) =>
                                    <ListItem
                                        key={item.key}
                                        leftAvatar={{source: require("../img/Palino.jpg")}}
                                        title={item.name}
                                        subtitle={item.score + " bodov"}
                                        onPress={() => this.props.navigation.navigate("OtherProfile", {id: item.id})}
                                    />
                                }
                            />
                        </List>
                    </Container>
                </Drawer>
            </StyleProvider>
        );
    }
}
