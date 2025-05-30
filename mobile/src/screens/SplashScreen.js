import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { STRINGS, ROUTES } from '../constants/strings';
import imagesPath from '../constants/images';
import COLORS from '../constants/colors';
import { getData } from '../utils/utils';

export default function SplashScreen({ navigation, route }) {
  const { MISC } = STRINGS;

  useEffect(() => {
    const timer = setTimeout(async () => {
      const deepLinkHandledRef = route?.params?.deepLinkHandledRef || false;

      // ✅ Skip splash logic if deep link navigation already occurred
      if (deepLinkHandledRef?.current === true) {
        console.log('🔗 Skipping splash navigation due to deep link');
        return;
      }

      const isFirstTime = await getData(MISC.isFirstTime);
      console.log('isFirstTime', isFirstTime);
      if (!!isFirstTime) {
        navigation.replace(ROUTES.login);
      } else {
        navigation.replace(ROUTES.Onboarding);
      }

    // navigation.replace(ROUTES.Onboarding)
    }, 2000); // 2 seconds delay
    return () => clearTimeout(timer);
  }, [navigation, route?.params]);

  return (
    <View style={styles.container}>
      <Image source={imagesPath.logo} style={styles.image} />
      <Text style={styles.text}>{STRINGS.TITLES.appName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12
  },
  image: { width: 50, height: 50 },
  text: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.black
  }
});
``
