import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {InteractionManager} from 'react-native';
import ActivityIndicator from '../../../../../../components/activity-indicator';
import HomeTab from './home-tab';

export default class HomeScreen extends React.Component {
  state = {};

  persistenceKey = 'defaultScenePersistenceKey';

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
    });
  }

  persistNavigationState = async navState => {
    try {
      await AsyncStorage.setItem(this.persistenceKey, JSON.stringify(navState));
    } catch (err) {
      // handle the error according to your needs
    }
  };

  loadNavigationState = async () => {
    const jsonString = await AsyncStorage.getItem(this.persistenceKey);
    return JSON.parse(jsonString);
  };

  render() {
    if (!this.state.animationsDone) {
      return <ActivityIndicator />;
    }

    return <HomeTab navigation={this.props.navigation} />;
    // return <Routes
    //   loadNavigationState={this.loadNavigationState}
    //   persistNavigationState={this.persistNavigationState}
    //   renderLoadingExperimental={() => <ActivityIndicator />}
    // />
  }
}
