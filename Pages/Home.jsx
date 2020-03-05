import React from 'react';
import { ImageBackground,StyleSheet, View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView,Dimensions ,Alert } from 'react-native';
import Note from '../Classes/Note';
import Category from '../Classes/Caregory';
import { AsyncStorage } from 'react-native';
import { Icon, Input } from 'react-native-elements'
import { Logs } from 'expo';
import Constants from 'expo-constants';


// const notes = [
//     {
//         id: 0,
//         category: "Personal",
//         date: new Date(1598051730000),
//         title: "Remind yossi about the meating",
//         body: "......",
//         image: "https://images1.calcalist.co.il/PicServer2/20122005/584036/beyonce-formation_l.jpg",
//     },
//     {
//         id: 1,
//         category: "Personal",
//         date: new Date(1598051740000),
//         title: "Remind avi about the meating",
//         body: "...body...",
//         image: "",
//     },
//     {
//         id: 2,
//         category: "Work",
//         date: new Date(1598052740000),
//         title: "Remind avi about the mail",
//         body: "...body...",
//         image: "",
//     }

// ]

// const categories = [
//     {
//         id: 0,
//         category: "Personal",
//         sumOfNotes: 2
//     },
//     {
//         id: 1,
//         category: "Work",
//         sumOfNotes: 1
//     }
// ]

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notes: [],
            categories: [],
            add: false,
            newCat:''
        }
    }
    componentDidMount=async()=>{
        try {
            let c = await AsyncStorage.getItem('categories');
            if (c === null) {
                this.setState({
                    add:true
                })
            }
        } catch (error) {
            console.log("Error geting AsyncStorege");
        }
    }
    _storeData = async (cat) => {
        try {
            await AsyncStorage.setItem('notes', JSON.stringify(this.state.notes));
            await AsyncStorage.setItem('categories', JSON.stringify(this.state.categories));
            await AsyncStorage.setItem('chosenCat', cat);
        } catch (error) {
            // Error saving data
        }
        this.props.navigation.navigate('Notes');
    };
    AddCat = () => {
        this.setState({
            add: true
        })
    }
    CatTxtChanged = (e) => {
        this.setState({
            newCat: e.nativeEvent.text
        })
    }
    AddCatToCategories = () => {
        if(this.state.newCat===''){
            Alert.alert(
                'Empty Category',
                'category cannot be empty',
                [
                    {text: 'OK'},
                ],
                { cancelable: false }
              );
        }
        else{
        let newcat = this.state.categories;
        newcat.push(new Category(newcat.length, this.state.newCat))
        this.setState({
            categories: newcat,
            add: false,
            newCat:""
        })
    }
    }
    RenderFromAnync = async () => {
        try {
            let n = await AsyncStorage.getItem('notes');
            let c = await AsyncStorage.getItem('categories');
            if (n !== null && c !== null) {
                n = JSON.parse(n);
                c = JSON.parse(c);
                this.setState({
                    notes: n,
                    categories: c
                })
            }
        } catch (error) {
            console.log("Error geting AsyncStorege");
            console.log(error);

        }
    }
    DeleteCat=async(cat)=>{
        let {notes}=this.state;
        let {categories}=this.state;
        notes=notes.filter(note=> note.category!== cat.category);
        categories=categories.filter(c=>c.category!==cat.category);
        await AsyncStorage.setItem('notes', JSON.stringify(notes));
        await AsyncStorage.setItem('categories', JSON.stringify(categories));
        this.setState({
            notes:notes,
            categories:categories
        })     
    }

    render() {
        this.props.navigation.addListener('focus', () => {
            this.RenderFromAnync();
        });

        return (
            <SafeAreaView style={styles.safeAreaView}>
                <ScrollView style={styles.scrollView}>
                <ImageBackground source={require('../assets/BackGround.jpg')} style={{flex:1}} resizeMode='cover'>
                    <View>
                        <Text style={{color:'red',fontSize:50, fontWeight:'bold', alignSelf:'center'}} >My Notes</Text>
                    </View>
                    <View style={styles.container}>
                        {this.state.categories.map(cat => {
                            return (
                                <TouchableOpacity key={cat.id} onPress={() => {
                                    this._storeData(cat.category);
                                }}>
                                    <View style={styles.category}>
                                        <Text style={{ fontSize: 28, fontWeight: 'bold',flex:0.6}}>
                                            {cat.category}
                                        </Text>
                                        <Text style={{ fontSize: 28, fontWeight: 'bold',flex:0.1}}>
                                            {cat.sumOfNotes}
                                        </Text>
                                        <TouchableOpacity style={{flex:0.1}} onPress={()=>{this.DeleteCat(cat)}}>
                                    <Icon name='delete' type='antdesign' size={25} color='#dd0000'/>
                                </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                                
                                
                            )
                        })}
                        {this.state.add ?
                            <Input
                                placeholder='Insert note category'
                                onChange={this.CatTxtChanged}
                                leftIcon={{ type: 'antdesign', name: 'pluscircle', size: 50, onPress: this.AddCatToCategories }}
                            />
                            : <TouchableOpacity onPress={this.AddCat} style={{marginTop:20}}>
                                <Icon name='pluscircle' type='antdesign' size={50} />

                            </TouchableOpacity>
                        }
                    </View>
                    </ImageBackground>
                </ScrollView>
            </SafeAreaView>
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
        flex: 1
        //marginTop: Constants.statusBarHeight,
    },
    scrollView: {
        marginHorizontal: 5,
      },
    category: {
        backgroundColor: "#dddddd",
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "row-reverse",
        justifyContent: 'space-evenly',
        width: Dimensions.get('window').width-10,
        marginTop:10
    }
});
