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
  FlatList,Platform,PixelRatio
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
const {width, height} = Dimensions.get('window');
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';




class Payment extends Component{
    constructor(props) {
        super(props);
        this.state = {
          lang: '',
          Processing: false,
          data:[],
          flag_view:0,
          userData:{},
          userId:'',
          type:0,
          article:0,
          isSelected:'',
          bg:'#fff',
          txt:'#F39322',
          radioSelected :1

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
                if(data.length === 1){
                  this.setState({isSelected:data[0]._id})
                  this.setState({bg:'#F39322'})
                  this.setState({txt:'#fff'})
                }
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
       renderOption(lang){
         if (lang === 'AR'){
            return (
                <View style={[styles.shadow,{width:width,height:'8%',alignItems:'center',backgroundColor:'#118CB3',flexDirection:'row'}]}>
                   <TouchableOpacity
                   onPress={()=>this.props.navigation.navigate('Menu')}
                   style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                 <Icon name="chevron-left" size={18} color="#fff" style={{}} />
                </TouchableOpacity>
                  <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}> دفع الأشتراك</Text>
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
              <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}>Payment</Text>
             <TouchableOpacity
             style={{width:'10%',height:20}} />
           </View>
            );
          }
       }
       renderRadio(clicked){
         return(
          <TouchableOpacity
          style={{ width:20 ,height:20 , borderRadius:20/2,backgroundColor:'#fff',elevation:5,justifyContent:'center',alignItems:'center'}}
          onPress={()=>{
            this.setState({radioSelected:clicked})
          }}>
            {this.state.radioSelected === clicked?
            <View
            style={{  width: 15, height: 15, alignItems: 'center',backgroundColor:'#003F51',borderRadius:15/2,}}/>
            :
            <View style={{display:'none'}}></View>
            }
          </TouchableOpacity>
         )
       }

       renderItem(item){
        const {isSelected} = this.state;
        const text_ar = 'القيمة المذكورة لرسوم الاشتراك السنوى أو النصف سنوى تكون لطفل واحد';
        const text_an = 'The above mentioned annual subscription fee is for one child';
         return (
          <View style={[styles.view,{}]}>
            <TouchableOpacity
            onPress={()=>{
              if (isSelected === item._id){
                this.setState({isSelected: '' });
              } else {
                this.setState({isSelected:item._id });
              }
            }}
            style={[styles.shadow,{width:'95%',borderColor:'#F39322',borderWidth:1,height:80,alignItems:'center',justifyContent:'center',marginVertical:4}]}>
             <View style={[ this.state.lang === 'AR' ? styles.row : styles.row_reserve,isSelected === item._id ? styles.clickedBg:styles.bg,{height:'100%', width:'100%',alignItems:'center',
             justifyContent:'center',}]}>
            <Text style={[isSelected === item._id ? styles.clickedTxt:styles.txt,this.state.lang==='AR'?styles.right:styles.left,{width:'60%', fontSize: this.normalize(18),fontFamily:'segoe', }]}>
              {item.firstname} {item.surname}</Text>
            {item.imgPath ?
            <View style={[this.state.lang==='AR'?styles.end:styles.start,{width:'30%'}]}>
                  <Image
                  source={{uri: item.imgPath}}
                  style={[styles.shadow2,{width: 70, height: 70,borderRadius:70 / 2 ,alignItems:'center'}]}/>
                </View>
                 :
                 <View style={[this.state.lang==='AR'?styles.end:styles.start,{width:'30%'}]}>
                 {item.gender === 1 ?
                  <Image
               source={require('../../img/boy.png')}
                style={[styles.shadow2,{width: 70, height: 70,alignItems:'center'}]}/>
                 :
                 <Image
                source={require('../../img/girl.png')}
                style={[styles.shadow2,{width: 70, height: 70,alignItems:'center' }]}/>
                 }
               </View>
                 }
              </View>
              </TouchableOpacity>
              {isSelected !== item._id ?
              <View style={{display:'none'}}/>
              :
              <View style={{width:'95%',alignItems:'center',justifyContent:'center',borderColor:'#CDCBCB',borderWidth:1,}}>
               <View style={{width:'95%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
               <View style={{flex:1,height:1,backgroundColor:'#118CB3',marginTop:5}}/>
               <Text style={{fontSize: 20, textAlign: 'center', color: '#118CB3',fontFamily:'segoe',margin:7}}>
                 {this.state.lang === "AR" ? 'أختر المواد' : 'Choose subjects'}</Text>
               <View style={{flex:1,height:1,backgroundColor:'#118CB3',marginTop:5}}/>
               </View>
               <View style ={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,{width:'95%' ,alignItems:'center',justifyContent:'center',marginTop:10}]}>
                <View style={{flex:1,alignItems:'center',}}>
                <View style ={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,{width:'100%',alignItems:'center'}]}>
                 <Text style={[this.state.lang ==='AR'?styles.right:styles.left,{fontSize: this.normalize(14), color: '#343434',margin:5,fontFamily:'segoe'}]}>
                 {this.state.lang === "AR" ? ' ريال سعودى ' : ' SAR'}</Text>
                 <Text style={[this.state.lang ==='ar'?styles.right:styles.left,{fontSize: this.normalize(20), color: '#343434',margin:5,fontFamily:'segoe'}]}>
                 {this.state.lang === "AR" ? '5  ' : '5 '}</Text>
                 </View>
                 <View style ={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,{width:'100%',marginTop:5,alignItems:'center'}]}>
                 <Text style={[this.state.lang ==='AR'?styles.right:styles.left,{fontSize: this.normalize(14), color: '#343434',margin:5,fontFamily:'segoe'}]}>
                 {this.state.lang === "AR" ? ' ريال سعودى ' : ' SAR'}</Text>
                 <Text style={[this.state.lang ==='ar'?styles.right:styles.left,{fontSize: this.normalize(20), color: '#343434',margin:5,fontFamily:'segoe'}]}>
                 {this.state.lang === "AR" ? '5  ' : '5 '}</Text>
                 </View>
                 <View style ={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,{width:'100%',marginTop:5,alignItems:'center'}]}>
                 <Text style={[this.state.lang ==='AR'?styles.right:styles.left,{fontSize: this.normalize(14), color: '#343434',margin:5,fontFamily:'segoe'}]}>
                 {this.state.lang === "AR" ? ' ريال سعودى ' : ' SAR'}</Text>
                 <Text style={[this.state.lang ==='AR'?styles.right:styles.left,{fontSize: this.normalize(20), color: '#343434',margin:5,fontFamily:'segoe'}]}>
                 {this.state.lang === "AR" ? '5  ' : '5 '}</Text>
                 </View>
                </View>
                <View style={{flex:1}}/>
                <View style={{flex:1,alignItems:'center',paddingRight:5,}}>
                  <View style ={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,{alignItems:'center',justifyContent:'center'}]}>
                     <Text style={{flex:1,fontSize:this.normalize(16),fontFamily:'segoe',color:'#343C53',margin:8,marginEnd:'10%'}}>{this.state.lang ==='AR'?'الخـط':'Line'}</Text>
                    {this.renderRadio(1)}
                  </View>
                  <View style ={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,{alignItems:'center',justifyContent:'center',marginTop:3}]}>
                     <Text style={{flex:1,fontSize:this.normalize(16),fontFamily:'segoe',color:'#343C53',margin:8,marginEnd:'10%'}}>{this.state.lang ==='AR'?'الحساب':'Math'}</Text>
                    {this.renderRadio(2)}
                  </View>
                  <View style ={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,{alignItems:'center',justifyContent:'center',marginTop:3}]}>
                     <Text style={{flex:1,fontSize:this.normalize(16),fontFamily:'segoe',color:'#343C53',margin:8,marginEnd:'10%'}}>{this.state.lang ==='AR'?'الرسـم':'Drawing'}</Text>
                    {this.renderRadio(3)}
                  </View>
               
                </View>
              </View>
              <View style={{width:'95%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
               <View style={{flex:1,height:1,backgroundColor:'#118CB3',marginTop:5}}/>
               <Text style={{fontSize: this.normalize(20), textAlign: 'center', color: '#118CB3',fontFamily:'segoe',margin:7}}>
                 {this.state.lang === "AR" ? 'أختر نوع الاشتراك' : 'Choose subjects'}</Text>
               <View style={{flex:1,height:1,backgroundColor:'#118CB3',marginTop:5}}/>
               </View>
               <View style ={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,{width:'95%' ,alignItems:'center',justifyContent:'center',marginTop:10}]}>
                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                 <View style ={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,{width:'100%',alignItems:'center',}]}>
                 <Text style={[this.state.lang ==='AR'?styles.right:styles.left,{fontSize: this.normalize(14), color: '#343434',margin:0,fontFamily:'segoe'}]}>
                 {this.state.lang === "AR" ? ' ريال سعودى ' : ' SAR'}</Text>
                 <Text style={[this.state.lang ==='AR'?styles.right:styles.left,{fontSize: this.normalize(18), color: '#343434',margin:0,fontFamily:'segoe'}]}>
                 {this.state.lang === "AR" ? '30  ' : '30 '}</Text>
                 </View>
                 <Text style={[this.state.lang ==='AR'?styles.left:styles.right,{ width: '100%', fontSize: this.normalize(14), color: '#343434',fontFamily:'segoe'}]}>
                 {this.state.lang === "AR" ? '(المادة الواحدة/الطفل الواحد) ' : '(One material/One child)'}</Text>
                 <View style ={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,{width:'100%',marginTop:5,alignItems:'center'}]}>
                 <Text style={[this.state.lang ==='AR'?styles.right:styles.left,{fontSize: this.normalize(14), color: '#343434',margin:0,fontFamily:'segoe'}]}>
                 {this.state.lang === "AR" ? ' ريال سعودى ' : ' SAR'}</Text>
                 <Text style={[this.state.lang ==='AR'?styles.right:styles.left,{fontSize: this.normalize(18), color: '#343434',margin:0,fontFamily:'segoe'}]}>
                 {this.state.lang === "AR" ? '30  ' : '30 '}</Text>
                 </View>
                 <Text style={[this.state.lang ==='AR'?styles.left:styles.right,{ width: '100%', fontSize: this.normalize(14), color: '#343434',fontFamily:'segoe'}]}>
                 {this.state.lang === "AR" ? '(المادة الواحدة/الطفل الواحد)' : '(One material/One child)'}</Text>
                </View>
                {/* <View style={{flex:1}}/> */}
                <View style={{flex:1,alignItems:'center',justifyContent:'center',paddingRight:5,}}>
                <View style ={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,{alignItems:'center',justifyContent:'center',marginBottom:'12%'}]}>
                     <Text style={{flex:1,fontSize:this.normalize(16),fontFamily:'segoe',color:'#343C53',margin:5,marginEnd:'10%'}}>{this.state.lang ==='AR'?'سنـوى':'Annual'}</Text>
                    {this.renderRadio(4)}
                  </View>
                  <View style ={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,{alignItems:'center',justifyContent:'center',marginBottom:'7%'}]}>
                     <Text style={{flex:1,fontSize:this.normalize(16),fontFamily:'segoe',color:'#343C53',margin:5,marginEnd:'10%'}}>{this.state.lang ==='AR'?'نصف سنوى':'Bi annual'}</Text>
                    {this.renderRadio(5)}
                  </View>
                
                </View>
              </View>
              <View style={{width:'100%',alignItems:'center',justifyContent:'center',marginBottom:7,backgroundColor:'#F9F9F9'}}>
              <Text style={[this.state.lang == "AR"?styles.right:styles.left,{ width: '90%', fontSize: this.normalize(14),  color: '#343434',marginTop:10,fontFamily:'segoe'}]}>
                 {this.state.lang === "AR" ? 'ملحوظه' : 'Note'}</Text>
                 <Text style={{ width: '90%', fontSize: this.normalize(15),  color: '#343434',margin:0,fontFamily:'segoe'}}>
                 {this.state.lang === "AR" ? text_ar:text_an}</Text>
                 <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,{width:'90%' ,alignItems:'center',justifyContent:'center',}]}>
                 <Text style={[this.state.lang ==='AR'?styles.right:styles.left,{fontSize: this.normalize(15),  color: '#343434',fontFamily:'segoe',margin:0}]}>
                 {this.state.lang === "AR" ? 'على كل مادة أضافية':'For each additional item'}</Text>
                 <Text style={{flex:1,fontSize: this.normalize(18), textAlign:'center' ,color: '#343434',fontFamily:'segoe',borderColor:'#707070',borderWidth:1,margin:2}}>
                 {this.state.lang === "AR" ? '5 ريال سعودى':'5  SAR'}</Text>
                 <Text style={[this.state.lang ==='AR'?styles.right:styles.left,{fontSize: this.normalize(15),  color: '#343434',fontFamily:'segoe',margin:0}]}>
                 {this.state.lang === "AR" ? 'في مادة واحدة وتضاف قيمة':'In one article and add value'}</Text>
                 </View>
                 </View>
              </View>
             }
             

          </View>
         );
       }
    render(){
    return (
            <SafeAreaView style={styles.container} >
            <StatusBar backgroundColor="#118CB3" barStyle="light-content" />
            <Spinner
             visible={this.state.Processing}
             textContent={'Loading...'}
             textStyle={{color: '#FFF'}}
            />
            <View style ={{width:width,height:'1%',backgroundColor:'#118CB3',elevation:11}}/>
            {this.renderOption(this.state.lang)}
            {/* <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 18 }} > */}
              <View style={[styles.view,{flexDirection:'column'}]}>
             <View style={[styles.view,{marginTop:10}]}>
              <Text style={{width:'100%',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe',color:'#003F51'}}>
               {this.state.lang === 'AR' ? 'دفع الأشتراك' : 'Payment'}</Text>
             </View>
            <FlatList style={{width:'100%',height:'50%',marginTop:5}}
                    data={this.state.data}
                    numColumns={1}
                    renderItem={({item})=>this.renderItem(item)}
                    keyExtractor={(item, index) => index.toString()}
                    />

               <View style={{width:'100%',height:'30%',alignItems:'center',}}>    
               <View style={{width:width,height:1,backgroundColor:'#CDCBCB',marginTop:'1%'}}></View>  
              <View style ={[styles.view2 , this.state.lang === 'AR' ? styles.row : styles.row_reserve,{}]}>
                <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,{flex:1,backgroundColor:'#118CB3',borderRadius:12,height:50,
                alignItems:'center',}]}>
                <Image source={require('./../../img/bill.png')}
                  style={{  width: 30, height: 30, alignItems: 'center',margin:5}}/>
                  <View style={{height:'100%',justifyContent:'space-around',flex:1}}>
                  <Text style={{textAlign:'center',fontSize:this.normalize(17),color:'#fff',fontFamily:'segoe',fontWeight:'bold'}}> {this.state.lang === 'AR' ? '200':'200'}</Text>
                  <Text style={{textAlign:'center',fontSize:this.normalize(18),color:'#fff',fontFamily:'segoe',}}> {this.state.lang === 'AR' ? 'ريال سعودى' : 'SAR'}</Text>
                  </View>
                </View>
                <Text style={{textAlign:'center',fontSize:this.normalize(22),color:'#343434',margin:'7%',fontFamily:'segoe'}}> {this.state.lang === 'AR' ? 'قيـمة الاجـمالى' : 'Total value'}</Text>
              </View>
              <View style={[styles.view,{marginTop:3}]}>
            <Text style={{width:'100%',textAlign:'center',fontSize:this.normalize(16),color:'#343434',fontFamily:'segoe'}}>
               {this.state.lang === 'AR' ? 'أدفع عن طريق' : 'Pay by'}</Text>
             </View>
             <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,{marginTop:3,width:'90%',alignItems:'center',
            justifyContent:'space-evenly'}]}>
             <Image source={require('./../../img/paypal.png')}style={{  width: 40, height: 40, alignItems: 'center',margin:3}}/>
             <Image source={require('./../../img/visa.png')}style={{  width: 40, height: 40, alignItems: 'center',margin:3}}/>
             <Image source={require('./../../img/mastercard.png')} style={{  width: 40, height: 40, alignItems: 'center',margin:3}}/>
             <Image source={require('./../../img/american.png')} style={{  width: 40, height: 40, alignItems: 'center',margin:3}}/>
             </View>
             </View>      
            
             </View>
             {/* <View style={{width:'100%',alignItems:'center',justifyContent:'center',borderColor:'#CDCBCB',borderWidth:1,position:'absolute',bottom:0}}>      
              <View style ={[styles.view2 , this.state.lang === 'AR' ? styles.row : styles.row_reserve,{}]}>
                <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,{flex:1,backgroundColor:'#118CB3',borderRadius:12,height:50,
                alignItems:'center',}]}>
                <Image source={require('./../../img/bill.png')}
                  style={{  width: 30, height: 30, alignItems: 'center',margin:5}}/>
                  <View style={{height:'100%',justifyContent:'space-around',flex:1}}>
                  <Text style={{textAlign:'center',fontSize:this.normalize(17),color:'#fff',fontFamily:'segoe',fontWeight:'bold'}}> {this.state.lang === 'AR' ? '200':'200'}</Text>
                  <Text style={{textAlign:'center',fontSize:this.normalize(18),color:'#fff',fontFamily:'segoe',}}> {this.state.lang === 'AR' ? 'ريال سعودى' : 'SAR'}</Text>
                  </View>
                </View>
                <Text style={{textAlign:'center',fontSize:this.normalize(22),color:'#343434',margin:'7%',fontFamily:'segoe'}}> {this.state.lang === 'AR' ? 'قيـمة الاجـمالى' : 'Total value'}</Text>
              </View>
              <View style={[styles.view,{marginTop:5}]}>
            <Text style={{width:'100%',textAlign:'center',fontSize:this.normalize(16),color:'#343434',fontFamily:'segoe'}}>
               {this.state.lang === 'AR' ? 'أدفع عن طريق' : 'Pay by'}</Text>
             </View>
             <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,{marginTop:3,width:'90%',alignItems:'center',
            justifyContent:'center'}]}>
             <Image source={require('./../../img/paypal.png')}style={{  width: 40, height: 40, alignItems: 'center',margin:7}}/>
             <Image source={require('./../../img/visa.png')}style={{  width: 40, height: 40, alignItems: 'center',margin:7}}/>
             <Image source={require('./../../img/mastercard.png')} style={{  width: 40, height: 40, alignItems: 'center',margin:7}}/>
             <Image source={require('./../../img/american.png')} style={{  width: 40, height: 40, alignItems: 'center',margin:7}}/>
             </View>
             </View> */}
            {/* </ScrollView> */}
         </SafeAreaView>
        );
    }
}
export default Payment;
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
    view:{
       width:width,
       alignItems:'center',
       justifyContent:'center',
       
    },
    view2:{
      width:'93%',
      alignItems:'center',
      justifyContent:'center',
      
   },
    right:{
      textAlign:'right',
    },
    left:{
      textAlign:'left',
    },
    shadow: {
       shadowColor: '#000',
       shadowOffset: {
          width: 0,
          height: 6,
       },
       shadowOpacity: 0.05,
       shadowRadius: 5,
       elevation: 4,
    },
    shadow2: {
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 6,
      },
      shadowOpacity: 0.05,
       shadowRadius: 10,
   },
    container: {
       flex: 1,
       height:height,
       alignItems: 'center',
       backgroundColor: '#FFF',
    },
    clickedBg:{
      backgroundColor:'#F39322'
    },
    bg:{
      backgroundColor:'#FDFEFF'
    },
    clickedTxt:{
      color:'#FDFEFF'
    },
    txt:{
      color:'#F39322'
    },
    start:{
      alignItems:'flex-start'
    },end:{
      alignItems:'flex-end'
    },
 });

