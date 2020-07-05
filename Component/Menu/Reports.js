/* eslint-disable no-alert */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-trailing-spaces */
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
  RefreshControl,
  FlatList,
  ImageBackground,Platform,PixelRatio
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
const {width, height} = Dimensions.get('window');
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';



class Reports extends Component{
    constructor(props) {
        super(props);
        this.state = {
          lang: '',
          Processing: false,
          data:[],
          materialRate:[],
          reports:[],
          shadow1:0,
          shadow2:0,
          shadow3:7,
          isVisible:false,
          userData:{},
          userId:'',
          childId:'',
          childName:'',
          familyName:'',
          childImage:'',
          refreshing: false,
          materialID:'',
          subMaterialID:'',
          material_rate:'0.0',
          exerciseNumber:0 ,
          rate : 0,
          Copy : 0 ,
          goal : '',
          clickedId:'',
          clickedId2:'',
          materials:[],
          subMaterials:[],
          levelID:'',
          parent:0,
          len:0
        };
      }
      componentDidMount() {
        this._retrieveData();
      }
      _retrieveData = async () => {
        const { navigation } = this.props;
        const Id = navigation.getParam('child_ID', 'NO-ID');
        this.setState({childId:Id});
        const levelId = navigation.getParam('levelID', 'NO-ID');
         this.setState({levelID:levelId});
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
            this.getMaterial();
            this.getChildData();
            // this.getData(this.state.materialID);
            // this.getMaterialRate(this.state.materialID);
           } else {
            var data2 = {
              _id:'1',
              fullname:'أسم المستخدم',
            };
             this.setState({userData:data2});
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
               this.setState({ data });
               this.setState({childName:response.data.firstname});
               this.setState({familyName:response.data.surname});
               this.setState({childImage:response.data.imgPath});
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
                this.setState({Processing:false});
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
       renderOption(lang){
         if (lang === "AR"){
            return (
                <View style={[styles.shadow,{width:width,height:'8%',alignItems:'center',backgroundColor:'#118CB3',flexDirection:'row'}]}>
                   <TouchableOpacity
                   onPress={()=>this.props.navigation.navigate('ChildrenReports')}
                   style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                 <Icon name="chevron-left" size={18} color="#fff" style={{}} />
                </TouchableOpacity>
                  <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe',}}> التقارير</Text>
                 <TouchableOpacity
                 style={{width:'10%',height:20}} />
               </View>
            );
          } else {
            return (
              <View style={[styles.shadow,{width:width,height:'8%',alignItems:'center',backgroundColor:'#118CB3',flexDirection:'row-reverse'}]}>
                <TouchableOpacity
                onPress={()=>this.props.navigation.navigate('ChildrenReports')}
                style={{width:'10%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                <Icon name="chevron-right" size={18} color="#fff" style={{}} />
                </TouchableOpacity>
              <Text style={{width:'80%',color:'#fff',textAlign:'center',fontSize:this.normalize(22),fontFamily:'segoe',}}>Reports</Text>
             <TouchableOpacity
             style={{width:'10%',height:20}} />
           </View>
            );
          }
       }

       renderItem(item , index){
        return (
          <TouchableOpacity
           onPress={()=>{
             this.setState({exerciseNumber:item.exerciseID.exerciseNumber});
             this.setState({rate : item.rate});
             this.setState ({Copy : item.Coun });
             if (this.setState.lang === 'AR'){
              this.setState({goal  : item.exerciseID.targetAR});
             } else {
              this.setState({goal  : item.exerciseID.targetEN});
             }
            
             this.setState({isVisible:true})
            }}
          style={{width:width,height:50,justifyContent: 'center',alignItems: 'center',backgroundColor: '#E2FFD2'}}>
            <View style={[styles.viewItem , this.state.lang === 'AR' ? styles.row : styles.row_reserve]}>
               <Text style={{ width: '20%', fontSize: 14, textAlign: 'center', color: '#39393B',fontFamily:'segoe'}}>
                 {item.Coun}</Text>
                 <View style={{width:1,height:40,backgroundColor:'#E4E4E4'}}/>
                 <Text style={{ width: '20%', fontSize: 14, textAlign: 'center', color: '#39393B',fontFamily:'segoe'}}>
                 {item.rate}</Text>
                 <View style={{width:1,height:40,backgroundColor:'#E4E4E4'}}/>
                 <Text style={{ width: '20%', fontSize: 12, textAlign: 'center', color: '#39393B',fontFamily:'segoe'}}>
                 {this.state.lang === 'AR' ? 'التمرين' : 'Exsercise'}</Text>
                 <View style={{width:1,height:40,backgroundColor:'#E4E4E4'}}/>
                 <Text style={{ width: '32%', fontSize: 12, textAlign: 'center', color: '#39393B',fontFamily:'segoe',}}>
                 {this.state.lang === 'AR' ? item.exerciseID.targetAR.trim() : item.exerciseID.targetEN.trim()}</Text>
                 <View style={{width:1,height:40,backgroundColor:'#E4E4E4'}}/>
                 <Text style={{ width: '8%', fontSize: 14, textAlign: 'center', color: '#39393B',fontFamily:'segoe'}}>
                 {item.exerciseID.exerciseNumber}</Text>
             </View>
             <View style={{width:width,height:1,backgroundColor:'#E4E4E4'}}/>
          </TouchableOpacity>
        );
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

      getData(id){
        this.setState({Processing:true});
        NetInfo.fetch().then(state =>{
          if (state.isConnected){
            try {
              axios.get('http://165.22.83.141/api/user/getrate',{
                params: {
                  MaterialsID: id,
                  ChildreenID: this.state.childId,
              },
              }).then(response => {
                this.setState({Processing:false});
                this.setState({ refreshing: false });
                const data = response.data;
                this.setState({ reports : data });
                if (this.state.reports.length === 0){
                  if (this.state.lang === 'AR'){
                    alert('لا يوجد تمارين مكتمله لهذا الطفل');
                  } else {
                    alert('No complete Exercises for this child');
                  }
                }
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
      getMaterial(){
        this.setState({Processing:true});
         NetInfo.fetch().then(state =>{
          if (state.isConnected){
            try {
              axios.get('http://165.22.83.141/api/user/Materials').then(response => {
                this.setState({Processing:false});
                const data = response.data;
               this.setState({ materials:data });
              }).catch(function (error) {
                this.setState({Processing:false});
                 console.log(error);
              }).finally(function () {
                 // always executed
              });
           } catch (error) {
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
      getSubMaterial= (id , parent)=>{
        if(parent === 1){
          NetInfo.fetch().then(state =>{
            if (state.isConnected){
              try {
                axios.get('http://165.22.83.141/api/user/getsubMaterialByMaterial',{
                  params:{
                    parentID:id
                  }
                }).then(response => {
                  const data = response.data;
                 this.setState({ subMaterials:data });
                 this.setState({len:data.length})
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
        }
        
      }

      renderItemMaterial(item){
        if(this.state.clickedId === item._id){
          return (
            <TouchableOpacity
            onPress={()=>{
            this.setState({materialID:item._id})
            this.setState({clickedId:item._id})
            this.setState({parent:item.hasChildreen})
            if(item.hasChildreen === 1){
              this.getSubMaterial(item._id,item.hasChildreen)
            }else{
              this.getData(item._id);
              this.getMaterialRate(item._id);
            }
           
            }}
            style={[styles.shadow,{width:width/3,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',height:'85%',margin:3}]}>
             <Text style={{color:'#39393B',fontSize:18,textAlign:'center',margin:5,fontFamily:'segoe'}}>{this.state.lang === 'AR' ? item.titleAr : item.titleEN}</Text>
            </TouchableOpacity>
          );
        }else{
          return (
            <TouchableOpacity
            onPress={()=>{
              this.setState({materialID:item._id})
              this.setState({clickedId:item._id})
              this.setState({parent:item.hasChildreen})
              if(item.hasChildreen === 1){
                this.getSubMaterial(item._id,item.hasChildreen)
              }else{
                this.getData(item._id);
                this.getMaterialRate(item._id);
              }
            }}
            style={{width:width/3,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',height:'100%'}}>
             <Text style={{color:'#39393B',fontSize:18,textAlign:'center',margin:5,fontFamily:'segoe'}}>{this.state.lang === 'AR' ? item.titleAr : item.titleEN}</Text>
            </TouchableOpacity>
          );
        }
      }
      renderItemSubMaterial(item){
        if(this.state.clickedId2 === item._id){
          return (
            <View style ={[this.state.len >2 ?styles.Vwid:styles.sp_Vwid]}>
            <TouchableOpacity
            onPress={()=>{
            this.setState({subMaterialID:item._id})
            this.setState({clickedId2:item._id})
            this.getData(item._id);
            this.getMaterialRate(item._id);
            }}
            style={[styles.shadow,this.state.len > 2?styles.wid:styles.sp_wid,{backgroundColor:'#fff',alignItems:'center',justifyContent:'center',height:'85%',margin:3}]}>
             <Text style={{color:'#39393B',fontSize:this.normalize(15),textAlign:'center',margin:5,fontFamily:'segoe'}}>{this.state.lang === 'AR' ? item.titleAr : item.titleEN}</Text>
            </TouchableOpacity>
            </View>
          );
        }else{
          return (
            <View style ={this.state.len >2?styles.wid:styles.sp_Vwid,{margin:5}}>
            <TouchableOpacity
            onPress={()=>{
              this.setState({subMaterialID:item._id})
              this.setState({clickedId2:item._id})
              this.getData(item._id);
              this.getMaterialRate(item._id);
            }}
            style={[this.state.len > 2?styles.wid:styles.sp_wid,{backgroundColor:'#fff',alignItems:'center',justifyContent:'center',height:'100%'}]}>
             <Text style={{color:'#39393B',fontSize:this.normalize(15),textAlign:'center',margin:5,fontFamily:'segoe'}}>{this.state.lang === 'AR' ? item.titleAr : item.titleEN}</Text>
            </TouchableOpacity>
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
          textStyle={{color: '#FFF'}}
        />
          <View style ={{width:width,height:'1%',backgroundColor:'#118CB3',elevation:11}}/>
            {this.renderOption(this.state.lang)}
            {/* <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 18 }} > */}
            <View style={{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
             <View style={[styles.view,this.state.lang === 'AR' ? styles.row : styles.row_reserve]}>
             <View style={[this.state.lang === 'AR' ? styles.start : styles.end,{flex:1,padding:3}]}>
             <View style={{width:50,height:50,alignItems:'center',justifyContent:'center',borderRadius:50/2,margin:5,backgroundColor:'#fff'}}>
             <Icon name="star" size={18} color="#FFE000" style={{}} />
             <Text style={{color:'#FFE000',fontSize:this.normalize(12),textAlign:'center',fontWeight:'bold'}}>{this.state.rate}</Text>
           </View>
           </View>

            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
              {this.state.childImage ?
             <Image source={{uri:this.state.childImage }}
            style={[styles.shadow2,{width: 110, height: 110, alignItems: 'center',borderRadius: 110 / 2,margin:5}]}
             resizeMode="cover" />
             :
             <View style={[{alignItems:'center',justifyContent:'center'}]}>
             {this.state.gender === 1 ?
              <Image
           source={require('../../img/boy.png')}
            style={[styles.shadow2,{width: 110, height: 110, alignItems: 'center',margin:5}]}/>
             :
             <Image
            source={require('../../img/girl.png')}
            style={[styles.shadow2,{width: 110, height: 110, alignItems: 'center',margin:5}]}/>
             }
           </View>
             }
           </View>
           <View style={[{flex:1,alignItems:'center',height:80,justifyContent:'center'}]}>
              <Text style={{color:'#fff',textAlign:'center',fontSize:this.normalize(15),}}>{this.state.childName} {this.state.familyName}</Text>
              </View>
              </View>
         
         <View style={{width:width,height:35,alignItems:'center',justifyContent:'center',}}> 
         {this.state.lang === 'AR'?
           <FlatList style={{width:'100%',height:'100%'}}
           horizontal={true}
                      data={this.state.materials}
                      renderItem={({item,index})=>this.renderItemMaterial(item,index)}
                      keyExtractor={(item, index) => index.toString()}
                     inverted
                      />
         :
         <FlatList style={{width:'100%',height:'100%'}}
         horizontal={true}
                    data={this.state.materials}
                    renderItem={({item,index})=>this.renderItemMaterial(item,index)}
                    keyExtractor={(item, index) => index.toString()}
                    />
         }
       
        </View>
        {this.state.parent === 1 ?
         <View style={{width:'100%',height:35,alignItems:'center',justifyContent:'center',marginTop:3}}> 
        {this.state.lang === 'AR'?
       <FlatList style={{width:'100%',height:'100%'}}
         horizontal={true}
            data={this.state.subMaterials}
            renderItem={({item,index})=>this.renderItemSubMaterial(item,index)}
            keyExtractor={(item, index) => index.toString()}
            inverted
            />
        :
        <FlatList style={{width:'100%',height:'100%'}}
        horizontal={true}
                   data={this.state.subMaterials}
                   renderItem={({item,index})=>this.renderItemSubMaterial(item,index)}
                   keyExtractor={(item, index) => index.toString()}
                  />
        }
        
          </View>
        :
        <View style={{display:'none'}}></View>
        }
       
              <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,{width:width,marginTop:'5%',alignItems:'center',
               justifyContent:'center',height:40}]}>
               <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,{width:'20%',alignItems:'center',justifyContent:'center'}]}>
               <Text style={{color:'#003F51',textAlign:'center',fontSize:this.normalize(16),fontFamily:'segoe'}}>{this.state.lang=="AR"? 'النسخ':'Copies'}</Text>
               <Image source={require('./../../img/print2.png')} style={{width:15,height:15,margin:5}} resizeMode="contain" />
               </View>
               <View style={{width:1,height:40,backgroundColor:'#E4E4E4'}}/>
               <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,{width:'20%',alignItems:'center',justifyContent:'center'}]}>
               <Text style={{color:'#003F51',textAlign:'center',fontSize:this.normalize(16),fontFamily:'segoe'}}>{this.state.lang=="AR"? 'التقييم':'Rate'}</Text>
               <Image source={require('./../../img/star.png')} style={{width:15,height:15,margin:5}} resizeMode="contain" />
               </View>
               <View style={{width:1,height:40,backgroundColor:'#E4E4E4'}}/>
               <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,{width:'20%',alignItems:'center',justifyContent:'center'}]}>
               <Text style={{color:'#003F51',textAlign:'center',fontSize:this.normalize(16),fontFamily:'segoe'}}>{this.state.lang=="AR"? 'التمرين':'Exercise'}</Text>
               <Image source={require('./../../img/print_icon.png')} style={{width:15,height:15,margin:5}} resizeMode="contain" />
               </View>
               <View style={{width:1,height:40,backgroundColor:'#E4E4E4'}}/>
               <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,{width:'32%',alignItems:'center',justifyContent:'center'}]}>
               <Text style={{color:'#003F51',textAlign:'center',fontSize:this.normalize(16),fontFamily:'segoe'}}>{this.state.lang=="AR"? 'الهدف':'Goal'}</Text>
               <Image source={require('./../../img/goal.png')} style={{width:15,height:15,margin:5}} resizeMode="contain" />
               </View>
               <View style={{width:1,height:40,backgroundColor:'#E4E4E4'}}/>
               <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,{width:'8%',alignItems:'center',justifyContent:'center'}]}>
               <Image source={require('./../../img/count.png')} style={{width:20,height:20,margin:5}} resizeMode="contain" />
               </View>
              </View>
        <FlatList style={{width:'100%',marginTop:5,marginBottom:'3%'}}
        //  refreshControl={
        //   <RefreshControl
        //     colors={['#9Bd35A', '#689F38']}
        //     refreshing={this.state.refreshing}
        //     onRefresh={this.handleRefresh}
        //   />
        // }
                    data={this.state.reports}
                    numColumns={1}
                    renderItem={({item,index})=>this.renderItem(item,index)}
                    keyExtractor={(item, index) => index.toString()}
                    />


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
            <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,styles.view2]}>
               <Text style={{flex:1,color:'#003F51',textAlign:'center',fontSize:this.normalize(16), fontFamily:'segoe'}}>{this.state.exerciseNumber}</Text>
               <Text style={{color:'#003F51',textAlign:'center',fontSize:this.normalize(16),margin:5, fontFamily:'segoe'}}>{this.state.lang=="AR"? 'رقم التمرين':'Exercise number'}</Text>
               <Image source={require('./../../img/count.png')} style={{width:20,height:20,margin:5}} resizeMode="contain" />
            </View>
            <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,styles.view2]}>
               <Text style={{flex:1,color:'#343C53',textAlign:'center',fontSize:this.normalize(16), fontFamily:'segoe'}}>{this.state.goal}</Text>
               <Text style={{color:'#003F51',textAlign:'center',fontSize:this.normalize(16),margin:5, fontFamily:'segoe'}}>{this.state.lang=="AR"? 'الهدف':'Goal'}</Text>
               <Image source={require('./../../img/goal.png')} style={{width:20,height:20,margin:5}} resizeMode="contain" />
            </View>
            <View style={{width:'80%',height:1,backgroundColor:'#E4E4E4',marginTop:'5%'}}/>
            <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,{width:'90%',alignItems:'center',justifyContent:'center',marginTop:'3%'}]}>
               <Text style={{color:'#003F51',textAlign:'center',fontSize:this.normalize(16),margin:5, fontFamily:'segoe'}}>{this.state.lang=="AR"? 'التقييم':'Rate'}</Text>
               <Image source={require('./../../img/star.png')} style={{width:15,height:15,margin:3}} resizeMode="contain" />
               <View style={{width:'30%',height:1}}/>
               <Text style={{color:'#003F51',textAlign:'center',fontSize:this.normalize(16),margin:5, fontFamily:'segoe'}}>{this.state.lang=="AR"? 'النسـخ':'Copies'}</Text>
               <Image source={require('./../../img/print2.png')} style={{width:15,height:15,margin:3}} resizeMode="contain" />
            </View>
            <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,{width:'90%',height:50,alignItems:'center',justifyContent:'center',marginTop:'3%'}]}>
            <Text style={{color:'#FFE000',textAlign:'center',fontSize:this.normalize(18),width:'40%', fontFamily:'segoe'}}>{this.state.rate} /10</Text>
            <View style={{width:1,height:50,backgroundColor:'#E4E4E4'}}/>
            {this.state.lang === 'AR' ? 
            <Text style={{color:'#003F51',textAlign:'center',fontSize:this.normalize(14),width:'40%', fontFamily:'segoe'}}>نسخه رقم  {this.state.Copy}</Text>
            : 
           <Text style={{color:'#003F51',textAlign:'center',fontSize:this.normalize(14),width:'40%', fontFamily:'segoe'}}>Copy Number  {this.state.Copy}</Text>
            }
           
            </View>
            <View style={{width:'90%',height:1,backgroundColor:'#E4E4E4'}}/>
            {/* <View style={[this.state.lang === 'AR' ? styles.row : styles.row_reserve,{width:'90%',alignItems:'center',justifyContent:'center'}]}>
            <Text style={{color:'#FFE000',textAlign:'center',fontSize:16,width:'40%'}}>{this.state.lang=="AR"? '6/10':'6/10'}</Text>
            <View style={{width:1,height:50,backgroundColor:'#E4E4E4'}}/>
            <Text style={{color:'#003F51',textAlign:'center',fontSize:16,width:'40%'}}>{this.state.lang=="AR"? 'النسخه رقم 2':'Copy number 2'}</Text>
            </View> */}
         </View>
          </Modal>
            </View>
            {/* </ScrollView> */}

         </SafeAreaView>
        );
    }
}
export default Reports;
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
      width:width,
      backgroundColor:'#F39322',
      padding:4,
    },
    viewItem:{
      width:width,
      height:'100%',
      alignItems:'center',
      justifyContent:'center',
    },
    view2:{
       width:'97%',
       alignItems:'center',
     
    },
    shadow: {
       shadowColor: '#000',
       shadowOffset: {
          width: 0,
          height: 6,
       },
       shadowOpacity: 0.3,
       shadowRadius: 10,
       elevation: 10,
    },
    shadow2: {
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 6,
      },
   },
    container: {
       flex: 1,
       justifyContent: 'flex-start',
       alignItems: 'center',
       backgroundColor: '#FFF',
    },
    modal:{
      width:'100%',
      alignItems:'center',
      backgroundColor:'#fff',
      borderRadius:4,
      borderColor:'#707070',borderWidth:1,
    },
    marginStart:{
      marginStart:'15%',
    },
    marginEnd:{
      marginEnd:'15%',
    },
    start:{
      alignItems:'flex-start'
    },end:{
      alignItems:'flex-end'
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
 });
