import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Icon,
  useColorModeValue,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  FaMobile, 
  FaCar, 
  FaLaptop, 
  FaPlane, 
  FaHome, 
  FaGamepad, 
  FaTshirt, 
  FaGift,
} from 'react-icons/fa';

const MotionBox = motion(Box);

// Dados de categorias
const CATEGORIES = [
  {
    id: 'electronics',
    name: 'Eletrônicos',
    icon: FaLaptop,
    color: 'blue.500',
    count: 156,
  },
  {
    id: 'smartphones',
    name: 'Smartphones',
    icon: FaMobile,
    color: 'teal.500',
    count: 98,
  },
  {
    id: 'vehicles',
    name: 'Veículos',
    icon: FaCar,
    color: 'red.500',
    count: 43,
  },
  {
    id: 'travel',
    name: 'Viagens',
    icon: FaPlane,
    color: 'orange.500',
    count: 72,
  },
  {
    id: 'realestate',
    name: 'Imóveis',
    icon: FaHome,
    color: 'green.500',
    count: 29,
  },
  {
    id: 'games',
    name: 'Games',
    icon: FaGamepad,
    color: 'purple.500',
    count: 118,
  },
  {
    id: 'fashion',
    name: 'Moda',
    icon: FaTshirt,
    color: 'pink.500',
    count: 87,
  },
  {
    id: 'other',
    name: 'Outros',
    icon: FaGift,
    color: 'gray.500',
    count: 205,
  },
];

const RaffleCategories = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBgColor = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');

  return (
    <Box bg={bgColor} py={16}>
      <Container maxW="container.xl">
        <Heading 
          as="h2" 
          size="xl" 
          mb={4}
          color={headingColor}
          textAlign="center"
        >
          Categorias de Rifas
        </Heading>
        
        <Text 
          fontSize="lg" 
          textAlign="center" 
          maxW="container.md" 
          mx="auto" 
          mb={12}
          color={textColor}
        >
          Explore todas as categorias de rifas disponíveis e encontre exatamente o que você está procurando
        </Text>
        
        <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={8}>
          {CATEGORIES.map((category) => (
            <Link 
              href={`/raffles/category/${category.id}`} 
              key={category.id}
              passHref
            >
              <ChakraLink _hover={{ textDecoration: 'none' }}>
                <MotionBox
                  bg={cardBgColor}
                  borderRadius="lg"
                  p={6}
                  boxShadow="md"
                  whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                  transition={{ duration: 0.3 }}
                  textAlign="center"
                >
                  <Flex 
                    justify="center" 
                    align="center" 
                    bg={`${category.color}20`} 
                    color={category.color}
                    borderRadius="full"
                    w="70px"
                    h="70px"
                    mx="auto"
                    mb={4}
                  >
                    <Icon as={category.icon} boxSize={7} />
                  </Flex>
                  
                  <Heading as="h3" size="md" mb={2}>
                    {category.name}
                  </Heading>
                  
                  <Text color={textColor} fontSize="sm">
                    {category.count} rifas
                  </Text>
                </MotionBox>
              </ChakraLink>
            </Link>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default RaffleCategories;