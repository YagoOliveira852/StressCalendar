import React from "react";
import CalendarScreen from "./src/screens/CalendarScreen";
import AnnotationScreen from "./src/screens/AnnotationScreen";
import GraphScreen from "./src/screens/GraphScreen";
import AnnotationDetails from "./src/screens/AnnotationDetails";

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function StackNavigator() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Home" component={CalendarScreen} />
		</Stack.Navigator>
	);
}

function AnnotationStackNavigator() {
	return (
		<Stack.Navigator>
			<Stack.Screen name="Lista de Anotações" component={AnnotationScreen} />
			<Stack.Screen name="AnnotationDetails" component={AnnotationDetails} />
		</Stack.Navigator>
	);
}

const Drawer = createDrawerNavigator();
export default function App() {
	return (
		<NavigationContainer>
			<Drawer.Navigator
				screenOptions={{
					headerTitle: 'StressAgenda',
					headerTitleAlign: 'center',
					headerStyle: { backgroundColor: '#fff' },
					headerTintColor: '#000',
					headerTitleStyle: { fontWeight: 'bold', fontSize: 24 },
				}}
			>
				<Drawer.Screen name="Calendário" component={StackNavigator} />
				<Drawer.Screen name="Anotações" component={AnnotationStackNavigator} />
				<Drawer.Screen name="Gráficos" component={GraphScreen} />
			</Drawer.Navigator>
		</NavigationContainer>
	);
}
