import { useNavigate } from "react-router";
import { Box, Button, Text, VStack, Spinner } from "@chakra-ui/react";
import { useAuth } from "../../src/context/AuthContext";
import { useEffectOnce } from "../../src/hooks/useEffectOnce";

export function meta() {
  return [{ title: "Dashboard | FILLIN_APP_NAME" }];
}

export default function Admin() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffectOnce(() => {
    if (!loading && !isAuthenticated) {
      navigate("/");
    }
  });

  if (loading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="lg" color="blue.500" />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Box minH="100vh" p="8">
      <VStack align="stretch" gap="4" maxW="800px" mx="auto">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Text fontSize="2xl" fontWeight="bold">Dashboard</Text>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Sign Out
          </Button>
        </Box>
        <Box bg="gray.50" p="4" borderRadius="md">
          <Text color="gray.600">
            Signed in as <strong>{user?.email}</strong>
          </Text>
          {user?.displayName && (
            <Text color="gray.500" fontSize="sm">{user.displayName}</Text>
          )}
        </Box>
        <Text color="gray.500">Coming soon.</Text>
      </VStack>
    </Box>
  );
}
