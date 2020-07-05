import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import Home from './Component/Home/Home';
import Children from './Component/Home/Children';
import ChildDetail from './Component/Home/ChildDetails';
import ExercisePage from './Component/Home/ExercisePage';

const HomeTabs = createStackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    Children: {
      screen: Children,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    ChildDetail: {
      screen: ChildDetail,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
    ExercisePage: {
      screen: ExercisePage,
      navigationOptions: ({navigation}) => ({
        header: null,
      }),
    },
  },
  {
    initialRouteName: 'Home',
  },
);

const AppContainer = createAppContainer(HomeTabs);

export default AppContainer;
