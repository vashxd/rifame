import { Box, Container, Heading, Text, SimpleGrid, Button, Image, Flex, Stack, Badge } from '@chakra-ui/react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { FeaturedRaffles } from '../components/home/FeaturedRaffles';
import { RecentRaffles } from '../components/home/RecentRaffles';
import { RaffleCategories } from '../components/home/RaffleCategories';
import { HowItWorks } from '../components/home/HowItWorks';
import Layout from '../components/layout/Layout';

const Home: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>RIFA.me - Sua plataforma de rifas digitais</title>
        <meta name="description" content="RIFA.me - Plataforma de rifas digitais segura, transparente e fácil de usar. Crie, venda e compre rifas online." />
      </Head>

      {/* Hero Section */}
      <Box 
        bg="linear-gradient(to right, #7928CA, #FF0080)" 
        color="white" 
        py={20}
        px={4}
      >
        <Container maxW="container.xl">
          <Flex direction={{ base: 'column', md: 'row' }} align="center">
            <Box flex={1} pr={{ base: 0, md: 10 }} mb={{ base: 10, md: 0 }}>
              <Heading 
                as="h1" 
                size="2xl" 
                mb={6}
                fontWeight="bold"
              >
                Rifas digitais de forma fácil, segura e transparente
              </Heading>
              <Text fontSize="xl" mb={8}>
                Crie suas próprias rifas ou participe de sorteios incríveis com prêmios exclusivos.
              </Text>
              <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
                <Button 
                  size="lg" 
                  colorScheme="white" 
                  variant="outline" 
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  <Link href="/raffles">
                    Ver rifas disponíveis
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  bg="white" 
                  color="#7928CA"
                  _hover={{ bg: 'whiteAlpha.800' }}
                >
                  <Link href="/create-raffle">
                    Criar uma rifa
                  </Link>
                </Button>
              </Stack>
            </Box>
            <Box 
              flex={1} 
              position="relative"
              width={{ base: '100%', md: '50%' }}
              height={{ base: '300px', md: '400px' }}
            >
              <Image 
                src="/assets/hero-image.png" 
                alt="RIFA.me plataforma" 
                fallbackSrc="https://via.placeholder.com/500x400?text=RIFA.me"
                borderRadius="lg"
                boxShadow="2xl"
                objectFit="cover"
                width="100%"
                height="100%"
              />
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Featured Raffles Section */}
      <Box py={16} px={4}>
        <Container maxW="container.xl">
          <Heading as="h2" size="xl" mb={8} textAlign="center">
            Rifas em Destaque
          </Heading>
          <FeaturedRaffles />
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box py={16} bg="gray.50" px={4}>
        <Container maxW="container.xl">
          <Heading as="h2" size="xl" mb={12} textAlign="center">
            Como Funciona
          </Heading>
          <HowItWorks />
        </Container>
      </Box>

      {/* Categories Section */}
      <Box py={16} px={4}>
        <Container maxW="container.xl">
          <Heading as="h2" size="xl" mb={8} textAlign="center">
            Categorias de Rifas
          </Heading>
          <RaffleCategories />
        </Container>
      </Box>

      {/* Recent Raffles Section */}
      <Box py={16} bg="gray.50" px={4}>
        <Container maxW="container.xl">
          <Heading as="h2" size="xl" mb={8} textAlign="center">
            Rifas Recentes
          </Heading>
          <RecentRaffles />
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={20} bg="blue.600" color="white" px={4}>
        <Container maxW="container.xl" textAlign="center">
          <Heading as="h2" size="xl" mb={6}>
            Pronto para criar sua própria rifa?
          </Heading>
          <Text fontSize="xl" mb={8} maxW="2xl" mx="auto">
            Comece agora mesmo e alcance milhares de potenciais compradores para seu sorteio.
          </Text>
          <Button 
            size="lg" 
            bg="white" 
            color="blue.600"
            _hover={{ bg: 'whiteAlpha.800' }}
            px={8}
          >
            <Link href="/create-raffle">
              Criar rifa agora
            </Link>
          </Button>
        </Container>
      </Box>
    </Layout>
  );
};

export default Home;