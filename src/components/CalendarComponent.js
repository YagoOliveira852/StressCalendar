import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

LocaleConfig.locales['pt-br'] = {
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: 'Hoje',
};
LocaleConfig.defaultLocale = 'pt-br';

export default function CalendarComponent({
    annotations,
    selectedDate,
    handleDayPress,
}) {
    return (
        <Calendar
            onDayPress={handleDayPress}
            markedDates={{
                ...Object.keys(annotations || {}).reduce((acc, date) => {
                    if (annotations[date]) {
                        acc[date] = {
                            marked: true,
                            dots: annotations[date].dots || [],
                        };
                    }
                    return acc;
                }, {}),
                [selectedDate]: {
                    selected: true,
                },
            }}
            markingType={'multi-dot'}
            style={styles.calendar}
            theme={{
                monthTextColor: 'black',
                monthTextSize: 20,
                todayTextColor: 'blue',
                textDayFontWeight: 'normal',
                textDayFontSize: 16,
                textMonthFontSize: 20,
            }}
            renderArrow={(direction) => (
                <Ionicons
                    name={direction === 'left' ? 'arrow-back' : 'arrow-forward'}
                    size={30}
                    color="#1684E1"
                />
            )}
        />
    );
}

const styles = StyleSheet.create({
    calendar: {
        width: Dimensions.get("window").width,
        alignSelf: "center",
        paddingBottom: 16,
        marginBottom: 8,
    },
});
