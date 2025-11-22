import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function ChatButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.text}>Precisa de orientações?</Text>
      <Text style={styles.subtext}>Fale com nossos especialistas</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    maxWidth: 200,
  },
  text: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 2,
  },
  subtext: {
    color: COLORS.white,
    fontSize: 11,
    opacity: 0.9,
  },
});
