import React, { useEffect } from "react";
import CalendarScreen from "./src/screens/CalendarScreen";
import AnnotationScreen from "./src/screens/AnnotationScreen";
import GraphScreen from "./src/screens/GraphScreen";
import AnnotationDetails from "./src/screens/AnnotationDetails";
import SmartwatchScreen from "./src/screens/SmartwatchScreen";

import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import * as Notifications from "expo-notifications";

// Configuração das notificações
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

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
	useEffect(() => {
		requestPermissions().then(() => scheduleFrequentNotification());
	}, []);

	const requestPermissions = async () => {
		const { status } = await Notifications.requestPermissionsAsync();
		if (status !== "granted") {
			alert("Permissão para notificações negada!");
		}
	};

	const scheduleFrequentNotification = async () => {
		await Notifications.cancelAllScheduledNotificationsAsync(); // Remove notificações antigas

		const interval = setInterval(async () => {
			await Notifications.scheduleNotificationAsync({
				content: {
					title: "Lembrete de Registro",
					body: "Não se esqueça de registrar seu nível de estresse!",
				},
				trigger: null, // Dispara imediatamente
			});
		}, 300000); // 300000 ms = 5 minutos

		return () => clearInterval(interval);
	};

	return (
		<NavigationContainer>
			<Drawer.Navigator
				screenOptions={{
					headerTitle: "StressAgenda",
					headerTitleAlign: "center",
					headerStyle: { backgroundColor: "#fff" },
					headerTintColor: "#000",
					headerTitleStyle: { fontWeight: "bold", fontSize: 24 },
				}}
			>
				<Drawer.Screen name="Calendário" component={StackNavigator} />
				<Drawer.Screen name="Anotações" component={AnnotationStackNavigator} />
				<Drawer.Screen name="Gráficos" component={GraphScreen} />
				<Drawer.Screen name="Smartwatch" component={SmartwatchScreen} />
			</Drawer.Navigator>
		</NavigationContainer>
	);
}
