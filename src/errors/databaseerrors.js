const sequelizeError = {
  SequelizeUniqueConstraintError: "UniqueConstraintError",
  SequelizeValidationError: "ValidationError",
  SequelizeDatabaseError: "DatabaseError",
  SequelizeForeignKeyConstraintError: "ForeignKeyConstraintError",
  SequelizeExclusionConstraintError: "ExclusionConstraintError",
  SequelizeConnectionRefusedError: "ConnectionRefusedError",
  SequelizeHostNotFoundError: "HostNotFoundError",
  SequelizeHostNotReachableError: "HostNotReachableError",
  SequelizeInvalidConnectionError: "InvalidConnectionError",
  SequelizeConnectionTimedOutError: "ConnectionTimedOutError",
  SequelizeAccessDeniedError: "AccessDeniedError",
  SequelizeConnectionAcquireTimeoutError: "ConnectionAcquireTimeoutError",
  SequelizeInvalidConnectionError: "InvalidConnectionError",
  SequelizeConnectionError: "ConnectionError",
  SequelizeBaseError: "BaseError",
  SequelizeEmptyResultError: "EmptyResultError",
  SequelizeEagerLoadingError: "EagerLoadingError",
  SequelizeAssociationError: "AssociationError",
  SequelizeTransactionError: "TransactionError",
  SequelizeTimeoutError: "TimeoutError",
};

const prismaError = {
  PrismaClientKnownRequestError: "PrismaClientKnownRequestError",
  PrismaClientUnknownRequestError: "PrismaClientUnknownRequestError",
  PrismaClientRustPanicError: "PrismaClientRustPanicError",
  PrismaClientInitializationError: "PrismaClientInitializationError",
  Error: "NotFoundError",
};
module.exports = {
  sequelizeError,
  prismaError,
};