import AsyncStorage from "@react-native-community/async-storage";

export async function read(key: string) {
    try {
        const value = await AsyncStorage.getItem(key);
        return value;
    } catch (e) {
        console.error("Error reading from AsyncStorage", key, e);
        return null;
    }
}

export async function write(key: string, value: string) {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        console.error("Error reading from AsyncStorage", key, e);
        return null;
    }
}
