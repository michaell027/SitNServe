 import React, { Component } from 'react';
import { Alert, Button, Linking, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';


interface State {
  hasCameraPermission: boolean | null;
}

class ScanScreen extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      hasCameraPermission: null,
    };
  }

  async componentDidMount() {
    const hasPermission: boolean = await RNCamera.checkVideoAuthorizationStatus();
    this.setState({ hasCameraPermission: hasPermission });
  }

  requestCameraPermission = async () => {
    try {
      const granted: boolean = await RNCamera.requestCameraPermission();
      this.setState({ hasCameraPermission: granted });
      if (!granted) {
        Alert.alert('Permission not granted', 'Cannot use the QR scanner without camera permissions.');
      }
    } catch (err) {
      console.error('Failed to request camera permission', err);
    }
  };

  onSuccess = (e: { data: string }) => {
    Linking.openURL(e.data).catch(err => console.error('An error occured', err));
  };

  render() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Checking camera permissions...</Text>;
    }

    if (hasCameraPermission === false) {
      return (
        <Button title="Request Camera Permission" onPress={this.requestCameraPermission} />
      );
    }

    return (
      <QRCodeScanner
        onRead={this.onSuccess}
        flashMode={RNCamera.Constants.FlashMode.torch}
        topContent={
          <Text style={styles.centerText}>
            Go to <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on your computer and scan the QR code.
          </Text>
        }
        bottomContent={
          <TouchableOpacity style={styles.buttonTouchable}>
            <Text style={styles.buttonText}>OK. Got it!</Text>
          </TouchableOpacity>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  }
});

export default ScanScreen;
