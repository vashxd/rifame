import { 
  Box, 
  SimpleGrid, 
  Flex, 
  Text, 
  Icon, 
  Stack, 
  Circle, 
  useColorModeValue 
} from '@chakra-ui/react';
import { 
  FaSearch, 
  FaCreditCard, 
  FaClipboardCheck, 
  FaTrophy 
} from 'react-icons/fa';

interface FeatureProps {
  title: string;
  text: string;
  icon: React.ReactElement;
  stepNumber: number;
}

const Feature = ({ title, text, icon, stepNumber }: FeatureProps) => {
  return (
    <Stack align={'center'} textAlign={'center'}>
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        mb={1}
        position="relative"
      >
        <Circle
          position="absolute"
          size="100%"
          bg={useColorModeValue('purple.100', 'purple.900')}
          opacity={0.3}
        />
        <Circle
          position="absolute"
          size="75%"
          bg={useColorModeValue('purple.100', 'purple.900')}
          opacity={0.5}
        />
        <Circle
          position="absolute"
          size="50%"
          bg="purple.500"
          color="white"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontWeight="bold" fontSize="lg">
            {stepNumber}
          </Text>
        </Circle>
      </Flex>
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'purple.500'}
        mb={4}
        boxShadow={'0px 4px 20px rgba(126, 58, 242, 0.3)'}
        zIndex={2}
      >
        {icon}
      </Flex>
      <Text fontWeight={600} fontSize="lg" mb={2}>{title}</Text>
      <Text color={useColorModeValue('gray.600', 'gray.400')}>{text}</Text>
    </Stack>
  );
};

export const HowItWorks = () => {
  return (
    <Box py={8}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
        <Feature
          icon={<Icon as={FaSearch} w={10} h={10} />}
          title={'Encontre uma Rifa'}
          text={
            'Navegue pelas rifas disponíveis ou pesquise por categorias para encontrar prêmios que você deseja concorrer.'
          }
          stepNumber={1}
        />
        <Feature
          icon={<Icon as={FaClipboardCheck} w={10} h={10} />}
          title={'Escolha seus Números'}
          text={
            'Selecione manualmente seus números da sorte ou utilize a seleção aleatória para escolher rapidamente.'
          }
          stepNumber={2}
        />
        <Feature
          icon={<Icon as={FaCreditCard} w={10} h={10} />}
          title={'Faça o Pagamento'}
          text={
            'Pague com segurança utilizando cartão de crédito, Pix, boleto ou sua carteira digital na plataforma.'
          }
          stepNumber={3}
        />
        <Feature
          icon={<Icon as={FaTrophy} w={10} h={10} />}
          title={'Concorra ao Prêmio'}
          text={
            'Acompanhe o sorteio ao vivo no dia marcado e veja se você foi o ganhador do prêmio!'
          }
          stepNumber={4}
        />
      </SimpleGrid>
    </Box>
  );
};