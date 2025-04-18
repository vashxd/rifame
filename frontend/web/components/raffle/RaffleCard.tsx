import {
  Box,
  Image,
  Badge,
  Text,
  Stack,
  Heading,
  Flex,
  Progress,
  Button,
  Avatar,
  useColorModeValue,
  HStack
} from '@chakra-ui/react';
import { FaCalendarAlt, FaTicketAlt } from 'react-icons/fa';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RaffleCardProps {
  raffle: {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    price: number;
    totalTickets: number;
    ticketsSold: number;
    drawDate: string;
    creatorName: string;
    creatorAvatar: string;
    category: string;
  };
}

const RaffleCard = ({ raffle }: RaffleCardProps) => {
  const {
    id,
    title,
    description,
    imageUrl,
    price,
    totalTickets,
    ticketsSold,
    drawDate,
    creatorName,
    creatorAvatar,
    category
  } = raffle;

  const percentageSold = Math.round((ticketsSold / totalTickets) * 100);
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);

  // Formatar a data do sorteio
  const formattedDrawDate = format(new Date(drawDate), "dd 'de' MMMM 'às' HH:mm", {
    locale: ptBR
  });

  return (
    <Box
      maxW={'100%'}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      bg={useColorModeValue('white', 'gray.800')}
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'xl',
      }}
    >
      <Box position="relative">
        <Image
          src={imageUrl}
          alt={title}
          objectFit="cover"
          width="100%"
          height="200px"
        />
        <Badge
          position="absolute"
          top="10px"
          right="10px"
          colorScheme="purple"
          borderRadius="full"
          px="2"
          fontSize="0.8em"
        >
          {category}
        </Badge>
      </Box>

      <Box p={5}>
        <Stack spacing={2}>
          <Heading as="h3" size="md" noOfLines={1}>
            {title}
          </Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')} fontSize="sm" noOfLines={2}>
            {description}
          </Text>

          <HStack spacing={2} mt={1} color={useColorModeValue('gray.600', 'gray.300')}>
            <FaCalendarAlt />
            <Text fontSize="sm">{formattedDrawDate}</Text>
          </HStack>

          <Box mt={2}>
            <Flex align="center" justify="space-between" mb={1}>
              <Text fontSize="sm" fontWeight="bold">
                {percentageSold}% vendido
              </Text>
              <Text fontSize="sm">
                {ticketsSold} / {totalTickets} números
              </Text>
            </Flex>
            <Progress
              value={percentageSold}
              size="sm"
              colorScheme="purple"
              borderRadius="full"
            />
          </Box>

          <Flex justify="space-between" align="center" mt={3}>
            <HStack>
              <Avatar src={creatorAvatar} size="xs" name={creatorName} />
              <Text fontSize="sm">{creatorName}</Text>
            </HStack>
            <Text fontWeight="bold" fontSize="md" color="purple.600">
              {formattedPrice}
            </Text>
          </Flex>

          <Button
            mt={4}
            colorScheme="purple"
            leftIcon={<FaTicketAlt />}
            width="100%"
            size="md"
          >
            <Link href={`/raffles/${id}`}>
              Comprar Agora
            </Link>
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default RaffleCard;