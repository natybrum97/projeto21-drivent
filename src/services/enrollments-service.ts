import { Address, Enrollment } from '@prisma/client';
import { request } from '@/utils/request';
import { invalidDataError, notFoundError } from '@/errors';
import { addressRepository, CreateAddressParams, enrollmentRepository, CreateEnrollmentParams } from '@/repositories';
import { exclude } from '@/utils/prisma-utils';

// TODO - Receber o CEP por parâmetro nesta função.
async function getAddressFromCEP(cep: string) {
  // FIXME: está com CEP fixo!
  const result = await request.get(`${process.env.VIA_CEP_API}/${cep}/json/`);

  // TODO: Tratar regras de negócio e lanças eventuais erros
  if (result.status === 200) {
    // Verificar se a resposta contém um campo "erro" com valor "true"
    if (result.data.erro && result.data.erro === true) throw invalidDataError('CEP não encontrado');

    // Mapear os campos relevantes da resposta
    // FIXME: não estamos interessados em todos os campos
    const addressData = {
      logradouro: result.data.logradouro,
      complemento: result.data.complemento,
      bairro: result.data.bairro,
      cidade: result.data.localidade,
      uf: result.data.uf,
    };

    //Retornar os dados do endereço mapeados
    return addressData;
  } else if (result.status === 400) throw invalidDataError('CEP inválido');
  //Erro de formato inválido
}

async function getOneWithAddressByUserId(userId: number): Promise<GetOneWithAddressByUserIdResult> {
  const enrollmentWithAddress = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollmentWithAddress) throw invalidDataError('Essa inscrição não possui o endereço!');

  const [firstAddress] = enrollmentWithAddress.Address;
  const address = getFirstAddress(firstAddress);

  return {
    ...exclude(enrollmentWithAddress, 'userId', 'createdAt', 'updatedAt', 'Address'),
    ...(!!address && { address }),
  };
}

type GetOneWithAddressByUserIdResult = Omit<Enrollment, 'userId' | 'createdAt' | 'updatedAt'>;

function getFirstAddress(firstAddress: Address): GetAddressResult {
  if (!firstAddress) return null;

  return exclude(firstAddress, 'createdAt', 'updatedAt', 'enrollmentId');
}

type GetAddressResult = Omit<Address, 'createdAt' | 'updatedAt' | 'enrollmentId'>;

async function createOrUpdateEnrollmentWithAddress(params: CreateOrUpdateEnrollmentWithAddress) {
  const enrollment = exclude(params, 'address');
  enrollment.birthday = new Date(enrollment.birthday);
  const address = getAddressForUpsert(params.address);

  // TODO - Verificar se o CEP é válido antes de associar ao enrollment.
  const result = await request.get(`${process.env.VIA_CEP_API}/${params.address.cep}/json/`);

  // TODO: Tratar regras de negócio e lanças eventuais erros
  if (result.status === 200) {
    // Verificar se a resposta contém um campo "erro" com valor "true"
    if (result.data.erro && result.data.erro === true) throw invalidDataError('CEP não encontrado');
  } else throw invalidDataError('CEP inválido');
  // Erro de formato inválido

  const newEnrollment = await enrollmentRepository.upsert(params.userId, enrollment, exclude(enrollment, 'userId'));

  await addressRepository.upsert(newEnrollment.id, address, address);
}

function getAddressForUpsert(address: CreateAddressParams) {
  return {
    ...address,
    ...(address?.addressDetail && { addressDetail: address.addressDetail }),
  };
}

export type CreateOrUpdateEnrollmentWithAddress = CreateEnrollmentParams & {
  address: CreateAddressParams;
};

export const enrollmentsService = {
  getOneWithAddressByUserId,
  createOrUpdateEnrollmentWithAddress,
  getAddressFromCEP,
};
