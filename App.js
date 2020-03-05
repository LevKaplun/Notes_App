import React from 'react';
import { StyleSheet,Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import Home from './Pages/Home';
import Notes from './Pages/Notes';
import Note from './Pages/Note';
import Pic from './Pages/Pic';


enableScreens();

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator style={styles.container}>
      <Stack.Screen name="Home" component={Home}  />
      <Stack.Screen name="Notes" component={Notes} />
      <Stack.Screen name="Note" component={Note} />
      <Stack.Screen name="Pic" component={Pic} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
