import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  Grid,
  GridItem,
  Badge,
  HStack,
  VStack,
  Divider,
  IconButton,
  Stack,
  Progress,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Avatar,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  FaCalendarAlt,
  FaShare,
  FaHeart,
  FaShoppingCart,
  FaInfoCircle,
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaCamera,
  FaCertificate,
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaTelegram,
} from 'react-icons/fa';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Layout from '../../components/layout/Layout';
import Link from 'next/link';

// Componente para selecionar números da rifa
const TicketSelector = ({ raffle, onAddToCart }) => {
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'available', 'selected'

  // Gerar bilhetes para demonstração
  const generateTickets = () => {
    const tickets = [];
    for (let i = 1; i <= raffle.totalTickets; i++) {
      const isSold = raffle.soldTickets.includes(i);
      const isSelected = selectedTickets.includes(i);
      tickets.push({
        number: i,
        status: isSold ? 'sold' : 'available',
        isSelected,
      });
    }
    return tickets;
  };

  const tickets = generateTickets();

  const filteredTickets = tickets.filter((ticket) => {
    if (filter === 'all') return true;
    if (filter === 'available') return ticket.status === 'available';
    if (filter === 'selected') return ticket.isSelected;
    return true;
  });

  const toggleTicket = (number) => {
    if (tickets.find((t) => t.number === number).status === 'sold') {
      return; // Não permite selecionar números já vendidos
    }

    setSelectedTickets((prev) =>
      prev.includes(number)
        ? prev.filter((n) => n !== number)
        : [...prev, number]
    );
  };

  const selectRandomTickets = (count) => {
    const availableTickets = tickets
      .filter((t) => t.status === 'available' && !selectedTickets.includes(t.number))
      .map((t) => t.number);

    if (availableTickets.length === 0) return;

    // Embaralha o array de bilhetes disponíveis
    const shuffled = [...availableTickets].sort(() => 0.5 - Math.random());
    
    // Pega a quantidade solicitada ou o máximo disponível
    const randomSelection = shuffled.slice(0, Math.min(count, shuffled.length));
    
    setSelectedTickets((prev) => [...prev, ...randomSelection]);
  };

  const clearSelection = () => {
    setSelectedTickets([]);
  };

  const addToCart = () => {
    if (selectedTickets.length === 0) return;
    onAddToCart(selectedTickets);
    clearSelection();
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <HStack>
          <Button
            size="sm"
            colorScheme={filter === 'all' ? 'purple' : 'gray'}
            onClick={() => setFilter('all')}
          >
            Todos
          </Button>
          <Button
            size="sm"
            colorScheme={filter === 'available' ? 'purple' : 'gray'}
            onClick={() => setFilter('available')}
          >
            Disponíveis
          </Button>
          <Button
            size="sm"
            colorScheme={filter === 'selected' ? 'purple' : 'gray'}
            onClick={() => setFilter('selected')}
          >
            Selecionados ({selectedTickets.length})
          </Button>
        </HStack>
        <HStack>
          <Button
            size="sm"
            colorScheme="blue"
            onClick={() => selectRandomTickets(5)}
          >
            +5 Aleatórios
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={clearSelection}
          >
            Limpar
          </Button>
        </HStack>
      </Flex>

      <Box 
        maxH="400px" 
        overflowY="auto" 
        borderWidth="1px" 
        borderRadius="md" 
        p={2}
      >
        <SimpleGrid columns={{ base: 5, md: 10 }} spacing={2}>
          {filteredTickets.map((ticket) => (
            <Button
              key={ticket.number}
              size="sm"
              variant={ticket.isSelected ? "solid" : "outline"}
              colorScheme={
                ticket.status === 'sold'
                  ? 'red'
                  : ticket.isSelected
                  ? 'green'
                  : 'gray'
              }
              opacity={ticket.status === 'sold' ? 0.7 : 1}
              onClick={() => toggleTicket(ticket.number)}
              isDisabled={ticket.status === 'sold'}
              w="100%"
              h="36px"
            >
              {ticket.number.toString().padStart(2, '0')}
            </Button>
          ))}
        </SimpleGrid>
      </Box>

      <Flex mt={4} justify="space-between" align="center">
        <Text fontWeight="bold">
          Total: {selectedTickets.length} números x R$ {raffle.price.toFixed(2)} = R$ {(selectedTickets.length * raffle.price).toFixed(2)}
        </Text>
        <Button
          colorScheme="purple"
          isDisabled={selectedTickets.length === 0}
          leftIcon={<FaShoppingCart />}
          onClick={addToCart}
        >
          Adicionar ao Carrinho
        </Button>
      </Flex>
    </Box>
  );
};

// Componente para exibir imagens da rifa
const ImageGallery = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  
  return (
    <Box position="relative">
      <Box
        position="relative"
        borderRadius="lg"
        overflow="hidden"
        cursor="pointer"
        onClick={onOpen}
      >
        <Image
          src={images[currentIndex]}
          alt={`Imagem ${currentIndex + 1}`}
          width="100%"
          height="400px"
          objectFit="cover"
        />
        <IconButton
          aria-label="Imagem anterior"
          icon={<FaChevronLeft />}
          position="absolute"
          left="10px"
          top="50%"
          transform="translateY(-50%)"
          colorScheme="blackAlpha"
          borderRadius="full"
          onClick={(e) => {
            e.stopPropagation();
            prevImage();
          }}
        />
        <IconButton
          aria-label="Próxima imagem"
          icon={<FaChevronRight />}
          position="absolute"
          right="10px"
          top="50%"
          transform="translateY(-50%)"
          colorScheme="blackAlpha"
          borderRadius="full"
          onClick={(e) => {
            e.stopPropagation();
            nextImage();
          }}
        />
      </Box>

      <HStack spacing={2} mt={2} overflowX="auto" py={2}>
        {images.map((image, index) => (
          <Box
            key={index}
            w="60px"
            h="60px"
            borderRadius="md"
            borderWidth="2px"
            borderColor={index === currentIndex ? "purple.500" : "transparent"}
            overflow="hidden"
            cursor="pointer"
            onClick={() => setCurrentIndex(index)}
          >
            <Image
              src={image}
              alt={`Miniatura ${index + 1}`}
              width="100%"
              height="100%"
              objectFit="cover"
            />
          </Box>
        ))}
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Galeria de imagens</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box position="relative">
              <Image
                src={images[currentIndex]}
                alt={`Imagem ${currentIndex + 1}`}
                width="100%"
                maxH="70vh"
                objectFit="contain"
              />
              <IconButton
                aria-label="Imagem anterior"
                icon={<FaChevronLeft />}
                position="absolute"
                left="10px"
                top="50%"
                transform="translateY(-50%)"
                colorScheme="blackAlpha"
                borderRadius="full"
                onClick={prevImage}
              />
              <IconButton
                aria-label="Próxima imagem"
                icon={<FaChevronRight />}
                position="absolute"
                right="10px"
                top="50%"
                transform="translateY(-50%)"
                colorScheme="blackAlpha"
                borderRadius="full"
                onClick={nextImage}
              />
            </Box>
            <HStack spacing={2} mt={4} overflowX="auto" py={2} justifyContent="center">
              {images.map((image, index) => (
                <Box
                  key={index}
                  w="80px"
                  h="80px"
                  borderRadius="md"
                  borderWidth="2px"
                  borderColor={index === currentIndex ? "purple.500" : "transparent"}
                  overflow="hidden"
                  cursor="pointer"
                  onClick={() => setCurrentIndex(index)}
                >
                  <Image
                    src={image}
                    alt={`Miniatura ${index + 1}`}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                  />
                </Box>
              ))}
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

// Página principal de detalhes da rifa
const RaffleDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [raffle, setRaffle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  
  const { isOpen: isShareOpen, onOpen: onShareOpen, onClose: onShareClose } = useDisclosure();

  useEffect(() => {
    if (!id) return;

    // Em um caso real, buscaríamos os dados da API
    // Aqui usando dados simulados para demonstração
    const fetchRaffle = async () => {
      // const response = await api.get(`/raffles/${id}`);
      // setRaffle(response.data);

      // Simulação de carregamento
      setTimeout(() => {
        setRaffle({
          id: 1,
          title: 'iPhone 15 Pro Max 256GB',
          description: 'iPhone 15 Pro Max novo na caixa com nota fiscal e garantia Apple. Cor: Titânio Preto. Memória: 256GB. Processador A17 Pro, câmera tripla de 48MP.',
          longDescription: `
            <p>iPhone 15 Pro Max totalmente novo, lacrado na caixa com nota fiscal e garantia Apple de 1 ano.</p>
            <p><strong>Especificações:</strong></p>
            <ul>
              <li>Cor: Titânio Preto</li>
              <li>Memória: 256GB</li>
              <li>Processador: A17 Pro</li>
              <li>Câmera tripla de 48MP</li>
              <li>Tela Super Retina XDR de 6,7 polegadas</li>
              <li>Face ID</li>
              <li>Resistente à água (IP68)</li>
            </ul>
            <p>Produto 100% original e com garantia completa.</p>
          `,
          images: [
            'https://via.placeholder.com/800x600?text=iPhone+Frontal',
            'https://via.placeholder.com/800x600?text=iPhone+Lateral',
            'https://via.placeholder.com/800x600?text=iPhone+Traseira',
            'https://via.placeholder.com/800x600?text=Caixa+Fechada',
            'https://via.placeholder.com/800x600?text=Acessórios'
          ],
          price: 10.00,
          totalTickets: 100,
          soldTickets: [3, 7, 12, 15, 22, 25, 30, 36, 42, 45, 53, 61, 72, 78, 85, 93, 98],
          drawDate: '2025-05-15T18:00:00',
          createdDate: '2025-04-01T10:30:00',
          status: 'active', // active, completed, cancelled
          category: 'Eletrônicos',
          creator: {
            id: 10,
            name: 'Carlos Silva',
            avatar: 'https://via.placeholder.com/40?text=CS',
            rating: 4.8,
            totalRaffles: 12,
            completedRaffles: 10,
            isVerified: true
          },
          rules: [
            'O sorteio será realizado pela plataforma na data e hora marcadas',
            'O vencedor receberá o produto em até 10 dias úteis após o sorteio',
            'O frete será pago pelo organizador da rifa',
            'O vencedor será notificado por e-mail e telefone'
          ]
        });
        setLoading(false);
      }, 1000);
    };

    fetchRaffle();
  }, [id]);

  const handleAddToCart = (tickets) => {
    setCartItems([...cartItems, ...tickets]);
  };

  const handleShareRaffle = (platform) => {
    const shareUrl = `https://rifa.me/raffles/${id}`;
    const shareText = `Estou participando da rifa "${raffle?.title}". Concorra você também!`;

    let shareLink = '';
    switch (platform) {
      case 'whatsapp':
        shareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'telegram':
        shareLink = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      default:
        // Copiar link
        navigator.clipboard.writeText(shareUrl);
        return;
    }

    window.open(shareLink, '_blank');
    onShareClose();
  };

  if (loading || !raffle) {
    return (
      <Layout>
        <Container maxW="container.xl" py={10}>
          <VStack spacing={8} align="center">
            <Heading>Carregando detalhes da rifa...</Heading>
          </VStack>
        </Container>
      </Layout>
    );
  }

  const percentageSold = Math.round((raffle.soldTickets.length / raffle.totalTickets) * 100);
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(raffle.price);
  const formattedDrawDate = format(new Date(raffle.drawDate), "dd 'de' MMMM 'às' HH:mm", {
    locale: ptBR
  });
  const formattedCreatedDate = format(new Date(raffle.createdDate), "dd/MM/yyyy", {
    locale: ptBR
  });

  return (
    <Layout>
      <Head>
        <title>{raffle.title} | RIFA.me</title>
        <meta name="description" content={raffle.description} />
      </Head>

      <Container maxW="container.xl" py={10}>
        {/* Navegação de retorno */}
        <Box mb={6}>
          <Link href="/raffles" passHref>
            <Button
              leftIcon={<FaArrowLeft />}
              variant="ghost"
              size="sm"
              colorScheme="purple"
            >
              Voltar para Rifas
            </Button>
          </Link>
        </Box>

        {/* Cabeçalho da rifa */}
        <Grid
          templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
          gap={{ base: 8, lg: 12 }}
        >
          {/* Coluna da esquerda - Imagens */}
          <GridItem>
            <ImageGallery images={raffle.images} />
          </GridItem>

          {/* Coluna da direita - Informações */}
          <GridItem>
            <VStack align="start" spacing={4}>
              <Badge colorScheme="purple" fontSize="sm" px={2} py={1} borderRadius="full">
                {raffle.category}
              </Badge>
              
              <Heading size="xl">{raffle.title}</Heading>
              
              <Text fontSize="lg">{raffle.description}</Text>
              
              <HStack spacing={4}>
                <Flex align="center">
                  <Avatar size="sm" src={raffle.creator.avatar} mr={2} />
                  <VStack spacing={0} align="start">
                    <Text fontSize="sm">Criado por</Text>
                    <HStack>
                      <Text fontWeight="bold">{raffle.creator.name}</Text>
                      {raffle.creator.isVerified && (
                        <FaCertificate color="#1D9BF0" size="14px" />
                      )}
                    </HStack>
                  </VStack>
                </Flex>
                <Text color="gray.500" fontSize="sm">
                  Criado em {formattedCreatedDate}
                </Text>
              </HStack>

              <Divider />
              
              <HStack width="100%" justify="space-between">
                <VStack align="start" spacing={0}>
                  <Text color="gray.500" fontSize="sm">Preço por número</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                    {formattedPrice}
                  </Text>
                </VStack>
                
                <VStack align="start" spacing={0}>
                  <Text color="gray.500" fontSize="sm">Data do sorteio</Text>
                  <Flex align="center">
                    <FaCalendarAlt color="#805AD5" />
                    <Text ml={2} fontWeight="bold">{formattedDrawDate}</Text>
                  </Flex>
                </VStack>
              </HStack>
              
              <Box w="100%">
                <Flex justify="space-between" mb={1}>
                  <Text fontSize="sm" fontWeight="bold">
                    {percentageSold}% vendido
                  </Text>
                  <Text fontSize="sm">
                    {raffle.soldTickets.length} / {raffle.totalTickets} números
                  </Text>
                </Flex>
                <Progress
                  value={percentageSold}
                  size="sm"
                  colorScheme="purple"
                  borderRadius="full"
                />
              </Box>
              
              <HStack width="100%" spacing={4}>
                <Button
                  leftIcon={<FaShare />}
                  variant="outline"
                  colorScheme="purple"
                  onClick={onShareOpen}
                >
                  Compartilhar
                </Button>
                <Button
                  leftIcon={<FaHeart />}
                  variant="outline"
                  colorScheme="red"
                >
                  Favoritar
                </Button>
              </HStack>
            </VStack>
          </GridItem>
        </Grid>

        {/* Modal de compartilhamento */}
        <Modal isOpen={isShareOpen} onClose={onShareClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Compartilhar rifa</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <Text>Compartilhe esta rifa com seus amigos:</Text>
                <HStack spacing={4} justify="center" width="100%">
                  <IconButton
                    aria-label="Compartilhar no WhatsApp"
                    icon={<FaWhatsapp />}
                    colorScheme="green"
                    size="lg"
                    borderRadius="full"
                    onClick={() => handleShareRaffle('whatsapp')}
                  />
                  <IconButton
                    aria-label="Compartilhar no Facebook"
                    icon={<FaFacebook />}
                    colorScheme="facebook"
                    size="lg"
                    borderRadius="full"
                    onClick={() => handleShareRaffle('facebook')}
                  />
                  <IconButton
                    aria-label="Compartilhar no Twitter"
                    icon={<FaTwitter />}
                    colorScheme="twitter"
                    size="lg"
                    borderRadius="full"
                    onClick={() => handleShareRaffle('twitter')}
                  />
                  <IconButton
                    aria-label="Compartilhar no Telegram"
                    icon={<FaTelegram />}
                    colorScheme="blue"
                    size="lg"
                    borderRadius="full"
                    onClick={() => handleShareRaffle('telegram')}
                  />
                </HStack>
                <Button 
                  width="100%" 
                  onClick={() => handleShareRaffle('copy')}
                >
                  Copiar link
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Conteúdo da rifa - Abas */}
        <Box mt={10}>
          <Tabs colorScheme="purple" variant="enclosed">
            <TabList>
              <Tab>Números</Tab>
              <Tab>Detalhes</Tab>
              <Tab>Regras</Tab>
              <Tab>Vendedor</Tab>
            </TabList>

            <TabPanels>
              {/* Aba de Números */}
              <TabPanel>
                <TicketSelector raffle={raffle} onAddToCart={handleAddToCart} />
              </TabPanel>
              
              {/* Aba de Detalhes */}
              <TabPanel>
                <Box
                  dangerouslySetInnerHTML={{ __html: raffle.longDescription }}
                  fontSize="md"
                  lineHeight="tall"
                />
              </TabPanel>
              
              {/* Aba de Regras */}
              <TabPanel>
                <VStack align="start" spacing={4}>
                  <Text fontWeight="bold" fontSize="lg">
                    Regras da rifa:
                  </Text>
                  <Box as="ul" pl={5}>
                    {raffle.rules.map((rule, index) => (
                      <Box as="li" key={index} mb={2}>
                        {rule}
                      </Box>
                    ))}
                  </Box>
                  <Box
                    mt={4}
                    p={4}
                    borderRadius="md"
                    bg={useColorModeValue('purple.50', 'purple.900')}
                    borderLeft="4px solid"
                    borderColor="purple.500"
                  >
                    <Flex>
                      <Box mr={3} color="purple.500">
                        <FaInfoCircle size="20px" />
                      </Box>
                      <Text>
                        A RIFA.me não se responsabiliza pela entrega do prêmio, atuando apenas como intermediadora entre o organizador da rifa e os participantes.
                      </Text>
                    </Flex>
                  </Box>
                </VStack>
              </TabPanel>
              
              {/* Aba de Vendedor */}
              <TabPanel>
                <VStack align="start" spacing={6}>
                  <Flex
                    direction={{ base: 'column', md: 'row' }}
                    align={{ base: 'center', md: 'start' }}
                    w="100%"
                    bg={useColorModeValue('gray.50', 'gray.800')}
                    p={5}
                    borderRadius="lg"
                  >
                    <Avatar
                      size="xl"
                      src={raffle.creator.avatar}
                      mr={{ base: 0, md: 6 }}
                      mb={{ base: 4, md: 0 }}
                    />
                    <Box flex="1">
                      <Flex align="center" mb={2}>
                        <Heading size="md" mr={2}>
                          {raffle.creator.name}
                        </Heading>
                        {raffle.creator.isVerified && (
                          <Flex
                            bg="blue.400"
                            color="white"
                            p={1}
                            borderRadius="full"
                            boxSize="20px"
                            align="center"
                            justify="center"
                          >
                            <FaCertificate size="12px" />
                          </Flex>
                        )}
                      </Flex>
                      <HStack spacing={6} mb={4}>
                        <VStack align="start" spacing={0}>
                          <Text color="gray.500" fontSize="sm">
                            Avaliação
                          </Text>
                          <HStack>
                            <Text fontWeight="bold">
                              {raffle.creator.rating.toFixed(1)}
                            </Text>
                            <Box color="yellow.400">
                              <FaCertificate />
                            </Box>
                          </HStack>
                        </VStack>
                        <VStack align="start" spacing={0}>
                          <Text color="gray.500" fontSize="sm">
                            Rifas criadas
                          </Text>
                          <Text fontWeight="bold">
                            {raffle.creator.totalRaffles}
                          </Text>
                        </VStack>
                        <VStack align="start" spacing={0}>
                          <Text color="gray.500" fontSize="sm">
                            Rifas concluídas
                          </Text>
                          <Text fontWeight="bold">
                            {raffle.creator.completedRaffles}
                          </Text>
                        </VStack>
                      </HStack>
                      <Button 
                        colorScheme="purple" 
                        variant="outline"
                        size="sm"
                      >
                        Ver todas as rifas deste vendedor
                      </Button>
                    </Box>
                  </Flex>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </Layout>
  );
};

export default RaffleDetail;