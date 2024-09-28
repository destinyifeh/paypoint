import React from 'react';
import {InteractionManager} from 'react-native';
import BaseScene from '../../../base-scene';
import Routes from './routes';

export default class ServicesScene extends BaseScene {
  screen_name = 'Services';
  persistenceKey = 'servicesScenePersistenceKey';

  state = {};

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        animationsDone: true,
      });
    });
  }

  render() {
    return <Routes />;
  }
}
