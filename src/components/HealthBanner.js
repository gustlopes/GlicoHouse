import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';

export default function HealthBanner({ banner }) {
  return (
    <View style={styles.container}>
      <View style={styles.gradient}>
        <View style={styles.content}>
          <View style={styles.heartIcon}>
            <Text style={styles.heartEmoji}>💚</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{banner?.title || 'Cuide da sua saúde!'}</Text>
            <Text style={styles.subtitle}>
              {banner?.subtitle || 'Hardware e agilidade para alcançar uma vida mais saudável'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Confira →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    backgroundColor: COLORS.secondary,
    padding: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  heartIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  heartEmoji: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.9,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
});
