import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link as ChakraLink,
  Stack,
  Text,
  useColorModeValue,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '../components/layout/Layout';

type LoginFormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    // Simular chamada à API de login
    try {
      console.log('Login data:', data);
      // Aqui faria a chamada real para a API
      // const response = await api.post('/auth/login', data);
      
      // Simulação de delay para demonstração
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirecionar após login
      // router.push('/dashboard');
      
      setIsLoading(false);
    } catch (error) {
      console.error('Erro no login:', error);
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Login | RIFA.me</title>
      </Head>
      <Container
        maxW="lg"
        py={{ base: '12', md: '16' }}
        px={{ base: '0', sm: '8' }}
      >
        <Stack spacing="8">
          <Stack spacing="6">
            <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
              <Heading size={{ base: 'lg', md: 'xl' }}>Entrar na sua conta</Heading>
              <Text color={useColorModeValue('gray.600', 'gray.400')}>
                Acesse para comprar ou gerenciar suas rifas
              </Text>
            </Stack>
          </Stack>
          <Box
            py={{ base: '0', sm: '8' }}
            px={{ base: '4', sm: '10' }}
            bg={useColorModeValue('white', 'gray.800')}
            boxShadow={{ base: 'none', sm: 'md' }}
            borderRadius={{ base: 'none', sm: 'xl' }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing="6">
                <Stack spacing="5">
                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                      id="email"
                      type="email"
                      {...register('email', {
                        required: 'Email é obrigatório',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Email inválido',
                        },
                      })}
                    />
                    <FormErrorMessage>
                      {errors.email && errors.email.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.password}>
                    <FormLabel htmlFor="password">Senha</FormLabel>
                    <InputGroup>
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password', {
                          required: 'Senha é obrigatória',
                          minLength: {
                            value: 6,
                            message: 'Senha deve ter no mínimo 6 caracteres',
                          },
                        })}
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                          icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                          variant="ghost"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>
                      {errors.password && errors.password.message}
                    </FormErrorMessage>
                  </FormControl>
                </Stack>
                <HStack justify="space-between">
                  <Checkbox {...register('rememberMe')}>Lembrar de mim</Checkbox>
                  <Link href="/forgot-password" passHref>
                    <ChakraLink 
                      fontSize="sm"
                      color={useColorModeValue('purple.600', 'purple.300')}
                    >
                      Esqueceu a senha?
                    </ChakraLink>
                  </Link>
                </HStack>
                <Stack spacing="6">
                  <Button
                    type="submit"
                    colorScheme="purple"
                    size="lg"
                    fontSize="md"
                    isLoading={isLoading}
                  >
                    Entrar
                  </Button>
                  <HStack>
                    <Divider />
                    <Text
                      fontSize="sm"
                      textTransform="uppercase"
                      color={useColorModeValue('gray.600', 'gray.400')}
                    >
                      ou
                    </Text>
                    <Divider />
                  </HStack>
                  <Stack spacing="3">
                    <Button
                      variant="outline"
                      leftIcon={<FaGoogle />}
                      colorScheme="red"
                      onClick={() => console.log('Login com Google')}
                    >
                      Continuar com Google
                    </Button>
                    <Button
                      variant="outline"
                      leftIcon={<FaFacebook />}
                      colorScheme="facebook"
                      onClick={() => console.log('Login com Facebook')}
                    >
                      Continuar com Facebook
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </form>
          </Box>
          <Stack spacing="0" align="center">
            <Text>
              Não tem uma conta?{' '}
              <Link href="/register" passHref>
                <ChakraLink 
                  color={useColorModeValue('purple.600', 'purple.300')}
                  fontWeight="semibold"
                >
                  Cadastre-se
                </ChakraLink>
              </Link>
            </Text>
          </Stack>
        </Stack>
      </Container>
    </Layout>
  );
};

export default Login;