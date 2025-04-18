import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Icon,
  useColorModeValue,
  createIcon,
  Flex,
  Image,
  HStack,
  VStack,
  SimpleGrid,
} from '@chakra-ui/react';
import { FaSearch, FaPlus, FaTrophy } from 'react-icons/fa';
import Link from 'next/link';

const Hero = () => {
  return (
    <Box position="relative" overflow="hidden">
      {/* Gradient background */}
      <Box
        width="100%"
        height="100%"
        position="absolute"
        bgGradient="linear(to-r, purple.600, pink.500)"
        opacity="0.8"
        zIndex="-1"
      />
      
      {/* Background pattern */}
      <Box
        width="100%"
        height="100%"
        position="absolute"
        bgImage="url('https://via.placeholder.com/1500x800?text=Pattern')"
        bgSize="cover"
        bgPosition="center"
        mixBlendMode="overlay"
        opacity="0.2"
        zIndex="-1"
      />
      
      <Container maxW={'container.xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 28 }}
          position="relative"
          zIndex="1"
        >
          <Heading
            fontWeight={700}
            fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}
            lineHeight={'110%'}
            color={'white'}
          >
            Rifas online <br />
            <Text as={'span'} color={'purple.100'}>
              de forma fácil e segura
            </Text>
          </Heading>
          <Text color={'white'} fontSize={{ base: 'md', sm: 'lg', md: 'xl' }} maxW={'3xl'} mx={'auto'}>
            Crie suas próprias rifas ou participe de milhares de sorteios com prêmios incríveis.
            Tudo isso em uma plataforma 100% digital, segura e transparente.
          </Text>
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            spacing={5}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}
          >
            <Link href="/raffles" passHref>
              <Button
                colorScheme={'white'}
                bg={'white'}
                color={'purple.600'}
                rounded={'full'}
                px={6}
                size="lg"
                fontWeight={'bold'}
                _hover={{
                  bg: 'gray.100',
                }}
                leftIcon={<FaSearch />}
              >
                Explorar Rifas
              </Button>
            </Link>
            <Link href="/create-raffle" passHref>
              <Button
                colorScheme={'purple'}
                bg={'purple.400'}
                rounded={'full'}
                px={6}
                size="lg"
                fontWeight={'bold'}
                _hover={{
                  bg: 'purple.500',
                }}
                leftIcon={<FaPlus />}
              >
                Criar Rifa
              </Button>
            </Link>
          </Stack>
          
          {/* Stats */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} mt={10}>
            <HStack
              p={4}
              bg="rgba(255, 255, 255, 0.1)"
              backdropFilter="blur(5px)"
              borderRadius="lg"
              spacing={4}
              align="center"
              justify="center"
            >
              <Icon as={FaTrophy} w={10} h={10} color="yellow.300" />
              <VStack align="start" spacing={0}>
                <Text color="white" fontWeight="bold" fontSize="3xl">
                  R$ 5M+
                </Text>
                <Text color="whiteAlpha.800">
                  Em prêmios distribuídos
                </Text>
              </VStack>
            </HStack>
            
            <HStack
              p={4}
              bg="rgba(255, 255, 255, 0.1)"
              backdropFilter="blur(5px)"
              borderRadius="lg"
              spacing={4}
              align="center"
              justify="center"
            >
              <Icon as={Arrow} w={10} h={10} color="green.300" />
              <VStack align="start" spacing={0}>
                <Text color="white" fontWeight="bold" fontSize="3xl">
                  50K+
                </Text>
                <Text color="whiteAlpha.800">
                  Rifas realizadas
                </Text>
              </VStack>
            </HStack>
            
            <HStack
              p={4}
              bg="rgba(255, 255, 255, 0.1)"
              backdropFilter="blur(5px)"
              borderRadius="lg"
              spacing={4}
              align="center"
              justify="center"
            >
              <Icon as={People} w={10} h={10} color="blue.300" />
              <VStack align="start" spacing={0}>
                <Text color="white" fontWeight="bold" fontSize="3xl">
                  200K+
                </Text>
                <Text color="whiteAlpha.800">
                  Usuários ativos
                </Text>
              </VStack>
            </HStack>
          </SimpleGrid>
          
          {/* Scroll indicator */}
          <Flex justify="center" mt={8}>
            <Icon
              as={ArrowDownIcon}
              w={10}
              h={10}
              color="white"
              animation="bounce 2s infinite"
            />
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
};

const Arrow = createIcon({
  displayName: 'Arrow',
  viewBox: '0 0 72 24',
  path: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.600904 7.08166C0.764293 6.8879 1.01492 6.79004 1.26654 6.82177C2.83216 7.01918 5.20326 7.24581 7.54543 7.23964C9.92491 7.23338 12.1351 6.98464 13.4704 6.32142C13.84 6.13785 14.2885 6.28805 14.4722 6.65692C14.6559 7.02578 14.5052 7.47362 14.1356 7.6572C12.4625 8.48822 9.94063 8.72541 7.54852 8.7317C5.67514 8.73663 3.79547 8.5985 2.29921 8.44247C2.80955 9.59638 3.50943 10.6396 4.24665 11.7384C4.39435 11.9585 4.54354 12.1809 4.69301 12.4068C5.79543 14.0733 6.88128 15.8995 7.1179 18.2636C7.15893 18.6735 6.85928 19.0393 6.4486 19.0805C6.03792 19.1217 5.67174 18.8227 5.6307 18.4128C5.43271 16.4346 4.52957 14.868 3.4457 13.2296C3.3058 13.0181 3.16221 12.8046 3.01684 12.5885C2.05899 11.1646 1.02372 9.62564 0.457909 7.78069C0.383671 7.53862 0.437515 7.27541 0.600904 7.08166ZM5.52039 10.2248C5.77662 9.90161 6.24663 9.84687 6.57018 10.1025C16.4834 17.9344 29.9158 22.4064 42.0781 21.4773C54.1988 20.5514 65.0339 14.2748 69.9746 0.584299C70.1145 0.196597 70.5427 -0.0046455 70.931 0.134813C71.3193 0.274276 71.5206 0.70162 71.3807 1.08932C66.2105 15.4159 54.8056 22.0014 42.1913 22.965C29.6185 23.9254 15.8207 19.3142 5.64226 11.2727C5.31871 11.0171 5.26415 10.5479 5.52039 10.2248Z"
      fill="currentColor"
    />
  ),
});

const People = createIcon({
  displayName: 'People',
  viewBox: '0 0 24 24',
  path: (
    <g fill="currentColor">
      <path d="M9,11 C11.209139,11 13,9.209139 13,7 C13,4.790861 11.209139,3 9,3 C6.790861,3 5,4.790861 5,7 C5,9.209139 6.790861,11 9,11 Z M9,13 C6.33333333,13 1,14.3333333 1,17 L1,21 L17,21 L17,17 C17,14.3333333 11.6666667,13 9,13 Z" />
      <path d="M15,5 C14.0472022,5 13.1960719,5.37892489 12.5706202,6 L13.9372402,6 C14.4410742,6.5978477 14.75,7.3472834 14.75,8.15999998 C14.75,8.96192457 14.4499976,9.71286689 13.9372402,10.32 L12.5706202,10.32 C13.1960719,10.94 14.0472022,11.32 15,11.32 C16.9389011,11.32 18.5,9.75889937 18.5,7.82 C18.5,5.88110063 16.9389011,5 15,5 Z" />
      <path d="M15,13.1999998 C16.6070144,13.1999998 18.1076079,13.4310943 19.2011337,13.8012454 C20.2946594,14.1713966 21,14.6767849 21,15.4 L21,17.6 L23,17.6 L23,15.4 C23,13.2632135 19.4960526,11.0399998 15,11.0399998 L15,13.1999998 Z" />
    </g>
  ),
});

const ArrowDownIcon = createIcon({
  displayName: 'ArrowDownIcon',
  viewBox: '0 0 24 24',
  path: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 3.5a.75.75 0 01.75.75v14.69l5.22-5.22a.75.75 0 011.06 1.06l-6.5 6.5a.75.75 0 01-1.06 0l-6.5-6.5a.75.75 0 111.06-1.06l5.22 5.22V4.25A.75.75 0 0112 3.5z"
      fill="currentColor"
    />
  ),
});

export default Hero;