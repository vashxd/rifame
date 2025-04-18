import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Link as ChakraLink,
  VisuallyHidden,
  chakra,
  useColorModeValue,
  Heading,
  Image,
  Button,
  Flex,
  Divider,
  Input,
  IconButton,
} from '@chakra-ui/react';
import { FaTwitter, FaInstagram, FaFacebook, FaYoutube, FaEnvelope } from 'react-icons/fa';
import Link from 'next/link';

const SocialButton = ({ children, label, href }) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}
      target="_blank"
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

const ListHeader = ({ children }) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
      {children}
    </Text>
  );
};

const Footer = () => {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      borderTop={1}
      borderStyle={'solid'}
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <Container as={Stack} maxW={'container.xl'} py={10}>
        <SimpleGrid
          templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr 1fr' }}
          spacing={8}
        >
          <Stack spacing={6}>
            <Box>
              <Image
                src="/assets/logo.png"
                fallbackSrc="https://via.placeholder.com/150x50?text=RIFA.me"
                alt="RIFA.me Logo"
                height="40px"
              />
            </Box>
            <Text fontSize={'sm'}>
              A RIFA.me é uma plataforma segura para a criação, gestão e participação em rifas online.
              Nossa missão é conectar sonhos através de oportunidades divertidas e acessíveis.
            </Text>
            <Stack direction={'row'} spacing={6}>
              <SocialButton label={'Twitter'} href={'#'}>
                <FaTwitter />
              </SocialButton>
              <SocialButton label={'Facebook'} href={'#'}>
                <FaFacebook />
              </SocialButton>
              <SocialButton label={'Instagram'} href={'#'}>
                <FaInstagram />
              </SocialButton>
              <SocialButton label={'YouTube'} href={'#'}>
                <FaYoutube />
              </SocialButton>
            </Stack>

            <Box>
              <Heading as="h4" size="md" mb={2}>
                Receba novidades
              </Heading>
              <Stack direction={{ base: 'column', md: 'row' }}>
                <Input
                  placeholder={'Seu e-mail'}
                  bg={useColorModeValue('white', 'gray.800')}
                  border={1}
                  borderColor={useColorModeValue('gray.300', 'gray.500')}
                  _focus={{
                    borderColor: 'purple.500',
                  }}
                />
                <Button
                  bg={'purple.500'}
                  color={'white'}
                  _hover={{
                    bg: 'purple.600',
                  }}
                  aria-label="Subscribe"
                  leftIcon={<FaEnvelope />}
                >
                  Inscrever
                </Button>
              </Stack>
            </Box>
          </Stack>

          <Stack align={'flex-start'}>
            <ListHeader>Explorar</ListHeader>
            <Link href="/raffles" passHref>
              <ChakraLink>Todas as Rifas</ChakraLink>
            </Link>
            <Link href="/categories" passHref>
              <ChakraLink>Categorias</ChakraLink>
            </Link>
            <Link href="/raffles/popular" passHref>
              <ChakraLink>Mais Populares</ChakraLink>
            </Link>
            <Link href="/raffles/ending-soon" passHref>
              <ChakraLink>Prestes a Encerrar</ChakraLink>
            </Link>
            <Link href="/raffles/charity" passHref>
              <ChakraLink>Rifas Beneficentes</ChakraLink>
            </Link>
          </Stack>
          
          <Stack align={'flex-start'}>
            <ListHeader>Criar Rifas</ListHeader>
            <Link href="/create-raffle" passHref>
              <ChakraLink>Nova Rifa</ChakraLink>
            </Link>
            <Link href="/my-raffles" passHref>
              <ChakraLink>Minhas Rifas</ChakraLink>
            </Link>
            <Link href="/promotions" passHref>
              <ChakraLink>Promoções</ChakraLink>
            </Link>
            <Link href="/business" passHref>
              <ChakraLink>Para Empresas</ChakraLink>
            </Link>
            <Link href="/fees" passHref>
              <ChakraLink>Taxas e Prazos</ChakraLink>
            </Link>
          </Stack>
          
          <Stack align={'flex-start'}>
            <ListHeader>Suporte</ListHeader>
            <Link href="/help" passHref>
              <ChakraLink>Central de Ajuda</ChakraLink>
            </Link>
            <Link href="/faq" passHref>
              <ChakraLink>Perguntas Frequentes</ChakraLink>
            </Link>
            <Link href="/contact" passHref>
              <ChakraLink>Contato</ChakraLink>
            </Link>
            <Link href="/safety-tips" passHref>
              <ChakraLink>Dicas de Segurança</ChakraLink>
            </Link>
            <Link href="/report" passHref>
              <ChakraLink>Denúncia</ChakraLink>
            </Link>
          </Stack>
          
          <Stack align={'flex-start'}>
            <ListHeader>Informações</ListHeader>
            <Link href="/about" passHref>
              <ChakraLink>Sobre Nós</ChakraLink>
            </Link>
            <Link href="/terms" passHref>
              <ChakraLink>Termos de Uso</ChakraLink>
            </Link>
            <Link href="/privacy" passHref>
              <ChakraLink>Política de Privacidade</ChakraLink>
            </Link>
            <Link href="/legal" passHref>
              <ChakraLink>Aspectos Legais</ChakraLink>
            </Link>
            <Link href="/careers" passHref>
              <ChakraLink>Carreiras</ChakraLink>
            </Link>
          </Stack>
        </SimpleGrid>
      </Container>
      
      <Divider borderColor={useColorModeValue('gray.200', 'gray.700')} />
      
      <Container
        as={Stack}
        maxW={'container.xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Text>© 2025 RIFA.me. Todos os direitos reservados</Text>
        <Flex align="center">
          <Image
            src="https://via.placeholder.com/40x30?text=SSL"
            alt="Certificado SSL"
            height="30px"
            mr={3}
          />
          <Image
            src="https://via.placeholder.com/70x30?text=PCI"
            alt="PCI Compliance"
            height="30px"
            mr={3}
          />
          <Stack direction={'row'} spacing={3}>
            <Image
              src="https://via.placeholder.com/40x30?text=VISA"
              alt="Visa"
              height="30px"
            />
            <Image
              src="https://via.placeholder.com/40x30?text=MC"
              alt="Mastercard"
              height="30px"
            />
            <Image
              src="https://via.placeholder.com/40x30?text=PIX"
              alt="PIX"
              height="30px"
            />
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;