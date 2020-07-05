/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable no-dupe-keys */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
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
  ImageBackground,
  FlatList,
  Picker,
  TextInput,
  RefreshControl,Platform, PixelRatio,
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
// import Entypo from 'react-native-vector-icons/Entypo'
import Icon from 'react-native-vector-icons/FontAwesome';

class Children extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: 'AR',
      Processing: false,
      data:[],
      childAges:[],
      levels:[],
      childName:'',
      familyName:'',
      level:'',
      childAge:'',
      flag_design:0,
      userData:{},
      userId:'',
      childrens:[],
      gender:1,
      refreshing:false,
      materialID:'',
      parent:0,
    };
  }
  componentDidMount() {
    this._retrieveData();
    this.setState({ refreshing: false });
  }
  _retrieveData = async () => {
    const { navigation } = this.props;
    const Id = navigation.getParam('materialID', 'NO-ID');
    this.setState({materialID:Id});
    const parent = navigation.getParam('parent', 'NO-ID');
    if(parent){
      this.setState({parent});
    }
   
    // if(this.state.data.length === 1){
    //   this.props.navigation.navigate('ChildDetail',{child_ID:item._id,materialID:this.state.materialID})
    // }
    try {
      const lang = await AsyncStorage.getItem('Lang');
      if (lang) {
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
    } catch (error) {}
  };

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
           label:'المرحله العمريه',value:'1',key:'1',
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
            // if(data.length === 1){
            //   this.props.navigation.navigate('ChildDetail',{child_ID:data[0]._id,materialID:this.state.materialID})
            // }
           this.setState({ data });
          }).catch(function (error) {
            this.setState({Processing:false});
            this.setState({ refreshing: false });
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

  normalize(size) {
    const scale = width / 320;
    const newSize = size * scale 
    if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(newSize))
    } else {
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
    }
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
        if (this.state.lang ==='AR' ){

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
        if (this.state.lang==='AR' ){
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
    onRefresh() {
      this.setState({ refreshing: true }, function() {this.componentDidMount()});
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
  renderOption(lang){
    if (lang === 'AR'){
      return (
          <View style={[styles.shadow,{width:width,height:'8%',alignItems:'center',backgroundColor:'#118CB3',flexDirection:'row'}]}>
             <TouchableOpacity
             onPress={()=>this.props.navigation.navigate('Home')}
             style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center'}}>
           <Icon name="chevron-left" size={18} color="#fff" style={{}} />
          </TouchableOpacity>
            <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}>الأطفال</Text>
           <TouchableOpacity
           onPress={() => this.props.navigation.navigate('MenuTabs')}
           style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center'}}>
             <Icon name="ellipsis-v" size={25} color="#fff" style={{}} />
          </TouchableOpacity>
         </View>
      );
    } else {
      return (
        <View style={[styles.shadow,{width:width,height:'10%',alignItems:'center',backgroundColor:'#118CB3',flexDirection:'row-reverse'}]}>
           <TouchableOpacity
           onPress={()=>this.props.navigation.navigate('Home')}
           style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center'}}>
           <Icon name="chevron-right" size={18} color="#fff" style={{}} />
          </TouchableOpacity>
        <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}>Children</Text>
       <TouchableOpacity
       onPress={() => this.props.navigation.navigate('MenuTabs')}
       style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center'}}>
         <Icon name="ellipsis-v" size={25} color="#fff" style={{}} />
      </TouchableOpacity>
     </View>
      );
    }
   }
   renderItem(item){
    return (
      <View style={{alignItems:'center',justifyContent:'center'}}>
      <TouchableOpacity
      onPress={()=>this.props.navigation.navigate('ChildDetail',{child_ID:item._id,materialID:this.state.materialID,parent:this.state.parent})}
      style={{width:'99%',height:150,justifyContent: 'center',alignItems: 'center',overflow: 'hidden',backgroundColor: '#FFF',elevation:6,
      borderRadius:15,marginBottom:7,marginVertical:5}}>
        <View style={[styles.viewItem , this.state.lang === 'AR' ? styles.row : styles.row_reserve]}>
        {item.imgPath ?
        <Image
        source={{uri: item.imgPath}}
        style={[styles.shadow2,{width: 100, height: 100, alignItems: 'center', borderRadius:100 / 2,margin:5,shadowRadius:100/2}]}/>
        :
        <View>
          {item.gender === 1 ?
           <Image
        source={require('../../img/boy.png')}
         style={{  width: 100, height: 100, alignItems: 'center' ,margin:5}}/>
          :
          <Image
         source={require('../../img/girl.png')}
         style={{  width: 100, height: 100, alignItems: 'center' ,margin:5}}/>
          }
        </View>
        // <Image
        // source={require('../../img/user.png')}
        //  style={{  width: 100, height: 100, alignItems: 'center' ,margin:5}}/>
       }
           <Text style={{ width: '50%', fontSize: this.normalize(20), textAlign: 'center', color: '#108AB0', fontFamily:'segoe', margin: 7,
              }}>{item.firstname} {item.surname}</Text>
         </View>
      </TouchableOpacity>
      </View>
    );
  }
  render() {
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
          <FlatList style={{width:'96%',marginTop:10,marginBottom:'3%',}}
                    data={this.state.data}
                    numColumns={1}
                    renderItem={({item})=>this.renderItem(item)}
                    keyExtractor={(item, index) => index.toString()}
                    />
         </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
export default Children;
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
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  shadow2: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
  },
  row: {
    flexDirection: 'row',
  },
  row_reserve: {
    flexDirection: 'row-reverse',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewItem:{
    width:'100%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:15,
  },
  input:{
    width:'85%',
    height:43,
    borderRadius:8,
    borderColor:'#E9E9E9',
    borderWidth:1,
    color:'#003F51',
    textAlign:'center',
    marginTop:7,
    alignItems:'center',
    fontFamily:'segoe',
},
radioForm:{
    width:'85%',
   marginTop:15,
   justifyContent:'center',
   alignItems:'center',
},
button:{
  width:'30%',
    height:35,
    backgroundColor:'#F39322',
    borderRadius:20,
    alignItems:'center',
    justifyContent:'center',
    marginTop:10,
    marginBottom:10,
},
});
