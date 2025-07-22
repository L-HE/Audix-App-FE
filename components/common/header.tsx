// components/common/header.tsx
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const Header: React.FC = () => (
  <View style={styles.header}>
    <Image
      source={require('../../assets/images/AudixLogoNavy.png')}
      style={styles.logo}
      resizeMode="contain"
    />
  </View>
);

export default Header;

const styles = StyleSheet.create({
  header: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 220,
    height: 220,
  },
});
