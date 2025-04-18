import {
  Box,
  Button,
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
  Checkbox,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '../components/layout/Layout';

type RegisterFormData = {
  fullName: string;
  email: string;
  cpf: string;
  phone: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
};

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password', '');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    // Simular chamada à API de registro
    try {
      console.log('Register data:', data);
      // Aqui faria a chamada real para a API
      // const response = await api.post('/auth/register', data);
      
      // Simulação de delay para demonstração
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Exibir mensagem de sucesso
      toast({
        title: 'Conta criada com sucesso!',
        description: 'Enviamos um email para confirmar seu cadastro.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      
      // Redirecionar após registro
      // router.push('/login');
      
      setIsLoading(false);
    } catch (error) {
      console.error('Erro no registro:', error);
      
      toast({
        title: 'Erro ao criar conta',
        description: 'Ocorreu um erro durante o cadastro. Tente novamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      
      setIsLoading(false);
    }
  };

  // Função para formatar o CPF durante a digitação
  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };
  
  // Função para formatar o telefone durante a digitação
  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  return (
    <Layout>
      <Head>
        <title>Cadastro | RIFA.me</title>
      </Head>
      <Container
        maxW="lg"
        py={{ base: '12', md: '16' }}
        px={{ base: '0', sm: '8' }}
      >
        <Stack spacing="8">
          <Stack spacing="6">
            <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
              <Heading size={{ base: 'lg', md: 'xl' }}>Criar sua conta</Heading>
              <Text color={useColorModeValue('gray.600', 'gray.400')}>
                Crie uma conta para participar de rifas ou criar as suas próprias
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
                  <FormControl isInvalid={!!errors.fullName}>
                    <FormLabel htmlFor="fullName">Nome completo</FormLabel>
                    <Input
                      id="fullName"
                      type="text"
                      {...register('fullName', {
                        required: 'Nome completo é obrigatório',
                        minLength: {
                          value: 3,
                          message: 'Nome deve ter no mínimo 3 caracteres',
                        },
                      })}
                    />
                    <FormErrorMessage>
                      {errors.fullName && errors.fullName.message}
                    </FormErrorMessage>
                  </FormControl>
                  
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
                  
                  <FormControl isInvalid={!!errors.cpf}>
                    <FormLabel htmlFor="cpf">CPF</FormLabel>
                    <Input
                      id="cpf"
                      type="text"
                      maxLength={14}
                      {...register('cpf', {
                        required: 'CPF é obrigatório',
                        minLength: {
                          value: 14,
                          message: 'CPF inválido',
                        },
                        onChange: (e) => {
                          e.target.value = formatCPF(e.target.value);
                        },
                      })}
                    />
                    <FormErrorMessage>
                      {errors.cpf && errors.cpf.message}
                    </FormErrorMessage>
                  </FormControl>
                  
                  <FormControl isInvalid={!!errors.phone}>
                    <FormLabel htmlFor="phone">Telefone</FormLabel>
                    <Input
                      id="phone"
                      type="text"
                      maxLength={15}
                      {...register('phone', {
                        required: 'Telefone é obrigatório',
                        minLength: {
                          value: 14,
                          message: 'Telefone inválido',
                        },
                        onChange: (e) => {
                          e.target.value = formatPhone(e.target.value);
                        },
                      })}
                    />
                    <FormErrorMessage>
                      {errors.phone && errors.phone.message}
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
                  
                  <FormControl isInvalid={!!errors.confirmPassword}>
                    <FormLabel htmlFor="confirmPassword">Confirmar senha</FormLabel>
                    <InputGroup>
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...register('confirmPassword', {
                          required: 'Confirmação de senha é obrigatória',
                          validate: value => 
                            value === password || 'As senhas não coincidem',
                        })}
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={showConfirmPassword ? 'Esconder senha' : 'Mostrar senha'}
                          icon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          variant="ghost"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>
                      {errors.confirmPassword && errors.confirmPassword.message}
                    </FormErrorMessage>
                  </FormControl>
                  
                  <FormControl isInvalid={!!errors.termsAccepted}>
                    <Checkbox
                      id="termsAccepted"
                      {...register('termsAccepted', {
                        required: 'Você deve aceitar os termos para continuar',
                      })}
                    >
                      Eu aceito os{' '}
                      <Link href="/terms" passHref>
                        <ChakraLink 
                          color={useColorModeValue('purple.600', 'purple.300')}
                          isExternal
                        >
                          termos de serviço
                        </ChakraLink>
                      </Link>{' '}
                      e a{' '}
                      <Link href="/privacy" passHref>
                        <ChakraLink 
                          color={useColorModeValue('purple.600', 'purple.300')}
                          isExternal
                        >
                          política de privacidade
                        </ChakraLink>
                      </Link>
                    </Checkbox>
                    <FormErrorMessage>
                      {errors.termsAccepted && errors.termsAccepted.message}
                    </FormErrorMessage>
                  </FormControl>
                </Stack>
                
                <Stack spacing="6">
                  <Button
                    type="submit"
                    colorScheme="purple"
                    size="lg"
                    fontSize="md"
                    isLoading={isLoading}
                  >
                    Criar conta
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
                      onClick={() => console.log('Cadastro com Google')}
                    >
                      Cadastrar com Google
                    </Button>
                    <Button
                      variant="outline"
                      leftIcon={<FaFacebook />}
                      colorScheme="facebook"
                      onClick={() => console.log('Cadastro com Facebook')}
                    >
                      Cadastrar com Facebook
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </form>
          </Box>
          <Stack spacing="0" align="center">
            <Text>
              Já tem uma conta?{' '}
              <Link href="/login" passHref>
                <ChakraLink 
                  color={useColorModeValue('purple.600', 'purple.300')}
                  fontWeight="semibold"
                >
                  Entrar
                </ChakraLink>
              </Link>
            </Text>
          </Stack>
        </Stack>
      </Container>
    </Layout>
  );
};

export default Register;