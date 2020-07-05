/* eslint-disable react/self-closing-comp */
/* eslint-disable no-sequences */
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
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,Platform,PixelRatio
} from 'react-native';
const {width,height} = Dimensions.get('window');
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';




class Menu extends Component{
    constructor(props) {
        super(props);
        this.state = {
          lang: 'AR',
          Processing: false,
          userData:{},
          userId:'',
          userName:'',
          loginType:0,
          refreshing: false,
        };
      }
      componentDidMount() {
        this._retrieveData();
        this.setState({ refreshing: false });
      }
      _retrieveData = async () => {
        try {
          const lang = await AsyncStorage.getItem('Lang');
          if (lang){
            this.setState({lang});
          }
          const value = await AsyncStorage.getItem('loginDataPen');
          // alert(value)
            if (value){
               const data = JSON.parse(value);
              this.setState({userData:data});
              this.setState({userId:data._id});
              this.setState({userName:data.fullname});
              this.setState({loginType:1});
             } else {
              var data2 = {
                _id:'1',
                fullname:'أسم المستخدم',
              };
               this.setState({userData:data2});
               this.setState({loginType:0});
             }
        } catch (error){}
      }
      onRefresh() {
        this.setState({ refreshing: true }, function() {this.componentDidMount()});
      }
      logOut = async() => {
            Alert.alert(
              this.state.lang === 'AR' ? 'بالقلم' : 'PialQalam' ,
              this.state.lang === 'AR' ? 'هل أنت متأكد من تسجيل الخروج' : 'Are you sure want to logout' ,
              [
                {text: this.state.lang === 'AR' ? 'الغاء' : 'Cancel' ,
                onPress: () => this.dismiss, style: 'cancel'},
                {text:this.state.lang === 'AR' ? 'خروج' : 'LogOut' ,  onPress: () => {
                  try {
                    AsyncStorage.clear();
                    this.props.navigation.navigate('Language');
                  } catch (e){}
                 },
               },
              ],
              { cancelable: true }
            );
             return true;
        }

        CheckChildren(){
          NetInfo.fetch().then(state =>{
            if (state.isConnected){
              try {
                axios.get('http://165.22.83.141/api/user/childByParent',{
                  params: {
                    userID:this.state.userId,
                },
                }).then(response => {
                 
                  const data = response.data;
                  if(data.length === 1){
                    this.props.navigation.navigate('Reports',{child_ID:data[0]._id,levelID:data[0].educationalLevelID})
                  }else{
                    this.props.navigation.navigate('ChildrenReports');
                  }
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
                   onPress={()=>this.props.navigation.navigate('Home')}
                   style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                 <Icon name="chevron-left" size={18} color="#fff" style={{}} />
                 </TouchableOpacity>
                  <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}>القائمة</Text>
                 <TouchableOpacity
                 style={{width:'10%',height:20}} />
               </View>
            );
          } else {
            return (
              <View style={[styles.shadow,{width:width,height:'8%',alignItems:'center',backgroundColor:'#118CB3',flexDirection:'row-reverse'}]}>
                <TouchableOpacity
                onPress={()=>this.props.navigation.navigate('Home')}
                style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                <Icon name="chevron-right" size={18} color="#fff" style={{}} />
                </TouchableOpacity>
              <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}>Menu</Text>
             <TouchableOpacity
             style={{width:'10%',height:20}} />
           </View>
            );
          }
       }
    render(){
      if (this.state.loginType === 1){
        return (
          <SafeAreaView style={styles.container} >
          <StatusBar backgroundColor="#118CB3" barStyle="light-content" />
          <Spinner
          visible={this.state.Processing}
          textContent={'Loading...'}
          textStyle={{color: '#FFF'}}
          />
          <View style ={{width:width,height:'1%',backgroundColor:'#118CB3',elevation:10}}/>
          {this.renderOption(this.state.lang)}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 18 }}
          refreshControl={
            <RefreshControl
            colors={['#9Bd35A', '#689F38']}
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }>
            <View style={[styles.shadow,styles.view,{backgroundColor:'#F39322'}]}>
              <Text style={[this.state.lang === 'AR' ? styles.right : styles.left,{width:'95%',height:'100%',color:'#FFFFFF',fontFamily:'segoe',
              fontSize:this.normalize(20),textAlignVertical:'center'}]}>{this.state.userName} </Text>
            </View>
            <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Home')}>
            <View style={[this.state.lang === "AR"? styles.row:styles.row_reserve,styles.view,{marginTop:7}]}>
            {this.state.lang === 'AR' ? 
           <Icon name="angle-left" size={18} color="#003F51" style={{margin:'5%'}} />
             : 
             <Icon name="angle-right" size={18} color="#003F51" style={{margin:'5%'}} />
            }
            <Text style={[this.state.lang === "AR" ? styles.right : styles.left,styles.text,{fontSize:this.normalize(20)}]}>
               {this.state.lang === 'AR' ? 'الصفحه الرئيسية' : 'Home page'}</Text>
           <Image source={require('./../../img/home_icon.png')} style={{width:25,height:25,margin:'5%'}} resizeMode="contain" />
            </View>
            <View style={{width:width,alignItems:'center',height:1,backgroundColor:'#E4E4E4'}}></View>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('ChildProfile')
              }}>
            <View style={[this.state.lang === "AR"? styles.row:styles.row_reserve,styles.view,{marginTop:7}]}>
             {this.state.lang === 'AR' ? 
            <Icon name="angle-left" size={18} color="#003F51" style={{margin:'5%'}} />
            : 
            <Icon name="angle-right" size={18} color="#003F51" style={{margin:'5%'}} />
            }
            <Text style={[this.state.lang === "AR" ? styles.right : styles.left,styles.text,{fontSize:this.normalize(20)}]}>
               {this.state.lang === 'AR' ? 'حساب الطفل' : 'Child profile'}</Text>
           <Image source={require('./../../img/study.png')} style={{width:25,height:25,margin:'5%'}} resizeMode="contain" />
            </View>
            <View style={{width:width,alignItems:'center',height:1,backgroundColor:'#E4E4E4'}}></View>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={() => this.props.navigation.navigate('FatherProfile')}>
            <View style={[this.state.lang === "AR"? styles.row:styles.row_reserve,styles.view,{marginTop:7}]}>
             {this.state.lang === 'AR' ? 
            <Icon name="angle-left" size={18} color="#003F51" style={{margin:'5%'}} />
            : 
            <Icon name="angle-right" size={18} color="#003F51" style={{margin:'5%'}} />
            }
            <Text style={[this.state.lang === "AR" ? styles.right : styles.left,styles.text,{fontSize:this.normalize(20)}]}>
               {this.state.lang === 'AR' ? 'حساب ولى الأمر' : 'Father profile'}</Text>
           <Image source={require('./../../img/avatar.png')} style={{width:25,height:25,margin:'5%'}} resizeMode="contain" />
            </View>
            <View style={{width:width,alignItems:'center',height:1,backgroundColor:'#E4E4E4'}}></View>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={() => {
              // this.props.navigation.navigate('ChildrenReports')
              this.CheckChildren();
              }}>
            <View style={[this.state.lang === "AR"? styles.row:styles.row_reserve,styles.view,{marginTop:7}]}>
             {this.state.lang === 'AR' ?
             <Icon name="angle-left" size={18} color="#003F51" style={{margin:'5%'}} />
             : 
             <Icon name="angle-right" size={18} color="#003F51" style={{margin:'5%'}} />
            }
            <Text style={[this.state.lang === "AR" ? styles.right : styles.left,styles.text,{fontSize:this.normalize(20)}]}>
               {this.state.lang === 'AR' ? 'التقارير' : 'Reports'}</Text>
           <Image source={require('./../../img/report.png')} style={{width:25,height:25,margin:'5%'}} resizeMode="contain" />
            </View>
            <View style={{width:width,alignItems:'center',height:1,backgroundColor:'#E4E4E4'}}></View>
            </TouchableOpacity>

            <TouchableOpacity
            onPress={() => this.props.navigation.navigate('printCertificate')}>
            <View style={[this.state.lang === "AR"? styles.row:styles.row_reserve,styles.view,{marginTop:7}]}>
             {this.state.lang === 'AR' ? 
             <Icon name="angle-left" size={18} color="#003F51" style={{margin:'5%'}} />
             : 
             <Icon name="angle-right" size={18} color="#003F51" style={{margin:'5%'}} />
            }
            <Text style={[this.state.lang === "AR" ? styles.right : styles.left,styles.text,{fontSize:this.normalize(20)}]}>
               {this.state.lang === 'AR' ? 'طباعه شهادة' : 'Print certificate'}</Text>
           <Image source={require('./../../img/print_icon.png')} style={{width:25,height:25,margin:'5%'}} resizeMode="contain" />
            </View>
            <View style={{width:width,alignItems:'center',height:1,backgroundColor:'#E4E4E4'}}></View>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Payment')}>
            <View style={[this.state.lang === "AR"? styles.row:styles.row_reserve,styles.view,{marginTop:7}]}>
             {this.state.lang === 'AR' ? 
             <Icon name="angle-left" size={18} color="#003F51" style={{margin:'5%'}} />
             : 
             <Icon name="angle-right" size={18} color="#003F51" style={{margin:'5%'}} />
            }
            <Text style={[this.state.lang === "AR" ? styles.right : styles.left,styles.text,{fontSize:this.normalize(20)}]}>
               {this.state.lang === 'AR' ? 'دفع الأشتراك' : 'Payment'}</Text>
           <Image source={require('./../../img/pay.png')} style={{width:25,height:25,margin:'5%'}} resizeMode="contain" />
            </View>
            <View style={{width:width,alignItems:'center',height:1,backgroundColor:'#E4E4E4'}}></View>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={() => this.props.navigation.navigate('ChangeLanguage')}>
            <View style={[this.state.lang === "AR"? styles.row:styles.row_reserve,styles.view,{marginTop:7}]}>
             {this.state.lang === 'AR' ? 
             <Icon name="angle-left" size={18} color="#003F51" style={{margin:'5%'}} />
             : 
             <Icon name="angle-right" size={18} color="#003F51" style={{margin:'5%'}} />
            }
            <Text style={[this.state.lang === "AR" ? styles.right : styles.left,styles.text,{fontSize:this.normalize(20)}]}>
               {this.state.lang === 'AR' ? 'تغير اللغة' : 'Change language'}</Text>
           <Image source={require('./../../img/lang.png')} style={{width:25,height:25,margin:'5%'}} resizeMode="contain" />
            </View>
            <View style={{width:width,alignItems:'center',height:1,backgroundColor:'#E4E4E4'}}></View>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={() => this.props.navigation.navigate('ContactUs')}>
            <View style={[this.state.lang === "AR"? styles.row:styles.row_reserve,styles.view,{marginTop:7}]}>
             {this.state.lang === 'AR' ? 
             <Icon name="angle-left" size={18} color="#003F51" style={{margin:'5%'}} />
             : 
             <Icon name="angle-right" size={18} color="#003F51" style={{margin:'5%'}} />
            }
            <Text style={[this.state.lang === "AR" ? styles.right : styles.left,styles.text,{fontSize:this.normalize(20)}]}>
               {this.state.lang === 'AR' ? 'تواصل معنا' : 'Contact us'}</Text>
           <Image source={require('./../../img/contact.png')} style={{width:25,height:25,margin:'5%'}} resizeMode="contain" />
            </View>
            <View style={{width:width,alignItems:'center',height:1,backgroundColor:'#E4E4E4'}}></View>
            </TouchableOpacity>

            <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Important')}>
            <View style={[this.state.lang === "AR"? styles.row:styles.row_reserve,styles.view,{marginTop:7}]}>
             {this.state.lang === 'AR' ? 
             <Icon name="angle-left" size={18} color="#003F51" style={{margin:'5%'}} />
             : 
             <Icon name="angle-right" size={18} color="#003F51" style={{margin:'5%'}} />
            }
            <Text style={[this.state.lang === "AR" ? styles.right : styles.left,styles.text,{fontSize:this.normalize(20)}]}>
               {this.state.lang === 'AR' ? 'مهــم' : 'Important'}</Text>
           <Image source={require('./../../img/import.png')} style={{width:25,height:25,margin:'5%'}} resizeMode="contain" />
            </View>
            <View style={{width:width,alignItems:'center',height:1,backgroundColor:'#E4E4E4'}}></View>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Copyrights')}>
            <View style={[this.state.lang === "AR"? styles.row:styles.row_reserve,styles.view,{marginTop:7}]}>
             {this.state.lang === 'AR' ? 
             <Icon name="angle-left" size={18} color="#003F51" style={{margin:'5%'}} />
             : 
             <Icon name="angle-right" size={18} color="#003F51" style={{margin:'5%'}} />
            }
            <Text style={[this.state.lang === "AR" ? styles.right : styles.left,styles.text,{fontSize:this.normalize(20)}]}>
               {this.state.lang === 'AR' ? 'حقوق النشر' : 'Copyrights'}</Text>
           <Image source={require('./../../img/copy.png')} style={{width:25,height:25,margin:'5%'}} resizeMode="contain" />
            </View>
            <View style={{width:width,alignItems:'center',height:1,backgroundColor:'#E4E4E4'}}></View>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={this.logOut.bind(this)}>
            <View style={[this.state.lang === "AR"? styles.row:styles.row_reserve,styles.view,{marginTop:7}]}>
             {this.state.lang === 'AR' ? 
             <Icon name="angle-left" size={18} color="#003F51" style={{margin:'5%'}} />
             : 
             <Icon name="angle-right" size={18} color="#003F51" style={{margin:'5%'}} />
            }
            <Text style={[this.state.lang === "AR" ? styles.right : styles.left,styles.text,{fontSize:this.normalize(20)}]}>
               {this.state.lang === 'AR' ? 'تسجيل الخروج' : 'Log out'}</Text>
           <Image source={require('./../../img/logout.png')} style={{width:25,height:25,margin:'5%'}} resizeMode="contain" />
            </View>
            <View style={{width:width,alignItems:'center',height:1,backgroundColor:'#E4E4E4'}}></View>
            </TouchableOpacity>


          </ScrollView>

       </SafeAreaView>
      );
      } else {
        return (
          <SafeAreaView style={styles.container} >
          <StatusBar backgroundColor="#118CB3" barStyle="light-content" />
          {this.renderOption(this.state.lang)}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 18 }} >
            <View style={[styles.shadow,styles.view,{backgroundColor:'#F39322'}]}>
              <Text style={[this.state.lang === 'AR' ? styles.right : styles.left,{width:'100%',height:'100%',color:'#FFFFFF',fontFamily:'segoe',
              fontSize:this.normalize(20),textAlignVertical:'center',marginStart:10,marginEnd:10}]}>{this.state.lang === 'AR' ? 'أسم المستخدم' : 'User Name'} </Text>
            </View>
            <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Home')}>
            <View style={[this.state.lang === "AR"? styles.row:styles.row_reserve,styles.view,{marginTop:7}]}>
            {this.state.lang === 'AR' ?
             <Icon name="angle-left" size={18} color="#003F51" style={{margin:'5%'}} />
             : 
             <Icon name="angle-right" size={18} color="#003F51" style={{margin:'5%'}} />
            }
            <Text style={[this.state.lang === "AR" ? styles.right : styles.left,styles.text,{fontSize:this.normalize(20)}]}>
               {this.state.lang === 'AR' ? 'الصفحه الرئيسيه' : 'Home page'}</Text>
           <Image source={require('./../../img/home_icon.png')} style={{width:25,height:25,margin:'5%'}} resizeMode="contain" />
            </View>
            <View style={{width:width,alignItems:'center',height:1,backgroundColor:'#E4E4E4'}}></View>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={() => this.props.navigation.navigate('ChangeLanguage')}>
            <View style={[this.state.lang === "AR"? styles.row:styles.row_reserve,styles.view,{marginTop:7}]}>
            {this.state.lang === 'AR' ? 
            <Icon name="angle-left" size={18} color="#003F51" style={{margin:'5%'}} />
            : 
            <Icon name="angle-right" size={18} color="#003F51" style={{margin:'5%'}} />
            }
            <Text style={[this.state.lang === "AR" ? styles.right : styles.left,styles.text,{fontSize:this.normalize(20)}]}>
               {this.state.lang === 'AR' ? 'تغير اللغه' : 'Change language'}</Text>
           <Image source={require('./../../img/lang.png')} style={{width:25,height:25,margin:'5%'}} resizeMode="contain" />
            </View>
            <View style={{width:width,alignItems:'center',height:1,backgroundColor:'#E4E4E4'}}></View>
            </TouchableOpacity>
            {/* <TouchableOpacity
            onPress={() => this.props.navigation.navigate('ContactUs')}>
            <View style={[this.state.lang === "AR"? styles.row:styles.row_reserve,styles.view,{marginTop:7}]}>
            {this.state.lang === 'AR' ?
            <Image source={require('./../../img/next.png')
            style={{width:'5%',height:'5%',margin:'5%'}} resizeMode="contain" /> :
            <Image source={require('./../../img/r_next.png')}
            style={{width:'5%',height:'5%',margin:'5%'}} resizeMode="contain" />}
            <Text style={[this.state.lang === "AR" ? styles.right : styles.left,styles.text]}>
               {this.state.lang === 'AR' ? 'تواصل معنا' : 'Contact us'}</Text>
           <Image source={require('./../../img/contact.png')} style={{width:25,height:25,margin:'5%'}} resizeMode="contain" />
            </View>
            <View style={{width:width,alignItems:'center',height:1,backgroundColor:'#E4E4E4'}}></View>
            </TouchableOpacity> */}

            <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Important')}>
            <View style={[this.state.lang === "AR"? styles.row:styles.row_reserve,styles.view,{marginTop:7}]}>
            {this.state.lang === 'AR' ? 
             <Icon name="angle-left" size={18} color="#003F51" style={{margin:'5%'}} />
             : 
             <Icon name="angle-right" size={18} color="#003F51" style={{margin:'5%'}} />
            }
            <Text style={[this.state.lang === "AR" ? styles.right : styles.left,styles.text,{fontSize:this.normalize(20)}]}>
               {this.state.lang === 'AR' ? 'مهــم' : 'Important'}</Text>
           <Image source={require('./../../img/import.png')} style={{width:25,height:25,margin:'5%'}} resizeMode="contain" />
            </View>
            <View style={{width:width,alignItems:'center',height:1,backgroundColor:'#E4E4E4'}}></View>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Copyrights')}>
            <View style={[this.state.lang === "AR"? styles.row:styles.row_reserve,styles.view,{marginTop:7}]}>
            {this.state.lang === 'AR' ? 
             <Icon name="angle-left" size={18} color="#003F51" style={{margin:'5%'}} />
             : 
             <Icon name="angle-right" size={18} color="#003F51" style={{margin:'5%'}} />
            }
            <Text style={[this.state.lang === "AR" ? styles.right : styles.left,styles.text,{fontSize:this.normalize(20)}]}>
               {this.state.lang === 'AR' ? 'حقوق النشر' : 'Copyrights'}</Text>
           <Image source={require('./../../img/copy.png')} style={{width:25,height:25,margin:'5%'}} resizeMode="contain" />
            </View>
            <View style={{width:width,alignItems:'center',height:1,backgroundColor:'#E4E4E4'}}></View>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={()=> {
              if(this.state.lang === 'AR'){
                this.props.navigation.navigate('Login')
              }else{
                this.props.navigation.navigate('LoginEn')
              }
              
              }}>
            <View style={[this.state.lang === "AR"? styles.row:styles.row_reserve,styles.view,{marginTop:7}]}>
            {this.state.lang === 'AR' ?
             <Icon name="angle-left" size={18} color="#003F51" style={{margin:'5%'}} />
             : 
             <Icon name="angle-right" size={18} color="#003F51" style={{margin:'5%'}} />
            }
            <Text style={[this.state.lang === "AR" ? styles.right : styles.left,styles.text,{fontSize:this.normalize(20)}]}>
               {this.state.lang === 'AR' ? 'تسجيل الدخول' : 'Log in'}</Text>
           <Image source={require('./../../img/logout.png')} style={{width:25,height:25,margin:'5%'}} resizeMode="contain" />
            </View>
            <View style={{width:width,alignItems:'center',height:1,backgroundColor:'#E4E4E4'}}></View>
            </TouchableOpacity>
          </ScrollView>

       </SafeAreaView>
      );
      }
    }
}
export default Menu;
const styles = StyleSheet.create({
    flex: {
       flex: 0,
  },
    row: {
       flexDirection: 'row',
    },
    row_reserve: {
      flexDirection: 'row-reverse',
   },
    column: {
       flexDirection: 'column',
    },
    right:{
      textAlign:'right',
    },
    left:{
      textAlign:'left',
    },
    view:{
      width:width ,
      height:height*0.07,
      alignItems:'center',
      justifyContent:'center',
    },
    view2:{
      width:width*0.95 ,
      height:45,
      alignItems:'center',
      justifyContent:'center',
    },
    text:{
      flex:1,
      color:'#003F51',
      margin:7,
      textAlignVertical:'center',
      fontFamily:'segoe',
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
       justifyContent: 'center',
       alignItems: 'center',
       backgroundColor: '#FFF',
    },
 });