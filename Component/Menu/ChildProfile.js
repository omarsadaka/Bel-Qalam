/* eslint-disable react/no-did-mount-set-state */
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
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  FlatList,
  RefreshControl,Platform, PixelRatio
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
const {width, height} = Dimensions.get('window');
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { CheckBox } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import SvgUri from 'react-native-svg-uri';
import { Container, Header, Content, Picker, Form } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';



class ChildProfile extends Component{
    constructor(props) {
        super(props);
        this.state = {
          lang: '',
          Processing: false,
          data:[],
          levels:[],
          childAges:[],
          childName:'',
          familyName:'',
          level:'',
          childAge:'',
          checked:false,
          flag_design:0,
          userData:{},
          userId:'',
          refreshing: false,
          gender:1,
        };
      }
     
      componentDidMount() {
        this._retrieveData();
        this.setState({ refreshing: false });
        this.willFocusSubscription = this.props.navigation.addListener(
          'willFocus',
          () => {
            this.getData(); 
          }
        );
      }
    
      componentWillUnmount() {
        this.willFocusSubscription.remove();
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
            this.getLevels();
            this.getAges();
           } else {
            var data2 = {
              _id:'1',
              fullname:'أسم المستخدم',
            };
             this.setState({userData:data2});
           }
        } catch (error){}
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
               label:'المرحلة الدراسية',value:'1',key:'1',
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
          if (this.state.lang=='AR'){
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
               label:'المرحلة العمرية',value:'1',key:'1',
              });
             } else {
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
        } else {
          if (this.state.lang ==='AR'){
            alert('لا يوجد أتصال بالانترنت');
          } else {
            alert('No internet connection');
          }
        }
        });
      }

      validate=(obj)=>{
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
          else if (this.state.childAge === ''){
            if (this.state.lang === 'AR' ){
              alert('أختر عمر الطفل أولا');
            }
            else {
              alert('Choose child age first');
            }
            this.setState({Processing:false});
            errors.this.state.childAge = 'child age is required';
          }
          else if (this.state.level === ''){
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

      addChild(){
        this.setState({Processing:true});
        NetInfo.fetch().then(state =>{
          if (state.isConnected){
            const errors = this.validate();
                this.setState({errors});
                if (Object.keys(errors).length === 0){
                  try {
                    axios.post('http://165.22.83.141/api/user/addChildren',{
                      firstname: this.state.childName,
                      surname: this.state.familyName,
                      childAgeID: this.state.childAge,
                      educationalLevelID: this.state.level,
                      gender:this.state.gender,
                      userID:this.state.userId,
                    }).then(response => {
                      this.setState({Processing:false});
                      if (response.data._id){
                        this.setState({childName:''});
                        this.setState({familyName:''});
                        this.getData();
                        if (this.state.lang === 'AR'){
                          alert('تمت الاضافه بنجاح');
                        } else {
                          alert('Added done successfully');
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
                  this.setState({Processing:!this.state.Processing});
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
              axios.get('http://165.22.83.141/api/user/childByParent',{
                params: {
                  userID:this.state.userId,
              },
              }).then(response => {
                this.setState({Processing:false});
                this.setState({ refreshing: false });
                const data = response.data;
               this.setState({ data });
              }).catch(function (error) {
                this.setState({Processing:false});
                 console.log(error);
              }).finally(function () {
                 // always executed
              });
           } catch (error) {
            this.setState({Processing:false});
            this.setState({ refreshing: false });
              console.log(error);
           }
          } else {
            this.setState({Processing:false});
            this.setState({ refreshing: false });
            if (this.state.lang === 'AR'){
              alert('لا يوجد أتصال بالانترنت');
            } else {
              alert('No internet connection');
            }
          }
        });
      }

      onRefresh() {
        this.setState({ refreshing: true }, function() {this.componentDidMount()});
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
      normalize(size) {
        const scale = width / 320;
        const newSize = size * scale 
        if (Platform.OS === 'ios') {
          return Math.round(PixelRatio.roundToNearestPixel(newSize))
        } else {
          return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
        }
      }
      renderItem(item){
         return (
          <View style={{alignItems:'center',justifyContent:'center'}}>
           <TouchableOpacity
           onPress={()=>this.props.navigation.navigate('UpdateChildProfile',{child_ID:item._id})}
           style={{width:'99%',justifyContent: 'center',alignItems: 'center',overflow: 'hidden',backgroundColor: '#FFF',elevation:6,
           borderRadius:15,marginBottom:7,marginVertical:5}}>
             <View style={[styles.viewItem , this.state.lang === 'AR' ? styles.row : styles.row_reserve,{padding:5}]}>
             <View style={[this.state.lang === 'AR' ? styles.start : styles.end,{flex:1,}]}>
               <Image
                  source={require('./../../img/edit.png')}
                  style={{  width: 50, height: 50, alignItems: 'center',}}/>
               </View>
                  <View style={[{flex:1,alignItems:'center',justifyContent:'center'}]}>
                 {item.imgPath ?
                  <Image
                  source={{uri: item.imgPath}}
                  style={{  width: 130, height: 130, alignItems: 'center', borderRadius:130 / 2,margin:5 }}/>
                 :
                 <View>
                {item.gender === 1 ?
               <Image
               source={require('../../img/boy.png')}
               style={{  width: 130, height: 130, alignItems: 'center' ,margin:5}}/>
                :
               <Image
               source={require('../../img/girl.png')}
               style={{  width: 130, height: 130, alignItems: 'center' ,margin:5}}/>
               }
             </View>
               
                 }
                  </View>
                  <View style={{flex:1,alignItems:'center',justifyContent:'center',height:80,}}>
                <Text style={{ fontSize: this.normalize(20), textAlign: 'center', color: '#108AB0',fontFamily:'segoe', 
                    }}>{item.firstname} {item.surname}</Text>
                 </View>
              </View>
           </TouchableOpacity>
           </View>
         );
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
                  <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}>حساب الطفل</Text>
                 <TouchableOpacity
                 style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center'}} />
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
              <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}>Child profile</Text>
             <TouchableOpacity
             style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center'}} />
           </View>
            );
          }
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
    return (
      <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#118CB3" barStyle="light-content" />
      <Spinner
        visible={this.state.Processing}
        textContent={'Loading...'}
        textStyle={{color: '#FFF'}}
      />
      <View style ={{width:width,height:'1%',backgroundColor:'#118CB3',elevation:10}}/>
      {this.renderOption(this.state.lang)}
      <ScrollView style={{width:width,height:height,marginTop:5}}
      refreshControl={
        <RefreshControl
        colors={['#9Bd35A', '#689F38']}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh.bind(this)}
        />
      }>
        <View style={{width:width,height:'100%',alignItems:'center',justifyContent:'center'}}>
        <FlatList style={{width:width*0.95,marginTop:10,marginBottom:5}}
                  data={this.state.data}
                  numColumns={1}
                  renderItem={({item})=>this.renderItem(item)}
                  keyExtractor={(item, index) => index.toString()}
                  />
      <View style={[this.state.lang === 'AR' ? styles.row_reserve : styles.row,{marginTop:15,width:'95%',alignItems:'center',marginBottom:10}]}>
                   <Image
                resizeMode="stretch"
                 source={require('./../../img/add_child.png')} style={{width: 30,height:30,alignItems:'center'}} />
                {/* <SvgUri width='50' height='50' source={require('./../../img/add_child.svg')} /> */}
                <TouchableOpacity
               onPress={()=>{
                  if (this.state.flag_design === 0){
                     this.setState({flag_design:1});
                  } else {
                     this.setState({flag_design:0});
                  }
               }}>
                 <Text style={{color:'#39393B',textAlign:'center',fontSize:this.normalize(18),fontFamily:'segoe',margin:5}}>{this.state.lang === 'AR' ? 'أضافه طفل أخر' : 'Add another child'}</Text>
                 </TouchableOpacity>
              </View>
       {this.state.flag_design === 0 ?
       <View style={{display:'none'}}/>
       :
      <View style={[styles.column,{width:'95%',marginTop:10,marginBottom:10,overflow: 'hidden',backgroundColor: '#FFF',elevation:5,padding:7,borderRadius:5}]}>
              <TextInput
               underlineColorAndroid="transparent"
              defaultValue={this.state.childName}
              onChangeText={(childName) => this.setState({ childName  }) }
               placeholder={this.state.lang === 'AR' ? 'أسم الطفل الاول ' : 'First name'}
              style={[styles.input,{fontSize:20}]}
              />
             <TextInput
               underlineColorAndroid="transparent"
              defaultValue={this.state.familyName}
              onChangeText={(familyName) => this.setState({ familyName  }) }
               placeholder={this.state.lang === 'AR' ? 'أسم العائلة' : 'Last name'}
             style={[styles.input,{fontSize:20}]}
              />
               <View style={[styles.viewRow,{}]}>
              <Icon name="caret-down" size={18} color="#707070" style={[this.state.lang==='AR'?styles.posLeft:styles.posRight,{position:'absolute'}]} />
             <View style={[{width:'100%'}]}  >
            <Picker
                style={{width:'100%',height:'100%',alignItems:'center',color:'#707070',justifyContent:'center',fontFamily:'segoe',backgroundColor:'transparent'}}
                itemStyle={{backgroundColor:'#fff'}}
                labelStyle={{fontFamily:'segoe'}}
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
              <View style={[styles.viewRow,{}]}>
              <Icon name="caret-down" size={18} color="#707070" style={[this.state.lang==='AR'?styles.posLeft:styles.posRight,{position:'absolute'}]} />
            <View style={[{width:'100%'}]}  >
            <Picker
                style={{width:'100%',height:'100%',alignItems:'center',color:'#707070',justifyContent:'center',fontFamily:'segoe',backgroundColor:'transparent'}}
                itemStyle={{backgroundColor:'#fff'}}
                labelStyle={{fontFamily:'segoe'}}
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
           
               <View style ={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,styles.radioForm,{}]}>
                     <Text style={{fontSize:this.normalize(18),fontFamily:'segoe',color:'#39393B',margin:10,}}>{this.state.lang ==='AR'?'أنثـى':'Female'}</Text>
                    {this.renderRadio(2)}
                    <View style ={{width:'10%'}}></View>
                    <Text style={{fontSize:this.normalize(18),fontFamily:'segoe',color:'#39393B',margin:10,}}>{this.state.lang ==='AR'?'ذكـر':'Male'}</Text>
                    {this.renderRadio(1)}
                  </View>
               <TouchableOpacity
             onPress={this.addChild.bind(this)}
           style={[styles.button,styles.shadow]}>
            <Text style={{width: '100%',height:'100%',textAlign:'center',color:'#003F51',fontSize:this.normalize(25),textAlignVertical:'center',fontFamily:'segoe'}}>
              {this.state.lang === 'AR' ? 'أضـف' : 'Add'}
            </Text>
          </TouchableOpacity>
              </View>
       }
       </View>
      </ScrollView>
    </SafeAreaView>
        );
    }
}
export default ChildProfile;
const styles = StyleSheet.create({
   container: {
     width: width,
     flex: 1,
     alignItems: 'center',
     backgroundColor: '#FFF',
   },
   shadow: {
     shadowColor: '#000',
     shadowOffset: {
       width: 0,
       height: 6,
     },
     shadowOpacity: 0.1,
     shadowRadius: 10,
     elevation: 8,
   },
   row: {
     flexDirection: 'row',
   },
   row_reserve: {
     flexDirection: 'row-reverse',
   },
   column: {
     alignItems: 'center',
     justifyContent: 'center',
   },
   viewItem:{
     width:'100%',
     borderRadius:15,
   },
   input:{
     width:'85%',
     height:50,
     borderRadius:8,
     borderColor:'#E9E9E9',
     borderWidth:1,
     color:'#003F51',
     textAlign:'center',
     marginTop:7,
     fontFamily:'segoe',
 },
 viewRow:{
  width:'85%',
  height:50,
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
   width:'35%',
     height:40,
     backgroundColor:'#F39322',
     borderRadius:20,
     alignItems:'center',
     justifyContent:'center',
     marginTop:10,
     marginBottom:10,
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