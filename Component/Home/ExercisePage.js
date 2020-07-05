/* eslint-disable no-alert */
/* eslint-disable react/self-closing-comp */
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
  Button,
  Platform, PixelRatio
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
const {width, height} = Dimensions.get('window');
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import Modal from 'react-native-modal';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';
import Icon from 'react-native-vector-icons/FontAwesome';



class ExercisePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lang: '',
      Processing: false,
      isVisible:false,
      exerciseID:'',
      userData:{},
      userId:'',
      data:[],
      excNumber:0,
      goal:'',
      desc:'',
      status:0,
      childId:'',
      materialId:'',
      selectedPrinter: null,
      pdfFile:'',
      nextId:'',
      rate:0,
      flag:0,
      print:0,
      count:0,

    };
  }
  componentDidMount() {
    this._retrieveData();
  }
  _retrieveData = async () => {
    const { navigation } = this.props;
    const Id = navigation.getParam('exerciseID', 'NO-ID');
    this.setState({exerciseID:Id});
    const child_Id = navigation.getParam('child_ID', 'NO-ID');
    this.setState({childId:child_Id});
    const material_Id = navigation.getParam('material_ID', 'NO-ID');
    this.setState({materialId:material_Id});
    const next_Id = navigation.getParam('nextID', 'NO-ID');
    this.setState({nextId:next_Id});
    const exer_rate = navigation.getParam('exerciseRate', 'NO-ID');
    this.setState({rate:exer_rate});
    const status_num = navigation.getParam('status', 'NO-ID');
    this.setState({status:status_num});
    const count_num = navigation.getParam('count', 0);
    if(count_num){
      this.setState({count:count_num});
    }else{
      this.setState({count:0});
    }
    
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
       } else {
        var data2 = {
          _id:'1',
          fullname:'أسم المستخدم',
        };
         this.setState({userData:data2});
       }
    } catch (error) {}
  };
  renderOption(lang){
    if (lang === 'AR'){
      return (
          <View style={[styles.shadow,{width:width,height:'8%',alignItems:'center',backgroundColor:'#118CB3',flexDirection:'row'}]}>
             <TouchableOpacity
             onPress={()=>this.props.navigation.navigate('ChildDetail')}
             style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center'}}>
           <Icon name="chevron-left" size={18} color="#fff" style={{}} />
          </TouchableOpacity>
            <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}>صفحه التمرين</Text>
           <TouchableOpacity
           onPress={() => this.props.navigation.navigate('MenuTabs')}
           style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center'}}>
             <Icon name="ellipsis-v" size={25} color="#fff" style={{}} />
          </TouchableOpacity>
         </View>
      );
    } else {
      return (
        <View style={[styles.shadow,{width:width,height:'8%',alignItems:'center',backgroundColor:'#118CB3',flexDirection:'row-reverse'}]}>
           <TouchableOpacity
           onPress={()=>this.props.navigation.navigate('ChildDetail')}
           style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center'}}>
           <Icon name="chevron-right" size={18} color="#fff" style={{}} />
          </TouchableOpacity>
        <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}>Exercise Page</Text>
       <TouchableOpacity
       onPress={() => this.props.navigation.navigate('MenuTabs')}
       style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center'}}>
         <Icon name="ellipsis-v" size={25} color="#fff" style={{}} />
      </TouchableOpacity>
     </View>
      );
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
   getData(){
    this.setState({Processing:true});
    NetInfo.fetch().then(state =>{
      if (state.isConnected){
        try {
          axios.get('http://165.22.83.141/api/user/getExerciseByID',{
            params: {
              id:this.state.exerciseID,
          },
          }).then(response => {
            this.setState({Processing:false});
            const data = response.data;
           this.setState({ data });
          //  this.setState({status:response.data.status});
           this.setState({pdfFile:response.data.pdfFile});
           if (this.state.lang === 'AR'){
            this.setState({excNumber:response.data.exerciseNumber});
            this.setState({goal:response.data.targetAR});
            this.setState({desc:response.data.descriptionAR});
           } else {
            this.setState({excNumber:response.data.exerciseNumber});
            this.setState({goal:response.data.targetEN});
            this.setState({desc:response.data.descriptionAR});
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
        if (this.state.lang === 'AR'){
          alert('لا يوجد أتصال بالانترنت');
        } else {
          alert('No internet connection');
        }
      }
    });
  }
  _onAddPressed =()=>{
    NetInfo.fetch().then(state =>{
      if (state.isConnected){
        try {
          axios.put('http://165.22.83.141/api/user/Exercise/' + this.state.exerciseID,{
            orderStatus :2,
          }).then(response => {
            if (response.data){
              this.setState({Processing:false});
              // if(this.state.nextId){
                this.editNextState();
              // }
             
              // this.setState({ isVisible: true });
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
        if (this.state.lang === 'AR'){
          alert('لا يوجد أتصال بالانترنت');
        } else {
          alert('No internet connection');
        }
      }
    });
   
  }

  _onReview(rate){
    this.setState({Processing:true});
      NetInfo.fetch().then(state =>{
        if (state.isConnected){
          try {
            axios.post('http://165.22.83.141/api/user/review',{
                rate:rate,
                exerciseID:this.state.exerciseID,
                ChildreenID:this.state.childId,
                MaterialsID:this.state.materialId,
            }).then(response => {
              if (response.data){
                this.setState({Processing:false});
                this.setState({isVisible:false});
                this.setState({rate:rate})
                this.setState({status:2});
                this.setState({print:0});
                if (this.state.lang === 'AR'){
                  alert('تم التقييم بنجاح');
                } else {
                  alert('Rate Done Successfully');
                }
                this.setState({ isVisible: false });
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
          if (this.state.lang === 'AR'){
            alert('لا يوجد أتصال بالانترنت');
          } else {
            alert('No internet connection');
          }
        }
      });
    }

    editNextState =()=>{
      NetInfo.fetch().then(state =>{
        if (state.isConnected){
          try {
            axios.put('http://165.22.83.141/api/user/Exercise/' + this.state.nextId,{
              orderStatus :3,
            }).then(response => {
              if (response.data){
                Toast.show('done');
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

    // @NOTE iOS Only
  selectPrinter = async () => {
    const selectedPrinter = await RNPrint.selectPrinter({ x: 100, y: 100 });
    this.setState({ selectedPrinter });
  }

  // @NOTE iOS Only
  silentPrint = async () => {
    if (!this.state.selectedPrinter) {
      alert('Must Select Printer First');
    }

    const jobName = await RNPrint.print({
      printerURL: this.state.selectedPrinter.url,
      html: '<h1>Silent Print</h1>',
    });

  }
  async printHTML() {
    await RNPrint.print({
      html: '<h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3>',
    });
  }

  async printPDF() {
    const results = await RNHTMLtoPDF.convert({
      html: '<h1>Custom converted PDF Document</h1>',
      fileName: 'test',
      base64: true,
    });

    await RNPrint.print({ filePath: results.filePath });
  }

   printRemotePDF = async ()=>{
     this.setState({Processing:true});
    if (this.state.pdfFile){
      // await RNPrint.print({ filePath: this.state.pdfFile });
      NetInfo.fetch().then(state =>{
        if (state.isConnected){
          try {
            axios.post('http://165.22.83.141/api/user/count',{
              ChildreenID:this.state.childId,
              exerciseID:this.state.exerciseID,
              MaterialsID:this.state.materialId,
            }).then( async response => {
              this.setState({Processing:false});
              if (response.data._id){
                await RNPrint.print({ filePath: this.state.pdfFile });
                  this.setState({print : 1});
                  this.setState({count:this.state.count+1})
              } else {
                this.setState({Processing:false});
              }
            }).catch(error => {
              this.setState({Processing:false});
               console.log(error);
               alert('error');
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
    } else {
      this.setState({Processing:false});
        if (this.state.lang === 'AR'){
          alert('لا يوجد ملف للطباعه');
        } else {
          alert('No file to print');
        }
      }
  }
  customOptions = () => {
    return (
      <View>
        {this.state.selectedPrinter &&
          <View>
            <Text>{`Selected Printer Name: ${this.state.selectedPrinter.name}`}</Text>
            <Text>{`Selected Printer URI: ${this.state.selectedPrinter.url}`}</Text>
          </View>
        }
      <Button onPress={this.selectPrinter} title="Select Printer" />
      <Button onPress={this.silentPrint} title="Silent Print" />
    </View>

    );
  }

  render() {
    const textAR2 = 'برجاء ادخال تقييم الطفل في هذا التمرين بحيث يكون أعلي تقيم هو 10 واقل تقيم هو 1';
    const texEN2 = 'Please enter the child ratting in this exercise with the highest rating being 10 and the lowest rating being 1';

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
       {Platform.OS === 'ios' && this.customOptions()}
       <ScrollView style={{width:width ,height:height}}>
         <View style={{width:width,height:height,alignItems:'center'}}>
       <View style={[this.state.status === 2 ? styles.Wcolor : styles.color,styles.viewContainer,{marginTop:10}]}>
         <View style={[this.state.lang==='AR'?styles.row:styles.row_reserve,{width:'100%',alignItems:'center',justifyContent:'center'}]}>
         <View style={{alignItems:'center',justifyContent:'center',margin:'2%',padding:3}}>
         {this.state.rate !==0 ?
          <View style={{alignItems:'center'}}>
          <Text style={[this.state.lang === 'AR' ? styles.left : styles.right,{color:'#003F51',fontSize:this.normalize(16),fontFamily:'segoe'}]}>{this.state.lang === 'AR' ? 'التقييم' : 'Rate'}</Text>
          <View style={[this.state.lang === 'AR' ? styles.row : styles.row ,{height:23,backgroundColor:'#fff', elevation:3,borderRadius:5,alignItems:'center',justifyContent:'center'}]}>
          <Icon name="star" size={15} color="#FFE000" style={{}} />
          <Text style={[{color:'#FFE000',fontSize:this.normalize(12),fontWeight:'bold',margin:2,textAlign:'center'}]}>{this.state.rate}/10</Text>
          </View>
          </View>
          :
          <View style={{display:'none'}}></View>
          }
          {this.state.count !==0 ?
           <View style={[this.state.lang === 'AR' ? styles.row : styles.row ,{alignItems:'center',}]}>
           <Image source={require('./../../img/g_print.png')} style={{width:17,height:17,}} resizeMode="contain" />
           <Text style={{color:'#087A00',fontSize:this.normalize(12),fontWeight:'bold',margin:5}}>{this.state.count}</Text>
           </View>
          :
          <View style={{display:'none'}}></View>
          }
          </View>
          <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
         <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve ,{width:'100%',marginTop:20,alignItems:'center'}]}>
          <Text style={{width:'60%',color:'#39393B',textAlign:'center',fontSize:this.normalize(14),backgroundColor:'#FFF',padding:2,fontFamily:'segoe'}}>{this.state.excNumber}</Text>
           <Text style={[this.state.lang === 'AR' ? styles.right : styles.left,{flex:1,color:'#003F51',fontSize:this.normalize(16),fontFamily:'segoe'}]}>{this.state.lang === 'AR' ? 'رقم التمرين' : 'Exe Number'}</Text>
           <Image source={require('./../../img/num.png')} style={{width:20,height:20,margin:10}} resizeMode="contain" />
          </View>

          <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve ,{width:'100%',marginTop:5,alignItems:'center'}]}>
          <Text style={{width:'60%',color:'#39393B',textAlign:'center',fontSize:this.normalize(14),backgroundColor:'#FFF',padding:3,fontFamily:'segoe'}}>{this.state.goal.trim()} </Text>
           <Text style={[this.state.lang === 'AR' ? styles.right : styles.left,{flex:1,color:'#003F51',fontSize:this.normalize(16),fontFamily:'segoe',margin:5}]}>
             {this.state.lang === 'AR' ? 'الهدف' : 'Goal'}</Text>
           <Image source={require('./../../img/goal.png')} style={{width:20,height:20,margin:10}} resizeMode="contain" />
          </View>
          </View>
         </View>
         

          <View style={{width:'70%',height:1,backgroundColor:'#DCD9D9',marginTop:20}}></View>
          <Text style={[this.state.lang === 'AR' ? styles.right : styles.left,{width:'80%',color:'#003F51',fontSize:this.normalize(16),marginTop:'5%',fontFamily:'segoe'}]}>
             {this.state.lang === 'AR' ? 'وصف التمرين' : 'Exercise description'}</Text>
             <Text style={[this.state.lang === 'AR' ? styles.right : styles.left,{width:'80%',color:'#003F51',fontSize:this.normalize(14),marginTop:'5%',fontFamily:'segoe',backgroundColor:'#FFFFFF',padding:5}]}>
             {this.state.desc.trim()}</Text>
       </View>
       <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve ,{width:'100%',marginTop:10,alignItems:'center',justifyContent:'space-evenly'}]}>

          <TouchableOpacity
           onPress={() => {
              if(this.state.print === 1 ){
            this.setState({ isVisible: true });
            
            } else{
              this.setState({Processing:false});
              if (this.state.lang === 'AR'){
                alert('قم بطباعه التمرين أولا ثم أضغط تم');
              } else {
                alert('Print the exercise first, then click Done');
              }
            }
        
            }}
             style={[styles.button,styles.shadow,{backgroundColor:'#087A00',}]}>
               <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve ,{width:'100%',alignItems:'center'}]}>
               <Text style={{flex:1,height:'100%',textAlign:'center',color:'#FFF',fontSize:this.normalize(20),textAlignVertical:'center',fontFamily:'segoe'}}>
                {this.state.lang === 'AR' ? 'تـم' : 'Ok'}
              </Text>
              <Image source={require('./../../img/right.png')} style={{width:30,height:30,margin:5}} resizeMode="contain" />
               </View>
            </TouchableOpacity>

            <TouchableOpacity
            onPress={()=>{
                this.printRemotePDF();
            }}
             style={[styles.button,styles.shadow,{backgroundColor:'#118CB3',}]}>
             <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve ,{width:'100%',alignItems:'center'}]}>
             {this.state.rate === 0 ? 
              <Text style={{flex:1,height:'100%',textAlign:'center',color:'#FFF',fontSize:this.normalize(22),textAlignVertical:'center',fontFamily:'segoe'}}>
              {this.state.lang === 'AR' ? 'أطبع' : 'Print'} </Text>
             :
             <Text style={{
               flex:1,height:'100%',textAlign:'center',color:'#FFF',fontSize:this.normalize(22),textAlignVertical:'center',fontFamily:'segoe'}}>
              {this.state.lang === 'AR' ? 'أعادة الطبع' : 'Print again'} </Text>
             }
            
           
            <Image source={require('./../../img/print.png')} style={{width:30,height:30,margin:5}} resizeMode="contain" />
             </View>
            </TouchableOpacity>
          </View>
          <Modal
             isVisible={this.state.isVisible}
             onBackdropPress={() => this.setState({ isVisible: false })}
             swipeDirection="left"
             >
          <View style={[styles.modal,{height:'50%'}]}>
          <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,styles.view2]}>
                <TouchableOpacity
                 onPress={()=>this.setState({isVisible:false})}>
               <Image source={require('./../../img/close.png')} style={{width:15,height:15,margin:10}} resizeMode="contain" />
               </TouchableOpacity>
            </View>
            <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve ,{width:'90%',marginTop:'3%',alignItems:'center', justifyContent:'center'}]}>
            <Text style={{color:'#003F51',textAlign:'center',fontSize:this.normalize(18) ,fontFamily:'segoe'}}>
            {this.state.lang === 'AR' ? 'التقييم' : 'Ratting'}</Text>
            <Image source={require('./../../img/star.png')} style={{width:20,height:20,margin:5,alignItems:'center'}} resizeMode="contain" />
            </View>
            <Text style={{width:'70%',color:'#003F51',textAlign:'center',fontSize:this.normalize(16),marginTop:10,fontFamily:'segoe'}}>
            {this.state.lang === 'AR' ? textAR2 : texEN2}</Text>
           <View style={{width:'90%',alignItems:'center',height:'33%',borderColor:'#707070',marginTop:'4%',borderWidth:1}}>
             <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve ,{height:'49%'}]}>
             <TouchableOpacity
               onPress={() =>this._onReview(1)}
             style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve ,{flex:1}]}>
              <Text style={{width: '100%',height:'100%',textAlign:'center',color:'#003F51',fontSize:this.normalize(22),textAlignVertical:'center',fontFamily:'segoe'}}>
                {this.state.lang === 'AR' ? '1' : '1'}
              </Text>
            </TouchableOpacity>
            <View style={{width:1,backgroundColor:'#707070',height:'100%'}}/>
            <TouchableOpacity
              onPress={() =>this._onReview(2)}
             style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve ,{flex:1}]}>
              <Text style={{width: '100%',height:'100%',textAlign:'center',color:'#003F51',fontSize:this.normalize(22),textAlignVertical:'center',fontFamily:'segoe'}}>
                {this.state.lang === 'AR' ? '2' : '2'}
              </Text>
            </TouchableOpacity>
            <View style={{width:1,backgroundColor:'#707070',height:'100%'}}/>
            <TouchableOpacity
             onPress={() =>this._onReview(3)}
             style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve ,{flex:1}]}>
              <Text style={{width: '100%',height:'100%',textAlign:'center',color:'#003F51',fontSize:this.normalize(22),textAlignVertical:'center',fontFamily:'segoe'}}>
                {this.state.lang === 'AR' ? '3' : '3'}
              </Text>
            </TouchableOpacity>
            <View style={{width:1,backgroundColor:'#707070',height:'100%'}}/>
            <TouchableOpacity
             onPress={() =>this._onReview(4)}
             style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve ,{flex:1}]}>
              <Text style={{width: '100%',height:'100%',textAlign:'center',color:'#003F51',fontSize:this.normalize(22),textAlignVertical:'center',fontFamily:'segoe'}}>
                {this.state.lang === 'AR' ? '4' : '4'}
              </Text>
            </TouchableOpacity>
            <View style={{width:1,backgroundColor:'#707070',height:'100%'}}/>
            <TouchableOpacity
              onPress={() =>this._onReview(5)}
             style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve ,{flex:1}]}>
              <Text style={{width: '100%',height:'100%',textAlign:'center',color:'#003F51',fontSize:this.normalize(22),textAlignVertical:'center',fontFamily:'segoe'}}>
                {this.state.lang === 'AR' ? '5' : '5'}
              </Text>
            </TouchableOpacity>
             </View>
             <View style={{height:'1%',backgroundColor:'#707070',width:'100%'}}/>
             <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve ,{height:'49%'}]}>
             <TouchableOpacity
              onPress={() =>this._onReview(6)}
             style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve ,{flex:1}]}>
              <Text style={{width: '100%',height:'100%',textAlign:'center',color:'#003F51',fontSize:this.normalize(22),textAlignVertical:'center',fontFamily:'segoe'}}>
                {this.state.lang === 'AR' ? '6' : '6'}
              </Text>
            </TouchableOpacity>
            <View style={{width:1,backgroundColor:'#707070',height:'100%'}}/>
            <TouchableOpacity
              onPress={() =>this._onReview(7)}
             style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve ,{flex:1}]}>
              <Text style={{width: '100%',height:'100%',textAlign:'center',color:'#003F51',fontSize:this.normalize(22),textAlignVertical:'center',fontFamily:'segoe'}}>
                {this.state.lang === 'AR' ? '7' : '7'}
              </Text>
            </TouchableOpacity>
            <View style={{width:1,backgroundColor:'#707070',height:'100%'}}/>
            <TouchableOpacity
             onPress={() =>this._onReview(8)}
             style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve ,{flex:1}]}>
              <Text style={{width: '100%',height:'100%',textAlign:'center',color:'#003F51',fontSize:this.normalize(22),textAlignVertical:'center',fontFamily:'segoe'}}>
                {this.state.lang === 'AR' ? '8' : '8'}
              </Text>
            </TouchableOpacity>
            <View style={{width:1,backgroundColor:'#707070',height:'100%'}}/>
            <TouchableOpacity
             onPress={() =>this._onReview(9)}
             style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve ,{flex:1}]}>
              <Text style={{width: '100%',height:'100%',textAlign:'center',color:'#003F51',fontSize:this.normalize(22),textAlignVertical:'center',fontFamily:'segoe'}}>
                {this.state.lang === 'AR' ? '9' : '9'}
              </Text>
            </TouchableOpacity>
            <View style={{width:1,backgroundColor:'#707070',height:'100%'}}/>
            <TouchableOpacity
              onPress={() =>this._onReview(10)}
             style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve ,{flex:1}]}>
              <Text style={{width: '100%',height:'100%',textAlign:'center',color:'#003F51',fontSize:this.normalize(22),textAlignVertical:'center',fontFamily:'segoe'}}>
                {this.state.lang === 'AR' ? '10' : '10'}
              </Text>
            </TouchableOpacity>
             </View>
           </View>
         </View>
          </Modal>
       </View>
       </ScrollView>
      </SafeAreaView>
    );
  }
}
export default ExercisePage;
const styles = StyleSheet.create({
  container: {
    width: width,
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  view2:{
    width:'100%',
    alignItems:'center',
  
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
  right:{
    textAlign:'right',
  },
  left:{
    textAlign:'left',
  },
  viewContainer:{
    width:width*0.92,
    borderRadius:15,
    alignItems:'center',
    height:height*0.8,
  },
  button:{
    width:'35%',
      height:40,
      borderRadius:12,
      alignItems:'center',
      justifyContent:'center',
  },
  color:{
    backgroundColor:'#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  Wcolor:{
    backgroundColor:'#E2FFD270',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    borderWidth:2,
    borderColor:'#EBEBEB'
    // elevation: 2,
  },
  modal:{
    width:'100%',
    alignItems:'center',
    backgroundColor:'#fff',
    borderRadius:4,
    borderColor:'#707070',borderWidth:1,
  },
});
