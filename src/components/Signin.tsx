import React, { useState } from 'react';
import {View, TextInput, TouchableOpacity, Text } from 'react-native';
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<any>("");

    const handleSignup = () => {
        createUserWithEmailAndPassword(auth, email.trim(), password)
        .catch(error => alert(error.message))
    }

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
        .catch(error => alert(error.message))
    }

    return (
        <View>
            <TextInput 
                placeholder="E-mail" 
                value = {email} 
                onChangeText={text => setEmail(text)}
            />
            <TextInput 
                placeholder="Password" 
                value = {password} 
                onChangeText={text => setPassword(text)}
            />
            <TouchableOpacity onPress={handleLogin}>
                <Text>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignup}>
                <Text>Register</Text>
            </TouchableOpacity>
        </View>
    )
}
    
export default LoginScreen;

