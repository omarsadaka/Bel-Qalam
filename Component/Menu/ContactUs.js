/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Alert,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,Platform, PixelRatio
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
const {width, height} = Dimensions.get('window');
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import { Container, Header, Content, Picker, Form } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';



class ContactUs extends Component{
    constructor(props) {
        super(props);
        this.state = {
          lang: '',
          Processing: false,
          type:'',
          types_ar:[
            { label:'إقتراح', value:1 },
            { label:'شكوي',value:2 },
            { label:'أخري',value:3 },
         ],
         types_en:[
           { label:'Opinion', value:1 },
           { label:'Spam',value:2 },
           { label:'Ather',value:3 },
        ],
        userData:{},
        userId:'',
        message:'',
        };
      }
      componentDidMount() {
        this._retrieveData();
      }
      _retrieveData = async () => {
        try {
          const lang = await AsyncStorage.getItem('Lang');
          if (lang){
            this.setState({lang});
          }
          const value = await AsyncStorage.getItem('loginDataPen');
      if (value){
         const data = JSON.parse(value);
        this.setState({userData:data});
        this.setState({userId:data._id});
       } else {
        var data2 = {
          _id:'1',
          fullname:'أسم المستخدم',
        };
         this.setState({userData:data2});
       }
        } catch (error){}
      }

      _onSendPressed=()=>{
        this.setState({Processing:true});
        if (this.state.message){
          NetInfo.fetch().then(state => {
            if (state.isConnected){
              try {
                axios.post('http://165.22.83.141/api/user/contactUS',{
                    userID :this.state.userId,
                    type :this.state.type,
                    msg :this.state.message,
                }).then(response => {
                  this.setState({Processing:false});
                  this.setState({message:''});
                  if (response.data._id){
                    if (this.state.lang === 'AR'){
                      alert('تم أرسال الرساله , شكرا لك');
                    } else {
                      alert('Message send , thank you');
                    }
                  } else {
                    if (this.state.lang === 'AR'){
                      alert('حدث خطأ ما حاول مرة أخرى');
                    } else {
                      alert('Opps , try again');
                    }
                  }
                }).catch(function (error) {
                  this.setState({Processing:false});
                   console.log(error);
                }).finally(function () {
                   // always executed
                });
             } catch (error) {
              this.setState({Processing:false});
                console.log(error);
             }
            } else {
              this.setState({Processing:false});
              if (this.state.lang === 'AR'){
                alert('لا يوجد أتصال بالانترنت');
              } else {
                alert('No internet connection');
              }
            }
          });
        } else {
          this.setState({Processing:false});
          if (this.state.lang === 'AR'){
            alert('ادخل نص الرساله');
          } else {
            alert('Enter message first');
          }
        }
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
       renderOption(lang){
         if (lang === 'AR'){
            return (
                <View style={[styles.shadow,{width:width,height:'8%',alignItems:'center',backgroundColor:'#118CB3',flexDirection:'row'}]}>
                   <TouchableOpacity
                   onPress={()=>this.props.navigation.navigate('Menu')}
                   style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                 <Icon name="chevron-left" size={18} color="#fff" style={{}} />
                </TouchableOpacity>
                  <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}>تواصل معنا</Text>
                 <TouchableOpacity
                 style={{width:'10%',height:20}} />
               </View>
            );
          } else {
            return (
              <View style={[styles.shadow,{width:width,height:'8%',alignItems:'center',backgroundColor:'#118CB3',flexDirection:'row-reverse'}]}>
                <TouchableOpacity
                onPress={()=>this.props.navigation.navigate('Menu')}
                style={{width:'10%',height:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                <Icon name="chevron-right" size={18} color="#fff" style={{}} />
                </TouchableOpacity>
              <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}>Contact us</Text>
             <TouchableOpacity
             style={{width:'10%',height:20}} />
           </View>
            );
          }
       }
    render(){
    return (
            <SafeAreaView style={styles.container} >
            <StatusBar backgroundColor="#118CB3" barStyle="light-content" />
            <Spinner
                    visible={this.state.Processing}
                    textContent={'Loading...'}
                    textStyle={{ color: '#FFF' }}
                />
                <View style ={{width:width,height:'1%',backgroundColor:'#118CB3',elevation:10}}/>
            {this.renderOption(this.state.lang)}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 18 }} >
            <View style={{width:'100%',alignItems:'center',justifyContent:'center'}}>
            <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]}>
                  <Image source={require('./../../img/logo.png')} style={styles.image}
                  resizeMode="contain" />
                   </View>
               <Text style={[this.state.lang === 'AR' ? styles.right : styles.left,{width: '90%',color:'#003F51',fontSize:this.normalize(20),textAlignVertical:'center',fontFamily:'segoe'}]}>
                {this.state.lang === 'AR' ? 'أختر نوع الرسالة' : 'Choose message type'}
              </Text>
              <View style={[styles.viewRow,this.state.lang==='AR'?styles.row:styles.row_reserve,styles.shadow,{height:40}]}>
              <Icon name="caret-down" size={18} color="#707070" style={{margin:10}} />
              <View style={[{flex:1,}]}>
            <Picker
                style={{width:'100%',height:'100%',alignItems:'center',color:'#707070',justifyContent:'center',backgroundColor:'transparent'}}
                itemStyle={{backgroundColor:'#fff',}}
                onValueChange = {(type) =>{
                  this.setState({ type });
              }}
            mode="dropdown" selectedValue = {this.state.type?this.state.type:1}
            >
               {this.state.lang === "AR"?
                this.state.types_ar.map((i, index) => (
                  <Picker.Item
                  label = {i.label} value = {i.value} key={i.value} />
                          ))
               :
               this.state.types_en.map((i, index) => (
                  <Picker.Item
                  label = {i.label} value = {i.value} key={i.value} />
                          ))
               }
            </Picker>
            </View>
             </View>
            <Text style={[this.state.lang === 'AR' ? styles.right : styles.left,{width: '90%',color:'#003F51',fontSize:this.normalize(20),marginTop:15,fontFamily:'segoe'}]}>
                {this.state.lang === 'AR' ? 'أكتب رسالتك' : 'Write your message'}
              </Text>
              <TextInput
               underlineColorAndroid="transparent"
               defaultValue={this.state.message}
               onChangeText={(message) => this.setState({ message}) }
               placeholder={this.state.lang === 'AR' ? 'أكتب هنا ' : 'write here'}
               style={[styles.input,styles.shadow,this.state.lang === 'AR' ? styles.right : styles.left ,{height:150,textAlignVertical:'top',fontSize:this.normalize(17)}]}
              />
              <TouchableOpacity
              onPress={this._onSendPressed.bind(this)}
             style={[styles.button,styles.shadow]}>
            <Text style={{width: '100%',height:'100%',textAlign:'center',color:'#FFF',fontSize:this.normalize(22),textAlignVertical:'center',fontFamily:'segoe'}}>
              {this.state.lang === 'AR' ? 'أرسل' : 'Send'}
            </Text>
          </TouchableOpacity>
            </View>
            </ScrollView>

         </SafeAreaView>
        );
    }
}
export default ContactUs;
const styles = StyleSheet.create({
    flex: {
       flex: 0,
  },
    row: {
       flexDirection: 'row',
    },
    shadow: {
       shadowColor: '#000',
       shadowOffset: {
          width: 0,
          height: 6,
       },
       shadowOpacity: 0.05,
       shadowRadius: 10,
       elevation: 5,
    },
    container: {
       flex: 1,
       justifyContent: 'flex-start',
       alignItems: 'center',
       backgroundColor: '#FFF',
    },
    image:{
      width:'100%',
      height:200,
      alignItems:'center',
    },
    left:{
       textAlign:'left',
    },
    right:{
       textAlign:'right',
    },
    input:{
      width:'90%',
      marginTop:10,
      borderRadius:8,
      backgroundColor:'#FFF',
      color:'#118CB3',
      padding:10,
      alignItems:'center',fontFamily:'segoe',
  },
  viewRow:{
    width:'90%',
    marginTop:10,
    borderRadius:8,
    backgroundColor:'#FFF',
    alignItems:'center',
  },
  button:{
   width:'30%',
     height:40,
     backgroundColor:'#118CB3',
     borderRadius:20,
     alignItems:'center',
     justifyContent:'center',
     marginTop:20,
     marginBottom:5,
 },
 });
