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
  TextInput,Platform,PixelRatio
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
const {width, height} = Dimensions.get('window');
import Entypo from 'react-native-vector-icons/Entypo';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import { Container, Header, Content, Picker, Form } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';



class FatherProfile extends Component{
    constructor(props) {
        super(props);
        this.state = {
          lang: '',
          data:{},
          Processing: false,
          genders_ar:[
             { label:'ذكـر', value:1 },
             { label:'أنثى',value:2 },
          ],
          genders_en:[
            { label:'Male', value:1 },
            { label:'Female',value:2 },
         ],
         isVisible:false,
         userData:{},
         userId:'',
         gender:1,
         fatherName:'',
         mobile:'',
         email:'',
         currentPass:'',
         currentPwd:'',
         newPwd:'',
         confirmPwd:'',
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
            this.getData();
           } else {
            var data2 = {
              _id:'1',
              fullname:'أسم المستخدم',
            };
             this.setState({userData:data2});
           }
        } catch (error){}
      }
      validate=()=>{
        const errors = {};
           if (!this.state.fatherName){
            if (this.state.lang === 'AR' ){
              alert('يرجي ادخال اسم ولى الامر');
            }
            else {
              alert(' Plase Enter father name ');
            }
            this.setState({Processing:false});
            errors.this.state.childName = 'Plase Enter father name';
          }
          else if (!this.state.mobile){
            if (this.state.lang === 'AR' ){
              alert('يرجى ادخال رقم الموبايل');
            }
            else {
              alert('Please Enter your mobile');
            }
            this.setState({Processing:false});
            errors.this.state.childAge = 'Please Enter your mobile';
          }
          else if (!this.state.email){
            if (this.state.lang === 'AR' ){
              alert('يرجي ادخال البريد الاكترونى');
            }
            else {
              alert(' Plase Enter email address ');
            }
            this.setState({Processing:false});
            errors.this.state.familyName = 'Plase Enter email address';
          }
        return errors;
        }

        validateSecure=()=>{
          const errors = {};
             if (!this.state.currentPwd){
              if (this.state.lang === 'AR' ){
                alert('يرجى أدخال كلمه السر الحاليه');
              }
              else {
                alert(' Plase Enter Current password ');
              }
              this.setState({Processing:false});
              errors.this.state.currentPwd = 'Plase Enter Current password';
            }
            else if (!this.state.newPwd){
              if (this.state.lang === 'AR' ){
                alert('يرجى أدخال كلمه السر الجديده');
              }
              else {
                alert('Please Enter New password');
              }
              this.setState({Processing:false});
              errors.this.state.newPwd = 'Please Enter your mobile';
            }
            else if (!this.state.confirmPwd){
              if (this.state.lang === 'AR' ){
                alert('يرجى تاكيد الرقم السرى');
              }
              else {
                alert(' Plase Enter New password again ');
              }
              this.setState({Processing:false});
              errors.this.state.confirmPwd = 'Plase Enter New password again';
            }
          return errors;
          }
        _onUpdateUser=()=>{
          this.setState({Processing:true});
          NetInfo.fetch().then(state =>{
            if (state.isConnected){
             const errors = this.validate();
             this.setState({errors});
             if (Object.keys(errors).length === 0){
               try {
                 axios.put('http://165.22.83.141/api/user/editUser/' + this.state.userId,{
                  fullname: this.state.fatherName,
                  mobile: this.state.mobile,
                  email: this.state.email,
                  gender:this.state.gender,
                 }).then(response => {
                   this.setState({Processing:false});
                   if (response.data._id){
                    const user = {
                      _id: response.data._id,
                      email: response.data.email,
                      fullname: response.data.fullname,
                      mobile: response.data.mobile,
                      password: response.data.password,
                      subscripeType:response.data.subscripeType,
                   };
                    AsyncStorage.setItem('loginDataPen',JSON.stringify(user));
                     if (this.state.lang === 'AR'){
                       alert('تم تعديل بيانات ولى الأمر بنجاح');
                     } else {
                       alert('Father information updated successfully');
                     }
                   } else {
                     if (this.state.lang === 'AR'){
                       alert('حدث خطأ ما حاول مرة أخرى');
                     } else {
                       alert('Opps try again');
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
        }
        _onSecurePressed=()=>{
          this.setState({Processing:true});
          NetInfo.fetch().then(state =>{
            if (state.isConnected){
             const errors = this.validateSecure();
             this.setState({errors});
             if (Object.keys(errors).length === 0){
               if (this.state.currentPass === this.state.currentPwd){
                 if (this.state.newPwd === this.state.confirmPwd){
                   if(this.state.newPwd.length>=6){
               try {
                 axios.put('http://165.22.83.141/api/user/editUser/' + this.state.userId,{
                  password: this.state.newPwd,
                 }).then(response => {
                   this.setState({Processing:false});
                   if (response.data._id){
                    const user = {
                      _id: response.data._id,
                      email: response.data.email,
                      fullname: response.data.fullname,
                      mobile: response.data.mobile,
                      password: response.data.password,
                      subscripeType:response.data.subscripeType,
                   };
                    AsyncStorage.setItem('loginDataPen',JSON.stringify(user));
                    this.setState({isVisible:false})
                     if (this.state.lang === 'AR'){
                       alert('تم تعديل الرقم السرى بنجاح');
                     } else {
                       alert('Password updated successfully');
                     }
                   } else {
                     if (this.state.lang === 'AR'){
                       alert('حدث خطأ ما حاول مرة أخرى');
                     } else {
                       alert('Opps try again');
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
                alert('كلمه السر قصيرة');
              } else {
                alert('Password is very short ');
              }
            }
            } else {
              this.setState({Processing:false});
              if (this.state.lang === 'AR'){
                alert('كلمه السر غير متطابقه');
              } else {
                alert('Password not match');
              }
            }
            } else {
              this.setState({Processing:false});
              if (this.state.lang === 'AR'){
                alert('كلمه السر الحاليه غير صحيحه');
              } else {
                alert('New password is wrong');
              }
            }
             } else {
               this.setState({Processing:false});
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
        }

        getData(){
          this.setState({Processing:true});
          NetInfo.fetch().then(state =>{
            if (state.isConnected){
              try {
                axios.get('http://165.22.83.141/api/user/userByID',{
                  params: {
                    id:this.state.userId,
                },
                }).then(response => {
                  this.setState({Processing:false});
                  const data = response.data;
                 this.setState({ data });
                 this.setState({fatherName:response.data.fullname});
                 this.setState({mobile:response.data.mobile});
                 this.setState({email:response.data.email});
                 this.setState({currentPass:response.data.password});
                 this.setState({gender:response.data.gender});
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
         if (lang === "AR"){
            return (
                <View style={[styles.shadow,{width:width,height:'8%',alignItems:'center',backgroundColor:'#118CB3',flexDirection:'row'}]}>
                   <TouchableOpacity
                   onPress={()=>this.props.navigation.navigate('Menu')}
                   style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                 <Icon name="chevron-left" size={18} color="#fff" style={{}} />
                </TouchableOpacity>
                  <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}>حساب ولى الأمر</Text>
                 <TouchableOpacity
                 style={{width:'10%',height:20}} />
               </View>
            );
          } else {
            return (
              <View style={[styles.shadow,{width:width,height:'8%',alignItems:'center',backgroundColor:'#118CB3',flexDirection:'row-reverse'}]}>
                <TouchableOpacity
                onPress={()=>this.props.navigation.navigate('Menu')}
                style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                <Icon name="chevron-right" size={18} color="#fff" style={{}} />
                </TouchableOpacity>
              <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}>Father profile</Text>
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
          textContent={this.state.lang === 'AR' ? 'تحميل...' : 'Loading...'}
          textStyle={{color: '#FFF'}}
        />
        <View style ={{width:width,height:'1%',backgroundColor:'#118CB3',elevation:10}}/>
            {this.renderOption(this.state.lang)}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 18 }} >
            <View style={[styles.container,{}]}>
               <View style={[this.state.lang === "AR" ? styles.row : styles.row_reserve,styles.view,styles.shadow,{}]}>
                 <TouchableOpacity
                 onPress={() => this.setState({ isVisible: true })}
                 style={{width:'35%',height:40}}>
               <Text style={{width:'100%',color:'#003F51',textAlign:'center',fontSize:this.normalize(18),backgroundColor:'#FFF',borderRadius:7,height:'100%',
                textAlignVertical:'center',fontFamily:'segoe'}}>
                  {this.state.lang === "AR" ? 'كلمه المرور' : 'Password'}</Text>
                  </TouchableOpacity>
               <View style={{width:'25%'}}/>
               <Text style={{width:'35%',color:'#fff',textAlign:'center',fontSize:this.normalize(20),fontFamily:'segoe'}}>{this.state.fatherName}</Text>
               </View>
               <View style={[this.state.lang === "AR" ? styles.row : styles.row_reserve,styles.viewItem,{marginTop:20}]}>
                 <TextInput
               underlineColorAndroid="transparent"
               defaultValue={this.state.fatherName}
               onChangeText={(fatherName) => this.setState({ fatherName  }) }
               placeholder={this.state.lang === 'AR' ? 'أسم ولي الأمر ' : 'Father name'}
               style={[styles.input,styles.shadow,{width:'60%',fontSize:this.normalize(18)}]}
              />
               <Text style={[styles.text,this.state.lang === "AR" ? styles.right : styles.left,{fontSize:this.normalize(20)}]}>
                 {this.state.lang === 'AR' ? 'أسم ولي الأمر ' : 'Father name'}</Text>
              </View>
              <View style={[this.state.lang === "AR" ? styles.row : styles.row_reserve,styles.viewItem,{marginTop:10}]}>
                 <TextInput
               underlineColorAndroid="transparent"
               defaultValue={this.state.mobile}
               onChangeText={(mobile) => this.setState({ mobile  }) }
               placeholder={this.state.lang === 'AR' ? 'رقم الجوال  ' : 'Mobile number'}
               style={[styles.input,styles.shadow,{width:'60%',fontSize:this.normalize(18)}]}
              />
               <Text style={[styles.text,this.state.lang === "AR" ? styles.right : styles.left,{fontSize:this.normalize(20)}]}>
                 {this.state.lang === 'AR' ? 'رقم الجوال  ' : 'Mobile number'}</Text>
              </View>
              <View style={[this.state.lang === "AR" ? styles.row : styles.row_reserve,styles.viewItem,{marginTop:10}]}>
                 <TextInput
               underlineColorAndroid="transparent"
               defaultValue={this.state.email}
               onChangeText={(email) => this.setState({ email  }) }
               placeholder={this.state.lang === 'AR' ? 'البريد الألكترونى  ' : 'Email'}
               style={[styles.input,styles.shadow,{width:'60%',fontSize:this.normalize(18)}]}
              />
               <Text style={[styles.text,this.state.lang === "AR" ? styles.right : styles.left,{fontSize:this.normalize(20)}]}>
                 {this.state.lang === 'AR' ? 'البريد الألكترونى  ' : 'Email'}</Text>
              </View>
              <View style={[this.state.lang === "AR" ? styles.row : styles.row_reserve,styles.viewItem,{marginTop:10}]}>
              <View style={[styles.viewRow,styles.shadow,{}]}>
              <Icon name="caret-down" size={18} color="#707070" style={[this.state.lang === "AR" ? styles.posLeft : styles.posRight,{position:'absolute'}]} />
              <View style={[this.state.lang === "AR" ? styles.maStart : styles.maEnd,{width:'100%'}]}>
                <Picker
                style={{width:'100%',height:'100%',alignItems:'center',color:'#003F51',justifyContent:'center',backgroundColor:'transparent'}}
                itemStyle={{backgroundColor:'#fff'}}
                onValueChange = {(gender) =>{
                  this.setState({ gender });
              }}
               mode="dropdown" selectedValue = {this.state.gender?this.state.gender:1}
               >
               {this.state.lang === "AR"?
                this.state.genders_ar.map((i, index) => (
                  <Picker.Item
                  label = {i.label} value = {i.value} key={i.value} />
                          ))
               :
               this.state.genders_en.map((i, index) => (
                  <Picker.Item
                  label = {i.label} value = {i.value} key={i.value} />
                          ))
               }
            </Picker>
            </View>
              </View>
               <Text style={[styles.text,this.state.lang === "AR" ? styles.right : styles.left,{fontSize:this.normalize(20)}]}>
                 {this.state.lang === 'AR' ? 'النـوع ' : 'Gender'}</Text>
              </View>
          <Modal
             isVisible={this.state.isVisible}
             onBackdropPress={() => this.setState({ isVisible: false })}
             swipeDirection="left"
             >
          <View style={[styles.modal,{}]}>
          <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,styles.view2]}>
                <TouchableOpacity
                 onPress={()=>this.setState({isVisible:false})}>
               <Image source={require('./../../img/close.png')} style={{width:15,height:15,margin:10}} resizeMode="contain" />
               </TouchableOpacity>
            </View>
          <TextInput
               secureTextEntry
               underlineColorAndroid="transparent"
               defaultValue={this.state.currentPwd}
               onChangeText={(currentPwd) => this.setState({ currentPwd  }) }
               placeholder={this.state.lang === 'AR' ? 'كلمه المرور الحاليه ' : 'Current password'}
               style={[styles.input,styles.shadow,{width:'80%',marginTop:'10%',fontSize:this.normalize(20)}]}
              />
              <TextInput
              secureTextEntry
               underlineColorAndroid="transparent"
               defaultValue={this.state.newPwd}
               onChangeText={(newPwd) => this.setState({ newPwd  }) }
               placeholder={this.state.lang === 'AR' ? 'كلمه المرور الجديدة' : 'New password'}
               style={[styles.input,styles.shadow,{width:'80%',marginTop:7,fontSize:this.normalize(20)}]}
              />
              <TextInput
              secureTextEntry
               underlineColorAndroid="transparent"
               defaultValue={this.state.confirmPwd}
               onChangeText={(confirmPwd) => this.setState({ confirmPwd  }) }
               placeholder={this.state.lang === 'AR' ? 'تأكيد كلمه المرور' : 'Confirm password'}
               style={[styles.input,styles.shadow,{width:'80%',marginTop:7,fontSize:this.normalize(20)}]}
              />
            <TouchableOpacity
              onPress={this._onSecurePressed.bind(this)}
               style={[styles.button,styles.shadow,{position:'absolute',bottom:15}]}>
              <Text style={{width: '100%',height:'100%',textAlign:'center',color:'#FFF',fontSize:this.normalize(20),textAlignVertical:'center',fontFamily:'segoe'}}>
                {this.state.lang === 'AR' ? 'حفــظ' : 'Save'}
              </Text>
            </TouchableOpacity>
         </View>
          </Modal>
            </View>
            </ScrollView>
          <TouchableOpacity
          onPress={this._onUpdateUser.bind(this)}
           style={[styles.button,{position:'absolute',bottom:'7%'}]}>
          <Text style={{width: '100%',height:'100%',textAlign:'center',color:'#FFF',fontSize:this.normalize(20),textAlignVertical:'center',fontFamily:'segoe'}}>
           {this.state.lang === 'AR' ? 'حفــظ' : 'Save'}
            </Text>
          </TouchableOpacity>
         </SafeAreaView>
        );
    }
}
export default FatherProfile;
const styles = StyleSheet.create({
   container: {
     width:width,
     flex:1,
     alignItems: 'center',
     justifyContent:'center',
     backgroundColor: '#fff',
   },
   shadow: {
     shadowColor: '#fff',
     shadowOffset: {
       width: 0,
       height: 6,
     },
     shadowOpacity: 0.05,
     shadowRadius: 10,
     elevation: 5,
   },
   row: {
     flexDirection: 'row',
   },
   row_reserve: {
     flexDirection: 'row-reverse',
   },
   viewItem:{
      width:'100%',alignItems:'center',
      justifyContent:'center',
   },
   view:{
    width:'100%',alignItems:'center',
    height:85,
    justifyContent:'center',
    backgroundColor:'#F39322',
   },
   view2:{
    width:'100%',
    alignItems:'center',
 },
   input:{
    width:'70%',
     height:50,
     borderRadius:8,
     backgroundColor:'#FFF',
     color:'#003F51',
     textAlign:'center',
     alignItems:'center',
     fontFamily:'segoe'
 },
 viewRow:{
  width:'60%',
  height:50,
  borderRadius:8,
  backgroundColor:'#FFF',
  alignItems:'center',
  justifyContent:'center'
},
 radioForm:{
     width:'85%',
    marginTop:'10%',
    marginBottom:'10%',
    justifyContent:'center',
    alignItems:'center',
 },
 text:{
   width: '30%',
   color: '#003F51', margin: 7,fontFamily:'segoe',
 },
 left:{
   textAlign:'left',
 },
 right:{
   textAlign:'right',
 },
 button:{
   width:'30%',
     height:40,
     backgroundColor:'#118CB3',
     borderRadius:20,
     alignItems:'center',
     justifyContent:'center',
 },
 modal:{
  width:'100%',
  height:'50%',
  alignItems:'center',
  backgroundColor:'#fff',
  borderRadius:10,
  borderColor:'#707070',borderWidth:1,
},
maStart:{
  marginEnd:'30%'
},
maEnd:{
  marginStart:'50%'
},
posLeft:{
 left:7
},
posRight:{
 right:7
}

 });
