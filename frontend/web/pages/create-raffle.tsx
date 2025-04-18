import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack,
  Text,
  Textarea,
  Select,
  HStack,
  SimpleGrid,
  Divider,
  useToast,
  Flex,
  Icon,
  Image,
  IconButton,
  Tag,
  TagLabel,
  TagCloseButton,
  useColorModeValue,
  Checkbox,
  Radio,
  RadioGroup,
  Tooltip,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepTitle,
  StepDescription,
  StepIcon,
  StepNumber,
  StepSeparator,
  useSteps,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import {
  FaCalendarAlt,
  FaUpload,
  FaImage,
  FaTimes,
  FaInfoCircle,
  FaQuestionCircle,
  FaCheckCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';

// Componente para upload de imagens
const ImageUploader = ({ onImageSelect, selectedImages, onRemoveImage }) => {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Em um ambiente real, aqui faria o upload para o servidor
    // e retornaria as URLs das imagens
    // Simulando URLs para demonstração
    const newImages = files.map((file) => ({
      id: Math.random().toString(36).substring(2, 11),
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
    }));

    onImageSelect(newImages);
  };

  const maxImages = 5;
  const canAddMoreImages = selectedImages.length < maxImages;

  return (
    <Box>
      <input
        type="file"
        multiple
        accept="image/*"
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={handleImageChange}
        disabled={!canAddMoreImages}
      />
      
      <SimpleGrid columns={{ base: 1, md: 5 }} spacing={4} mb={4}>
        {selectedImages.map((image, index) => (
          <Box 
            key={image.id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            position="relative"
            height="150px"
          >
            <Image
              src={image.previewUrl}
              alt={`Imagem ${index + 1}`}
              objectFit="cover"
              width="100%"
              height="100%"
            />
            <IconButton
              aria-label="Remover imagem"
              icon={<FaTimes />}
              size="sm"
              colorScheme="red"
              position="absolute"
              top={2}
              right={2}
              onClick={() => onRemoveImage(image.id)}
            />
            {index === 0 && (
              <Tag
                position="absolute"
                bottom={2}
                left={2}
                colorScheme="purple"
                size="sm"
              >
                Principal
              </Tag>
            )}
          </Box>
        ))}
        
        {canAddMoreImages && (
          <Box
            borderWidth="2px"
            borderRadius="lg"
            borderStyle="dashed"
            height="150px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            onClick={handleClick}
            _hover={{ bg: 'gray.50' }}
          >
            <Stack spacing={2} align="center">
              <Icon as={FaUpload} boxSize={8} color="gray.400" />
              <Text fontSize="sm" color="gray.500">
                Adicionar imagem
              </Text>
            </Stack>
          </Box>
        )}
      </SimpleGrid>
      
      <Text fontSize="sm" color="gray.500">
        {selectedImages.length} de {maxImages} imagens - A primeira imagem será definida como a principal da rifa
      </Text>
    </Box>
  );
};

// Passos do formulário
const steps = [
  { title: 'Informações básicas', description: 'Título, descrição, categoria' },
  { title: 'Detalhes e regras', description: 'Números, preço, sorteio' },
  { title: 'Imagens', description: 'Fotos do prêmio' },
  { title: 'Revisão', description: 'Verificar e publicar' },
];

// Componente principal
const CreateRaffle = () => {
  const toast = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const { activeStep, setActiveStep } = useSteps({ index: 0, count: steps.length });
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      category: '',
      prizeDescription: '',
      prizeValue: 0,
      ticketPrice: 5.00,
      totalTickets: 100,
      drawMethod: 'automatic',
      drawDate: '',
      rules: '',
      isCharity: false,
      charityPercentage: 0,
      minimumSalesPercentage: 0,
      hasCautionDeposit: false,
      cautionDepositAmount: 0,
      hasAutoDrawEnabled: true,
    },
  });

  const handleImageSelect = (newImages) => {
    setSelectedImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (id) => {
    setSelectedImages((prev) => prev.filter((image) => image.id !== id));
  };

  const isFormStepValid = () => {
    // Validação para cada etapa
    switch (activeStep) {
      case 0:
        const { title, description, category } = watch();
        return title.trim() !== '' && description.trim() !== '' && category !== '';
      case 1:
        const { 
          prizeDescription, 
          prizeValue, 
          ticketPrice, 
          totalTickets, 
          drawDate 
        } = watch();
        return (
          prizeDescription.trim() !== '' && 
          prizeValue > 0 && 
          ticketPrice > 0 && 
          totalTickets > 0 && 
          drawDate !== ''
        );
      case 2:
        return selectedImages.length > 0;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (isFormStepValid()) {
      setActiveStep((prevStep) => prevStep + 1);
    } else {
      toast({
        title: 'Preencha todos os campos obrigatórios',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const prevStep = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const onSubmit = async (data) => {
    if (selectedImages.length === 0) {
      toast({
        title: 'Adicione pelo menos uma imagem',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    setIsSubmitting(true);

    // Criar objeto com dados do formulário e imagens
    const raffleData = {
      ...data,
      images: selectedImages,
    };

    try {
      console.log('Dados da rifa:', raffleData);
      // Em um caso real, faria a chamada à API
      // await api.post('/raffles', formData);

      // Simulação de delay para demonstração
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: 'Rifa criada com sucesso!',
        description: 'Sua rifa foi enviada para aprovação e estará disponível em breve.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });

      // Redirecionar para a página de rifas do usuário
      // router.push('/my-raffles');
    } catch (error) {
      console.error('Erro ao criar rifa:', error);
      toast({
        title: 'Erro ao criar rifa',
        description: 'Ocorreu um erro ao criar sua rifa. Tente novamente mais tarde.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Observar valores do formulário para campos dependentes
  const isCharity = watch('isCharity');
  const hasCautionDeposit = watch('hasCautionDeposit');
  const formValues = watch();

  return (
    <Layout>
      <Head>
        <title>Criar Rifa | RIFA.me</title>
      </Head>

      <Container maxW="container.lg" py={10}>
        <Stack spacing={8}>
          <Box textAlign="center">
            <Heading as="h1" size="xl" mb={2}>
              Criar uma Nova Rifa
            </Heading>
            <Text color={useColorModeValue('gray.600', 'gray.400')}>
              Preencha as informações abaixo para criar sua rifa
            </Text>
          </Box>

          <Stepper size='lg' index={activeStep} colorScheme="purple" mb={8}>
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>

                <Box flexShrink='0'>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </Box>

                <StepSeparator />
              </Step>
            ))}
          </Stepper>

          <Box
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            bg={useColorModeValue('white', 'gray.800')}
            p={8}
            borderRadius="lg"
            boxShadow="base"
          >
            {/* Etapa 1: Informações básicas */}
            {activeStep === 0 && (
              <Stack spacing={6}>
                <Heading size="md" mb={4}>
                  Informações Básicas
                </Heading>

                <FormControl isInvalid={errors.title}>
                  <FormLabel htmlFor="title">Título da Rifa</FormLabel>
                  <Input
                    id="title"
                    placeholder="Ex: iPhone 15 Pro Max 256GB"
                    {...register('title', {
                      required: 'Título é obrigatório',
                      maxLength: {
                        value: 80,
                        message: 'Título não pode ter mais de 80 caracteres',
                      },
                    })}
                  />
                  <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.description}>
                  <FormLabel htmlFor="description">Descrição curta</FormLabel>
                  <Textarea
                    id="description"
                    placeholder="Descreva brevemente o prêmio da rifa"
                    {...register('description', {
                      required: 'Descrição é obrigatória',
                      maxLength: {
                        value: 200,
                        message: 'Descrição não pode ter mais de 200 caracteres',
                      },
                    })}
                    maxLength={200}
                    rows={3}
                  />
                  <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.category}>
                  <FormLabel htmlFor="category">Categoria</FormLabel>
                  <Select
                    id="category"
                    placeholder="Selecione a categoria"
                    {...register('category', {
                      required: 'Categoria é obrigatória',
                    })}
                  >
                    <option value="Eletrônicos">Eletrônicos</option>
                    <option value="Veículos">Veículos</option>
                    <option value="Imóveis">Imóveis</option>
                    <option value="Viagens">Viagens</option>
                    <option value="Beneficente">Beneficente</option>
                    <option value="Games">Games</option>
                    <option value="Moda">Moda</option>
                    <option value="Esportes">Esportes</option>
                    <option value="Gastronomia">Gastronomia</option>
                    <option value="Outros">Outros</option>
                  </Select>
                  <FormErrorMessage>{errors.category?.message}</FormErrorMessage>
                </FormControl>
              </Stack>
            )}

            {/* Etapa 2: Detalhes e regras */}
            {activeStep === 1 && (
              <Stack spacing={6}>
                <Heading size="md" mb={4}>
                  Detalhes e Regras
                </Heading>

                <FormControl isInvalid={errors.prizeDescription}>
                  <FormLabel htmlFor="prizeDescription">Descrição detalhada do prêmio</FormLabel>
                  <Textarea
                    id="prizeDescription"
                    placeholder="Descreva detalhadamente o prêmio, suas características, estado de conservação, etc."
                    {...register('prizeDescription', {
                      required: 'Descrição do prêmio é obrigatória',
                    })}
                    rows={5}
                  />
                  <FormErrorMessage>{errors.prizeDescription?.message}</FormErrorMessage>
                </FormControl>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <FormControl isInvalid={errors.prizeValue}>
                    <FormLabel htmlFor="prizeValue">Valor do prêmio</FormLabel>
                    <Controller
                      name="prizeValue"
                      control={control}
                      rules={{
                        required: 'Valor do prêmio é obrigatório',
                        min: {
                          value: 1,
                          message: 'Valor deve ser maior que 0',
                        },
                      }}
                      render={({ field }) => (
                        <NumberInput
                          id="prizeValue"
                          min={1}
                          precision={2}
                          step={10}
                          {...field}
                        >
                          <NumberInputField placeholder="Ex: 5000.00" />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      )}
                    />
                    <FormErrorMessage>{errors.prizeValue?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={errors.ticketPrice}>
                    <FormLabel htmlFor="ticketPrice">
                      Preço por número
                      <Tooltip label="Valor que cada participante pagará por número" hasArrow>
                        <Box as="span" ml={1} display="inline-block">
                          <FaQuestionCircle />
                        </Box>
                      </Tooltip>
                    </FormLabel>
                    <Controller
                      name="ticketPrice"
                      control={control}
                      rules={{
                        required: 'Preço por número é obrigatório',
                        min: {
                          value: 1,
                          message: 'Preço deve ser maior que 0',
                        },
                      }}
                      render={({ field }) => (
                        <NumberInput
                          id="ticketPrice"
                          min={1}
                          precision={2}
                          step={1}
                          {...field}
                        >
                          <NumberInputField placeholder="Ex: 10.00" />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      )}
                    />
                    <FormErrorMessage>{errors.ticketPrice?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={errors.totalTickets}>
                    <FormLabel htmlFor="totalTickets">
                      Total de números
                      <Tooltip label="Quantidade total de números disponíveis para venda" hasArrow>
                        <Box as="span" ml={1} display="inline-block">
                          <FaQuestionCircle />
                        </Box>
                      </Tooltip>
                    </FormLabel>
                    <Controller
                      name="totalTickets"
                      control={control}
                      rules={{
                        required: 'Total de números é obrigatório',
                        min: {
                          value: 10,
                          message: 'Mínimo de 10 números',
                        },
                        max: {
                          value: 10000,
                          message: 'Máximo de 10.000 números',
                        },
                      }}
                      render={({ field }) => (
                        <NumberInput
                          id="totalTickets"
                          min={10}
                          max={10000}
                          step={10}
                          {...field}
                        >
                          <NumberInputField placeholder="Ex: 100" />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      )}
                    />
                    <FormErrorMessage>{errors.totalTickets?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={errors.drawDate}>
                    <FormLabel htmlFor="drawDate">
                      Data do sorteio
                      <Tooltip label="Data e hora em que o sorteio será realizado" hasArrow>
                        <Box as="span" ml={1} display="inline-block">
                          <FaQuestionCircle />
                        </Box>
                      </Tooltip>
                    </FormLabel>
                    <Input
                      id="drawDate"
                      type="datetime-local"
                      {...register('drawDate', {
                        required: 'Data do sorteio é obrigatória',
                      })}
                    />
                    <FormErrorMessage>{errors.drawDate?.message}</FormErrorMessage>
                  </FormControl>
                </SimpleGrid>

                <Divider my={2} />

                <FormControl>
                  <FormLabel htmlFor="drawMethod">Método de sorteio</FormLabel>
                  <Controller
                    name="drawMethod"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup {...field}>
                        <Stack direction="column" spacing={4}>
                          <Radio value="automatic">
                            <Box>
                              <Text fontWeight="bold">Automático pela plataforma</Text>
                              <Text fontSize="sm" color="gray.500">
                                O sorteio será realizado automaticamente pelo sistema RIFA.me
                              </Text>
                            </Box>
                          </Radio>
                          <Radio value="live">
                            <Box>
                              <Text fontWeight="bold">Ao vivo</Text>
                              <Text fontSize="sm" color="gray.500">
                                Você realizará o sorteio ao vivo através da plataforma RIFA.me
                              </Text>
                            </Box>
                          </Radio>
                        </Stack>
                      </RadioGroup>
                    )}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="rules">Regras adicionais (opcional)</FormLabel>
                  <Textarea
                    id="rules"
                    placeholder="Descreva regras específicas para esta rifa, como forma de entrega do prêmio, responsabilidade por fretes, etc."
                    {...register('rules')}
                    rows={4}
                  />
                </FormControl>

                <Divider my={2} />
                
                <Box>
                  <Heading size="sm" mb={4}>
                    Configurações avançadas (opcionais)
                  </Heading>

                  <Stack spacing={4}>
                    <FormControl>
                      <Checkbox {...register('isCharity')}>
                        Esta é uma rifa beneficente
                      </Checkbox>
                    </FormControl>

                    {isCharity && (
                      <FormControl isInvalid={errors.charityPercentage}>
                        <FormLabel htmlFor="charityPercentage">
                          Percentual destinado à caridade
                        </FormLabel>
                        <Controller
                          name="charityPercentage"
                          control={control}
                          rules={{
                            min: {
                              value: 10,
                              message: 'Mínimo de 10%',
                            },
                            max: {
                              value: 100,
                              message: 'Máximo de 100%',
                            },
                          }}
                          render={({ field }) => (
                            <NumberInput
                              id="charityPercentage"
                              min={10}
                              max={100}
                              step={5}
                              {...field}
                            >
                              <NumberInputField placeholder="Ex: 50" />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          )}
                        />
                        <FormErrorMessage>{errors.charityPercentage?.message}</FormErrorMessage>
                      </FormControl>
                    )}

                    <FormControl>
                      <Checkbox {...register('hasAutoDrawEnabled')}>
                        Realizar sorteio automaticamente quando 100% dos números forem vendidos
                      </Checkbox>
                    </FormControl>

                    <FormControl>
                      <FormLabel htmlFor="minimumSalesPercentage">
                        Percentual mínimo de vendas (0 = sem mínimo)
                        <Tooltip label="Se o percentual mínimo não for atingido até a data do sorteio, a rifa será cancelada e os valores devolvidos" hasArrow>
                          <Box as="span" ml={1} display="inline-block">
                            <FaQuestionCircle />
                          </Box>
                        </Tooltip>
                      </FormLabel>
                      <Controller
                        name="minimumSalesPercentage"
                        control={control}
                        render={({ field }) => (
                          <NumberInput
                            id="minimumSalesPercentage"
                            min={0}
                            max={100}
                            step={5}
                            {...field}
                          >
                            <NumberInputField placeholder="Ex: 70" />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        )}
                      />
                    </FormControl>

                    <FormControl>
                      <Checkbox {...register('hasCautionDeposit')}>
                        Adicionar depósito caução
                        <Tooltip label="Valor que será retido até a entrega do prêmio ao vencedor, como forma de garantia" hasArrow>
                          <Box as="span" ml={1} display="inline-block">
                            <FaQuestionCircle />
                          </Box>
                        </Tooltip>
                      </Checkbox>
                    </FormControl>

                    {hasCautionDeposit && (
                      <FormControl isInvalid={errors.cautionDepositAmount}>
                        <FormLabel htmlFor="cautionDepositAmount">
                          Valor do depósito caução
                        </FormLabel>
                        <Controller
                          name="cautionDepositAmount"
                          control={control}
                          rules={{
                            min: {
                              value: 100,
                              message: 'Mínimo de R$ 100,00',
                            },
                          }}
                          render={({ field }) => (
                            <NumberInput
                              id="cautionDepositAmount"
                              min={100}
                              precision={2}
                              step={100}
                              {...field}
                            >
                              <NumberInputField placeholder="Ex: 500.00" />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          )}
                        />
                        <FormErrorMessage>{errors.cautionDepositAmount?.message}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Stack>
                </Box>
              </Stack>
            )}

            {/* Etapa 3: Upload de imagens */}
            {activeStep === 2 && (
              <Stack spacing={6}>
                <Heading size="md" mb={4}>
                  Imagens do Prêmio
                </Heading>

                <Text>
                  Adicione fotos do prêmio da sua rifa. A primeira imagem será a principal.
                </Text>

                <ImageUploader
                  onImageSelect={handleImageSelect}
                  selectedImages={selectedImages}
                  onRemoveImage={handleRemoveImage}
                />

                <Alert status="info">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Dicas para boas fotos:</AlertTitle>
                    <AlertDescription>
                      <Box as="ul" pl={4} mt={2}>
                        <Box as="li">Use boa iluminação e fundo neutro</Box>
                        <Box as="li">Mostre diferentes ângulos do produto</Box>
                        <Box as="li">Inclua fotos da caixa e acessórios, se aplicável</Box>
                        <Box as="li">Evidencie detalhes relevantes e estado de conservação</Box>
                      </Box>
                    </AlertDescription>
                  </Box>
                </Alert>
              </Stack>
            )}

            {/* Etapa 4: Revisão */}
            {activeStep === 3 && (
              <Stack spacing={6}>
                <Heading size="md" mb={4}>
                  Revisão da Rifa
                </Heading>

                <Alert status="warning" mb={6}>
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Atenção!</AlertTitle>
                    <AlertDescription>
                      Após enviar, sua rifa passará por um processo de aprovação. Certifique-se de que todas as informações estão corretas.
                    </AlertDescription>
                  </Box>
                </Alert>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <Box>
                    <Heading size="sm" mb={2}>Informações Básicas</Heading>
                    <Stack spacing={3} p={4} borderWidth="1px" borderRadius="md">
                      <Box>
                        <Text fontWeight="bold">Título:</Text>
                        <Text>{formValues.title}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Categoria:</Text>
                        <Text>{formValues.category}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Descrição:</Text>
                        <Text>{formValues.description}</Text>
                      </Box>
                    </Stack>
                  </Box>

                  <Box>
                    <Heading size="sm" mb={2}>Detalhes da Rifa</Heading>
                    <Stack spacing={3} p={4} borderWidth="1px" borderRadius="md">
                      <Box>
                        <Text fontWeight="bold">Valor do prêmio:</Text>
                        <Text>R$ {Number(formValues.prizeValue).toFixed(2)}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Preço por número:</Text>
                        <Text>R$ {Number(formValues.ticketPrice).toFixed(2)}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Total de números:</Text>
                        <Text>{formValues.totalTickets}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Data do sorteio:</Text>
                        <Text>{new Date(formValues.drawDate).toLocaleString('pt-BR')}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Método de sorteio:</Text>
                        <Text>
                          {formValues.drawMethod === 'automatic' 
                            ? 'Automático pela plataforma' 
                            : 'Ao vivo'}
                        </Text>
                      </Box>
                    </Stack>
                  </Box>
                </SimpleGrid>

                <Box>
                  <Heading size="sm" mb={2}>Imagens ({selectedImages.length})</Heading>
                  <HStack spacing={4} overflowX="auto" py={2}>
                    {selectedImages.map((image, index) => (
                      <Box
                        key={image.id}
                        w="100px"
                        h="100px"
                        borderRadius="md"
                        overflow="hidden"
                        position="relative"
                      >
                        <Image
                          src={image.previewUrl}
                          alt={`Imagem ${index + 1}`}
                          objectFit="cover"
                          width="100%"
                          height="100%"
                        />
                        {index === 0 && (
                          <Tag
                            position="absolute"
                            bottom={1}
                            left={1}
                            size="sm"
                            colorScheme="purple"
                          >
                            Principal
                          </Tag>
                        )}
                      </Box>
                    ))}
                  </HStack>
                </Box>

                {formValues.isCharity && (
                  <Box p={4} borderWidth="1px" borderRadius="md" bg="green.50">
                    <Flex>
                      <Box mr={3} color="green.500">
                        <FaCheckCircle size="20px" />
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Rifa Beneficente</Text>
                        <Text>
                          {formValues.charityPercentage}% do valor arrecadado será destinado à caridade
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                )}

                <Box p={4} borderWidth="1px" borderRadius="md" bg="blue.50">
                  <Heading size="sm" mb={2}>Valores estimados</Heading>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <Box>
                      <Text fontSize="sm">Valor total se 100% vendido:</Text>
                      <Text fontWeight="bold">
                        R$ {(formValues.ticketPrice * formValues.totalTickets).toFixed(2)}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm">Taxa da plataforma (10%):</Text>
                      <Text fontWeight="bold">
                        R$ {(formValues.ticketPrice * formValues.totalTickets * 0.1).toFixed(2)}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm">Valor líquido estimado:</Text>
                      <Text fontWeight="bold">
                        R$ {(formValues.ticketPrice * formValues.totalTickets * 0.9).toFixed(2)}
                      </Text>
                    </Box>
                  </SimpleGrid>
                </Box>
              </Stack>
            )}

            {/* Botões de navegação entre etapas */}
            <Flex justify="space-between" mt={10}>
              {activeStep > 0 ? (
                <Button onClick={prevStep} variant="outline">
                  Voltar
                </Button>
              ) : (
                <Box></Box>
              )}

              {activeStep < steps.length - 1 ? (
                <Button 
                  colorScheme="purple" 
                  onClick={nextStep}
                  isDisabled={!isFormStepValid()}
                >
                  Próximo
                </Button>
              ) : (
                <Button
                  colorScheme="purple"
                  type="submit"
                  isLoading={isSubmitting}
                  loadingText="Enviando..."
                >
                  Publicar Rifa
                </Button>
              )}
            </Flex>
          </Box>
        </Stack>
      </Container>
    </Layout>
  );
};

export default CreateRaffle;