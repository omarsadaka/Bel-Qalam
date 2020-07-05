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
  TouchableOpacity,Platform, PixelRatio
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
const {width, height} = Dimensions.get('window');
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from 'react-native-restart';
import Icon from 'react-native-vector-icons/FontAwesome';



class ChangeLanguage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            lang:'',
          Processing: false,
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
          // this.setState({Processing:true});
        } catch (error){}
      }

    setAppLanguage = async (lang) => {
        this.setState({ Processing: true });
        setTimeout(() => {
           try {
                       this.setState({ Processing: false });
                       Alert.alert(
                        this.state.lang === 'AR' ? 'بالقلم' : 'PelQalam' ,
                        this.state.lang === 'AR' ? 'يجب أعادة تشغيل التطبيق لتغير اللغه' : 'You need to restart app to change language' ,
                        [
                          {text: this.state.lang === 'AR' ? 'الغاء' : 'Cancel' ,
                          onPress: () => this.dismiss, style: 'cancel'},
                          {text:this.state.lang === 'AR' ? 'موافق' : 'ok' ,  onPress: () => {
                            try {
                              AsyncStorage.setItem('Lang', lang);
                              RNRestart.Restart();
                            } catch (e){}
                           },
                         },
                        ],
                        { cancelable: true }
                      );
                       return true;
           } catch (error) {
              this.setState({ Processing: false });
              alert(error);
           }
        }, 1000);
    };

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
                   style={{width:'10%',height:18}}>
                 {/* <Image source={require('./../../img/back.png')} style={{width:'100%',height:'100%',alignItems:'center'}} resizeMode="contain" /> */}
                 <Icon name="chevron-left" size={18} color="#fff" style={{marginStart:10}} />
                </TouchableOpacity>
                  <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}>تغير اللغه</Text>
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
              <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}>Change language</Text>
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
               textStyle={{ color: '#FFF' }}
           />
           <View style ={{width:width,height:'1%',backgroundColor:'#118CB3',elevation:11}}/>
           {this.renderOption(this.state.lang)}
        <Image source={require('./../../img/logo.png')} style={styles.image}
        resizeMode="contain" />
        <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]} >
               <Text style={{ fontSize: this.normalize(20),fontFamily:'segoe', color: '#003F51', marginVertical: 21 }} >{'اختر لغه التطبيق'}</Text>
           </View>
           <View style={[styles.row]} >

                   <TouchableOpacity onPress={() => this.setAppLanguage('EN')} style={[styles.Button, styles.shadow, { backgroundColor: '#F39322' }]} >
                       <Text style={{ color: '#003F51', fontSize: this.normalize(20),fontFamily:'segoe' }}>English</Text>
                   </TouchableOpacity>

                   <TouchableOpacity onPress={() => this.setAppLanguage('AR')} style={[styles.Button, styles.shadow, { backgroundColor: '#108AB0',marginStart:5 }]} >
                       <Text style={{ color: '#FFF', fontSize: this.normalize(20),fontFamily:'segoe' }}>العربيه</Text>
                   </TouchableOpacity>
           </View>
    </SafeAreaView>
        );
    }
}
export default ChangeLanguage;
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
       justifyContent: 'flex-start',
       alignItems: 'center',
       backgroundColor: '#FFF',
    },
    Button: {
        width: '40%',
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        height:40,
    },
    image: {
        width: '90%',
        height: '50%',
        marginTop:'10%',
    },
 });