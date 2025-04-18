import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Button,
  Flex,
  SimpleGrid,
  useColorModeValue,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import RaffleCard from './RaffleCard';

// Dados simulados de rifas em destaque
const FEATURED_RAFFLES = [
  {
    id: 'raffle-1',
    title: 'iPhone 15 Pro Max 256GB',
    description: 'Novo iPhone 15 Pro Max com 256GB, cor Titânio Escuro, em caixa lacrada.',
    category: 'Eletrônicos',
    imageUrl: 'https://via.placeholder.com/800x600?text=iPhone15ProMax',
    price: 25.0,
    totalTickets: 100,
    soldTickets: 68,
    daysRemaining: 3,
    endDate: '2025-04-21T23:59:59',
    ownerName: 'João Silva',
    ownerAvatar: 'https://via.placeholder.com/150',
    isFeatured: true,
    isHot: true,
  },
  {
    id: 'raffle-2',
    title: 'PlayStation 5 + 2 Controles + 3 Jogos',
    description: 'Console PS5 completo com 2 controles DualSense e 3 jogos à escolha do ganhador.',
    category: 'Games',
    imageUrl: 'https://via.placeholder.com/800x600?text=PlayStation5',
    price: 15.0,
    totalTickets: 200,
    soldTickets: 135,
    daysRemaining: 5,
    endDate: '2025-04-23T23:59:59',
    ownerName: 'Maria Santos',
    ownerAvatar: 'https://via.placeholder.com/150',
    isFeatured: true,
    isHot: false,
  },
  {
    id: 'raffle-3',
    title: 'Notebook Dell XPS 15',
    description: 'Notebook Dell XPS 15 com Intel Core i7, 32GB RAM, SSD 1TB e tela 4K.',
    category: 'Eletrônicos',
    imageUrl: 'https://via.placeholder.com/800x600?text=DellXPS15',
    price: 50.0,
    totalTickets: 50,
    soldTickets: 22,
    daysRemaining: 7,
    endDate: '2025-04-25T23:59:59',
    ownerName: 'Pedro Oliveira',
    ownerAvatar: 'https://via.placeholder.com/150',
    isFeatured: true,
    isHot: false,
  },
  {
    id: 'raffle-4',
    title: 'Viagem para Fernando de Noronha',
    description: 'Pacote completo para duas pessoas em Fernando de Noronha por 5 dias, com passagens e hospedagem.',
    category: 'Viagens',
    imageUrl: 'https://via.placeholder.com/800x600?text=FernandoDeNoronha',
    price: 100.0,
    totalTickets: 75,
    soldTickets: 40,
    daysRemaining: 12,
    endDate: '2025-04-30T23:59:59',
    ownerName: 'Ana Costa',
    ownerAvatar: 'https://via.placeholder.com/150',
    isFeatured: true,
    isHot: true,
  },
];

const FeaturedRaffles = () => {
  const [featuredRaffles, setFeaturedRaffles] = useState([]);
  const bgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    // Em um caso real faria uma chamada à API
    // const fetchFeaturedRaffles = async () => {
    //   try {
    //     const response = await api.get('/raffles/featured');
    //     setFeaturedRaffles(response.data);
    //   } catch (error) {
    //     console.error('Erro ao buscar rifas em destaque:', error);
    //   }
    // };
    
    // Simulando carregamento da API
    setTimeout(() => {
      setFeaturedRaffles(FEATURED_RAFFLES);
    }, 500);
  }, []);

  return (
    <Box bg={bgColor} py={16}>
      <Container maxW="container.xl">
        <Stack spacing={8}>
          <Flex justify="space-between" align="center">
            <Heading as="h2" size="xl">
              Rifas em Destaque
            </Heading>
            <Link href="/raffles" passHref>
              <Button
                as={ChakraLink}
                rightIcon={<FaArrowRight />}
                colorScheme="purple"
                variant="link"
                _hover={{ textDecoration: 'none' }}
              >
                Ver todas
              </Button>
            </Link>
          </Flex>

          <Text color="gray.600" fontSize="lg">
            Confira as rifas mais populares da plataforma com os melhores prêmios
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            {featuredRaffles.map((raffle) => (
              <RaffleCard key={raffle.id} raffle={raffle} />
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
};

export default FeaturedRaffles;