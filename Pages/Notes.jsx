import React from 'react';
import { ImageBackground,Alert,StyleSheet, View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView,Dimensions,AsyncStorage } from 'react-native';
import { Logs } from 'expo';
import Moment from 'moment';
import { Icon, Input,Button} from 'react-native-elements'
import Note from '../Classes/Note';
import Category from '../Classes/Caregory';
import { Camera } from 'expo-camera';
import Constants from 'expo-constants';
import Pic from './Pic';
import * as ImagePicker from 'expo-image-picker';


export default class Notes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            picUri: 'http://www.glptn.com/images/nopic.jpg',
            add: false
        }
    }
    componentDidMount = async () => {
        try {
            const value = await AsyncStorage.getItem('notes');
            const chosenCat = await AsyncStorage.getItem('chosenCat');
            if (value !== null && chosenCat !== null) {
                // We have data!!
                let notes = JSON.parse(value);
                notesByCat=notes.filter(note => note.category === chosenCat);
                let isE;
                notesByCat.length===0?isE=true:isE=false;
                
                this.setState({
                    chosenCat: chosenCat,
                    notesByCat:notesByCat,
                    notes:notes,
                    add:isE,
                    newTitle:"",
                    newBody:""
                })
                
            }
            else
                console.log('storge is null');

        } catch (error) {
            console.log("Error geting AsyncStorege");
        }
    };
    _storeData = async (note) => {
        try {
            await AsyncStorage.setItem('chosenNote', JSON.stringify(note));
        } catch (error) {
            // Error saving data
        }
    };
    AddNote = () => {
        this.setState({
            add: true,
            picUri: 'http://www.glptn.com/images/nopic.jpg'
        })
    }
    TitleTxtChanged = (e) => {
        this.setState({
            newTitle: e.nativeEvent.text
        })
    }
    BodyTxtChanged = (e) => {
        this.setState({
            newBody: e.nativeEvent.text
        })
    }
    
    AddNoteToNotes = () => {
        if(this.state.newTitle===''||this.state.newBody===''){
            Alert.alert(
                this.state.newTitle===''?'Empty Title':'Empty Body',
                this.state.newTitle===''?'Title cannot be empty':'Body cannot be empty',
                [
                    {text: 'OK'},
                ],
                { cancelable: false }
              );
        }
        else{
        let newNotes = this.state.notesByCat;
        let newNote = new Note(this.state.notes.length===0?0:(this.state.notes[this.state.notes.length-1].id+1), this.state.chosenCat, new Date(), this.state.newTitle, this.state.newBody,this.state.picUri!=='http://www.glptn.com/images/nopic.jpg'?this.state.picUri:"");        
        newNotes.push(newNote);
        let allNotes=this.state.notes;
        allNotes.push(newNote)
        this.setState({
            notesByCat: newNotes,
            notes:allNotes,
            add: false,
            newTitle:"",
            newBody:"",
            picUri: 'http://www.glptn.com/images/nopic.jpg'
        })
        
        this.AddNoteToAsyncS(newNote);
    }
    }
    AddNoteToAsyncS = async (newNote) => {
        
        try {
            let n = await AsyncStorage.getItem('notes');
            let c = await AsyncStorage.getItem('categories');
            if (n !== null && c !== null) {
                n = JSON.parse(n);
                c = JSON.parse(c);
                n.push(newNote);
                c.map(cat => {
                    if (newNote.category === cat.category) {
                        cat.sumOfNotes++;
                        return (cat)
                    }
                    else
                        return cat;
                })
                await AsyncStorage.setItem('notes', JSON.stringify(n));
                await AsyncStorage.setItem('categories', JSON.stringify(c));
            }
        }
        catch{
            console.log("Error SetNoteToAsyncStorege");
        }
    }
    DeleteNote= async(n)=>{
        try {
            let notes = await AsyncStorage.getItem('notes');
            let cat = await AsyncStorage.getItem('categories');
            if (notes !== null && cat !== null) {
                notes = JSON.parse(notes);
                cat = JSON.parse(cat);
                notes=notes.filter(note => note.id !== n.id);
                cat.map(c => {
                    if (n.category === c.category) {
                        c.sumOfNotes--;
                        return (c)
                    }
                    else
                        return c;
                })
                await AsyncStorage.setItem('notes', JSON.stringify(notes));
                await AsyncStorage.setItem('categories', JSON.stringify(cat));
                this.setState({
                    notesByCat: notes.filter(note => note.category === this.state.chosenCat),
                    notes:notes
                })
            }
        }
        catch{
            console.log("Error SetNoteToAsyncStorege");
        }
        
    }
    btnOpenGalery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            //allowsEditing: true,
            //aspect: [4, 3],
          });
            
          if (!result.cancelled) {
            this.setState({ picUri: result.uri });
          }
    };
    RenderPic= async()=>{
        try{
            let picUri = await AsyncStorage.getItem('picUri');
            if(picUri!==null){
                this.setState({
                    picUri:picUri
                })
                await AsyncStorage.removeItem('picUri');
            }
        }
        catch{}
    }
    render() {
        this.props.navigation.addListener('focus', () => {
            this.RenderPic();
        });
        if (this.state.notesByCat != null) {
            return (
                <SafeAreaView style={styles.safeAreaView}>
                    <ScrollView style={styles.scrollView}>
                    <ImageBackground source={require('../assets/BackGround.jpg')} style={{flex:1}} resizeMode='cover'>
                    <View>
            <Text style={{color:'red',fontSize:50, fontWeight:'bold', alignSelf:'center'}} >{this.state.chosenCat}</Text>
                    </View>
                        <View style={styles.container}>
                            {this.state.notesByCat.map(note => {
                                
                                return (
                                    <TouchableOpacity style={styles.note} key={note.id} onPress={() => {
                                        this._storeData(note);
                                        this.props.navigation.navigate('Note');

                                    }}>
                                        <Text>
                                            {Moment(note.date).fromNow()}
                                        </Text>

                                        <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold' }}>
                                            {note.title}
                                        </Text>

                                        <Text style={{ color: 'black', fontSize: 15 }} >
                                            {note.body.split('\n').length>1?note.body.split('\n')[0]+'...':note.body}
                                        </Text>
                                        <TouchableOpacity style={{marginRight: 300}} onPress={()=>{this.DeleteNote(note)}}>
                                    <Icon name='delete' type='antdesign' size={25} color='#dd0000'/>
                                </TouchableOpacity>
                                    </TouchableOpacity>
                                )

                            })}
                            {this.state.add ?
                                <View style={styles.add}>
                                    <Input
                                        placeholder='Insert title'
                                        onChange={this.TitleTxtChanged}
                                    />
                                    <Input
                                        placeholder='Insert body'
                                        onChange={this.BodyTxtChanged}
                                        multiline={true}
                                    />
                                    <Image
                                        style={{ width: 200, height: 200 }}
                                        source={{ uri: this.state.picUri }}
                                    />
                                    <View style={{flex:1,flexDirection:'row'}}>
                                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Pic')}}>
                                        <Icon name='camera' type='antdesign' size={50} />

                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{this.btnOpenGalery()}}>
                                        <Icon name='upload' type='antdesign' size={50} />

                                    </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity onPress={this.AddNoteToNotes}>
                                        <Icon name='pluscircle' type='antdesign' size={50} />

                                    </TouchableOpacity>

                                </View>
                                : <TouchableOpacity onPress={this.AddNote} style={{marginTop:20}}>
                                    <Icon name='pluscircle' type='antdesign' size={50}/>

                                </TouchableOpacity>

                            }
                        </View>
                        </ImageBackground>
                    </ScrollView>
                </SafeAreaView>
            );
        }
        else
            return (
                <View></View>
            );
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "column",
        minHeight: Dimensions.get('window').height-125,
    },
    safeAreaView: {
        flex: 1,
      },
      scrollView: {
        marginHorizontal: 5,
      },
    note: {
        flex: 0.1,
        backgroundColor: "#dddddd",
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        width: Dimensions.get('window').width-10,
        justifyContent: 'flex-start',
        maxHeight:150,
        marginTop:10,
    },
    add: {
        flex: 0.2,
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        width: Dimensions.get('window').width-10,
        justifyContent: 'flex-start',
        marginTop:20,
        marginBottom:30
    }
});