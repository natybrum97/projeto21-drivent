import { ApplicationError } from '@/protocols';

export function PaymentRequired(): ApplicationError {
  return {
    name: 'PaymentRequired',
    message: 'Payment Required',
  };
}
