import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, UIManager, Platform } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { useAppearance } from '@/contexts/AppearanceContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionItemProps {
  title: string;
  content: string;
}

export default function AccordionItem({ title, content }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { textSize, colors } = useAppearance();
  const styles = getStyles(textSize, colors);

  const toggleOpen = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleOpen} style={styles.titleContainer} activeOpacity={0.8}>
        <Text style={styles.title}>{title}</Text>
        <View style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}>
          <ChevronDown color={colors.textSecondary} size={20} />
        </View>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.contentContainer}>
          <Text style={styles.content}>{content}</Text>
        </View>
      )}
    </View>
  );
}

const getStyles = (textSize: number, colors: any) => StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
  },
  title: {
    fontSize: 16 * textSize,
    color: colors.text,
    flex: 1,
    marginRight: 16,
    fontWeight: '500',
  },
  contentContainer: {
    paddingBottom: 18,
  },
  content: {
    fontSize: 15 * textSize,
    color: colors.textSecondary,
    lineHeight: 22 * textSize,
  },
});
