import { describe, it, expect } from 'vitest';
import { formatPhoneNumber, getCleanPhoneNumber, cn } from './utils';

describe('utils', () => {
    describe('cn', () => {
        it('should merge class names correctly', () => {
            expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
        });

        it('should handle conditional classes', () => {
            expect(cn('bg-red-500', false && 'text-white', 'p-4')).toBe('bg-red-500 p-4');
        });

        it('should merge tailwind classes properly (override)', () => {
            expect(cn('p-4', 'p-8')).toBe('p-8');
        });
    });

    describe('formatPhoneNumber', () => {
        it('should format empty string', () => {
            expect(formatPhoneNumber('')).toBe('');
        });

        it('should format partial number', () => {
            expect(formatPhoneNumber('29')).toBe('+375 (29');
        });

        it('should format full number', () => {
            expect(formatPhoneNumber('291234567')).toBe('+375 (29) 123-45-67');
        });

        it('should handle input with 375 prefix', () => {
            expect(formatPhoneNumber('375291234567')).toBe('+375 (29) 123-45-67');
        });
        
        it('should handle input with non-digits', () => {
             expect(formatPhoneNumber('abc291234567')).toBe('+375 (29) 123-45-67');
        });
    });

    describe('getCleanPhoneNumber', () => {
        it('should return +375XXXXXXXXX format', () => {
            expect(getCleanPhoneNumber('+375 (29) 123-45-67')).toBe('+375291234567');
        });

        it('should handle 9 digit input', () => {
            expect(getCleanPhoneNumber('291234567')).toBe('+375291234567');
        });
        
        it('should handle 12 digit input starting with 375', () => {
             expect(getCleanPhoneNumber('375291234567')).toBe('+375291234567');
        });
    });
});
