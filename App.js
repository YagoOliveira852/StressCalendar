import React, { useState } from "react";
import CalendarScreen from "./src/screens/CalendarScreen";

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Button, StyleSheet } from 'react-native';


function SettingsScreen({ navigation }) {
	return (
		<View style={styles.screen}>
			<Text>Settings Screen</Text>
			<Button title="Ir para a Home" onPress={() => navigation.navigate('Home')} />
		</View>
	);
}

// Navegação por Stack
const Stack = createStackNavigator();
function StackNavigator() {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name="Home" component={CalendarScreen} />
			<Stack.Screen name="Settings" component={SettingsScreen} />
		</Stack.Navigator>
	);
}

// Navegação Drawer (Sidebar)
const Drawer = createDrawerNavigator();
export default function App() {
	return (
		<NavigationContainer>
			<Drawer.Navigator
				screenOptions={{
					headerTitle: 'StressAgenda',
					headerTitleAlign: 'center',
					headerStyle: {
						backgroundColor: '#fff',
					},
					headerTintColor: '#000',
					headerTitleStyle: {
						fontWeight: 'bold',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: 24,
					},
				}}
			>
				<Drawer.Screen name="Calendario" component={StackNavigator} />
				<Drawer.Screen name="Settings" component={SettingsScreen} />
			</Drawer.Navigator>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	header: {
		height: 60,
		backgroundColor: '#4CAF50',
		justifyContent: 'center',
		alignItems: 'center',
	},
	headerText: {
		fontSize: 20,
		color: 'white',
		fontWeight: 'bold',
	},
});

