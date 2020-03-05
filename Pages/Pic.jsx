import React from 'react';
import { Text, View, TouchableOpacity, Vibration, Image, Button ,Dimensions,AsyncStorage} from 'react-native';
import { Camera } from 'expo-camera';
import { Icon } from 'react-native-elements';


export default class Pic extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
    };
  }
  async componentDidMount() {
    const { status } = await Camera.requestPermissionsAsync();
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  btnPic = async () => {
    let photo2 = await this.camera.takePictureAsync();
    Vibration.vibrate();
    try {
      await AsyncStorage.setItem('picUri', photo2.uri);
      this.props.navigation.goBack();
  } catch (error) {
      console.log("error asyncPic");
      
  }
  } 

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera ref={ref => {
            this.camera = ref;
          }} style={{ flex: 1 , alignItems:'center'}} type={this.state.type} >
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row-reverse',
              }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  // marginHorizontal:-300,

                }}
                onPress={() => {
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  });
                }}>
                
                <Icon name='arrowleft' type='antdesign' size={50} />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={this.btnPic}>
                
                <Icon name='picasa' type='entypo' size={50} />
              </TouchableOpacity>
              
            </View>
          </Camera>
        </View>
      );
    }
  }
}
