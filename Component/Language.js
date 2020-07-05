/* eslint-disable semi */
/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable no-alert */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable keyword-spacing */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import {View, StyleSheet, Image, StatusBar, SafeAreaView ,Dimensions,Alert,Text,TouchableOpacity,BackHandler,PixelRatio,Platform} from 'react-native';
import {StackActions, NavigationActions} from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
const { width, height } = Dimensions.get('window');
import AsyncStorage from '@react-native-community/async-storage';
class Language extends Component{
    constructor(props) {
        super(props);
        this.state = {
            Processing: false,
            lang:'',
        };
        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
        BackHandler.addEventListener('hardwareBackPress', this.onBackClicked)
        );
    }

    componentDidMount =async()=> {
        this.setState({ Processing: true })
        setTimeout(() => {
             AsyncStorage.getItem('Lang').then((val) => {
                if (val) {
                    this.setState({lang:val})
                    AsyncStorage.getItem('loginDataPen').then((value) => {
                        if (value != null) {
                            this.setState({ Processing: false })
                            this.props.navigation.navigate('HomeTabs')
                        } else {
                            this.setState({ Processing: false })
                            if(this.state.lang =='AR'){
                                this.props.navigation.navigate('Login')
                            }else{
                                this.props.navigation.navigate('LoginEn')
                            }
                           
                        }
                    })
                } else {
                    this.setState({ Processing: false })
                }
            })
        }, 1000)
        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
        BackHandler.removeEventListener('hardwareBackPress', this.onBackClicked)
      );
    }

    setAppLanguage = async (lang) =>{
        try {
            await AsyncStorage.setItem('Lang', lang)
            this.setState({lang})
            if(this.state.lang =='AR'){
                this.props.navigation.navigate('Login')
            }else{
                this.props.navigation.navigate('LoginEn')
            }
            // this.props.navigation.dispatch(StackActions.reset({
                
            //                     index: 0,
            //                     actions: [
                                    
            //                         NavigationActions.navigate({ routeName: 'Login' }),
            //                     ],
            //                 }));
               

        } catch (error) {
            alert('error');
        }
    };
    onBackClicked=()=>{
        if(this.props.navigation.state.routeName === 'Language'){
         Alert.alert(
           'بالقلم' ,
           'هل أنت متأكد من أنك تريد الخروج؟',
           [
             {text: 'إلغاء' 
             , onPress: () => this.dismiss, style: 'cancel'},
             {text:  'موافق'
             , onPress: () => BackHandler.exitApp()},
           ],
           { cancelable: true }
          
         )
          return true;
       }
          else{return false;}
        }

        normalize(size) {
            const scale = width / 320;
            const newSize = size * scale 
            if (Platform.OS === 'ios') {
              return Math.round(PixelRatio.roundToNearestPixel(newSize))
            } else {
              return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
            }
          }
    
    render(){
        return(
         <SafeAreaView style={styles.container}>
             <StatusBar backgroundColor="#118CB3" barStyle="light-content" />
             <Spinner
                    visible={this.state.Processing}
                    textContent={'Loading...'}
                    textStyle={{ color: '#FFF' }}
                /> 
             <Image source={require('../img/logo.png')} style={styles.image}
             resizeMode="contain" />
             <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]} >
                    <Text style={{ fontSize: this.normalize(18), color: '#003F51', marginVertical: 21,fontFamily:'segoe' }} >{'أختر لغة التطبيق'}</Text>
                </View>
                <View style={[styles.row]} >

                        <TouchableOpacity onPress={() => this.setAppLanguage('EN')} style={[styles.Button, styles.shadow, { backgroundColor: '#F39322' }]} >
                            <Text style={{ color: '#003F51', fontSize: this.normalize(18),fontFamily:'segoe' }}>English</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.setAppLanguage('AR')} style={[styles.Button, styles.shadow, { backgroundColor: '#108AB0',marginStart:5 }]} >
                            <Text style={{ color: '#FFF', fontSize: this.normalize(18),fontFamily:'segoe' }}>العربيه</Text>
                        </TouchableOpacity>
                </View>
            
         </SafeAreaView>
        );
    }
}
export default Language;

const styles = StyleSheet.create({
    flex: {
        flex: 0,
    },
    row: {
        flexDirection: 'row',
        width:width,
        alignItems:'center',
        justifyContent:'center',
        marginTop:'5%',
    },
   
    shadow: {
        shadowColor: '#585858',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 7,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    Button: {
        width: '40%',
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        height:40,
    },
    image: {
        width: '90%',
        height: '50%',
        marginTop:'10%',
        
    },
});
