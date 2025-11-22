import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CategoryCard from './CategoryCard';
import { COLORS } from '../constants/colors';

export default function CategoriesSection({ categories, onCategoryPress }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorias</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onPress={() => onCategoryPress && onCategoryPress(category)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
});
