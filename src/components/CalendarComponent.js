import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

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
                    // selectedColor: 'lightblue',
                },
            }}
            markingType={'multi-dot'}
            style={styles.calendar}
        />
    );
}

const styles = StyleSheet.create({
    calendar: {
        width: Dimensions.get("window").width,
        alignSelf: "center",
        padding: 16,
        marginTop: 16,
        marginBottom: 16,
    },

});