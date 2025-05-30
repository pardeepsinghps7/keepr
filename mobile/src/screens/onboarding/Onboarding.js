import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import imagesPath from '../../constants/images';
import {ROUTES, STRINGS} from '../../constants/strings';
import COLORS from '../../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const { ONBOARDING,BUTTONS } = STRINGS;
const onboardingData = [
  {
    key: '1',
    title: ONBOARDING.title1,
    subtitle: ONBOARDING.subtitle1,
    image: imagesPath.walkthrough1, // Replace with your image path
  },
  {
    key: '2',
    title: ONBOARDING.title2,
    subtitle: ONBOARDING.subtitle2,
    image: imagesPath.walkthrough2,
  },
  {
    key: '3',
    title: ONBOARDING.title3,
    subtitle: ONBOARDING.subtitle3,
    image: imagesPath.walkthrough3,
  },
];

const Onboarding = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef();

  const onNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace(ROUTES.recaptcha); // or navigate to Home
    }
  };

  const onSkip = () => navigation.replace(ROUTES.recaptcha);

  const renderItem = ({ item }) => (
    <View style={styles.page}>
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotContainer}>
      {onboardingData.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index <= currentIndex && styles.activeDot,
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity style={styles.skip} onPress={onSkip}>
        <Icon name="arrow-back" size={16} color={COLORS.accent} />
        <Text style={styles.skipText}>{BUTTONS.skip}</Text>
      </TouchableOpacity>

      {/* Pages */}
      <FlatList
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.key}
        onScroll={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        ref={flatListRef}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomRow}>
        {renderDots()}
        <TouchableOpacity onPress={onNext} style={styles.nextButton}>
          <Text style={styles.nextText}>
            {currentIndex === onboardingData.length - 1 ? BUTTONS.getStarted : BUTTONS.next}
          </Text>
          <Icon name="arrow-forward" size={16} color={COLORS.black} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'flex-end',
    padding:16
  },
  skipText: {
    marginLeft: 8,
    color: COLORS.accent,
    fontWeight: '400',
    fontSize: 16,
  },
  page: {
    width,
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    height: 360,
    width: '100%',
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    color: COLORS.black,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.text_secondary,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding:16,
    borderTopWidth:1,
    borderColor:COLORS.secondary
  },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:COLORS.primary,
    paddingHorizontal:16,
    paddingVertical:12,
    borderRadius:8
  },
  nextText: {
    marginRight: 8,
    color: COLORS.black,
    fontWeight: '400',
    fontSize: 16,
  },
});

export default Onboarding;
