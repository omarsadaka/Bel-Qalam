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
  RefreshControl,
  FlatList,
  ScrollView,Platform, PixelRatio,
  ImageBackground,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
const {width, height} = Dimensions.get('window');
import Modal from 'react-native-modal';
// import Modal from 'react-native-modalbox';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';
import Icon from 'react-native-vector-icons/FontAwesome';


class ChildDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: '',
      Processing: false,
      data:[],
      data2:[],
      materialRate:[],
      exerciseData:{},
      childData:{},
      subMaterials:[],
      shadow1:0,
      shadow2:0,
      shadow3:7,
      isVisible1:false,
      isVisible2:false,
      childId:'',
      userData:[],
      userId:'',
      materialID:'',
      subMaterialID:'',
      childName:'',
      familyName:'',
      levelID:'',
      childImage:'',
      refreshing: false,
      ind:0,
      excNumber:0,
      goal:'',
      desc:'',
      selectedPrinter: null,
      pdfFile:'',
      exerciseID:'',
      status:0,
      rate :'0.0',
      clickedId:'',
      gender:0,
      indx:0,
      parent:0,
      material:{},
      len:0
      };
  }
  componentDidMount() {
    this._retrieveData();
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        if(this.state.parent ===1){
          this.getData(this.state.subMaterialID);
          this.getMaterialRate(this.state.subMaterialID);
        }else{
          this.getData(this.state.materialID);
          this.getMaterialRate(this.state.materialID);
        }
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }
  _retrieveData = async () => {
    const { navigation } = this.props;
    const Id = navigation.getParam('child_ID', 'NO-ID');
    this.setState({childId:Id});
    const materialID = navigation.getParam('materialID', 'NO-ID');
    this.setState({materialID});
    const parent = navigation.getParam('parent', 'NO-ID');
    if(parent){
      this.setState({parent});
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
        this.getChildData();
       } else {
        var data2 = {
          _id:'1',
          fullname:'أسم المستخدم',
        };
         this.setState({userData:data2});
       }
    } catch (error) {}
  };

  getData(id){
    this.setState({Processing:true})
    NetInfo.fetch().then(state =>{
      if (state.isConnected){
        try {
          axios.get('http://165.22.83.141/api/user/getExerciseByMaterial',{
            params: {
              materialsID:id,
              educationalLevelID: this.state.levelID,
          },
          }).then(response => {
            this.setState({Processing:false})
            this.setState({ refreshing: false });
            var data = response.data;
            if (data.length === 0){
              this.setState({ data : [] });
              if (this.state.lang === 'AR'){
                alert('لا يوجد تمارين لهذة الفئه');
              } else {
                alert('No Exercises for this category');
              }
              return
            }
            // if(data.length > 4){
            //   this.setState({init:1})
            // }else{
            //   this.setState({init:0})
            // }
            
            try {
          axios.get('http://165.22.83.141/api/user/getrate',{
            params: {
              MaterialsID: id,
              ChildreenID: this.state.childId,
          },
          }).then(response2 => {
            const data2 = response2.data;
            if (data2.length === 0){
              data[0].orderStatus = 3;
              data.forEach((item , i) => {
               item.rate = 0;
               if (item.orderStatus === 3 && i===0){
                item.orderStatus = 3;
               }
              });
              this.setState({ data : data });
            } else {
              data.forEach((exercise , e) => {
                exercise.rate = 0;
                exercise.count =0
                
                // if (exercise.orderStatus !== 3 && exercise.orderStatus !== 2){
                //   exercise.orderStatus = 1;
                // }
                // if(exercise.orderStatus === 3){
                //   this.setState({indx:e})
                //   // alert(this.state.indx)
                // }
                exercise.found = false;
                data2.forEach((rate , r) => {
                  if (rate.exerciseID._id === exercise._id && rate.rate!==0 ){
                    exercise.found = true;
                    exercise.rate = rate.rate;
                    exercise.orderStatus = rate.orderStatus;
                    exercise.count = rate.Coun
                  }
                  if ( e === data.length -1 && r ===  data2.length-1  ){
                    var foundNext = false;
                    data.forEach((element , i) => {
                      if (element.orderStatus != 2 &&  foundNext == false){
                        element.orderStatus = 3;
                        foundNext = true;
                        this.setState({indx:i})
                        if(i > 4){
                          this.setState({init:3})
                        }else{
                          this.setState({init:0})
                        }
                        this.setState({ data : data });
                      }

                    });
                    
                    
                  }
                });



                
              });
            }
           if(this.state.indx >=3){
            this.flatList.scrollToIndex(this.state.indx)
           }
           
          }).catch(function (error) {
             console.log(error);
          }).finally(function () {
             // always executed
          });
       } catch (error) {
          console.log(error);
       }
            this.getRate(this.state.materialID , data);
          }).catch(function (error) {
            this.setState({Processing:false})
            this.setState({ refreshing: false });
             console.log(error);
          }).finally(function () {
             // always executed
          });
       } catch (error) {
        this.setState({Processing:false})
        this.setState({ refreshing: false });
          console.log(error);
       }
      } else {
        this.setState({Processing:false})
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

  getChildData(){
    NetInfo.fetch().then(state =>{
      if (state.isConnected){
        try {
          axios.get('http://165.22.83.141/api/user/userChildreen',{
            params: {
              id:this.state.childId,
          },
          }).then(response => {
            const data = response.data;
           this.setState({childName:response.data.firstname});
           this.setState({familyName:response.data.surname});
           this.setState({childAge:response.data.childAgeID});
           this.setState({levelID:response.data.educationalLevelID});
           this.setState({childImage:response.data.imgPath});
           this.setState({gender:response.data.gender})
           this.getSubMaterial();
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

  getSubMaterial= async()=>{
    
    if(this.state.parent === 1){
      NetInfo.fetch().then(state =>{
        if (state.isConnected){
          try {
            axios.get('http://165.22.83.141/api/user/getsubMaterialByMaterial',{
              params:{
                parentID:this.state.materialID
              }
            }).then(response => {
              const data = response.data;
             this.setState({ subMaterials:data });
             this.setState({clickedId:data[0]._id})
             this.setState({subMaterialID:data[0]._id})
             this.setState({len:data.length})
             this.getData(data[0]._id);
             this.getMaterialRate(data[0]._id)
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
      // alert('no sub')
      const val = await AsyncStorage.getItem('Material');
      if(val){
        const material = JSON.parse(val);
        this.setState({material})
      }
     this.getData(this.state.materialID)
     this.getMaterialRate(this.state.materialID);
    }
   
  }

  handleRefresh = () => {
    this.setState({
      refreshing: true,
    }, () => {
      if(this.state.parent ===1){
        this.getData(this.state.subMaterialID);
        this.getMaterialRate(this.state.subMaterialID);
      }else{
        this.getData(this.state.materialID);
        this.getMaterialRate(this.state.materialID);
      }
     
    });
  }

  editState =(id)=>{
    this.setState({Processing:true});
    NetInfo.fetch().then(state =>{
      if (state.isConnected){
        try {
          axios.put('http://165.22.83.141/api/user/Exercise/' + id,{
            orderStatus :1,
          }).then(response => {
            if (response.data){
              this.setState({Processing:false});
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


  getMaterialRate(id){
    NetInfo.fetch().then(state =>{
      if (state.isConnected){
        try {
          axios.get('http://165.22.83.141/api/user/getMaterialRate',{
            params: {
              MaterialsID:id,
              ChildreenID: this.state.childId,
          },
          }).then(response => {
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
  }

  getItemLayout = (data, index) => (
    { length: 150, offset: 150 * index, index }
  )

  renderOption(lang){
    if (lang === 'AR'){
      return (
          <View style={[styles.shadow,{width:width,height:'8%',alignItems:'center',backgroundColor:'#118CB3',flexDirection:'row'}]}>
             <TouchableOpacity
             onPress={()=>this.props.navigation.navigate('Children')}
             style={{width:'10%',height:'100%',justifyContent:'center',alignItems:'center'}}>
           <Icon name="chevron-left" size={18} color="#fff" style={{}} />
          </TouchableOpacity>
            <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}>صفحه الطفل</Text>
           <TouchableOpacity
           onPress={() => this.props.navigation.navigate('MenuTabs')}
           style={{width:'10%',height:'100%',justifyContent:'center',alignItems:'center'}}>
             <Icon name="ellipsis-v" size={25} color="#fff" style={{}} />
          </TouchableOpacity>
         </View>
      );
    } else {
      return (
        <View style={[styles.shadow,{width:width,height:'8%',alignItems:'center',backgroundColor:'#118CB3',flexDirection:'row-reverse'}]}>
           <TouchableOpacity
           onPress={()=>this.props.navigation.navigate('Children')}
           style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center'}}>
           <Icon name="chevron-right" size={18} color="#fff" style={{}} />
          </TouchableOpacity>
        <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe'}}>Child Page</Text>
       <TouchableOpacity
       onPress={() => this.props.navigation.navigate('MenuTabs')}
       style={{width:'5%',height:'100%',alignItems:'center',justifyContent:'center'}}>
         <Icon name="ellipsis-v" size={25} color="#fff" style={{}} />
      </TouchableOpacity>
     </View>
      );
    }
   }
   
   renderItem(item,index){
    return (
      <TouchableOpacity
      onPress={()=>{
        // this.editState(item._id);
        let materialID = '';
        if(this.state.parent === 1){
          materialID = this.state.subMaterialID
        }else{
          materialID = this.state.materialID
        }
        let ID = '';
        if (this.state.data.length > index + 1 && item.orderStatus === 3 ){
          ID = this.state.data[index + 1]._id;
        }
        if (item.orderStatus !== 1){
          this.props.navigation.navigate('ExercisePage',{exerciseID:item._id,child_ID:this.state.childId,material_ID:materialID,nextID:ID,
          exerciseRate:item.rate,status:item.orderStatus,count:item.count});
        } else {
         this.setState({isVisible1:true});
        }
      }}
      style={[item.orderStatus === 2 ? styles.color2 : item.orderStatus === 3 ? styles.color3 : styles.color,{width:'100%',height:height/8,justifyContent: 'center',alignItems: 'center',
       borderRadius:12,marginBottom:7}]}>
        <View style={[styles.viewItem , this.state.lang === 'AR' ? styles.row : styles.row_reserve]}>
          {item.rate !== 0 ?
          <View style={{width:'20%',alignItems:'center',}}>
          <Text style={{width:'100%',color:'#003F51',textAlign:'center',fontSize:this.normalize(14),fontFamily:'segoe'}}>{this.state.lang === 'AR' ? 'التقيـيم' : 'Rate'}</Text>
          <View style={[this.state.lang === 'AR' ? styles.row : styles.row ,{width:'100%',alignItems:'center',}]}>
          <Image source={require('./../../img/star.png')} style={[this.state.lang==='AR'?styles.end:styles.start,{width:15,height:15,}]} resizeMode="contain" />
          <Text style={{flex:1,color:'#FFE000',textAlign:'center',fontSize:this.normalize(13),fontWeight:'bold'}}>{item.rate}/10</Text>
          </View>
          <View style={[this.state.lang === 'AR' ? styles.row : styles.row ,{width:'100%',alignItems:'center',}]}>
          <Image source={require('./../../img/g_print.png')} style={[this.state.lang==='AR'?styles.end:styles.start,{width:15,height:15,}]} resizeMode="contain" />
          <Text style={{flex:1,color:'#087A00',textAlign:'center',fontSize:this.normalize(13),fontWeight:'bold'}}>{item.count}</Text>
          </View>
          </View>
          :
          <View style={{width:'20%',alignItems:'center',justifyContent:'center'}}>
            {item.orderStatus === 3 ? 
             <Image source={require('./../../img/o_print.png')} style={{width:25,height:25,position:'absolute',bottom:0,}} resizeMode="contain" />
            :
            <Image source={require('./../../img/pr.png')} style={{width:25,height:25,position:'absolute',bottom:0}} resizeMode="contain" />
            }
          
           </View>
          }
           <View style={{width:'80%',alignItems:'center',justifyContent:'center'}}>
           <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve ,{width:'100%',alignItems:'center'}]}>
           <Text style={{width:'65%',color:'#39393B',textAlign:'center',fontSize:this.normalize(14),backgroundColor:'#FFF',fontFamily:'segoe',padding:2}}>{item.exerciseNumber}</Text>
           <Text style={[this.state.lang === 'AR' ? styles.right : styles.left,{flex:1,color:'#003F51',fontSize:this.normalize(14),margin:3,fontFamily:'segoe'}]}>{this.state.lang === 'AR' ? 'رقم التمرين' : 'Exe Number'}</Text>
           <Image source={require('./../../img/num.png')} style={[this.state.lang==='AR'?styles.start:styles.end,{width:20,height:20,}]} resizeMode="contain" />
           </View>
           <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve ,{width:'100%',marginTop:3,alignItems:'center'}]}>
          <Text style={{width:'65%',color:'#39393B',textAlign:'center',fontSize:this.normalize(16),backgroundColor:'#FFF',fontFamily:'segoe',padding:2}}>
            {this.state.lang === 'AR' ? item.targetAR.trim() : item.targetEN.trim()}</Text>
           <Text style={[this.state.lang === 'AR' ? styles.right : styles.left,{flex:1,color:'#003F51',fontSize:this.normalize(14),margin:3,fontFamily:'segoe'}]}>{this.state.lang === 'AR' ? 'الهدف' : 'Gool'}</Text>
           <Image source={require('./../../img/goal.png')} style={[this.state.lang==='AR'?styles.start:styles.end,{width:20,height:20,}]} resizeMode="contain" />
           </View>
           </View>
         </View>
      </TouchableOpacity>
    );
  }

  renderItemMaterial(item){
    if(this.state.clickedId === item._id){
      return (
        <View style ={[this.state.len >2 ?styles.Vwid:styles.sp_Vwid]}>
        <TouchableOpacity
        onPress={()=>{
        this.setState({subMaterialID:item._id})
        this.setState({materialID:item.parentID})
        this.setState({clickedId:item._id})
        this.getData(item._id);
        this.getMaterialRate(item._id);
        }}
        style={[styles.shadow,this.state.len > 2?styles.wid:styles.sp_wid,{backgroundColor:'#fff',alignItems:'center',justifyContent:'center',height:'85%',margin:3}]}>
         <Text style={{color:'#39393B',fontSize:this.normalize(18),textAlign:'center',margin:5,fontFamily:'segoe'}}>{this.state.lang === 'AR' ? item.titleAr : item.titleEN}</Text>
        </TouchableOpacity>
        </View>
      );
    }else{
      return (
        <View style ={this.state.len >2?styles.wid:styles.sp_Vwid,{margin:5}}>
        <TouchableOpacity
        onPress={()=>{
          this.setState({subMaterialID:item._id})
          this.setState({clickedId:item._id})
          this.getData(item._id);
          this.getMaterialRate(item._id);
        }}
        style={[this.state.len > 2?styles.wid:styles.sp_wid,{backgroundColor:'#fff',alignItems:'center',justifyContent:'center',height:'100%'}]}>
         <Text style={{color:'#39393B',fontSize:this.normalize(18),textAlign:'center',margin:5,fontFamily:'segoe'}}>{this.state.lang === 'AR' ? item.titleAr : item.titleEN}</Text>
        </TouchableOpacity>
        </View>
      );
    }
  }
  render() {
    const textAR = 'هناك تمرين سابق لا يكتمل بحسب مراحل ترتيب التمارين الخاصه بالطفل';
    const texEN = 'There is a previous exercise that is incomplete according to the stages of arranging the exercises for the child';
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
        <View style={[styles.view,this.state.lang === 'AR' ? styles.row : styles.row_reserve,{}]}>
       <View style={[this.state.lang === 'AR' ? styles.start : styles.end,{flex:1,padding:3}]}>
        <View style={{width:50,height:50,alignItems:'center',borderRadius:50/2,margin:5,backgroundColor:'#fff',justifyContent:'center'}}>
        <Icon name="star" size={18} color="#FFE000" style={{}} />
        <Text style={{color:'#FFE000',fontSize:this.normalize(14),fontWeight:'bold',}}>{this.state.rate}</Text>
        </View>
        </View>
        
        {this.state.childImage ?
        <View style={[{flex:1,alignItems:'center'}]}>
         <Image source={{uri:this.state.childImage }}
         style={[styles.shadow2,{width: 100, height: 100, alignItems: 'center',borderRadius: 100 / 2,margin:5}]}
         resizeMode="cover" />
         </View>
        :
        <View style={[{ flex:1,alignItems: 'center',justifyContent:'center'}]}>
        {this.state.gender === 1 ?
         <Image
      source={require('../../img/boy.png')}
       style={[styles.shadow2,{width: 100, height: 100, alignItems: 'center' ,margin:5}]}/>
        :
        <Image
       source={require('../../img/girl.png')}
       style={[styles.shadow2,{width: 100, height: 100, alignItems: 'center' ,margin:5}]}/>
        }
      </View>
       
        }
        <View style={{flex:1,alignItems:'center',}}>
        <Text style={{color:'#fff',textAlign:'center',fontSize:this.normalize(20),textAlignVertical:'top',fontFamily:'segoe',marginTop:'3%'}}>
          {this.state.childName} {this.state.familyName}</Text>
        </View>
        </View>
       {this.state.parent === 1 ?
        <View style={{width:width,height:45,alignItems:'center',justifyContent:'center'}}> 
        {this.state.lang === 'AR'?
         <FlatList style={{width:'100%',height:'100%'}}
         horizontal={true}
                    data={this.state.subMaterials}
                    renderItem={({item,index})=>this.renderItemMaterial(item,index)}
                    keyExtractor={(item, index) => index.toString()}
                    inverted
                    />
        :
        <FlatList style={{width:'100%',height:'100%'}}
        horizontal={true}
                   data={this.state.subMaterials}
                   renderItem={({item,index})=>this.renderItemMaterial(item,index)}
                   keyExtractor={(item, index) => index.toString()}
                   />
        }
       
       </View>
       :
       <View style={{width:width,height:35,alignItems:'center',justifyContent:'center'}}> 
       <TouchableOpacity
       onPress={() => {
        this.getData(this.state.materialID);
       }}
       style={[styles.shadow,{width:'97%',height:'100%',backgroundColor:'#fff',margin:5}]}>
       <Text style={[{width:'100%',height:'100%',color:'#39393B',fontSize:this.normalize(18),fontFamily:'segoe',textAlign:'center',textAlignVertical:'center'}]}>
       {this.state.lang ==='AR'? this.state.material.titleAr:this.state.material.titleEN}
       </Text>
       </TouchableOpacity>
       </View>
       }
       
        <FlatList style={{width:'96%',marginTop:10,marginBottom:'3%'}}
         refreshControl={
          <RefreshControl
            colors={['#9Bd35A', '#689F38']}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
          />
        }
                    data={this.state.data}
                    numColumns={1}
                    ref={(ref) => { this.flatList = ref}}
                    renderItem={({item,index})=>this.renderItem(item,index)}
                    keyExtractor={(item, index) => index.toString()}
                    getItemLayout={this.getItemLayout}
                    initialScrollIndex={this.state.init}
                    initialNumToRender={2}
                 />
          <Modal
             isVisible={this.state.isVisible1}
             onBackdropPress={() => this.setState({ isVisible1: false })}
             animationType = {'slide'}
             >
          <View style={[styles.modal,{height:'35%'}]}>
          <Text style={{width:'77%',color:'#003F51',textAlign:'center',fontSize:this.normalize(20),marginTop:10,fontFamily:'segoe'}}>
            {this.state.lang === 'AR' ? 'عذرا' : 'Sorry'}</Text>
            <Text style={{width:'60%',color:'#003F51',textAlign:'center',fontSize:this.normalize(18),marginTop:10,fontFamily:'segoe'}}>
            {this.state.lang === 'AR' ? textAR : texEN}</Text>
            <TouchableOpacity
              onPress={() => this.setState({ isVisible1: false })}
             style={[styles.button,styles.shadow]}>
              <Text style={{width: '100%',height:'100%',textAlign:'center',color:'#FFF',fontSize:this.normalize(20),textAlignVertical:'center',fontFamily:'segoe'}}>
                {this.state.lang === 'AR' ? 'حسنا' : 'Ok'}
              </Text>
            </TouchableOpacity>
         </View>
          </Modal>

      </SafeAreaView>
    );
  }
}
export default ChildDetails;
const styles = StyleSheet.create({
  container: {
    width: width,
    flex: 1,
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: '#FFF',
  },
  view:{
    width:width,
    backgroundColor:'#F39322',
    padding:3,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
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
  right:{
    textAlign:'right',
  },
  left:{
    textAlign:'left',
  },
  button:{
    width:'30%',
      height:30,
      backgroundColor:'#003F51',
      borderRadius:20,
      alignItems:'center',
      justifyContent:'center',
      marginTop:20,
  },
  modal:{
    width:'100%',
    alignItems:'center',
    backgroundColor:'#fff',
    borderRadius:4,
    justifyContent:'center',
    borderColor:'#707070',
    borderWidth:1,
  },
  viewContainer:{
    width:'95%',
    backgroundColor:'#fff',
    borderRadius:15,
    borderWidth:1,
    alignItems:'center',
    borderColor:'#EBEBEB',
    elevation:5,
    height:'75%',
  },
  color:{
    backgroundColor: '#F1F1F1',
  },
  color2:{
    backgroundColor: '#E2FFD270',
  },
  color3:{
    backgroundColor: '#FFE5C5',
    borderColor:'#F3932270',borderWidth:3,elevation:2
  },
  marginStart:{
    marginStart:'20%',
  },
  marginEnd:{
    marginEnd:'20%',
  },
  wid:{
    width:width/3
  },
  sp_wid:{
    width:width/2,
  },
  Vwid:{

  },
  sp_Vwid:{
    width:width/2,
  },
 start:{
   marginEnd:7
 },
 end:{
   marginStart:7,
   alignItems:'flex-end'
 }
  
});
