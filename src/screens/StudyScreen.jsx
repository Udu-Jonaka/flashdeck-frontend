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

export default function StudyScreen({ route, navigation }) {
  // We expect the Dashboard to pass the selected deck via navigation params
  const { deck } = route.params; 
  const flashcards = deck.cards || []; // <-- Updated from deck.flashcards

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // The 3D Animation Engine
  const flipAnimation = useRef(new Animated.Value(0)).current;

  // Values from 0 to 180 degrees
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  // Values from 180 to 360 degrees (Back starts flipped)
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
      // If card is flipped, flip it back instantly without animation before moving to next
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
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#111827" />
          </TouchableOpacity>
        </View>
        <View style={styles.cardContainer}>
          <Text style={{ fontSize: 18 }}>No flashcards in this deck.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{deck.title}</Text>
        <Text style={styles.progressText}>{currentIndex + 1} / {flashcards.length}</Text>
      </View>

      {/* 3D Animated Card Area */}
      <View style={styles.cardContainer}>
        <TouchableOpacity activeOpacity={1} onPress={flipCard}>
          <View style={styles.flipWrapper}>
            
            {/* FRONT OF CARD */}
            <Animated.View style={[styles.card, { transform: [{ rotateY: frontInterpolate }] }]}>
              <Text style={styles.cardLabel}>Question</Text>
              <Text style={styles.cardText}>{currentCard.q}</Text>
            </Animated.View>

            {/* BACK OF CARD */}
            <Animated.View style={[styles.card, styles.cardBack, { transform: [{ rotateY: backInterpolate }] }]}>
              <Text style={styles.cardLabel}>Answer</Text>
              <Text style={styles.cardText}>{currentCard.a}</Text>
            </Animated.View>

          </View>
        </TouchableOpacity>
      </View>

      {/* Navigation Controls */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.navButton, currentIndex > 0 && styles.navButtonActive]} 
          onPress={handlePrev}
          disabled={currentIndex === 0}
        >
          <Ionicons name="arrow-back" size={28} color={currentIndex > 0 ? "#FFFFFF" : "#9CA3AF"} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.flipButton} onPress={flipCard}>
          <Text style={styles.flipButtonText}>Flip Card</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navButton, currentIndex < flashcards.length - 1 && styles.navButtonActive]} 
          onPress={handleNext}
          disabled={currentIndex === flashcards.length - 1}
        >
          <Ionicons name="arrow-forward" size={28} color={currentIndex < flashcards.length - 1 ? "#FFFFFF" : "#9CA3AF"} />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}
