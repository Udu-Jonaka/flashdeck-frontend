import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  Animated 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/study.styles';
import { useTheme } from '../context/ThemeContext';

export default function StudyScreen({ route, navigation }) {
  const { colors, isDark } = useTheme();
  const { deck } = route.params; 
  const flashcards = deck.cards || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const flipAnimation = useRef(new Animated.Value(0)).current;

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const flipCard = () => {
    if (isFlipped) {
      Animated.spring(flipAnimation, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(flipAnimation, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    }
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      if (isFlipped) {
        flipAnimation.setValue(0);
        setIsFlipped(false);
      }
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      if (isFlipped) {
        flipAnimation.setValue(0);
        setIsFlipped(false);
      }
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (flashcards.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.cardContainer}>
          <Text style={{ fontSize: 18, color: colors.text }}>No flashcards in this deck.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>{deck.title}</Text>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>{currentIndex + 1} / {flashcards.length}</Text>
      </View>

      {/* 3D Animated Card Area */}
      <View style={styles.cardContainer}>
        <TouchableOpacity activeOpacity={1} onPress={flipCard}>
          <View style={styles.flipWrapper}>
            
            {/* FRONT OF CARD */}
            <Animated.View style={[
              styles.card, 
              { backgroundColor: colors.surface, borderColor: colors.borderLight, transform: [{ rotateY: frontInterpolate }] }
            ]}>
              <Text style={[styles.cardLabel, { color: colors.textMuted }]}>Question</Text>
              <Text style={[styles.cardText, { color: colors.text }]}>{currentCard.q}</Text>
            </Animated.View>

            {/* BACK OF CARD */}
            <Animated.View style={[
              styles.card, 
              styles.cardBack, 
              { backgroundColor: isDark ? '#134E4A' : '#DEF7EC', borderColor: isDark ? '#2DD4BF' : '#A7F3D0', transform: [{ rotateY: backInterpolate }] }
            ]}>
              <Text style={[styles.cardLabel, { color: colors.textMuted }]}>Answer</Text>
              <Text style={[styles.cardText, { color: colors.text }]}>{currentCard.a}</Text>
            </Animated.View>

          </View>
        </TouchableOpacity>
      </View>

      {/* Navigation Controls */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.navButton, { backgroundColor: colors.border }, currentIndex > 0 && { backgroundColor: colors.primary }]} 
          onPress={handlePrev}
          disabled={currentIndex === 0}
        >
          <Ionicons name="arrow-back" size={28} color={currentIndex > 0 ? "#FFFFFF" : colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.flipButton, { backgroundColor: isDark ? colors.surface : '#111827' }]} onPress={flipCard}>
          <Text style={styles.flipButtonText}>Flip Card</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navButton, { backgroundColor: colors.border }, currentIndex < flashcards.length - 1 && { backgroundColor: colors.primary }]} 
          onPress={handleNext}
          disabled={currentIndex === flashcards.length - 1}
        >
          <Ionicons name="arrow-forward" size={28} color={currentIndex < flashcards.length - 1 ? "#FFFFFF" : colors.textMuted} />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}
