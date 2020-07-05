import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Splash from './Component/Splash';
import Language from './Component/Language';
import Login from './Component/Login';
import Rigister from './Component/Rigister';
import HomeTabs from './HomeTabs';
import MenuTabs from './MenuTabs';
import LoginEn from './Component/Login_En'
import RegisterEn from './Component/Register_En'

const MyNavigate = createStackNavigator(
  {
    Splash: {
      screen: Splash,
      navigationOptions:{
        header: null,
      },
    },
    Language: {
      screen: Language,
      navigationOptions: {
        header: null,
      },
    },
    Login: {
      screen: Login,
      navigationOptions: {
        header: null,
      },
    },
    LoginEn: {
      screen: LoginEn,
      navigationOptions: {
        header: null,
      },
    },
    Rigister: {
      screen: Rigister,
      navigationOptions: {
        header: null,
      },
    },
    RegisterEn: {
      screen: RegisterEn,
      navigationOptions: {
        header: null,
      },
    },
    HomeTabs: {
      screen: HomeTabs,
      navigationOptions:{
        header: null,
      },
    },
    MenuTabs: {
      screen: MenuTabs,
      navigationOptions:{
        header: null,
      },
    },
  },
  {
    initialRouteName: 'Splash',
  },
);

const AppContainer = createAppContainer(MyNavigate);

export default AppContainer;
