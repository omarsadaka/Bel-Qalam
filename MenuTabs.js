/* eslint-disable no-undef */
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Menu from './Component/Menu/Menu';
import ChildProfile from './Component/Menu/ChildProfile';
import UpdateChildProfile from './Component/Menu/UpdateChlidProfile';
import FatherProfile from './Component/Menu/Fatherprofile';
import Reports from './Component/Menu/Reports';
import Payment from './Component/Menu/Payment';
import ContactUs from './Component/Menu/ContactUs';
import Important from './Component/Menu/Important';
import Copyrights from './Component/Menu/Copyrights';
import ChangeLanguage from './Component/Menu/ChangeLanguage';
import printCertificate from './Component/Menu/PrintCertificate';
import ChildrenReports from './Component/Menu/ChildrenReports';

const MenuTabs = createStackNavigator(
  {
    Menu: {
      screen: Menu,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    ChildProfile: {
      screen: ChildProfile,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    UpdateChildProfile: {
      screen: UpdateChildProfile,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    FatherProfile: {
      screen: FatherProfile,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    Reports: {
      screen: Reports,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    printCertificate: {
      screen: printCertificate,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    Payment: {
      screen: Payment,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    ChangeLanguage: {
      screen: ChangeLanguage,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    ContactUs: {
      screen: ContactUs,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    Important: {
      screen: Important,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    Copyrights: {
      screen: Copyrights,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    ChildrenReports: {
      screen: ChildrenReports,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
  },
  {
    initialRouteName: 'Menu',
  },
);

const AppContainer = createAppContainer(MenuTabs);

export default AppContainer;
