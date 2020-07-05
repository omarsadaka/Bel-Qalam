/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-alert */
/* eslint-disable prettier/prettier */
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
  RefreshControl,Platform, PixelRatio
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
const {width, height} = Dimensions.get('window');
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import SvgUri from 'react-native-svg-uri';
import Icon from 'react-native-vector-icons/FontAwesome';



class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: '',
      Processing: false,
      data:[],
      userId:'',
      userData:{},
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
      // alert(value)
        if (value){
          this.setState({isLogin:true});
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
  getData(){
    this.setState({Processing:true});
     NetInfo.fetch().then(state =>{
      if (state.isConnected){
        try {
          axios.get('http://165.22.83.141/api/user/Materials').then(response => {
            this.setState({Processing:false});
            this.setState({ refreshing: false });
            const data = response.data;
           this.setState({ data });
          }).catch(function (error) {
            this.setState({Processing:false});
            this.setState({ refreshing: false });
             console.log(error);
          }).finally(function () {
             // always executed
          });
       } catch (error) {
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
  CheckChildren(id,isParent,name){
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
              this.props.navigation.navigate('ChildDetail',{child_ID:data[0]._id,materialID:id,parent:isParent})
            }else{
              this.props.navigation.navigate('Children',{materialID:id,parent:isParent});
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

  handleRefresh = () => {
    this.setState({
      refreshing: true,
    }, () => {
      this.getData();
    });
  }
   renderOption(lang){
    if (lang === 'AR'){
      return (
          <View style={[styles.shadow,{width:width,height:'8%',alignItems:'center',backgroundColor:'#118CB3',flexDirection:'row'}]}>
             <TouchableOpacity
           onPress={() => this.props.navigation.navigate('Menu')}
           style={{height:'100%',width:'10%',alignItems:'center',justifyContent:'center'}} />
            <Text style={{flex:1,color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}>الرئيسية</Text>
           <TouchableOpacity
           onPress={() => this.props.navigation.navigate('Menu')}
           style={{height:'100%',width:'10%',alignItems:'center',justifyContent:'center'}}>
           <Icon name="ellipsis-v" size={25} color="#fff" style={{}} />
          </TouchableOpacity>
         </View>
      );
    } else {
      return (
        <View style={[styles.shadow,{width:width,height:'8%',alignItems:'center',backgroundColor:'#118CB3',flexDirection:'row-reverse'}]}>
        <TouchableOpacity
       onPress={() => this.props.navigation.navigate('Menu')}
       style={{height:'100%',width:'10%',alignItems:'center',justifyContent:'center'}} />
        <Text style={{flex:1,color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}>Home</Text>
       <TouchableOpacity
       onPress={() => this.props.navigation.navigate('Menu')}
       style={{height:'100%',width:'10%',alignItems:'center',justifyContent:'center'}}>
        <Icon name="ellipsis-v" size={25} color="#fff" style={{}} />
      </TouchableOpacity>
     </View>
      );
    }
   }
   renderItem(item){
     return (
       <TouchableOpacity
       onPress={ async()=>{
        const value = await AsyncStorage.getItem('loginDataPen');
         if (value){
          this.CheckChildren(item._id,item.hasChildreen)
          AsyncStorage.setItem('Material',JSON.stringify(item));
         } else {
          if (this.state.lang === 'AR'){
            alert('يجب تسجيل الدخول أولا');
          } else {
            alert('You must login first');
          }
         }
        }}
       style={[styles.viewItem,{borderRadius:10,overflow:'hidden',marginVertical:3}]}>
          <ImageBackground
            resizeMode = 'cover'
            source={{uri: item.imgPath}}
            style={{  width: width,height:height/3,alignItems: 'center', borderRadius:10}}/>
            <LinearGradient colors={['#FEFEFE10','#84C3D720' ,'#118CB390']} style={styles.linearGradient}/>
            <Text style={{ width: '40%',fontSize: this.normalize(25),textAlign:'center',color:'#FFF',position: 'absolute',bottom:10,
            textAlignVertical:'center',borderRadius:3,borderColor:'#F39322',borderWidth:2,fontFamily:'segoe'}}>
           {this.state.lang === 'AR' ? item.titleAr : item.titleEN}</Text>
       </TouchableOpacity>
     );
   }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#118CB3" barStyle="light-content"
         />
        <Spinner
          visible={this.state.Processing}
          textContent={this.state.lang === 'AR' ? 'تحميل...' : 'Loading...'}
          textStyle={{color: '#FFF'}}
        />
        <View style ={{width:width,height:'1%',backgroundColor:'#118CB3',elevation:10}}/>
        {this.renderOption(this.state.lang)}
        <View style ={{width:width,height:height,alignItems:'center',justifyContent:'center',padding:3}} >
        <FlatList style={{width:width*0.96,marginTop:0,marginBottom:0}}
           refreshControl={
            <RefreshControl
             colors={['#9Bd35A', '#689F38']}
             refreshing={this.state.refreshing}
             onRefresh={this.handleRefresh}
            />
         }
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
export default Home;
const styles = StyleSheet.create({
  container: {
    width: width,
    height:height,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  shadow: {
    shadowColor: '#585858',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  row_reserve: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewItem:{
    width:'100%',
    height:(height*0.85)/3,
    alignItems:'center',
    justifyContent:'center'
  },
  linearGradient:{
   width:width,
   height:'100%',
   borderRadius:15,
   position:'absolute'
  },
});
