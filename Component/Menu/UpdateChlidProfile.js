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
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import { Container, Header, Content, Picker, Form } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';


class UpdateChildProfile extends Component{
    constructor(props) {
        super(props);
        this.state = {
          lang: '',
          Processing: false,
          childAge:'',
          level:'',
          data:{},
           radio_props : [
            {label: 'Male', value: 1},
            {label: 'Female', value: 2 },
          ],
           radio_props_ar : [
            {label: 'ذكر', value: 1},
            {label: 'انثى', value: 2},
          ],
          childAges:[],
          levels:[],
          childName:'',
          familyName:'',
          childId:'',
          userImg:'',
          gender: 0,
          genderr:0,
          userData:{},
          userId:'',
        };
      }
      componentWillMount() {
        this._retrieveData();
      }
      _retrieveData = async () => {
        const { navigation } = this.props;
        const Id = navigation.getParam('child_ID', 'NO-ID');
        this.setState({childId:Id});
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

      normalize(size) {
        const scale = width / 320;
        const newSize = size * scale 
        if (Platform.OS === 'ios') {
          return Math.round(PixelRatio.roundToNearestPixel(newSize))
        } else {
          return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
        }
      }


      pickImageFromPhone() {
        const options = {
          title: this.state.lang === 'AR' ? 'أختار النوع' : 'Select Avatar',
          cancelButtonTitle:this.state.lang === 'AR' ? 'الغاء ' : 'Cancel',
          takePhotoButtonTitle:this.state.lang === 'AR' ? 'ألتقاط صورة ' : 'Take Photo',
          chooseFromLibraryButtonTitle:this.state.lang === 'AR' ? 'معرض الصور ' : 'From Gallery ',
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };
        ImagePicker.showImagePicker(options, (response) => {
           this.setState({Processing:true});
           console.log('Response = ', response);
           if (response.didCancel) {
              this.setState({Processing:false});
              console.log('User cancelled image picker');
           } else if (response.error) {
              this.setState({Processing:false});
              console.log('ImagePicker Error: ', response.error);
           } else if (response.customButton) {
              this.setState({Processing:false});
              console.log('User tapped custom button: ', response.customButton);
           } else {
             this.setState({Processing:false});
              // const source = { uri: response.uri, fileName: response.fileName };

              const source = { uri: response.uri };
              const data = new FormData();
              data.append('name', 'testName'); // you can append anyone.
              data.append('photo', {
                uri: source.uri,
                type: 'image/jpeg', // or photo.type
                name: 'testPhotoName',
              });
              fetch('http://165.22.83.141/api/user/uploadFile', {
                method: 'post',
                body: data,
              }).then((res)=>{
                return res.text();
              })
              .then((text)=>{
                this.setState({
                  userImg: text,
                });
                if (this.state.lang === 'AR' ){
                  Toast.show('تم رفع الملف بنجاح');
                }
                else {
                  Toast.show('file added successfully ');
                }
              });
           }
        });
     }

     validate=()=>{
      const errors = {};
         if (!this.state.childName){
          if (this.state.lang === 'AR' ){
            alert('يرجي ادخال اسم الطفل');
          }
          else {
            alert(' Plase Enter child name ');
          }
          this.setState({Processing:false});
          errors.this.state.childName = 'Plase Enter child name';
        }
        else if (!this.state.familyName){
          if (this.state.lang === 'AR' ){
            alert('يرجي ادخال اسم العائله');
          }
          else {
            alert(' Plase Enter family name ');
          }
          this.setState({Processing:false});
          errors.this.state.familyName = 'Plase Enter family name';
        }
        else if (this.state.childAge === '1'){
          if (this.state.lang === 'AR' ){
            alert('أختر عمر الطفل أولا');
          }
          else {
            alert('Choose child age first');
          }
          this.setState({Processing:false});
          errors.this.state.childAge = 'child age is required';
        }
        else if (this.state.level === '1'){
          if (this.state.lang === 'AR' ){
            alert('أختر الرحله الدراسيه أولا');
          }
          else {
            alert('Choose education level first');
          }
          this.setState({Processing:false});
          errors.this.state.level = 'Education level is required';
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
      return errors;
      }
     _onUpdateChild=()=>{
       this.setState({Processing:true});
       NetInfo.fetch().then(state =>{
         if (state.isConnected){
          const errors = this.validate();
          this.setState({errors});
          if (Object.keys(errors).length === 0){
            try {
              axios.put('http://165.22.83.141/api/user/userChildreen/' + this.state.childId,{
                firstname: this.state.childName,
                surname: this.state.familyName,
                childAgeID: this.state.childAge,
                educationalLevelID: this.state.level,
                imgPath:this.state.userImg,
                gender:this.state.gender,
              }).then(response => {
                this.setState({Processing:false});
                if (response.data._id){
                  if (this.state.lang === 'AR'){
                    alert('تم تعديل بيانات الطفل بنجاح');
                  } else {
                    alert('Child information updated successfully');
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

   getLevels(){
    NetInfo.fetch().then(state=>{
    if (state.isConnected){
      try {
        axios.get('http://165.22.83.141/api/user/educationalLevel').then(response => {
          let level = response.data;
          let levelArr = [];
          if (this.state.lang === 'AR'){
          level.forEach(element => {
            levelArr.push({
             label:element.titleAr ,value:element._id,key:element._id,
            });
          });
          levelArr.unshift({
           label:'المرحله الدراسيه',value:'1',key:'1',
          });
         } else {
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
           console.log(error);
        }).finally(function () {
           // always executed
        });
     } catch (error) {
        console.log(error);
     }
    } else {
      if (this.state.lang === 'AR'){
        alert('لا يوجد أتصال بالانترنت');
      } else {
        alert('No internet connection');
      }
    }
    });
   }

  getAges =()=>{
    NetInfo.fetch().then(state=>{
    if (state.isConnected){
      try {
        axios.get('http://165.22.83.141/api/user/childAge').then(response  => {
          let age = response.data;
          let ageArr = [];
          if (this.state.lang === 'AR'){
          age.forEach(element => {
            ageArr.push({
             label:element.titleAr ,value:element._id,key:element._id,
            });
          });
          ageArr.unshift({
           label:'المرحله العمريه',value:'1',key:'1',
          });

         } else {
           age.forEach(element => {
             ageArr.push({
               label:element.titleEN ,value:element._id,key:element._id,
             });
           });
           ageArr.unshift({
             label:'Age stage' ,value:'1',key:'1',
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
    } else {
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
              axios.get('http://165.22.83.141/api/user/userChildreen',{
                params: {
                  id:this.state.childId,
              },
              }).then(response => {
                this.setState({Processing:false});
                const data = response.data;
               this.setState({ data });
               this.setState({childName:response.data.firstname});
               this.setState({familyName:response.data.surname});
               this.setState({childAge:response.data.childAgeID});
               this.setState({level:response.data.educationalLevelID});
               this.setState({userImg:response.data.imgPath});
               this.setState({genderr:response.data.gender});
               this.setState({gender:response.data.gender});
              
               this.getAges();
               this.getLevels();
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

      renderRadio(clicked){
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

       renderOption(lang){
         if (lang === 'AR'){
            return (
                <View style={[styles.shadow,{width:width,height:'8%',alignItems:'center',backgroundColor:'#118CB3',flexDirection:'row'}]}>
                   <TouchableOpacity
                   onPress={()=>this.props.navigation.navigate('ChildProfile')}
                   style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                 <Icon name="chevron-left" size={18} color="#fff" style={{}} />
                </TouchableOpacity>
                  <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}> تعديل حساب الطفل</Text>
                 <TouchableOpacity
                 style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center'}} />
               </View>
            );
          } else {
            return (
              <View style={[styles.shadow,{width:width,height:'8%',alignItems:'center',backgroundColor:'#118CB3',flexDirection:'row-reverse'}]}>
                <TouchableOpacity
                onPress={()=>this.props.navigation.navigate('ChildProfile')}
                style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                <Icon name="chevron-right" size={18} color="#fff" style={{}} />
                </TouchableOpacity>
              <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}>Update Child profile</Text>
             <TouchableOpacity
             style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center'}} />
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
            textStyle={{color: '#fff'}}
          />
          <View style ={{width:width,height:'1%',backgroundColor:'#118CB3',elevation:10}}/>
            {this.renderOption(this.state.lang)}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 18 }} >
              <View style={[styles.container]}>
              <View style={[styles.shadow,styles.viewContain]} >
              <View style={[styles.viewItem , this.state.lang === 'AR' ? styles.row : styles.row_reserve]}>
              <View style={[this.state.lang === 'AR' ? styles.start : styles.end,{flex:1,}]}>
               <Image
                  source={require('./../../img/edit2.png')}
                  style={{  width: 50, height: 50, alignItems: 'center'}}/>
               </View>
                  <View style={[{flex:1,alignItems:'center',justifyContent:'center'}]}>
                  {this.state.userImg ?
                   <TouchableOpacity
                    onPress={this.pickImageFromPhone.bind(this)}
                   >
                   <Image
                   source={{uri:this.state.userImg }}
                   style={{  width: 130, height: 130, alignItems: 'center', borderRadius:130 / 2 ,margin:'5%'}}/>
                   </TouchableOpacity>
                  :
                  <View style={[{flex:1,alignItems:'center',justifyContent:'center'}]}>
               {this.state.genderr === 1 ?
             <TouchableOpacity
              onPress={this.pickImageFromPhone.bind(this)}
             >
             <Image
              source={require('../../img/boy.png')}
             style={{  width: 130, height: 130, alignItems: 'center' ,margin:'5%'}}/>
             </TouchableOpacity>
              :
              <TouchableOpacity
              onPress={this.pickImageFromPhone.bind(this)}
             >
             <Image
            source={require('../../img/girl.png')}
            style={{  width: 130, height: 130, alignItems: 'center' ,margin:'5%'}}/>
            </TouchableOpacity>
             }
            </View>
                  }
          </View>
          <View style={[{flex:1,alignItems:'center',height:90,justifyContent:'center'}]}>
                <Text style={{ fontSize: this.normalize(20), textAlign: 'center', color: '#108AB0',fontFamily:'segoe', 
                    }}>{this.state.childName} {this.state.familyName}</Text>
          </View>
        </View>
              <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,styles.view,{marginTop:20}]}>
                 <TextInput
               underlineColorAndroid="transparent"
               defaultValue={this.state.childName}
               onChangeText={(childName) => this.setState({ childName  }) }
               placeholder={this.state.lang === 'AR' ? 'أسم الطفل الأول ' : 'Child first name'}
               style={[styles.input,{fontSize:this.normalize(17)}]}
              />
               <Text style={[styles.text,this.state.lang === 'AR' ? styles.right : styles.left,{fontSize:this.normalize(18)}]}>
                 {this.state.lang === 'AR' ? 'أسـم الطفل الأول ' : 'Child first name'}</Text>
              </View>
              <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,styles.view,{marginTop:5}]}>
                 <TextInput
               underlineColorAndroid="transparent"
               defaultValue={this.state.familyName}
               onChangeText={(familyName) => this.setState({ familyName  }) }
               placeholder={this.state.lang === 'AR' ? 'أسم عائلة الطفل  ' : 'Family Child  name'}
               style={[styles.input,{fontSize:this.normalize(17)}]}
              />
               <Text style={[styles.text,this.state.lang === 'AR' ? styles.right : styles.left,{fontSize:this.normalize(18)}]}>
                 {this.state.lang === 'AR' ? 'أسم عائلة الطفل  ' : 'Family Child  name'}</Text>
              </View>

              <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,styles.view,{marginTop:5}]}>
              <View style={[styles.viewRow,{}]}>
              <Icon name="caret-down" size={18} color="#707070" style={[this.state.lang==='AR'?styles.posLeft:styles.posRight,{position:'absolute'}]} />
              <View style={[{width:'100%'}]}  >
            <Picker
                style={{width:'100%',height:'100%',alignItems:'center',color:'#118CB3',justifyContent:'center', backgroundColor:'transparent',}}
                itemStyle={{backgroundColor:'#fff',}}
                
                onValueChange = {(childAge) =>{
                  this.setState({ childAge });
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
               <Text style={[styles.text,this.state.lang === 'AR' ? styles.right : styles.left,{fontSize:this.normalize(18)}]}>
                 {this.state.lang === 'AR' ? 'اختر عمر الطفل  ' : 'Choose child age'}</Text>
              </View>
              <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,styles.view,{marginTop:5}]}>
              <View style={[styles.viewRow,{}]}>
              <Icon name="caret-down" size={18} color="#707070" style={[this.state.lang==='AR'?styles.posLeft:styles.posRight,{position:'absolute'}]} />
              <View style={[{width:'100%'}]}  >
            <Picker
                style={{width:'100%',height:'100%',alignItems:'center',color:'#118CB3', justifyContent:'center',backgroundColor:'transparent',}}
                itemStyle={{backgroundColor:'#fff', }}
                onValueChange = {(level) =>{                                      
                  this.setState({ level });
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
               <Text style={[styles.text,this.state.lang === 'AR' ? styles.right : styles.left,{fontSize:this.normalize(18)}]}>
                 {this.state.lang === 'AR' ? 'أختر المرحلة الدراسية ' : 'Choose child level'}</Text>
              </View>

             
               <View style ={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,styles.radioForm,{}]}>
                     <Text style={{fontSize:this.normalize(18),fontFamily:'segoe',color:'#39393B',margin:10,}}>{this.state.lang ==='AR'?'أنثـى':'Female'}</Text>
                    {this.renderRadio(2)}
                    <View style ={{width:'10%'}}></View>
                    <Text style={{fontSize:this.normalize(18),fontFamily:'segoe',color:'#39393B',margin:10,}}>{this.state.lang ==='AR'?'ذكـر':'Male'}</Text>
                    {this.renderRadio(1)}
                  </View>
                  </View>
               </View>
              <View style={{width:'100%',alignItems:'center',justifyContent:'center',marginTop:'7%'}}>
              <TouchableOpacity
             onPress={this._onUpdateChild.bind(this)}
           style={[styles.button,styles.shadow]}>
            <Text style={{width: '100%',height:'100%',textAlign:'center',color:'#FFF',fontSize:this.normalize(22),textAlignVertical:'center',fontFamily:'segoe'}}>
              {this.state.lang === 'AR' ? 'حفـظ' : 'Save'}
            </Text>
          </TouchableOpacity>
          </View>
            </ScrollView>
         </SafeAreaView>
        );
    }
}
export default UpdateChildProfile;
const styles = StyleSheet.create({
   container: {
     width:width,
     flex: 1,
     alignItems: 'center',
     justifyContent:'center',
     backgroundColor: '#FFF',
   },
   viewContain:{
    width:'97%',alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#FFFFFF',
    borderTopRightRadius:15,
    borderTopLeftRadius:15,
    marginTop:10
   },
   shadow: {
     shadowColor: '#000',
     shadowOffset: {
       width: 0,
       height: 0,
     },
     shadowOpacity: 0.2,
     shadowRadius: 10,
     elevation: 4,
   },
   row: {
     flexDirection: 'row',
   },
   row_reserve: {
     flexDirection: 'row-reverse',
   },
   viewItem:{
     width:'100%',
     borderRadius:15,
     backgroundColor: '#fff',
     elevation:4,
   },
   view:{
    width:'93%',alignItems:'center',
    justifyContent:'center',
   },
   input:{
    width:'65%',
     height:50,
     borderRadius:8,
     borderColor:'#E9E9E9',
     borderWidth:1,
     color:'#118CB3',
     textAlign:'center',
     fontFamily:'segoe',
 },
 viewRow:{
  width:'65%',
  height:50,
  borderRadius:8,
  borderColor:'#E9E9E9',
  borderWidth:1,
  alignItems:'center',
  justifyContent:'center'
},
 radioForm:{
    width:'80%',
    marginTop:20,
    marginBottom:20,
    justifyContent:'center',
    alignItems:'center',
 },
 text:{
   width:'35%',
   margin:5,
   color: '#003F51',fontFamily:'segoe',textAlign:'center'
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
 start:{
  alignItems:'flex-start'
},end:{
  alignItems:'flex-end'
},
maStart:{
  marginEnd:'30%'
},
maEnd:{
  marginStart:'0%'
},
posLeft:{
 left:7
},
posRight:{
 right:7
}
 });

