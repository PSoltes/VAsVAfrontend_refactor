import React from "react";
import {ListItem} from 'react-native-elements';
import {
    StyleProvider,
    Container,
    Content,
    Drawer,
} from "native-base";
import {View, FlatList, StyleSheet} from "react-native";
import { Dropdown } from 'react-native-material-dropdown';
import { Col, Row, Grid } from "react-native-easy-grid";

import SideBar from "../components/SideBar.js";
import getTheme from "../native-base-theme/components";
import material from "../native-base-theme/variables/material";
import AppHeader from "../components/AppHeader.js";
import axios from "../components/axios-instance.js";
import Config from "react-native-config";
// import stringoflanguages from './lang';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
    },
    drop: {
      padding: 10,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});

// Tento súbor obsahuje to isté ako Boulder Problem Screen, platí to aj prekomnetáre

function logStuff(severity, msg) {
  msg = msg.replace(" ", "%20");
  axios.get(Config.BACKEND_URL + `/log/${severity}/${msg}`).catch(err => {
    console.log(err, "ERROR: Could not send log to server.");
  });
}

export default class WallProblemScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          problems: [],
          grade: undefined,
          maxOver: undefined,
          sector: undefined,
        };
        this.arrayholder = [];

        logStuff("TRACE", "Boulder problem screen created");
    }

    componentDidMount() {
      logStuff("INFO", "Request for problems sent.");

      axios
        .get(Config.BACKEND_URL + "/problems")
            .then((response) =>
                  response.data
            )
            .then((problems) => {
              logStuff("INFO", "Respond for problems received.");
              const data = problems
                    .filter(problem => problem.type === "stena")
                    .map(problem => {
                      console.log(problem);
                        return {
                            key: problem.id,
                            name: problem.name,
                            sector: problem.sector,
                            grade: problem.grade,
                            maxOver: problem.maximumOverhangDegree,
                            type: "stena"
                        };
                    }
              );

                this.setState({data})
                this.arrayholder = data;
            })
            .catch(err => {
                logStuff("WARN", "Could not get problems.");
                console.log(err);
            });
    }

    closeDrawer() {
      this.setState({lang: "changed"});
        this.drawer._root.close();
    }

    openDrawer() {
        this.drawer._root.open();
    }

    filterAll() {
      logStuff("TRACE", "Filtering problems.");
      const newData = this.arrayholder
      .filter(problem => {
        console.log('sect',this.state.sector);
        console.log('grd',this.state.grade);
        console.log('max',this.state.maxOver);

          return (
            ((this.state.sector != undefined && this.state.sector != 'None')
            ? (problem.sector === this.state.sector)
            : true) &&

            ((this.state.grade != undefined && this.state.grade != 'None')
            ? (problem.grade === this.state.grade)
            : true) &&

            ((this.state.maxOver != undefined && this.state.maxOver != 'None')
            ? (parseFloat(problem.maxOver) <= parseFloat(this.state.maxOver))
            : true)
          );
      })
          this.setState({
            data: newData,
          }, () => {console.log(this.state)});

    }

    filterSections(sector) {
      logStuff("TRACE", "Filtering problems based on sector.");
      this.setState({sector}, () => this.filterAll());
    }

    filterGrades(grade) {
      logStuff("TRACE", "Filtering problems based on grade.");
      this.setState({grade}, () => this.filterAll());
    }

    filterMaxOverhang(max) {
      logStuff("TRACE", "Filtering problems based on overhang.");
      this.setState({maxOver: max}, () => this.filterAll());
    }

    renderFilters = () => {
      
      
      let sectors = [{
          value: 'A2',
        }, {
          value: 'C3',
        }, {
          value: 'None',
        },
      ];

      let grades = [{
          value: '6a',
        }, {
          value: '6-',
        }, {
          value: 'None',
        },
      ];

      let max = [{
          value: '5',
        }, {
          value: '40',
        }, {
          value: 'None',
        },
      ];

      return (
        <View style={styles.drop}>
        <Grid>
          <Row>
            <Col style={{ marginHorizontal: "1%" }}>
              <Dropdown
                label="Obtiažnosť"
                data={grades}
                value='None'
                onChangeText={(grade) => this.filterGrades(grade)}
              />
            </Col>
            <Col style={{ marginHorizontal: "1%" }}>
              <Dropdown
                label="Maximálny previs"
                value='None'
                data={max}
                onChangeText={(max) => this.filterMaxOverhang(max)}
              />
            </Col>
            <Col style={{ marginHorizontal: "1%" }}>
              <Dropdown
                label="Sektor"
                data={sectors}
                value='None'
                onChangeText={(sector) => this.filterSections(sector)}
              />
            </Col>
          </Row>
          </Grid>
        </View>
      );
    };

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
                  <Content contentContainerStyle={{flex: 1, heigth: "100%", width: "100%"}}>  
                      <FlatList
                        ListHeaderComponent={this.renderFilters}
                        data={this.state.data}
                        renderItem={({item}) =>
                                      <ListItem
                                        key={item.key}
                                        title={item.name}
                                        subtitle={item.type}
                                        onPress={() => this.props.navigation.navigate("ProblemDetails", {id: item.key})}
                                      />}
                      />
                  </Content>
                </Container>
              </Drawer>
	      </StyleProvider>
      );
    }
}
