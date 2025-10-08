import React from 'react';
import { Text } from '../index';

/**
 * ProfileTextSection - Text content section (About Me, Ideal Partner)
 */
export default function ProfileTextSection({ text, isArabic }) {
  if (!text) return null;

  return (
    <Text
      variant="body"
      className={isArabic ? 'text-right leading-6' : 'text-left leading-6'}
      style={{ lineHeight: 22 }}
    >
      {text}
    </Text>
  );
}
