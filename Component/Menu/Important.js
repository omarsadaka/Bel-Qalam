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
  ImageBackground,
  FlatList,Platform,PixelRatio
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
const {width, height} = Dimensions.get('window');
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';



class Important extends Component{
    constructor(props) {
        super(props);
        this.state = {
          lang: 'AR',
          Processing: false,
          data:[],
          userData:{},
          userId:'',
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
             this.getData();
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

      getData(){
        this.setState({Processing:true});
        NetInfo.fetch().then(state =>{
          if (state.isConnected){
            try {
              axios.get('http://165.22.83.141/api/user/important',{
              }).then(response => {
                this.setState({Processing:false});
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

      renderItem(item){
         return (
          <View style={{width:'95%',alignItems:'center'}}>
             <Text style={[this.state.lang === "AR" ? styles.right : styles.left,styles.text,{fontSize:this.normalize(15)}]}>{this.state.lang === 'AR' ? item.titleAr:item.titleEN}</Text>
          </View>
         );
       }
       renderOption(lang){
         if (lang === 'AR'){
            return (
                <View style={[styles.shadow,{width:width,height:'8%',alignItems:'center',backgroundColor:'#118CB3',flexDirection:'row'}]}>
                   <TouchableOpacity
                   onPress={()=>this.props.navigation.navigate('Menu')}
                   style={{width:'10%',height:18}}>
                 {/* <Image source={require('./../../img/back.png')} style={{width:'100%',height:'100%',alignItems:'center'}} resizeMode="contain" /> */}
                 <Icon name="chevron-left" size={18} color="#fff" style={{marginStart:10}} />
                </TouchableOpacity>
                  <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}>مهـم</Text>
                 <TouchableOpacity
                 style={{width:'10%',height:20}} />
               </View>
            );
          } else {
            return (
              <View style={[styles.shadow,{width:width,height:'8%',alignItems:'center',backgroundColor:'#118CB3',flexDirection:'row-reverse'}]}>
                <TouchableOpacity
                onPress={()=>this.props.navigation.navigate('Menu')}
                style={{width:'10%',height:18}}>
                {/* <Image source={require('./../../img/r_back.png')} style={{width:'100%',height:'100%',alignItems:'center'}} resizeMode="contain" /> */}
                <Icon name="chevron-right" size={18} color="#fff" style={{marginStart:10}} />
                </TouchableOpacity>
              <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}>Important</Text>
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
                <View style ={{width:width,height:'1%',backgroundColor:'#118CB3',elevation:11}}/>
            {this.renderOption(this.state.lang)}
            <View style={[styles.shadow,styles.view,{}]}>
            <FlatList style={{width:'100%',marginTop:5}}
                    data={this.state.data}
                    numColumns={1}
                    renderItem={({item})=>this.renderItem(item)}
                    keyExtractor={(item, index) => index.toString()}
                    />
          </View>
         </SafeAreaView>
        );
    }
}
export default Important;
const styles = StyleSheet.create({
    flex: {
       flex: 0,
  },
    row: {
       flexDirection: 'row',
    },
    column: {
       flexDirection: 'column',
    },
    shadow: {
       shadowColor: '#000',
       shadowOffset: {
          width: 0,
          height: 6,
       },
       shadowOpacity: 0.05,
       shadowRadius: 10,
       elevation: 10,
    },
    container: {
       flex: 1,
       alignItems: 'center',
       backgroundColor: '#FFF',
    },
    view:{
      width:'95%',
      alignItems:'center',
      justifyContent:'center',
      marginTop:10,backgroundColor:'#fff',
      borderRadius:10,
      height:'88%',
    },
    left:{
      textAlign:'left',
   },
   right:{
      textAlign:'right',
   },
   text:{
      color:'#343434',
      margin:5,
      width:'97%',fontFamily:'segoe',
   },
 });
