import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function HealthTip({ tip }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>💙</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Dica de Saúde</Text>
          <Text style={styles.message}>
            {tip || 'Monitore sua glicose regularmente e mantenha um estilo de vida saudável.'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
  },
});
