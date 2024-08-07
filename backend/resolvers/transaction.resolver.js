import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

const transactionResolver = {
  Query: {
    transactions: async (_, __, context) => {
      try {
        if (!context.getUser()) throw new Error("Unauthorized");
        const userId = await context.getUser()._id;

        const transactions = await Transaction.find({ userId });
        return transactions;
      } catch (err) {
        console.error("Error getting transactions: ", err);
        throw new Error("Error getting transactions");
      }
    },

    transaction: async (_, { transactionId }) => {
      try {
        const transaction = await Transaction.findById(transactionId);
        return transaction;
      } catch (err) {
        console.error("Error getting a transaction: ", err);
        throw new Error("Error getting a transaction");
      }
    },

    // TODO => ADD categoryStatistics query

  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        const newTransaction = new Transaction({
          ...input,
          userId: context.getUser()._id,
        });

        await newTransaction.save();
        return newTransaction;
      } catch (err) {
        console.error("Error creating a transaction: ", err);
        throw new Error("Error creating a transaction");
      }
    },

    updateTransaction: async (_, { input }) => {
      try {
        const updateTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, {
          new: true,
        });

        return updateTransaction;
      } catch (err) {
        console.error("Error updating a transaction: ", err);
        throw new Error("Error updating a transaction");
      }
    }
  },
};

export default transactionResolver;