import React from 'react';
import { View } from 'react-native';

import H1 from '../../components/h1';
import Header from '../../components/header';
import Text from '../../components/text';
import ClickableListItem from '../../components/clickable-list-item';
import AlertStrip from '../../components/alert-strip';


export default class SelectProfileScene extends React.Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <Header paypointLogo />
        
        <View style={{flex: 1, padding: 25}}>
          <H1 
            style={{
              marginHorizontal: -8,
              marginBottom: 20,
              marginTop: 30, 
              textAlign: 'center',
            }} 
            underline
          >
            SELECT A ROLE
          </H1>

          <Text center title style={{lineHeight: 22}}>
            Which duties would you like to perform? 
          </Text>

          <ClickableListItem>
            <View style={{height: 105, padding: 16, justifyContent: 'space-evenly'}}>
              <Text semiBold big black>Agent</Text>
              <Text mid grey>Sell airtime, send money, pay bills, check reports, and more.</Text>
            </View>
          </ClickableListItem>

          <ClickableListItem>
            <View style={{height: 105, padding: 16, justifyContent: 'space-evenly'}}>
              <Text semiBold big black>FIP</Text>
              <Text mid grey>Onboard agents to the Quickteller Paypoint platform, monitor and support onboarded agents, and more.</Text>
            </View>
          </ClickableListItem>

          <AlertStrip variant="information" content={"You could log out to change your role at anytime."} />
        </View>
      </View>
    );
  }
}
