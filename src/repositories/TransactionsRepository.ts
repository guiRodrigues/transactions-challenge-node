import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const { income, outcome } = this.transactions.reduce(
      (accumulator: Balance, current: Transaction) => {
        switch (current.type) {
          case 'income':
            accumulator.income += current.value;
            break;
          case 'outcome':
            accumulator.outcome += current.value;
            break;
          default:
            break;
        }

        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const total = income - outcome;

    return { income, outcome, total };
  }

  public create({ title, value, type }: TransactionDTO): Transaction {
    if (!['income', 'outcome'].includes(type)) {
      throw Error('Transaction type is invalid');
    }

    const { total } = this.getBalance();

    if (type === 'outcome' && value > total) {
      throw Error('You do not have enought');
    }

    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
