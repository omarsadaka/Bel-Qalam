/* eslint-disable no-alert */
/* eslint-disable jsx-quotes */
/* eslint-disable space-infix-ops */
/* eslint-disable eqeqeq */
/* eslint-disable no-lone-blocks */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
/* eslint-disable keyword-spacing */
/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {View, StyleSheet, Image, StatusBar, SafeAreaView ,Dimensions,Alert,Text,TouchableOpacity,
    ScrollView,TextInput,BackHandler,Platform,PixelRatio} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
const { width, height } = Dimensions.get('window');
import {StackActions, NavigationActions} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import Modal from 'react-native-modal';


class Login extends Component{
    constructor(props) {
        super(props);
        this.state = {
            Processing: false,
            lang:'',
            password:'',
            email:'',
            getEmail:'',
            isVisible:false,
        };
        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
        BackHandler.addEventListener('hardwareBackPress', this.onBackClicked)
        );
    }
    componentDidMount() {
        // this._retrieveData();
        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
         BackHandler.removeEventListener('hardwareBackPress', this.onBackClicked)
       );
      }
      _retrieveData = async () => {
        try {
          const lang = await AsyncStorage.getItem('Lang');
          if(lang!== null){
            this.setState({lang});
          }
         
        }catch(error){}
      }
      onBackClicked=()=>{
        if(this.props.navigation.state.routeName == 'Login'){
         Alert.alert(
          'بالقلم' ,
         'هل أنت متأكد من أنك تريد الخروج؟',
           [
             {text:'إلغاء' 
             , onPress: () => this.dismiss, style: 'cancel'},
             {text: 'موافق'
             , onPress: () => BackHandler.exitApp()},
           ],
           { cancelable: true }
          
         )
          return true;
       }
          else{return false;}
        }
      _onRigisterPressed=()=>{
        this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'Rigister'})],
          }),
        );
      }
      _onSkipLoginPressed=()=>{
        this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'HomeTabs'})],
          }),
        );
      }
      _onLoginPressed =async()=>{
        this.setState({Processing:true});
        NetInfo.fetch().then(state =>{
         if(state.isConnected){
          if(this.state.email){
              if(this.state.password){
                try {
                  axios.get('http://165.22.83.141/api/user/login',{
                      params: {
                          val:this.state.email,
                          password:this.state.password,
                      },
                  }).then( response => {
                    this.setState({ Processing: false });
                    if(response.data._id){
                      const user = {
                        _id: response.data._id,
                        email: response.data.email,
                        fullname: response.data.fullname,
                        mobile: response.data.mobile,
                        password: response.data.password,
                        subscripeType:response.data.subscripeType,
                     };
                      AsyncStorage.setItem('loginDataPen',JSON.stringify(user));
                      // alert(JSON.stringify(user));
                      this.setState({email:''});
                      this.setState({password:''});
                        Toast.show('مرحبا  ' + response.data.fullname);            
                        this.props.navigation.navigate('Home');
                      
                    } else{
                        alert('يوجد خطأ في السيرفر حاول مرة أخري');
                      
                    }
                 
                  }).catch((error)=>{
                      this.setState({ Processing: false });
                      if(error.response.data.message === 'Authentication failed. User not found.'){
                          alert('عفوا هذا الايميل غير موجود');
                        
                      }
                     else if(error.response.data.message === 'Authentication failed. Wrong password.'){
                          alert('عفوا كلمة المرور غير صحيحة');
                       
                        }
                  });
              } catch (err) {
                  this.setState({ Processing: false });
                  console.log(err);
              }
              }else{
               this.setState({Processing:false});
              alert('أدخل الرقم السرى أولا');
             
          }
          }else{
            this.setState({Processing:false});
              alert('أدخل بريدك الالكترونى أولا');
           
          }
         }else{
          this.setState({Processing:false});
            alert('لا يوجد أتصال بالانترنت');
         
         }
        });
      }
      _onForgrtPwdPressed=()=>{
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        this.setState({Processing:true});
        NetInfo.fetch().then(state =>{
         if(state.isConnected){
          if(this.state.getEmail){
           if (reg.test(this.state.getEmail) === true){
                try {
                  axios.get('http://165.22.83.141/api/user/forgetPassword',{
                      params: {
                        email:this.state.getEmail,
                      }
                  }).then( response => {
                    this.setState({ Processing: false });
                    if(response.data.message === 'DONE'){
                      this.setState({getEmail:''});
                      this.setState({isVisible:false});
                     
                        alert('تم أرسال كلمه السر الى هذا الايميل');
                     
                    }else if(response.data.message === 'User not found.'){
                        alert('عفوا هذا البريد الالكترونى غير موجود');
                     
                    }
                
                  }).catch((error)=>{
                      this.setState({ Processing: false });
                      console.log(error);
                      if(error.response.data.message === 'User not found.'){
                          alert('عفوا هذا البريد الالكترونى غير موجود');
                        
                      }
                  });
              } catch (err) {
                  this.setState({ Processing: false });
                  console.log(err);
              }
          }else{
            this.setState({Processing:false});
            alert(' البريد الالكتروني غير صحيح');
         
          }
        }else{
          this.setState({Processing:false});
            alert('أدخل بريدك الالكترونى أولا');
         
         
        }
         }else{
          this.setState({Processing:false});
            alert('لا يوجد أتصال بالانترنت');
          
         }
        });
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
      
      
    
    
    renderOption=(lang)=>{
      // if(lang ==='AR'){
          return(
         <View style={[styles.shadow,{width:width,height:'8%',alignItems:'center',justifyContent:'center',backgroundColor:'#118CB3'}]}>
            <Text style={{width:'100%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}>تسجيل الدخول</Text>
         </View>
          );
      // }else{
      //     return(
      //       <View style={[styles.shadow,{width:width,height:'8%',alignItems:'center',justifyContent:'center',backgroundColor:'#118CB3'}]}>
      //       <Text style={{width:'100%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}>Login</Text>
      //    </View>
      //     );
      // }
    }
    render(){
        return(
          <SafeAreaView style={styles.container}>
              <StatusBar backgroundColor="#118CB3" barStyle="light-content"/>
              <Spinner
                   visible={this.state.Processing}
                   color='#FFF'
                   textContent='انتظر من فضلك..'
                   textStyle={{ color: '#FFF' }}
                /> 
                <View style ={{width:width,height:'1%',backgroundColor:'#118CB3',elevation:10}}/>
                {this.renderOption(this.state.lang)}
                <ScrollView  style={{width:width,height:height}}>
                  
                  <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]}>
                  <Image source={require('../img/logo.png')} style={styles.image} 
                  resizeMode="contain"></Image>
                   </View>
                   
                   <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]}>
                <TextInput
                 underlineColorAndroid='transparent' 
                defaultValue={this.state.email}
                onChangeText={(email) => this.setState({ email  }) }
                 placeholder='البريد الالكترونى' 
               style={[styles.input,{fontSize:this.normalize(20),padding:3}]}
               ></TextInput>
                </View>
              
                 <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]}>
                 <TextInput
              secureTextEntry
              underlineColorAndroid='transparent' 
              defaultValue={this.state.password}
              onChangeText={(password) => this.setState({ password  }) }
              placeholder= 'كلمه المرور' 
              style={[styles.input,{fontSize:this.normalize(20),marginBottom:'5%',padding:2} ]}
             />   
               
             </View>
               
               
                <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]}>
            <TouchableOpacity 
             onPress={this._onLoginPressed.bind(this)}
             style={[styles.button,styles.shadow]}>
              <Text style={{width: '100%',height:'100%',textAlign:'center',color:'#fff',fontSize:this.normalize(20),textAlignVertical:'center',fontFamily:'segoe'}}>
                تسجيل الدخول
              </Text>
            </TouchableOpacity>
            </View>
            <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]}>
            <TouchableOpacity 
             onPress={() => this.setState({ isVisible: true })}
             style={styles.forgetPwd}>
              <Text style={{width: '100%',height:'100%',textAlign:'center',color:'#003F51',fontSize:this.normalize(16),textAlignVertical:'center',fontFamily:'segoe'}}>
                فقدت كلمه المرور؟
              </Text>
            </TouchableOpacity>
            </View>
            <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]}>
            <TouchableOpacity 
            onPress={this._onRigisterPressed.bind(this)}
             style={[styles.createButton,styles.shadow]}>
              <Text style={{width: '100%',height:'100%',textAlign:'center',color:'#003F51',fontSize:this.normalize(20),textAlignVertical:'center',fontFamily:'segoe'}}>
               أنشاء حساب
              </Text>
            </TouchableOpacity>
            </View>
            <View style={[styles.row, { justifyContent: 'center', alignItems: 'center',marginBottom:'7%',marginTop:10 }]}>
            <TouchableOpacity 
            onPress={this._onSkipLoginPressed.bind(this)}
             style={styles.skipLogin}>
              <Text style={{width: '100%',height:'100%',textAlign:'center',color:'#003F51',fontSize:this.normalize(20),textAlignVertical:'center',
              fontFamily:'segoe'}}>
                تخطي التسجيل
              </Text>
            </TouchableOpacity>
          </View>
          <Modal
             isVisible={this.state.isVisible}
             onBackdropPress={() => this.setState({ isVisible: false })}
             animationType = {'slide'}
             >
          <View style={[styles.modal]}>
          <Text style={{width:'77%',color:'#003F51',textAlign:'center',fontSize:this.normalize(16),marginTop:5,marginBottom:'5%',fontFamily:'segoe'}}>
            أعادة الرقم السرى</Text>
            <TextInput
                 underlineColorAndroid='transparent' 
                defaultValue={this.state.getEmail}
                onChangeText={(getEmail) => this.setState({ getEmail  }) }
                 placeholder='أدخل البريد الألكترونى' 
               style={[styles.input,{fontSize:this.normalize(17)}]}
               ></TextInput>
            <TouchableOpacity
              onPress={this._onForgrtPwdPressed.bind(this)}
             style={[styles.button,styles.shadow]}>
              <Text style={{width: '100%',height:'100%',textAlign:'center',color:'#FFF',fontSize:this.normalize(18),textAlignVertical:'center',fontFamily:'segoe'}}>
                أرسال
              </Text>
            </TouchableOpacity>
         </View>
          </Modal>
                </ScrollView>
                
          </SafeAreaView>
        );
    }
}
export default Login;

const styles = StyleSheet.create({
    container:{
        height:height,
        width:width,
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent:'center',
    },
    image:{
        width:'100%',
        height:height*0.3,
        alignItems:'center',
        
    },
    input:{
        width:'80%',
        height:height*0.07,
        borderRadius:8,
        borderColor:'#E9E9E9',
        borderWidth:1,
        color:'#003F51',
        textAlign:'center',
        textAlignVertical:'center',
        marginTop:7,
        alignItems:'center',
        fontFamily:'segoe',
        lineHeight: 16
        
    },
    shadow: {
      shadowColor: '#585858',
      shadowOffset:{
          width: 0,
          height: 6,
      },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 7,
  },
    button:{
      width:'50%',
      height:45,
      backgroundColor:'#108AB0',
      borderRadius:20,
      alignItems:'center',
      justifyContent:'center',
      marginTop:30,
    },
    forgetPwd:{
      width:'60%',
      height:40,
      alignItems:'center',
      justifyContent:'center',
      marginTop:7,
    },
    createButton:{
      width:'60%',
      height:45,
      backgroundColor:'#F39322',
      borderRadius:20,
      alignItems:'center',
      justifyContent:'center',
      marginTop:7,
    },
    skipLogin:{
      width:'60%',
      height:40,
      alignItems:'center',
      justifyContent:'center',
      marginTop:20,
    },
    row:{
      flexDirection:'row',
    },
    modal:{
      width:'100%',
      height:'35%',
      alignItems:'center',
      backgroundColor:'#fff',
      borderRadius:7,
      justifyContent:'center',
      borderColor:'#707070',
      borderWidth:1,
    },
    right:{
      textAlign:'right',paddingRight:10
    },
    left:{
      textAlign:'left',
      paddingLeft:10
    }

});
