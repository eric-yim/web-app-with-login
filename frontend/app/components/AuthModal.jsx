/**
 * AuthModal - Google-only login modal
 */

import { useState } from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { authApi } from '../../src/api/client';

export default function AuthModal({ isOpen, onClose }) {
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      const { url } = await authApi.getGoogleAuthUrl();
      window.location.href = url;
    } catch (err) {
      setError('Failed to start Google sign in');
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="blackAlpha.700"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex="modal"
      onClick={handleClose}
    >
      <Box
        bg="white"
        borderRadius="xl"
        p="8"
        maxW="md"
        w="90%"
        boxShadow="2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <VStack gap="6" align="stretch">
          <VStack gap="1">
            <Text fontSize="2xl" fontWeight="bold" color="gray.800">FILLIN_APP_NAME</Text>
            <Text color="gray.500" fontSize="sm">Sign in to get started</Text>
          </VStack>

          {error && (
            <Text color="red.500" fontSize="sm" textAlign="center">
              {error}
            </Text>
          )}

          <Button
            variant="outline"
            size="lg"
            w="full"
            onClick={handleGoogleLogin}
            bg="white"
            borderColor="gray.300"
            color="gray.700"
            _hover={{ bg: 'gray.50' }}
          >
            <HStack gap="3">
              <FcGoogle size={20} />
              <Text>Sign in with Google</Text>
            </HStack>
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
