import React from 'react';
import { ImageBackground,StyleSheet, View, Text ,Image,SafeAreaView, ScrollView,Dimensions} from 'react-native';
import { AsyncStorage } from 'react-native';
import Moment from 'moment';

export default class Note extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount = async () => {
        try {
            let value = await AsyncStorage.getItem('chosenNote');
            if (value !== null) {
                // We have data!!
                let note = JSON.parse(value);
                this.setState({
                    note: note
                })
            }
            else
                console.log('storge is null');

        } catch (error) {
            console.log("Error geting AsyncStorege");
        }
    };
    render() {
        if (this.state.note != null) {
            
            return (
                <SafeAreaView style={styles.safeAreaView}>
                    <ScrollView style={styles.scrollView}>
                    <ImageBackground source={require('../assets/BackGround.jpg')} style={{flex:1}} resizeMode='cover'>
                    <View>
            <Text style={{color:'red',fontSize:50, fontWeight:'bold', alignSelf:'center'}} >{this.state.note.title}</Text>
                    </View>
                <View style={styles.container}>
                    <View style={{alignItems:"center"}}>
                    <Text>
                        {Moment(this.state.note.date).format('D MMM YYYY')}
                    </Text>

                    </View>

                    <Text style={{ color: 'black', fontSize: 15 }} >
                        {this.state.note.body}
                    </Text>
                    <View>
                        {this.state.note.image!=""?
                        <Image style={{ width: 150, height: 150 }} source={{ uri: this.state.note.image }}/>:null
            }
                    </View>
                </View>
                </ImageBackground>
                </ScrollView>
                </SafeAreaView>
            );
        }
        else
            return <View></View>;
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: "column",
        minHeight: Dimensions.get('window').height-215,
    },
    safeAreaView: {
        flex: 1,
      },
      scrollView: {
        marginHorizontal: 5,
      },
});
