import { StyleSheet, Platform } from 'react-native';
export default StyleSheet.create({
    droidSafeArea: {
        flex: 1,
       paddingHorizontal: 25,
        paddingTop: Platform.OS === 'android' ? 25 : 0
    },
});