/**
 * OAuth callback handler
 */

import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Box, Text, VStack, Spinner } from '@chakra-ui/react';
import { useAuth } from '../../src/context/AuthContext';
import { useAsyncEffectOnce } from '../../src/hooks/useEffectOnce';

export function meta() {
  return [{ title: "Signing in... | FILLIN_APP_NAME" }];
}

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  useAsyncEffectOnce(async () => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError('Authentication was cancelled');
      setTimeout(() => navigate('/'), 2000);
      return;
    }

    if (!code) {
      setError('No authorization code received');
      setTimeout(() => navigate('/'), 2000);
      return;
    }

    try {
      await login(code);
      navigate('/admin');
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Login failed');
      setTimeout(() => navigate('/'), 3000);
    }
  });

  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
      <VStack gap="4" textAlign="center">
        {error ? (
          <>
            <Text color="red.500" fontWeight="medium">
              {error}
            </Text>
            <Text color="gray.500" fontSize="sm">
              Redirecting to home...
            </Text>
          </>
        ) : (
          <>
            <Spinner size="lg" color="blue.500" />
            <Text color="gray.600">Completing sign in...</Text>
          </>
        )}
      </VStack>
    </Box>
  );
}
