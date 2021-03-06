import React, {useState} from 'react'

import {
    View,
    Text,
    Button,
    TextInput,
    TouchableOpacity,
    Alert
} from 'react-native'
import Amplify from 'aws-amplify';
import {Auth} from 'aws-amplify'
import {validateEmail,validatePassword} from '../validation'
import awsconfig from '../../aws-exports';
import {FormStyles} from '../styles/FormStyles'

Amplify.configure(awsconfig);

export default function SignUp(props){
    
    const [state, setState] = useState({
        email: '',
        password: '',
    });
    const [error,setErrors] = useState({
        email:'',password:''
    });

    async function onSubmit() {
        const emailError = validateEmail(state.email);
        const passwordError = validatePassword(state.password);
        if(emailError || passwordError) {
            setErrors({email:emailError,password:passwordError});
        }else{
            try{
                console.log({
                    username: state.email,
                    password: state.password,
                })
                const user = await Auth.signUp({
                    username: state.email,
                    password: state.password,
                });
                props.onStateChange('confirmSignUp',user);
            }catch(errorMsg){
                Alert.alert(errorMsg);
            }
        }
    }

    if(props.authState === 'signUp'){
        return (
            <View style={FormStyles.container}>
                <Text style={FormStyles.title}>Criar Conta</Text>
                <Text style={FormStyles.space}></Text>
                <Text style={FormStyles.label}>Email:</Text>
                <TextInput
                style={FormStyles.input}
                onChangeText={(text) => setState({...state, email: text.toLowerCase()})}
                placeholder="Seu email"
                value={state.email}
                />
                <Text style={FormStyles.error}>{error.email}</Text>
                <Text style={FormStyles.label}>Senha:</Text>
                <TextInput
                    style={FormStyles.input}
                    onChangeText={(text) => setState({...state, password: text})}
                    placeholder="Sua senha"
                    value={state.password}
                    secureTextEntry={true}
                />
                <Text style={FormStyles.error}>{error.password}</Text>
                <TouchableOpacity
                    style={FormStyles.button}
                    onPress={() => onSubmit()}>
                    <Text style={FormStyles.buttonText}>Enviar</Text>
                </TouchableOpacity>
                <View style={FormStyles.links}>
                    <Button
                    onPress={() => props.onStateChange('signIn', {})}
                    title="Voltar para Login"
                    color="black"
                    accessibilityLabel="voltar para login"
                    />
                    <Button
                    onPress={() => props.onStateChange('confirmSignUp', {})}
                    title="Confirmar Código"
                    color="black"
                    accessibilityLabel="confirmar código"
                    />
                </View>
            </View>
        )
    }else{
        return <></>
    }
}