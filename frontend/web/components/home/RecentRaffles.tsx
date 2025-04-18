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

// Dados simulados de rifas recentes
const RECENT_RAFFLES = [
  {
    id: 'raffle-5',
    title: 'MacBook Air M3 2025',
    description: 'MacBook Air com chip M3, 16GB RAM, SSD 512GB, novo modelo 2025.',
    category: 'Eletrônicos',
    imageUrl: 'https://via.placeholder.com/800x600?text=MacBookAirM3',
    price: 35.0,
    totalTickets: 150,
    soldTickets: 23,
    daysRemaining: 10,
    endDate: '2025-04-28T23:59:59',
    ownerName: 'Rafael Mendes',
    ownerAvatar: 'https://via.placeholder.com/150',
    isFeatured: false,
    isHot: false,
  },
  {
    id: 'raffle-6',
    title: 'Smart TV 75" Samsung Neo QLED 8K',
    description: 'Smart TV Samsung 75 polegadas Neo QLED 8K, modelo 2025 com tecnologia de última geração.',
    category: 'Eletrônicos',
    imageUrl: 'https://via.placeholder.com/800x600?text=SamsungTV',
    price: 80.0,
    totalTickets: 100,
    soldTickets: 5,
    daysRemaining: 15,
    endDate: '2025-05-03T23:59:59',
    ownerName: 'Camila Ferreira',
    ownerAvatar: 'https://via.placeholder.com/150',
    isFeatured: false,
    isHot: false,
  },
  {
    id: 'raffle-7',
    title: 'Drone DJI Air 3 Fly More Combo',
    description: 'Kit completo Drone DJI Air 3 com 3 baterias, controle remoto e acessórios extras.',
    category: 'Eletrônicos',
    imageUrl: 'https://via.placeholder.com/800x600?text=DJIDrone',
    price: 20.0,
    totalTickets: 80,
    soldTickets: 10,
    daysRemaining: 12,
    endDate: '2025-04-30T23:59:59',
    ownerName: 'Lucas Castro',
    ownerAvatar: 'https://via.placeholder.com/150',
    isFeatured: false,
    isHot: false,
  },
  {
    id: 'raffle-8',
    title: 'Pacote Disney 2025 - 7 dias para família',
    description: 'Pacote completo para 4 pessoas nos parques da Disney em Orlando, com hospedagem e ingressos.',
    category: 'Viagens',
    imageUrl: 'https://via.placeholder.com/800x600?text=Disney',
    price: 120.0,
    totalTickets: 200,
    soldTickets: 42,
    daysRemaining: 20,
    endDate: '2025-05-08T23:59:59',
    ownerName: 'Juliana Torres',
    ownerAvatar: 'https://via.placeholder.com/150',
    isFeatured: false,
    isHot: true,
  },
];

const RecentRaffles = () => {
  const [recentRaffles, setRecentRaffles] = useState([]);
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  useEffect(() => {
    // Em um caso real faria uma chamada à API
    // const fetchRecentRaffles = async () => {
    //   try {
    //     const response = await api.get('/raffles/recent');
    //     setRecentRaffles(response.data);
    //   } catch (error) {
    //     console.error('Erro ao buscar rifas recentes:', error);
    //   }
    // };
    
    // Simulando carregamento da API
    setTimeout(() => {
      setRecentRaffles(RECENT_RAFFLES);
    }, 500);
  }, []);

  return (
    <Box bg={bgColor} py={16}>
      <Container maxW="container.xl">
        <Stack spacing={8}>
          <Flex justify="space-between" align="center">
            <Heading as="h2" size="xl">
              Rifas Recentes
            </Heading>
            <Link href="/raffles?sort=recent" passHref>
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
            Confira as rifas mais recentes adicionadas à plataforma
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            {recentRaffles.map((raffle) => (
              <RaffleCard key={raffle.id} raffle={raffle} />
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
};

export default RecentRaffles;