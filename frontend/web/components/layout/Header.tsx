import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link as ChakraLink,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Badge,
  InputGroup,
  Input,
  InputRightElement,
  Container,
  Image,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  SearchIcon,
  BellIcon,
} from '@chakra-ui/icons';
import { 
  FaPlus, 
  FaTicketAlt, 
  FaUser, 
  FaSignOutAlt, 
  FaWallet, 
  FaCog, 
  FaShoppingCart, 
  FaHeart 
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const NavLink = ({ children, href, isActive }) => (
  <Link href={href} passHref>
    <ChakraLink
      px={2}
      py={1}
      rounded={'md'}
      fontWeight={isActive ? 'bold' : 'medium'}
      color={isActive ? 'purple.500' : useColorModeValue('gray.600', 'gray.200')}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.100', 'gray.700'),
      }}
    >
      {children}
    </ChakraLink>
  </Link>
);

const Header = () => {
  const { isOpen, onToggle } = useDisclosure();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(2);

  // Simular autenticação para demonstração
  useEffect(() => {
    // Em um caso real, verificaria o token de autenticação
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    };

    // Simular para demonstração
    setIsAuthenticated(false);
    
    // Simulação de itens no carrinho
    setCartCount(3);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Box 
      borderBottom={1}
      borderStyle={'solid'}
      borderColor={useColorModeValue('gray.200', 'gray.900')}
      bg={useColorModeValue('white', 'gray.800')}
      position="sticky"
      top={0}
      zIndex={1000}
      boxShadow="sm"
    >
      <Container maxW={'container.xl'}>
        <Flex
          color={useColorModeValue('gray.600', 'white')}
          minH={'60px'}
          py={{ base: 2 }}
          px={{ base: 4 }}
          align={'center'}
        >
          <Flex
            flex={{ base: 1, md: 'auto' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', md: 'none' }}
          >
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
              }
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
            />
          </Flex>
          
          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
            <Link href="/" passHref>
              <ChakraLink
                textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
                fontFamily={'heading'}
                color={useColorModeValue('gray.800', 'white')}
                _hover={{
                  textDecoration: 'none',
                }}
              >
                <Image
                  src="/assets/logo.png"
                  fallbackSrc="https://via.placeholder.com/150x50?text=RIFA.me"
                  alt="RIFA.me Logo"
                  height="40px"
                />
              </ChakraLink>
            </Link>

            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <DesktopNav router={router} />
            </Flex>
          </Flex>

          <Stack
            flex={{ base: 1, md: 1 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}
            align="center"
          >
            <Box
              display={{ base: 'none', md: 'flex' }}
              maxW="300px"
              flex={1}
            >
              <form onSubmit={handleSearch}>
                <InputGroup size="sm">
                  <Input
                    placeholder="Buscar rifas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    borderRadius="full"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label="Buscar"
                      icon={<SearchIcon />}
                      size="sm"
                      type="submit"
                      borderRadius="full"
                      colorScheme="purple"
                      variant="ghost"
                    />
                  </InputRightElement>
                </InputGroup>
              </form>
            </Box>

            <Link href="/cart" passHref>
              <IconButton
                aria-label="Carrinho"
                icon={<FaShoppingCart />}
                variant="ghost"
                position="relative"
                colorScheme="purple"
              />
            </Link>
            {cartCount > 0 && (
              <Badge
                colorScheme="red"
                borderRadius="full"
                position="absolute"
                top="10px"
                right="80px"
                fontSize="0.7em"
              >
                {cartCount}
              </Badge>
            )}

            {isAuthenticated ? (
              <>
                <IconButton
                  aria-label="Notificações"
                  icon={<BellIcon />}
                  variant="ghost"
                  position="relative"
                  colorScheme="purple"
                />
                {notificationCount > 0 && (
                  <Badge
                    colorScheme="red"
                    borderRadius="full"
                    position="absolute"
                    top="10px"
                    right="45px"
                    fontSize="0.7em"
                  >
                    {notificationCount}
                  </Badge>
                )}

                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={'full'}
                    variant={'link'}
                    cursor={'pointer'}
                    minW={0}
                  >
                    <Avatar
                      size={'sm'}
                      src="https://via.placeholder.com/150"
                    />
                  </MenuButton>
                  <MenuList zIndex={1001}>
                    <MenuItem icon={<FaUser />}>
                      <Link href="/profile">Meu Perfil</Link>
                    </MenuItem>
                    <MenuItem icon={<FaTicketAlt />}>
                      <Link href="/my-raffles">Minhas Rifas</Link>
                    </MenuItem>
                    <MenuItem icon={<FaHeart />}>
                      <Link href="/favorites">Favoritos</Link>
                    </MenuItem>
                    <MenuItem icon={<FaWallet />}>
                      <Link href="/wallet">Carteira</Link>
                    </MenuItem>
                    <MenuItem icon={<FaCog />}>
                      <Link href="/settings">Configurações</Link>
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem icon={<FaSignOutAlt />}>Sair</MenuItem>
                  </MenuList>
                </Menu>
              </>
            ) : (
              <Stack
                flex={{ base: 1, md: 0 }}
                justify={'flex-end'}
                direction={'row'}
                spacing={3}
              >
                <Link href="/login" passHref>
                  <Button
                    as={'a'}
                    fontSize={'sm'}
                    fontWeight={400}
                    variant={'ghost'}
                  >
                    Entrar
                  </Button>
                </Link>
                <Link href="/register" passHref>
                  <Button
                    as={'a'}
                    display={{ base: 'none', md: 'inline-flex' }}
                    fontSize={'sm'}
                    fontWeight={600}
                    color={'white'}
                    bg={'purple.500'}
                    _hover={{
                      bg: 'purple.400',
                    }}
                  >
                    Cadastrar
                  </Button>
                </Link>
              </Stack>
            )}

            <Link href="/create-raffle" passHref>
              <Button
                leftIcon={<FaPlus />}
                colorScheme="purple"
                variant="outline"
                size="sm"
                display={{ base: 'none', md: 'inline-flex' }}
              >
                Criar Rifa
              </Button>
            </Link>
          </Stack>
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <MobileNav />
        </Collapse>
      </Container>
    </Box>
  );
};

const DesktopNav = ({ router }) => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Box>
                <NavLink 
                  href={navItem.href ?? '#'} 
                  isActive={router?.pathname === navItem.href}
                >
                  {navItem.label}
                </NavLink>
              </Box>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Link href={href} passHref>
      <ChakraLink
        role={'group'}
        display={'block'}
        p={2}
        rounded={'md'}
        _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}
      >
        <Stack direction={'row'} align={'center'}>
          <Box>
            <Text
              transition={'all .3s ease'}
              _groupHover={{ color: 'purple.400' }}
              fontWeight={500}
            >
              {label}
            </Text>
            <Text fontSize={'sm'}>{subLabel}</Text>
          </Box>
          <Flex
            transition={'all .3s ease'}
            transform={'translateX(-10px)'}
            opacity={0}
            _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
            justify={'flex-end'}
            align={'center'}
            flex={1}
          >
            <Icon color={'purple.400'} w={5} h={5} as={ChevronRightIcon} />
          </Flex>
        </Stack>
      </ChakraLink>
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
      <Stack spacing={4} pt={4}>
        <InputGroup>
          <Input placeholder="Buscar rifas..." borderRadius="full" />
          <InputRightElement>
            <IconButton
              aria-label="Buscar"
              icon={<SearchIcon />}
              size="sm"
              borderRadius="full"
            />
          </InputRightElement>
        </InputGroup>
      </Stack>
      <Link href="/create-raffle" passHref>
        <Button
          leftIcon={<FaPlus />}
          colorScheme="purple"
          variant="outline"
          size="sm"
          w="100%"
          mt={4}
        >
          Criar Rifa
        </Button>
      </Link>
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} href={child.href} passHref>
                <ChakraLink py={2}>{child.label}</ChakraLink>
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const NAV_ITEMS = [
  {
    label: 'Início',
    href: '/',
  },
  {
    label: 'Explorar',
    href: '/raffles',
    children: [
      {
        label: 'Todas as Rifas',
        subLabel: 'Veja todas as rifas disponíveis',
        href: '/raffles',
      },
      {
        label: 'Categorias',
        subLabel: 'Encontre rifas por categorias',
        href: '/categories',
      },
      {
        label: 'Mais Populares',
        subLabel: 'As rifas mais populares do momento',
        href: '/raffles/popular',
      },
      {
        label: 'Prestes a Encerrar',
        subLabel: 'Rifas que estão quase acabando',
        href: '/raffles/ending-soon',
      },
    ],
  },
  {
    label: 'Como Funciona',
    href: '/how-it-works',
  },
  {
    label: 'Blog',
    href: '/blog',
  },
  {
    label: 'Ajuda',
    href: '/help',
  },
];

export default Header;