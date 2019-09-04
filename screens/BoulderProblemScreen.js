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

/*import stringoflanguages from './lang';*/
import Config from "react-native-config";

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

// Funkcia na posielanie logov na server
function logStuff(severity, msg) {
  msg = msg.replace(" ", "%20");
  axios.get(Config.BACKEND_URL + `/log/${severity}/${msg}`).catch(err => {
    console.log(err, "ERROR: Could not send log to server.");
  });
}

// Táto obrazovka obsahuje zoznam Boulder problémov, dajú sa v nej napr. filtrovať problémy
// na základe rôznych parametrov ako stupeň obtiažnosti.
export default class BoulderProblemScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          problems: [],
          grade: undefined,
          maxOver: undefined,
          sector: undefined,
          scat: [],
          gcat: [],
          mcat: [],
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

              // Filtrovanie vhodných problémov na základe ich typu
              const data = problems
                    .filter(problem => problem.type === "boulder")
                    .map(problem => {

                      // Populovanie kategórií filtrov: sektory, stupňe a prevysi
                      let tmp_s = this.state.scat;
                      let tmp_g = this.state.gcat;
                      let tmp_m = this.state.mcat;
                      tmp_s.push(problem.sector);
                      tmp_g.push(problem.grade);
                      tmp_m.push(problem.maximumOverhangDegree);
                      this.setState({
                        scat:tmp_s,
                        gcat:tmp_g,
                        mcat:tmp_m,
                      });

                      // Konvertovanie na vnútronú reprezentáciu
                        return {
                            key: problem.id,
                            name: problem.name,
                            sector: problem.sector,
                            grade: problem.grade,
                            maxOver: problem.maximumOverhangDegree,
                            type: "boulder"
                        };
                    }
              );

                console.log([...new Set(this.state.scat)]);
                let all_scat = [...new Set(this.state.scat)].map((c) => {
                  return { value: c };
                });
                let all_gcat = [...new Set(this.state.gcat)].map((c) => {
                  return { value: c };
                });
                let all_mcat = [...new Set(this.state.mcat)].map((c) => {
                  return { value: c };
                });

                // Pridávanie všetkých prístupných kategórií
                this.setState({
                  scat: all_scat,
                  gcat: all_gcat,
                  mcat: all_mcat,
                });

                this.setState({data})
                this.arrayholder = data;
            })
            .catch(err => {
                logStuff("WARN", "Could not get problems.");
                console.log(err);
            });
    }

    // Zatvorenie bočného panelu
    closeDrawer() {
      this.setState({lang: "changed"});
        this.drawer._root.close();
    }

    // Otvorenie bočného panelu
    openDrawer() {
        this.drawer._root.open();
    }

    // Filtrovanie problémov na základe aktuálne vybraných filtrov
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

    // Filtruj na základe sektorov
    filterSections(sector) {
      logStuff("TRACE", "Filtering problems based on sector.");
      this.setState({sector}, () => this.filterAll());
    }

    // Filtruj na základe stupňov
    filterGrades(grade) {
      logStuff("TRACE", "Filtering problems based on grade.");
      this.setState({grade}, () => this.filterAll());
    }

    // Filtruj na základe prevysov
    filterMaxOverhang(max) {
      logStuff("TRACE", "Filtering problems based on overhang.");
      this.setState({maxOver: max}, () => this.filterAll());
    }

    // Renderovanie Filtrov, stupeň, 
    renderFilters = () => {
      return (
        <View style={styles.drop}>
        <Grid>
          <Row>
            <Col style={{ marginHorizontal: "1%" }}>
              <Dropdown
                label="Obtiažnosť"
                data={this.state.gcat}
                value='None'
                onChangeText={(grade) => this.filterGrades(grade)}
              />
            </Col>
            <Col style={{ marginHorizontal: "1%" }}>
              <Dropdown
                label="Maximálny previs"
                value='None'
                data={this.state.mcat}
                onChangeText={(max) => this.filterMaxOverhang(max)}
              />
            </Col>
            <Col style={{ marginHorizontal: "1%" }}>
              <Dropdown
                label="Sektor"
                data={this.state.scat}
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
