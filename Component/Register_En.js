/* eslint-disable no-trailing-spaces */
/* eslint-disable no-alert */
/* eslint-disable quotes */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable jsx-quotes */
/* eslint-disable react/self-closing-comp */
/* eslint-disable space-infix-ops */
/* eslint-disable eol-last */
/* eslint-disable no-unused-vars */
/* eslint-disable keyword-spacing */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {View, StyleSheet, Image, StatusBar, SafeAreaView ,Dimensions,Alert,Text,TouchableOpacity,
    ScrollView,TextInput,Platform,PixelRatio} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
const { width, height } = Dimensions.get('window');
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { CheckBox } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import { Container, Header, Content, Picker, Form } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';



class RigisterEn extends Component{
    constructor(props){
        super(props);
        this.state={
           Processing:false,
           lang:'',
           fatherName:'',
           phoneNumber:'',
           gender:1,
           email:'',
           errors:'',
           subtypes_ar:[
            { label:'أختر نوع الاشتراك', value:1 },
            { label:'سنوى', value:2 },
            { label:'نصف سنوى',value:3 },
           ],
           subtypes_en:[
            { label:'Choose type', value:1 },
            { label:'Yearly', value:2 },
            { label:'Mid year',value:3 },
           ],
           levels:[],
           childAges:[],
           subtype:'',
           childName:'',
           familyName:'',
           level:'',
           childAge:'',
           childName2:'',
           familyName2:'',
           level2:'',
           childAge2:'',
           gender2:1,
           checked:false,
           flag_design:0,
           flag_add:0,
           password:'',
           confirmPwd:'',
           childrens:[],
           packerColor1: '#70707040',
           packerColor2: '#70707040',
           packerColor3: '#70707040',
           packerColor4: '#70707040',
           packerColor5: '#70707040',
        };
    }
    componentDidMount() {
      this._retrieveData();
    }
    _retrieveData = async () => {
      try {
        const lang = await AsyncStorage.getItem('Lang');
        if(lang!== null){
          this.setState({lang});
        }else{
           alert(' no lang');
        }
        this.getLevels();
        this.getAges();
      }catch(error){}
    }
    validate=()=>{
      const errors ={};
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if(!this.state.fatherName){
        if(this.state.lang==='AR' ){
          alert('يرجي إدخال أسم الأب كامل' );
        }
        else {
          alert('Enter father name first' );
        }
        this.setState({Processing:false});
        errors.this.state.fatherName ="Father Name is requied "; 
      }
      else if(this.state.fatherName.length < 3){
        if(this.state.lang==='AR' ){
          alert('  اسم الأب قصير جدآ' );
        }
        else {
          alert('Father Name is very short' );
        }
        this.setState({Processing:false});
        errors.fatherName ="Father Name is very short ";
      }
     
      else if(!this.state.phoneNumber){
        if(this.state.lang==='AR' ){
          alert('ادخل  رقم الموبايل');
        }
        else {
          alert('Mobile Is Requied ');
        }
        this.setState({Processing:false});
        errors.this.state.phoneNumber ="mobile is requied ";
       }
       else if(!this.state.email){
        if(this.state.lang==='AR' ){
          alert('ادخل البريد الاكترونى');
        }
        else {
          alert('Enter email first ');
        }
        this.setState({Processing:false});
        errors.this.state.email ="email is requied ";
       }
        else if(reg.test(this.state.email) === false){
          if(this.state.lang==='AR' ){

            alert(' البريد الالكتروني غير صحيح');
          }
          else {

            alert('Email Is invalied ');
          }
          this.setState({Processing:false});
          errors.email ="email is invalied ";
        }
      else if(!this.state.password){
        if(this.state.lang==='AR' ){
          alert('يرجي ادخال كلمة السر');
        }
        else {
          alert('password is required ');
        }
        this.setState({Processing:false});
        errors.this.state.password ="password is requied";
      } 
      else if(!this.state.confirmPwd){
        if(this.state.lang==='AR' ){
          alert(' يرجي ادخال كلمة السر مرة اخري');
        }
        else {
          alert('Confirm password is required ');
        }
        this.setState({Processing:false});
        errors.this.state.confirmPwd ="Confirm password is requied";
      } 
      else if(this.state.password !== this.state.confirmPwd){
        if(this.state.lang==='AR' ){
          alert('كلمه المرور غير متطابقه ');
        }
        else {
          alert('Password Not Match ');
        }
        this.setState({Processing:false});
        errors.this.state.password ="password is requied";
      } 
      else if(this.state.password.length < 6){
        if(this.state.lang==='AR' ){
          alert('  كلمة السر قصيرة');
        }
        else {
          alert('password is very short ');
        }
        this.setState({Processing:false});
        errors.this.state.password ="password is very short";
      }
      else if(this.state.subtype === 1){
        if(this.state.lang==='AR' ){
          alert('أختر نوع الاشتراك أولا');
        }
        else {
          alert('Choose practise type first');
        }
        this.setState({Processing:false});
        errors.this.state.subtype ="practise type is required";
      }
        else if(!this.state.childName){
          if(this.state.lang==='AR' ){

            alert('يرجي ادخال اسم الطفل');
          }
          else {

            alert(' Plase Enter child name ');
          }
          this.setState({Processing:false});
          errors.this.state.childName ="Plase Enter child name";
        }
        else if(!this.state.familyName){
          if(this.state.lang==='AR' ){

            alert('يرجي ادخال اسم العائله');
          }
          else {

            alert(' Plase Enter family name ');
          }
          this.setState({Processing:false});
          errors.this.state.familyName ="Plase Enter family name";
        }
        else if(this.state.childAge === ''){
          if(this.state.lang==='AR' ){
            alert('أختر عمر الطفل أولا');
          }
          else {
            alert('Choose child age first');
          }
          this.setState({Processing:false});
          errors.this.state.childAge ="child age is required";
        }
        else if(this.state.level === ''){
          if(this.state.lang==='AR' ){
            alert('أختر الرحله الدراسيه أولا');
          }
          else {
            alert('Choose education level first');
          }
          this.setState({Processing:false});
          errors.this.state.level ="Education level is required";
        }
        else if (!this.state.gender){
          if (this.state.lang === 'AR' ){
            alert('أختر النوع أولا');
          }
          else {
            alert('Choose Gender first');
          }
          this.setState({Processing:false});
          errors.this.state.gender = 'gender is required';
        }
        else if(!this.state.checked){
          if(this.state.lang==='AR' ){
            alert('وافق على الشروط والاحكام اولا');
          }
          else {
            alert('Accept terms and condition first');
          }
          this.setState({Processing:false});
          errors.this.state.checked ="Terms and condition is required";
        }
        
      return errors;
      }

      validate2=()=>{
        const errors ={};
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!this.state.fatherName){
          if(this.state.lang==='AR' ){
            alert('يرجي إدخال أسم الأب كامل' );
          }
          else {
            alert('Enter father name first' );
          }
          this.setState({Processing:false});
          errors.this.state.fatherName ="Father Name is requied "; 
        }
        else if(this.state.fatherName.length < 3){
          if(this.state.lang==='AR' ){
            alert('  اسم الأب قصير جدآ' );
          }
          else {
            alert('Father Name is very short' );
          }
          this.setState({Processing:false});
          errors.fatherName ="Father Name is very short ";
        }
       
        else if(!this.state.phoneNumber){
          if(this.state.lang==='AR' ){
            alert('ادخل  رقم الموبايل');
          }
          else {
            alert('Mobile Is Requied ');
          }
          this.setState({Processing:false});
          errors.this.state.phoneNumber ="mobile is requied ";
         }
         else if(!this.state.email){
          if(this.state.lang==='AR' ){
            alert('ادخل البريد الاكترونى');
          }
          else {
            alert('Enter email first ');
          }
          this.setState({Processing:false});
          errors.this.state.email ="email is requied ";
         }
          else if(reg.test(this.state.email) === false){
            if(this.state.lang==='AR' ){
  
              alert(' البريد الالكتروني غير صحيح');
            }
            else {
  
              alert('Email Is invalied ');
            }
            this.setState({Processing:false});
            errors.email ="email is invalied ";
          }
        else if(!this.state.password){
          if(this.state.lang==='AR' ){
            alert('يرجي ادخال كلمة السر');
          }
          else {
            alert('password is required ');
          }
          this.setState({Processing:false});
          errors.this.state.password ="password is requied";
        } 
        else if(!this.state.confirmPwd){
          if(this.state.lang==='AR' ){
            alert(' يرجي ادخال كلمة السر مرة اخري');
          }
          else {
            alert('Confirm password is required ');
          }
          this.setState({Processing:false});
          errors.this.state.confirmPwd ="Confirm password is requied";
        } 
        else if(this.state.password !== this.state.confirmPwd){
          if(this.state.lang==='AR' ){
            alert('كلمه المرور غير متطابقه ');
          }
          else {
            alert('Password Not Match ');
          }
          this.setState({Processing:false});
          errors.this.state.password ="password is requied";
        } 
        else if(this.state.password.length < 6){
          if(this.state.lang==='AR' ){
            alert('  كلمة السر قصيرة');
          }
          else {
            alert('password is very short ');
          }
          this.setState({Processing:false});
          errors.this.state.password ="password is very short";
        }
        else if(this.state.subtype === 1){
          if(this.state.lang==='AR' ){
            alert('أختر نوع الاشتراك أولا');
          }
          else {
            alert('Choose practise type first');
          }
          this.setState({Processing:false});
          errors.this.state.subtype ="practise type is required";
        }
          else if(!this.state.childName2){
            if(this.state.lang==='AR' ){
  
              alert('يرجي ادخال اسم الطفل');
            }
            else {
  
              alert(' Plase Enter child name ');
            }
            this.setState({Processing:false});
            errors.this.state.childName2 ="Plase Enter child name";
          }
          else if(!this.state.familyName2){
            if(this.state.lang==='AR' ){
  
              alert('يرجي ادخال اسم العائله');
            }
            else {
  
              alert(' Plase Enter family name ');
            }
            this.setState({Processing:false});
            errors.this.state.familyName2 ="Plase Enter family name";
          }
          else if(this.state.childAge2 === ''){
            if(this.state.lang==='AR' ){
              alert('أختر عمر الطفل أولا');
            }
            else {
              alert('Choose child age first');
            }
            this.setState({Processing:false});
            errors.this.state.childAge2 ="child age is required";
          }
          else if(this.state.level2 === ''){
            if(this.state.lang==='AR' ){
              alert('أختر الرحله الدراسيه أولا');
            }
            else {
              alert('Choose education level first');
            }
            this.setState({Processing:false});
            errors.this.state.level2 ="Education level is required";
          }
          else if (!this.state.gender2){
            if (this.state.lang === 'AR' ){
              alert('أختر النوع أولا');
            }
            else {
              alert('Choose Gender first');
            }
            this.setState({Processing:false});
            errors.this.state.gender2 = 'gender is required';
          }
          else if(!this.state.checked){
            if(this.state.lang==='AR' ){
              alert('وافق على الشروط والاحكام اولا');
            }
            else {
              alert('Accept terms and condition first');
            }
            this.setState({Processing:false});
            errors.this.state.checked ="Terms and condition is required";
          }
          
        return errors;
        }

      getLevels(){
        NetInfo.fetch().then(state=>{
        if(state.isConnected){
          try {
            axios.get("http://165.22.83.141/api/user/educationalLevel").then(response => {
              this.setState({Processing:false})
              let level = response.data;
              let levelArr =[];
              if(this.state.lang ==='AR'){
                
              level.forEach(element => {
                levelArr.push({
                 label:element.titleAr ,value:element._id,key:element._id,
                });
              });
              levelArr.unshift({
               label:'المرحلة الدراسية',value:'1',key:'1',
              });
            
             }else{
               level.forEach(element => {
                 levelArr.push({
                   label:element.titleEN ,value:element._id,key:element._id,
                 });
               });
               levelArr.unshift({
                 label:'Educational level' ,value:'1',key:'1',
                });
              
             }
             this.setState({ levels :levelArr});
            }).catch(function (error) {
              this.setState({Processing:false})
               console.log(error);
            }).finally(function () {
               // always executed
            });
         } catch (error) {
            console.log(error);
         }
        }else{
          this.setState({Processing:false});
          if(this.state.lang=='AR'){
            alert('لا يوجد أتصال بالانترنت');
          }else{
            alert('No internet connection');
          }
        }
        });
      }
      getAges =()=>{
        NetInfo.fetch().then(state=>{
        if(state.isConnected){
          try {
            axios.get("http://165.22.83.141/api/user/childAge").then(response  => {
              let age = response.data;
              let ageArr =[];
              if(this.state.lang ==='AR'){
              age.forEach(element => {
                ageArr.push({
                 label:element.titleAr ,value:element._id,key:element._id,
                });
              });
              ageArr.unshift({
               label:'المرحلة العمرية',value:'1',key:'1',
              });
            
             }else{
               age.forEach(element => {
                 ageArr.push({
                   label:element.titleEN ,value:element._id,key:element._id,
                 });
               });
               ageArr.unshift({
                 label:'Age' ,value:'1',key:'1',
                });
              
             }
             this.setState({ childAges :ageArr});
            }).catch(function (error) {
               console.log(error);
            }).finally(function () {
               // always executed
            });
         } catch (error) {
            console.log(error);
         }
        }else{
          if(this.state.lang=='AR'){
            alert('لا يوجد أتصال بالانترنت');
          }else{
            alert('No internet connection');
          }
        }
        });
      }

      
      _onRigisterPressed=()=>{
        this.setState({Processing:true});
        NetInfo.fetch().then(state=>{
          if(state.isConnected){
            let errors = ''; 
            if(this.state.flag_design === 0){
               errors =this.validate();
            }else{
               errors =this.validate2();
            }
           
            this.setState({errors});
            if(Object.keys(errors).length === 0){
              try {
                axios.post("http://165.22.83.141/api/user/register",{
                  fullname: this.state.fatherName,
                  mobile: this.state.phoneNumber,
                  email: this.state.email,
                  password: this.state.password,
                  subscripeType: this.state.subtype,
                  children:this.state.childrens,
                }).then(response => {
                  this.setState({Processing:false});
                  if(response.data.message){
                    if(response.data.message === 'sorry is email exsist'){
                      if(this.state.lang==='AR'){
                       alert('هذا البريد الالكتروني يوجد');
                      }
                      else {
                       alert('email is exist');
                      }
                    }
                   else if(response.data.message === 'sorry is mobile exsist'){
                    if(this.state.lang==='AR'){
                     alert('هذا الرقم موجود');
                    }
                    else {
                     alert('mobil is exist');
                    }
                      }
                  }
                  else if(response.data._id){
                      this.setState({fatherName:''});
                      this.setState({phoneNumber:''});
                      this.setState({email:''});
                      this.setState({password:''});
                      this.setState({confirmPwd:''});
                      this.setState({childName:''});
                      this.setState({familyName:''});
                      this.setState({childName2:''});
                      this.setState({familyName2:''});
                      this.setState({childrens:[]});
                    if(this.state.lang ==='AR' ){
                      Toast.show(' تم التسجيل بنجاح');
                      this.props.navigation.push('Login');  
                    }
                    else {
                      Toast.show('register complete ');
                      this.props.navigation.push('Login');  
                    }
                  }
                  
                }).catch((error)=> {
                  this.setState({Processing:false});
                  if(error.response.data.message === 'sorry is email exsist'){
                    if(this.state.lang==='AR'){
                     alert('هذا البريد الالكتروني يوجد');
                    }
                    else {
                     alert('email is exist');
                    }
                  }
                 else if(error.response.data.message === 'sorry is mobile exsist'){
                  if(this.state.lang==='AR'){
                   alert('هذا الرقم موجود');
                  }
                  else {
                   alert('mobil is exist');
                  }
                    }
                }).finally(function () {
                   // always executed
                });
             } catch (error) {
              this.setState({Processing:false});
                console.log(error);
             }
            }else{
              this.setState({Processing:false});
            }
          }else{
            this.setState({Processing:false});
            if(this.state.lang ==='AR'){
              alert('لا يوجد أتصال بالانترنت');
            }else{
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

      renderRadio2(clicked){
        return(
         <TouchableOpacity
         style={{ width:27 ,height:27 , borderRadius:27/2,backgroundColor:'#fff',elevation:5,justifyContent:'center',alignItems:'center',margin:5}}
         onPress={()=>{
           this.setState({gender2:clicked})
         }}>
           {this.state.gender2 === clicked?
           <View
           style={{  width: 23, height: 23, alignItems: 'center',backgroundColor:'#F39322',borderRadius:23/2,}}/>
           :
           <View style={{display:'none'}}></View>
           }
         </TouchableOpacity>
        )
      }

      renderRadio1(clicked){
        return(
         <TouchableOpacity
         style={{ width:27 ,height:27 , borderRadius:27/2,backgroundColor:'#fff',elevation:5,justifyContent:'center',alignItems:'center',margin:5}}
         onPress={()=>{
           this.setState({gender:clicked})
         }}>
           {this.state.gender === clicked?
           <View
           style={{  width: 23, height: 23, alignItems: 'center',backgroundColor:'#F39322',borderRadius:23/2,}}/>
           :
           <View style={{display:'none'}}></View>
           }
         </TouchableOpacity>
        )
      }
    renderOption=(lang)=>{
        // if(lang ==='AR'){
        //     return(
        //    <View style={[styles.shadow,{width:width,height:'8%',alignItems:'center',backgroundColor:'#118CB3',flexDirection:'row'}]}>
        //        <TouchableOpacity
        //        onPress={() =>{
        //         this.props.navigation.navigate('LoginEn');
        //          }}
        //          resizeMode='contain'
        //        style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center'}}>
        //      <Icon name="chevron-left" size={18} color="#fff" style={{}} />
        //      </TouchableOpacity>
        //       <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}>أنشاء حساب</Text>
        //    </View>
        //     );
        // }else{
            return(
              <View style={[styles.shadow,{width:width,height:'8%',alignItems:'center',backgroundColor:'#118CB3',flexDirection:'row-reverse'}]}>
                  <TouchableOpacity
                  onPress={() =>{
                    this.props.navigation.navigate('LoginEn');
                     }} 
                     resizeMode='contain'
                  style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center'}}>
             <Icon name="chevron-right" size={18} color="#fff" style={{}} />
             </TouchableOpacity>
              <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}>Create Account</Text>
           </View>
            );
        // }
      }
    render(){
        var radio_props = [
          {label: 'Male', value: 1},
            {label: 'Female', value: 2 },
          ];
          var radio_props_ar = [
            {label: 'ذكر', value: 1},
            {label: 'انثى', value: 2},
          ];
        return(
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#118CB3" barStyle="light-content"/>
            <Spinner
                    visible={this.state.Processing}
                    color='#FFF'
                    textContent={this.state.lang === 'AR'?'انتظر من فضلك..':'Please wait..'}
                    textStyle={{ color: '#FFF' }}
                />
                <View style ={{width:width,height:'1%',backgroundColor:'#118CB3',elevation:10}}/>
                 {this.renderOption(this.state.lang)}
                <ScrollView style={{width:width,height:height}}>
                <View style={[styles.container,{alignItems:'center',justifyContent:'center'}]}>
                <View style ={[styles.row,{marginTop:10,width:'95%'}]}>
                    <View style={{width:'30%',height:1,backgroundColor:'#707070'}}></View>
                    <Text style={{width:'40%',color:'#39393B',textAlign:'center',fontSize:this.normalize(20),fontFamily:'segoe'}}>
                        {this.state.lang ==='AR'?'بيانات ولى الامر':'Parent information'}</Text>
                    <View style={{width:'30%',height:1,backgroundColor:'#707070'}}></View>
                </View>
                <View style={[styles.column,{width:'95%',marginTop:10,marginBottom:5,overflow: 'hidden',backgroundColor: '#FFF',elevation:8,padding:7,borderRadius:5}]}>
                <TextInput
                 underlineColorAndroid='transparent'
                defaultValue={this.state.fatherName}
                onChangeText={(fatherName) => this.setState({ fatherName  }) }
                 placeholder={this.state.lang ==='AR'?'أسم ولى الامر' :'Father name'}
               style={[styles.input,{fontSize:this.normalize(17)}]}
               ></TextInput>
               <TextInput
                 underlineColorAndroid='transparent'
                defaultValue={this.state.phoneNumber}
                keyboardType='numeric'
                onChangeText={(phoneNumber) => this.setState({ phoneNumber  }) }
                 placeholder={this.state.lang ==='AR'?'رقم الجوال' :'Phone number'}
               style={[styles.input,{fontSize:this.normalize(17)}]}
               ></TextInput>
                <TextInput
                 underlineColorAndroid='transparent'
                defaultValue={this.state.email}
                onChangeText={(email) => this.setState({ email  }) }
                 placeholder={this.state.lang==='AR'?'البريد الالكترونى' :'Email'}
               style={[styles.input,{fontSize:this.normalize(17)}]}
               ></TextInput>
               <TextInput
                secureTextEntry
                underlineColorAndroid='transparent'
                defaultValue={this.state.password}
                onChangeText={(password) => this.setState({ password  }) }
                placeholder= 'Password'
               style={[styles.input,{fontSize:this.normalize(17)}]}
               />
               
               <TextInput
                secureTextEntry
                 underlineColorAndroid='transparent'
                defaultValue={this.state.confirmPwd}
                onChangeText={(confirmPwd) => this.setState({ confirmPwd  }) }
                placeholder='Confirm password'
               style={[styles.input,{fontSize:this.normalize(17),}]}
               />
              <View style={[styles.viewRow,{}]}>
              <Icon name="caret-down" size={18} color="#707070" style={{position:'absolute',right:5}} />
               <View style={{width:'100%',alignItems:'center',marginStart:'55%'}}  >
              <Picker
                  style={{width:'100%',height:'100%',alignItems:'center',color:this.state.packerColor1,justifyContent:'center',fontFamily:'segoe',backgroundColor:'transparent'}}
                  itemStyle={{backgroundColor:'#fff',fontFamily:'segoe',}}
                  onValueChange = {(subtype) =>{
                    this.setState({ subtype });
                    this.setState({packerColor1:'#003F51'})
                }}
              mode="dropdown" selectedValue = {this.state.subtype?this.state.subtype:1}
              >
                       {this.state.lang === "AR"?
                this.state.subtypes_ar.map((i, index) => (
                  <Picker.Item
                  
                  label = {i.label} value = {i.value} key={i.value} />
                          ))
               :
               this.state.subtypes_en.map((i, index) => (
                  <Picker.Item
                  
                  label = {i.label} value = {i.value} key={i.value} />
                          ))
               }
              </Picker>
              </View>
              </View>
                </View>
                <View style ={[styles.row,{marginTop:15,width:'95%'}]}>
                    <View style={{width:'30%',height:1,backgroundColor:'#707070'}}></View>
                    <Text style={{width:'40%',color:'#39393B',textAlign:'center',fontSize:this.normalize(20),fontFamily:'segoe'}}>
                        {this.state.lang ==='AR'?'بيانات الطفل':'Child information'}</Text>
                    <View style={{width:'30%',height:1,backgroundColor:'#707070'}}></View>
                </View>
                <View style={[styles.column,{width:'95%',marginTop:10,marginBottom:5,overflow: 'hidden',backgroundColor: '#FFF',elevation:8,padding:7,borderRadius:5}]}>
                <TextInput
                 underlineColorAndroid='transparent'
                defaultValue={this.state.childName}
                onChangeText={(childName) => this.setState({ childName  }) }
                 placeholder={this.state.lang==='AR' ?'أسم الطفل الاول ' :'First name'}
               style={[styles.input,{fontSize:this.normalize(17)}]}
               ></TextInput>
               <TextInput
                 underlineColorAndroid='transparent'
                defaultValue={this.state.familyName}
                onChangeText={(familyName) => this.setState({ familyName  }) }
                 placeholder={this.state.lang==='AR' ?'أسم العائلة' :'Last name'}
               style={[styles.input,{fontSize:this.normalize(17)}]}
               ></TextInput>
               <View style={[styles.viewRow,{}]}>
              <Icon name="caret-down" size={18} color="#707070" style={{position:'absolute',right:5}} />
               <View style={{width:'100%',marginStart:'0%'}}  >
              <Picker
                  style={{width:'100%',height:'100%',alignItems:'center',color:this.state.packerColor2,justifyContent:'center',fontFamily:'segoe',backgroundColor:'transparent'}}
                  itemStyle={{backgroundColor:'#707070',fontFamily:'segoe'}}
                  onValueChange = {(childAge) =>{
                    this.setState({ childAge });
                    this.setState({packerColor2:'#003F51'})
                }}
              mode="dropdown" selectedValue = {this.state.childAge?this.state.childAge:'1'}
              >
                       {this.state.childAges.map((i, index) => (
               <Picker.Item
               label = {i.label} value = {i.value} key={i.value} />
                       ))}
              </Picker>
              </View>
              </View>
              <View style={[styles.viewRow,{}]}>
              <Icon name="caret-down" size={18} color="#707070" style={{position:'absolute',right:5}} />
              <View style={{width:'100%',marginStart:'0%'}}  >
              <Picker
                  style={{width:'100%',height:'100%',alignItems:'center',color:this.state.packerColor3,justifyContent:'center',fontFamily:'segoe',backgroundColor:'transparent'}}
                  itemStyle={{backgroundColor:'#707070',fontFamily:'segoe'}}
                  onValueChange = {(level) =>{
                    this.setState({ level });
                    this.setState({packerColor3:'#003F51'})
                }}
              mode="dropdown" selectedValue = {this.state.level?this.state.level:'1'}
              >
                       {this.state.levels.map((i, index) => (
               <Picker.Item
               label = {i.label} value = {i.value} key={i.value} />
                       ))}
              </Picker>
              </View>
             </View>
                 <View style ={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,styles.radioForm,{}]}>
                     <Text style={{fontSize:this.normalize(20),fontFamily:'segoe',color:'#39393B',margin:10,}}>{this.state.lang ==='AR'?'أنثـى':'Female'}</Text>
                    {this.renderRadio1(2)}
                    <View style ={{width:'10%'}}></View>
                    <Text style={{fontSize:this.normalize(20),fontFamily:'segoe',color:'#39393B',margin:10,}}>{this.state.lang ==='AR'?'ذكـر':'Male'}</Text>
                    {this.renderRadio1(1)}
                  </View>
                </View>
                {this.state.flag_design == 0 ?
                <View style={{display:'none'}}></View>
                :
                <View style={[styles.column,{width:'95%',marginTop:10,marginBottom:5,overflow: 'hidden',backgroundColor: '#FFF',elevation:8,padding:7,borderRadius:5}]}>
                <TextInput
                 underlineColorAndroid='transparent'
                defaultValue={this.state.childName2}
                onChangeText={(childName2) => {
                  this.setState({ childName2  });
                  this.setState({flag_add:1});
                } }
                 placeholder={this.state.lang==='AR' ?'أسم الطفل الاول ' :'First name'}
               style={[styles.input,{fontSize:this.normalize(17)}]}
               ></TextInput>
               <TextInput
                 underlineColorAndroid='transparent'
                defaultValue={this.state.familyName2}
                onChangeText={(familyName2) => this.setState({ familyName2  }) }
                 placeholder={this.state.lang==='AR' ?'أسم العائلة' :'Last name'}
               style={[styles.input,{fontSize:this.normalize(17)}]}
               ></TextInput>
                <View style={[styles.viewRow,{}]}>
              <Icon name="caret-down" size={18} color="#707070" style={{position:'absolute',right:5}} />
               <View style={{width:'100%',marginStart:'0%'}}  >
              <Picker
                  style={{width:'100%',height:'100%',alignItems:'center',color:this.state.packerColor4,justifyContent:'center',backgroundColor:'transparent'}}
                  itemStyle={{backgroundColor:'#fff'}}
                  onValueChange = {(childAge2) =>{
                    this.setState({ childAge2 });
                    this.setState({packerColor4:'#003F51'})
                }}
              mode="dropdown" selectedValue = {this.state.childAge2?this.state.childAge2:'1'}
              >
                       {this.state.childAges.map((i, index) => (
               <Picker.Item
               label = {i.label} value = {i.value} key={i.value} />
                       ))}
              </Picker>
              </View>
              </View>
              <View style={[styles.viewRow,{}]}>
              <Icon name="caret-down" size={18} color="#707070" style={{position:'absolute',right:5}} />
              <View style={{width:'100%',marginStart:'0%'}}  >
              <Picker
                  style={{width:'100%',height:'100%',alignItems:'center',color:this.state.packerColor5,justifyContent:'center',backgroundColor:'transparent'}}
                  itemStyle={{backgroundColor:'#fff'}}
                  onValueChange = {(level2) =>{
                    this.setState({ level2 });
                    this.setState({packerColor5:'#003F51'})
                }}
              mode="dropdown" selectedValue = {this.state.level2?this.state.level2:'1'}
              >
                       {this.state.levels.map((i, index) => (
               <Picker.Item
               label = {i.label} value = {i.value} key={i.value} />
                       ))}
              </Picker>
              </View>
             </View>
                  <View style ={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,styles.radioForm,{}]}>
                     <Text style={{fontSize:this.normalize(20),fontFamily:'segoe',color:'#39393B',margin:10,}}>{this.state.lang ==='AR'?'أنثـى':'Female'}</Text>
                    {this.renderRadio2(2)}
                    <View style ={{width:'10%'}}></View>
                    <Text style={{fontSize:this.normalize(20),fontFamily:'segoe',color:'#39393B',margin:10,}}>{this.state.lang ==='AR'?'ذكـر':'Male'}</Text>
                    {this.renderRadio2(1)}
                  </View>
                </View>
                }
                {this.state.flag_add === 0 ?
                 <View style={[this.state.lang === "AR"?styles.row_reserve:styles.row,{marginTop:15,width:'90%'}]}>
                
                      <Image
                   resizeMode='stretch'
                   source={require('../img/add_child.png')} style={{width: 30,height:30,alignItems:'center'}}>
                  </Image>
                   <TouchableOpacity
                   onPress={() =>{
                      // const errors = this.validate2.bind(this)
                      // this.setState({errors})
                   if(this.state.childName&&this.state.familyName&&this.state.childAge!=='1'&&this.state.level!=='1'){
                     this.setState({flag_design:1});
                     const obj ={
                       firstname:this.state.childName,
                       surname:this.state.familyName,
                       childAgeID :this.state.childAge,
                       educationalLevelID:this.state.level,
                       gender:this.state.gender,
                     };
                      this.state.childrens.push(obj);
                   }else{
                     this.setState({Processing:false});
                     if(this.state.lang==='AR' ){
                      alert(' أكمل جميع بيانات الطفل السابق أولا');
                    }
                    else {
                      alert('Complete all data of the previous child');
                    }
                   }
                      }}>
                    <Text style={{color:'#39393B',textAlign:'center',fontSize:this.normalize(18),fontFamily:'segoe',margin:5}}>{this.state.lang==="AR"?'أضافه طفل أخر':'Add another child'}</Text>
                    </TouchableOpacity>
                 </View>
                
                :
                
                <View style={{display:'none'}}></View>
                }
               
                <View style={[this.state.lang === "AR"?styles.row_reserve:styles.row,{marginTop:10,width:'55%',alignItems:'center',justifyContent:'center'}]}>
                <CheckBox
                  checkedIcon={<Image style={{width:30,height:30}} source={require('../img/checked.png')} />}
                  uncheckedIcon={<Image style={{width:30,height:30}} source={require('../img/unchecked.png')} />}
                checked={this.state.checked}
                onPress={() =>{
                   this.setState({checked: !this.state.checked});
                   if(this.state.childrens.length===0){
                    const obj ={
                      firstname:this.state.childName,
                      surname:this.state.familyName,
                      childAgeID :this.state.childAge,
                      educationalLevelID:this.state.level,
                      gender:this.state.gender,
                    };
                     this.state.childrens.push(obj);
                     
                   }else{
                    const obj ={
                      firstname:this.state.childName2,
                      surname:this.state.familyName2,
                      childAgeID :this.state.childAge2,
                      educationalLevelID:this.state.level2,
                      gender:this.state.gender2,
                    };
                     this.state.childrens.push(obj);
                    
                   }
                  
                  }}
                 />
                   <Text style={[this.state.lang ==='AR'?styles.right:styles.left,{color:'#39393B',fontSize:this.normalize(16),fontFamily:'segoe'}]}>
                       {this.state.lang==="AR"?'موافق على الشروط والاحكام':'Accept terms and condition'}</Text>
                </View>
                <TouchableOpacity
               onPress={this._onRigisterPressed.bind(this)}
             style={[styles.button,styles.shadow]}>
              <Text style={{width: '100%',height:'100%',textAlign:'center',color:'#003F51',fontSize:this.normalize(18),textAlignVertical:'center',
              fontFamily:'segoe'}}>
                {this.state.lang ==='AR' ?'أنشاء الحساب' :'Create Account'}
              </Text>
            </TouchableOpacity>
                </View>
                </ScrollView>

        </SafeAreaView>
        );
    }
}
export default RigisterEn;

const styles = StyleSheet.create({
   container:{
       width:width,
       flex:1,
       alignItems:'center',
       backgroundColor:'#FFF',
   },
   shadow: {
    shadowColor: '#fff',
    shadowOffset:{
        width: 0,
        height: 6,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
},
row:{
    flexDirection:'row',
    alignItems:'center',
},
row_reserve:{
    flexDirection:'row-reverse',
    alignItems:'center',
},
column:{
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
},
input:{
    width:'85%',
    height:height*0.07,
    borderRadius:8,
    borderColor:'#E9E9E9',
    borderWidth:1,
    color:'#003F51',
    textAlign:'center',
    marginTop:7,
    alignItems:'center',
    fontFamily:'segoe',
    padding: 2
},
viewRow:{
  width:'85%',
  height:43,
  borderRadius:8,
  borderColor:'#E9E9E9',
  borderWidth:1,
  marginTop:7,
  alignItems:'center',
  justifyContent:'center'
},
radioForm:{
    width:'85%',
   marginTop:15,
   justifyContent:'center',
   alignItems:'center',
},
button:{
    width:'60%',
      height:45,
      backgroundColor:'#F39322',
      borderRadius:20,
      alignItems:'center',
      justifyContent:'center',
      marginBottom:20,
  },
  right:{
    textAlign:'right',
  },
  left:{
    textAlign:'left',
  }
});