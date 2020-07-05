/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
import React, {Component} from 'react';
import { View,StyleSheet,Image, StatusBar,SafeAreaView, Dimensions,Text,TouchableOpacity,ScrollView,
    ImageBackground,Platform,PixelRatio} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
const {width, height} = Dimensions.get('window');
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';
import { Container, Header, Content, Picker, Form } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';



class PrintCertificate extends Component{
    constructor(props) {
        super(props);
        this.state = {
          lang: 'AR',
          Processing: false,
          name:'',
          article:'',
          subArticle:'',
          names:[],
          isVisible:false,
          articles:[],
          subArticles:[],
          childreens:[],
          userData:{},
          userId:'',
          rate:'0.0',
          materialRate:{},
          subArticles:[],
          parent:1,
          ids:[],
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
          this.getChildreen();
          this.getArticles();
         } else {
          var data2 = {
            _id:'1',
            fullname:'أسم المستخدم',
          };
           this.setState({userData:data2});
         }
        } catch (error){}
      }

      getChildreen(){
        NetInfo.fetch().then(state=>{
        if (state.isConnected){
          try {
            axios.get('http://165.22.83.141/api/user/childByParent' ,{
              params: {
                userID:this.state.userId,
            },
            }).then(response => {
              let childreen = response.data;
              let childreenArr = [];
              if (this.state.lang === 'AR'){
                childreen.forEach(element => {
                  childreenArr.push({
                   label:element.firstname ,value:element._id,key:element._id,
                  });
                });
                childreenArr.unshift({
                 label:'أختر الطفل',value:'1',key:'1',
                });
               } else {
                childreen.forEach(element => {
                  childreenArr.push({
                   label:element.firstname ,value:element._id,key:element._id,
                  });
                });
                 childreenArr.unshift({
                   label:'Choose Child' ,value:'1',key:'1',
                  });
               }
             this.setState({ childreens :childreenArr});
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

      getArticles(){
        NetInfo.fetch().then(state=>{
        if (state.isConnected){
          try {
            axios.get('http://165.22.83.141/api/user/Materials ').then(response => {
              let marerial = response.data;
              let marerialArr = [];
              let subMarerialArr = [];
              if (this.state.lang === 'AR'){
              marerial.forEach(element => {
                if(element.hasChildreen===2){
                  this.state.ids.push(element._id)
                }
                marerialArr.push({
                 label:element.titleAr ,value:element._id,key:element._id,parent:element.hasChildreen
                });
              });
              marerialArr.unshift({
               label:'أختر المادة',value:'1',key:'1',
              });
              subMarerialArr.unshift({
                label:'أختر المادة الفرعية',value:'1',key:'1',
               });
             } else {
               marerial.forEach(element => {
                 if(element.hasChildreen===2){
                   this.state.ids.push(element._id)
                 }
                 marerialArr.push({
                   label:element.titleEN ,value:element._id,key:element._id,parent:element.hasChildreen
                 });
               });
               marerialArr.unshift({
                 label:'Choose subject' ,value:'1',key:'1',
                });
                subMarerialArr.unshift({
                  label:'Choose SubMaterial' ,value:'1',key:'1',
                 });
             }
             this.setState({ articles :marerialArr});
             this.setState({subArticles:subMarerialArr})
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

      getSubArticle= (id)=>{
        if(this.state.parent === 1){
          NetInfo.fetch().then(state =>{
            if (state.isConnected){
              try {
                axios.get('http://165.22.83.141/api/user/getsubMaterialByMaterial',{
                  params:{
                    parentID:id
                  }
                }).then(response => {
                  let subMarerial = response.data;
                  let subMarerialArr = [];
                  let marerialArr = [];
                  if (this.state.lang === 'AR'){
                    subMarerial.forEach(element => {
                      subMarerialArr.push({
                       label:element.titleAr ,value:element._id,key:element._id,
                      });
                    });
                    subMarerialArr.unshift({
                     label:'أختر المادة',value:'1',key:'1',
                    });
                   
                   } else {
                     subMarerial.forEach(element => {
                       subMarerialArr.push({
                         label:element.titleEN ,value:element._id,key:element._id,
                       });
                     });
                     subMarerialArr.unshift({
                       label:'Choose subject' ,value:'1',key:'1',
                      });
                     
                   }
                   this.setState({ subArticles :subMarerialArr});
                 
                }).catch(function (error) {
                   console.log(error);
                }).finally(function () {
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
        }else{
         
        }
       
      }

      getMaterialRate(id){
        if(this.state.name){
          NetInfo.fetch().then(state =>{
            if (state.isConnected){
              try {
                axios.get('http://165.22.83.141/api/user/getMaterialRate',{
                  params: {
                    MaterialsID:id,
                    ChildreenID: this.state.name,
                },
                }).then(response => {
                  // alert(JSON.stringify(response.data))
                  this.setState({ materialRate:response.data });
                  if (!response.data.rate){
                    this.setState({rate :'0.0'});
                  } else {
                    const data = response.data.rate.toFixed(1);
                    this.setState({rate :data});
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
        }else{
          if (this.state.lang === 'AR'){
            alert('اختر الطفل لاظهار تقييم المادة');
          } else {
            alert('Choose child to get rate');
          }
        }
       
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

      // async printHTML() {
      //   await RNPrint.print({
      //     html: <div> </div> ,
      //   });
      // }
      async printHTML() {
        await RNPrint.print({
          html: 
          '<h1>Heading 1</h1> <h2>Heading 2</h2> <h3>Heading 3</h3> '
          ,
        });
      }

    
      async printPDF() {
        const results = await RNHTMLtoPDF.convert({
          html: '<h1>Heading 1</h1> <h2>Heading 2</h2> <h3>Heading 3</h3> ',
          fileName: 'test',
          base64: true,
        });
    
        await RNPrint.print({ filePath: results.filePath });
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
                 <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}> طباعة شهادة</Text>
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
             <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}>Print certificate</Text>
            <TouchableOpacity
            style={{width:'10%',height:20}} />
          </View>
           );
         }
      }
    render(){
        return(
            <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#118CB3" barStyle="light-content" />
            {/* <Spinner
                    visible={this.state.Processing}
                    textContent={'Loading...'}
                    textStyle={{ color: '#FFF' }}
                /> */}
            <View style ={{width:width,height:'1%',backgroundColor:'#118CB3',elevation:11}}/>
            {this.renderOption(this.state.lang)}
             <View style={[styles.view,{borderColor:'#1DA9E1',marginTop:10}]}>
                 <View style={[styles.view2,{borderColor:'#108CB0'}]}>
                   <View style={[styles.view2,{borderColor:'#1DA9E1'}]}>
                     <View style={[styles.view2,{borderColor:'#108CB0'}]}>
                      <View style={[styles.view2,{borderColor:'#1DA9E1',backgroundColor:'#DAF6FF',justifyContent:'center'}]}>
                    <Text style={{color:'#003F51',textAlign:'center',fontSize:this.normalize(25),fontFamily:'tahoma',marginTop:'12%'}}>
                        {this.state.lang=="AR"? 'شهاده شكر':'Certificate'}</Text>
                    <View style={[styles.viewRow,{width:'70%', borderColor:'#F39322',backgroundColor:'#FFFFFF',paddingTop:5}]}>
                    <Icon name="caret-down" size={18} color="#707070" style={[this.state.lang==='AR'?styles.posLeft:styles.posRight,{position:'absolute'}]} />
               <View style={[this.state.lang==='AR'?styles.maStart:styles.maEnd,{width:'100%',height:'100%'}]}>
                 <Picker
                  style={{width:'100%',height:'100%',alignItems:'center',color:'#F39322',justifyContent:'center',fontSize:this.normalize(20),backgroundColor:'transparent'}}
                  itemStyle={{backgroundColor:'#fff',alignItems:'center',justifyContent:'center',textAlign:'center'}}
                  onValueChange = {(name) =>{
                    this.setState({ name });
                }}
                mode="dropdown" selectedValue = {this.state.name?this.state.name:'1'} >
                       {this.state.childreens.map((i, index) => (
               <Picker.Item
               label = {i.label} value = {i.value} key={i.value} />
                       ))}
              </Picker>
              </View>
                    </View>
                      <Text style={{color:'#003F51',textAlign:'center',fontSize:this.normalize(17),marginTop:'2%',fontFamily:'segoe'}}>
                        {this.state.lang==="AR"? 'وذلك لحصولك علي تقيم عام':'So you get a general assessment'}</Text>
                        {/* <Text style={{color:'#F39322',textAlign:'center',fontSize:22,fontFamily:'segoe',marginTop:3}}>
                        {this.state.lang==="AR"? '7/10':'7/10'}</Text> */}
             <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve ,{alignItems:'center'}]}>
             <Image source={require('./../../img/rate_o.png')} style={{width:25,height:25}} resizeMode="contain" />
             <Text style={{color:'#F39322',textAlign:'center',fontSize:this.normalize(22),fontFamily:'tahoma',margin:7}}>{this.state.rate}/10</Text>
             </View>
                        <Text style={{color:'#003F51',textAlign:'center',fontSize:this.normalize(20),marginTop:'1%',fontFamily:'segoe'}}>
                        {this.state.lang==="AR"? 'في مادة':'In Article'}</Text>
                <View style={[styles.viewRow,{width:'65%', borderColor:'#F39322',backgroundColor:'#FFFFFF',paddingTop:5}]}>
               <Icon name="caret-down" size={18} color="#707070" style={[this.state.lang==='AR'?styles.posLeft:styles.posRight,{position:'absolute'}]} />
                <View style={[this.state.lang==='AR'?styles.maStart:styles.maEnd,{width:'100%',height:'100%'}]}>
                 <Picker
                  style={{width:'100%',height:'100%',alignItems:'center',color:'#118CB3',justifyContent:'center',fontSize:this.normalize(15),backgroundColor:'transparent'}}
                  itemStyle={{backgroundColor:'#fff',alignItems:'center',justifyContent:'center',textAlign:'center'}}
                  onValueChange = {(article) =>{
                    this.setState({ article });
                    if(this.state.ids.includes(article)){
                      this.setState({parent:2})
                      this.getMaterialRate(article);
                    }else{
                      this.setState({parent:1})
                      this.getSubArticle(article)
                    }
                   
                }}
                mode="dropdown" selectedValue = {this.state.article?this.state.article:'1'} >
                       {this.state.articles.map((i, index) => (
                        
               <Picker.Item
               label = {i.label} value = {i.value} key={i.value} parent={i.parent}
               />
               
                       ))}
              </Picker>
              </View>
               </View>
               {this.state.parent===1 ?
               <View style={{width:'100%',alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:'#003F51',textAlign:'center',fontSize:this.normalize(20),marginTop:'3%',fontFamily:'segoe'}}>
                {this.state.lang==="AR"? 'في المادة الفرعية':'In SubArticle'}</Text>
             <View style={[styles.viewRow,{width:'65%', borderColor:'#F39322',backgroundColor:'#FFFFFF',paddingTop:5}]}>
            <Icon name="caret-down" size={18} color="#707070" style={[this.state.lang==='AR'?styles.posLeft:styles.posRight,{position:'absolute'}]} />
            <View style={[this.state.lang==='AR'?styles.maStart:styles.maEnd,{width:'100%',height:'100%'}]}>
            <Picker
            style={{width:'100%',height:'100%',alignItems:'center',color:'#118CB3',justifyContent:'center',fontSize:this.normalize(15),backgroundColor:'transparent'}}
            itemStyle={{backgroundColor:'#fff',alignItems:'center',justifyContent:'center',textAlign:'center'}}
            onValueChange = {(subArticle) =>{
             this.setState({ subArticle });
             this.getMaterialRate(subArticle);
             }}
            mode="dropdown" selectedValue = {this.state.subArticle?this.state.subArticle:'1'} >
               {this.state.subArticles.map((i, index) => (
              <Picker.Item
                label = {i.label} value = {i.value} key={i.value} />
               ))}
              </Picker>
                </View>
            </View>
            </View>
               :
                <View style={{display:'none'}}></View>
               }
              
            
                      <Text style={{color:'#003F51',textAlign:'center',fontSize:this.normalize(15),fontFamily:'segoe',position:'absolute',bottom:5}}>
                        {this.state.lang==="AR"? 'نتمنى لك دوام التفوق والنجاح':'We wish you continued excellence and success'}</Text>
                     </View>
                   </View>
                   </View>
                 </View>
             </View>
             <TouchableOpacity
             onPress={()=>{
              this.printHTML();
            }}
             style={{width: 50,height:50,position:'absolute',top:'11%',left:5}}>
             <Image
              resizeMode="stretch"
              source={require('./../../img/print_bg.png')} style={{width: 50,height:50}}/>
              </TouchableOpacity>
              <ImageBackground source={require('./../../img/award.png')}
              resizeMode="contain"
                     style={{width:100,height:100,alignItems:'center',justifyContent:'center',position:'absolute',top:'12%',}}>
                     <Image
                     resizeMode="contain"
                     source={require('./../../img/logo_cer.png')} style={{width: 30,height:70,alignItems:'center'}} />
                    </ImageBackground>
                    
         </SafeAreaView>
        );
    }
}
export default PrintCertificate;
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
    row_reserve:{
       flexDirection:'row-reverse',
    },
    view:{
      width:'95%',
      height:'88%',
      alignItems:'center',
      justifyContent:'center',
      borderWidth:8,
    },
    view2:{
        width:'100%',
        height:'100%',
        borderWidth:8,
        alignItems:'center',
      },
    shadow: {
       shadowColor: '#000',
       shadowOffset: {
          width: 0,
          height: 8,
       },
       shadowOpacity: 0.1,
       shadowRadius: 10,
       elevation: 10,
    },
    container: {
        width:'100%',
       flex:1,
       alignItems: 'center',
       backgroundColor: '#FFF',
    },
    picker:{
        height:40,
        borderRadius:8,
        borderWidth:1,
        color:'#F39322',
        textAlign:'center',
        alignItems:'center',
        justifyContent:'center',
    },
    viewRow:{
      height:40,
      borderRadius:8,
      borderWidth:1,
       marginTop:5,
        alignItems:'center',
        justifyContent:'center',
    },
    maStart:{
      marginStart:'30%'
    },
    maEnd:{
      marginEnd:0
    },
    posLeft:{
     left:7
    },
    posRight:{
     right:7
    }
 });

