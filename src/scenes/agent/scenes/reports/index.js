import React from 'react';
import {InteractionManager} from 'react-native';
import Routes from './routes';

export default class ReportsScene extends React.Component {
  state = {};

  persistenceKey = 'reportsScenePersistenceKey';

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
