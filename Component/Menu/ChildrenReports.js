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
  Picker,
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
import Icon from 'react-native-vector-icons/FontAwesome';


class ChildrenReports extends Component{
    constructor(props) {
        super(props);
        this.state = {
          lang: 'AR',
          Processing: false,
          data:[],
          userData:{},
          userId:'',
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

      renderItem(item){
         return (
          <View style={{alignItems:'center',justifyContent:'center'}}>
           <TouchableOpacity
           onPress={()=>this.props.navigation.navigate('Reports',{child_ID:item._id,levelID:item.educationalLevelID})}
           style={{width:'99%',height:120,justifyContent: 'center',alignItems: 'center',overflow: 'hidden',backgroundColor: '#FFF',elevation:4,
           borderRadius:15,marginBottom:7,marginVertical:5}}>
             <View style={[styles.viewItem , this.state.lang === 'AR' ? styles.row : styles.row_reserve]}>
                  <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,{width:'80%',alignItems:'center',justifyContent:'center'}]}>
                 {item.imgPath ?
                  <Image
                  source={{uri: item.imgPath}}
                  style={{  width: 100, height: 100, alignItems: 'center', borderRadius:100 / 2,margin:5 }}/>
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
                //  <Image
                //  source={require('../../img/user.png')}
                //  style={{  width: 90, height: 90, alignItems: 'center', borderRadius:90 / 2,margin:5 }}/>
                 }
                <Text style={{ width: '50%', fontSize: this.normalize(20), textAlign: 'center', color: '#108AB0', margin: 7,fontFamily:'segoe',
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
                  <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(20),fontFamily:'segoe',}}>قائمه الأطفال</Text>
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
              <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(20),fontFamily:'segoe',}}>Children List</Text>
             <TouchableOpacity
             style={{width:'10%',height:20}} />
           </View>
            );
          }
       }
    render(){
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
        <View style={{width:width,alignItems:'center',justifyContent:'center'}}>
        <FlatList style={{width:width*0.96,marginTop:10,marginBottom:'10%'}}
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
export default ChildrenReports;
const styles = StyleSheet.create({
   container: {
     width: width,
     flex: 1,
     alignItems: 'center',
     backgroundColor: '#FFF',
   },
   shadow: {
     shadowColor: '#fff',
     shadowOffset: {
       width: 0,
       height: 6,
     },
     shadowOpacity: 0.05,
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
 });