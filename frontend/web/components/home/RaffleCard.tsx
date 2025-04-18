import {
  Box,
  Flex,
  Image,
  Badge,
  Text,
  Stack,
  Heading,
  Avatar,
  useColorModeValue,
  Progress,
  Button,
  IconButton,
  HStack,
  Tooltip,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { FaHeart, FaRegHeart, FaShoppingCart, FaClock } from 'react-icons/fa';
import { useState } from 'react';
import Link from 'next/link';

const RaffleCard = ({ raffle }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const cardBg = useColorModeValue('white', 'gray.700');
  const progressColorScheme = raffle.soldTickets / raffle.totalTickets > 0.8 ? 'red' : 'purple';
  const soldPercent = Math.round((raffle.soldTickets / raffle.totalTickets) * 100);
  
  // Função para formatar preço
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };
  
  // Função que calcula quantos dias faltam para o término da rifa
  const calculateDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={cardBg}
      boxShadow="md"
      transition="transform 0.3s ease, box-shadow 0.3s ease"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'xl',
      }}
    >
      <Box position="relative">
        <Link href={`/raffles/${raffle.id}`} passHref>
          <ChakraLink _hover={{ textDecoration: 'none' }}>
            <Image 
              src={raffle.imageUrl} 
              alt={raffle.title} 
              width="100%" 
              height="200px"
              objectFit="cover"
            />
          </ChakraLink>
        </Link>
        
        <IconButton
          aria-label={isFavorited ? 'Remove dos favoritos' : 'Adicionar aos favoritos'}
          icon={isFavorited ? <FaHeart /> : <FaRegHeart />}
          position="absolute"
          top="2"
          right="2"
          variant="ghost"
          colorScheme="pink"
          onClick={() => setIsFavorited(!isFavorited)}
          bg="rgba(255, 255, 255, 0.8)"
          _hover={{ bg: 'rgba(255, 255, 255, 0.9)' }}
          size="sm"
          borderRadius="full"
        />
        
        {/* Badges */}
        <HStack position="absolute" top="2" left="2" spacing={2}>
          {raffle.isHot && (
            <Badge colorScheme="red" variant="solid" borderRadius="full" px={2}>
              Hot
            </Badge>
          )}
          {raffle.isFeatured && (
            <Badge colorScheme="purple" variant="solid" borderRadius="full" px={2}>
              Destaque
            </Badge>
          )}
          <Badge colorScheme="blue" variant="solid" borderRadius="full" px={2}>
            {raffle.category}
          </Badge>
        </HStack>
        
        {/* Creator */}
        <Flex 
          position="absolute" 
          bottom="-12px" 
          left="10px"
          align="center"
        >
          <Avatar 
            src={raffle.ownerAvatar} 
            size="sm" 
            border="2px solid white"
            mr={2}
          />
        </Flex>
      </Box>

      <Box p={4} pt={6}>
        <Flex justify="space-between" align="center" mt={2}>
          <Text fontSize="xs" color={textColor}>
            Por: {raffle.ownerName}
          </Text>
          <Flex align="center">
            <FaClock color="gray" size="12px" />
            <Text fontSize="xs" ml={1} color={textColor}>
              {calculateDaysRemaining(raffle.endDate)} dias restantes
            </Text>
          </Flex>
        </Flex>
        
        <Link href={`/raffles/${raffle.id}`} passHref>
          <ChakraLink _hover={{ textDecoration: 'none' }}>
            <Heading 
              as="h3" 
              size="md" 
              mt={2}
              noOfLines={2}
              height="50px"
            >
              {raffle.title}
            </Heading>
          </ChakraLink>
        </Link>

        <Text 
          fontSize="sm" 
          color={textColor} 
          mt={2}
          noOfLines={2}
          height="40px"
        >
          {raffle.description}
        </Text>
        
        <Box mt={4}>
          <Flex justify="space-between" mb={1}>
            <Text fontSize="sm" fontWeight="bold">
              Progresso
            </Text>
            <Text fontSize="sm">
              {raffle.soldTickets} / {raffle.totalTickets} números
            </Text>
          </Flex>
          <Progress 
            value={soldPercent} 
            size="sm" 
            colorScheme={progressColorScheme} 
            borderRadius="full" 
          />
        </Box>
        
        <Flex justify="space-between" align="center" mt={4}>
          <Text fontWeight="bold" fontSize="xl" color="purple.600">
            {formatPrice(raffle.price)}
          </Text>
          <Tooltip label="Cada número" placement="top">
            <Text fontSize="xs" color={textColor}>por número</Text>
          </Tooltip>
        </Flex>
        
        <Flex mt={4} justify="space-between">
          <Link href={`/raffles/${raffle.id}`} passHref>
            <Button
              as={ChakraLink}
              size="sm"
              variant="outline"
              colorScheme="purple"
              width="48%"
              _hover={{ textDecoration: 'none' }}
            >
              Ver detalhes
            </Button>
          </Link>
          <Button
            size="sm"
            colorScheme="purple"
            width="48%"
            leftIcon={<FaShoppingCart />}
            onClick={() => {
              console.log(`Adicionando rifa ${raffle.id} ao carrinho`);
              // Em um caso real, chamaria uma função para adicionar ao carrinho
            }}
          >
            Comprar
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default RaffleCard;