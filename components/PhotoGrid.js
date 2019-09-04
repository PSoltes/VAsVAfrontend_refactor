import {FlatList, TouchableOpacity, View} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';

export default class PhotoGrid extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FlatList
        data={this.props.items}
        numColumns={this.props.itemsPerRow}
        keyExtractor= {(item,index) => index.toString()}
        renderItem={({item}) => (
          <View style={{flex: 1, flexDirection: 'column', margin: this.props.itemMargin}}>
            <TouchableOpacity key={item.id} style={{flex:1}} onPress={() => this.props.onPress(item)}>
              <FastImage
                style={{height: 100, width: '100%'}}
                source={{uri: item.src}}
              />
            </TouchableOpacity>
          </View>
        )}></FlatList>
    );
  }
}
