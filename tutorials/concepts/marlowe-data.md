---
title: The Marlowe data types
sidebar_position: 4
---

# The Marlowe data types

This tutorial formally introduces Marlowe as a Haskell data type, as
well as presenting the different types used by the model, and discussing
a number of assumptions about the infrastructure in which contracts will
be run. It also introduces *Extended Marlowe* which we use for
describing *contract templates* in Marlowe.

The code that we describe here comes from the Haskell modules
[Semantics/Types.hs](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe/src/Language/Marlowe/Core/V1/Semantics/Types.hs)
,
[Semantics.hs](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe/src/Language/Marlowe/Core/V1/Semantics.hs)
and
[Util.hs](https://github.com/input-output-hk/marlowe-cardano/blob/main/marlowe/src/Language/Marlowe/Util.hs).

## Marlowe

The Marlowe domain-specific language (DSL) is modelled as used above, a
collection of algebraic types in Haskell, with contracts being given by
the `Contract` type:

``` haskell
data Contract = Close
              | Pay Party Payee Token Value Contract
              | If Observation Contract Contract
              | When [Case] Timeout Contract
              | Let ValueId Value Contract
              | Assert Observation Contract
```

We saw in the [previous tutorial](marlowe-step-by-step.mdx) what
these contracts do. In the rest of this tutorial we will dig a bit
deeper into the Haskell types that are used to represent the various
components of the contracts, including accounts, values, observations,
and actions. We will also look at types that relate to the execution of
contracts, including inputs, states, the environment.

## Basic components

In modelling basic parts of Marlowe we use a combination of Haskell
`data` types, that define *new* types, and `type` synonyms that give a
new name to an existing type.[^1]

A `Party` to a contract is represented as used above, either a public
key or a role name.

``` haskell
data Party = PubKey PubKeyHash
           | Role   TokenName
```

In order to progress a Marlowe contract, a party must provide an
evidence. For `PubKey` party that would be a valid signature of a
transaction signed by a private key of the public key, similarly to
Bitcoin's `Pay to Public Key Hash` mechanism.

``` haskell
newtype PubKeyHash = PubKeyHash { getPubKeyHash :: ByteString }
```

For a `Role` party the evidence is spending a *role token* within the
same transaction, usually to the same owner.

``` haskell
newtype TokenName = TokenName { unTokenName :: ByteString }
```

`Role` parties will look like `Role "alice"`, `Role "bob"` and so on.
However, Haskell allows us to present and read in these values more
concisely (by declaring a custom instance of `Show` and using
*overloaded strings*) so that these can be input and read as used above,
`"alice"`, `"bob"`, etc.

A Marlowe *account* holds amounts of multiple currencies and/or fungible
and non-fungible tokens. A concrete amount is indexed by a `Token`,
which is a pair of a *currency symbol* and a *token name*, both given by
a `ByteString`.

``` haskell
newtype CurrencySymbol = CurrencySymbol { unCurrencySymbol :: ByteString }
data Token = Token CurrencySymbol TokenName
```

Cardano's Ada token is: 

``` haskell
ada = Token adaSymbol adaToken
```

But you are free to create your own currencies and tokens using the
native token facility of Cardano. You can think of an `Account` as used
above, a map from `Token` to `Integer` and so all the accounts in a
contracts can be modelled like this:

``` haskell
type AccountId = Party
type Accounts = Map (AccountId, Token) Integer
```

Tokens of a currency can represent roles in a contract, e.g., `"buyer"`
and `"seller"`. Think of a legal contract in the sense of "hereafter
referred to as used above, the Performer/Vendor/Artist/Consultant".
This way we can decouple the notion of ownership of a contract role, and
make it tradable. So you can sell your loan or buy a share of a role in
some contract.

Timeouts and amounts of money are treated in a similar way; with the
same show/overload approach as used above, they will appear in contracts
as numbers:

``` haskell
newtype POSIXTime = POSIXTime { getPOSIXTime :: Integer }
type Timeout = POSIXTime
```

The number represents the number of seconds after the midnight of the
1st of January of 1970 (UTC).

Note that `"alice"` is the owner here in the sense that she will be
refunded any money in the account when the contract terminates.

We can use overloaded strings to allow us to abbreviate this account by
the name of its owner: in this case `"alice"`.

A payment can be made to one of the parties to the contract, or to one
of the accounts of the contract, and this is reflected in this definition: 

``` haskell
data Payee = Account AccountId
           | Party Party
```

Choices -- of integers -- are identified by `ChoiceId` which combines a
name for the choice with the `Party` who had made the choice:

``` haskell
type ChoiceName = ByteString
data ChoiceId   = ChoiceId ChoiceName Party
type ChosenNum  = Integer
```

Values defined using `Let` are identified by text strings.[^2]

``` haskell
data ValueId    = ValueId ByteString
```

## Values, observations and actions

Building on the basic types, we can describe three higher-level
components of contracts: a type of *values*, on top of that a type of
*observations*, and also a type of *actions*, which trigger particular
cases. First, looking at `Value` we have:

``` haskell
data Value = AvailableMoney Party Token
           | Constant Integer
           | NegValue Value
           | AddValue Value Value
           | SubValue Value Value
           | MulValue Value Value
           | DivValue Value Value
           | ChoiceValue ChoiceId
           | TimeIntervalStart
           | TimeIntervalEnd
           | UseValue ValueId
           | Cond Observation Value Value
```

The different kinds of values -- all of which are `Integer` -- are
pretty much self explanatory, but for completeness we have:

-   Lookup of the value in an account `AvailableMoney`, made in a choice
    `ChoiceValue` and in an identifier that has already been defined
    `UseValue`.
-   Arithmetic constants and operators.
-   The start and end of the current *time interval*; see below for
    further discussion of this.
-   `Cond` represents if-expressions, that is - first argument to `Cond`
    is a condition (`Observation`) to check, second is a `Value` to take
    when condition is satisfied and the last one is a `Value` for
    unsatisfied condition; for example:
    `(Cond FalseObs (Constant 1) (Constant 2))` is equivalent to
    `(Constant 2)`

Next we have observations:

``` haskell
data Observation = AndObs Observation Observation
                 | OrObs Observation Observation
                 | NotObs Observation
                 | ChoseSomething ChoiceId
                 | ValueGE Value Value
                 | ValueGT Value Value
                 | ValueLT Value Value
                 | ValueLE Value Value
                 | ValueEQ Value Value
                 | TrueObs
                 | FalseObs
```

These are really self-explanatory: we can compare values for
(in)equality and ordering, and combine observations using the Boolean
connectives. The only other construct `ChoseSomething` indicates whether
any choice has been made for a given `ChoiceId`.

Cases and actions are given by these types:

``` haskell
data Case = Case Action Contract

data Action = Deposit AccountId Party Token Value
            | Choice ChoiceId [Bound]
            | Notify Observation

data Bound = Bound Integer Integer
```

Three kinds of action are possible:

-   A `Deposit n p t v` makes a deposit of value `v` of token `t` from
    party `p` into account `n`.
-   A choice is made for a particular id with a list of bounds on the
    values that are acceptable. For example, `[Bound 0 0, Bound 3 5]`
    offers the choice of one of `0`, `3`, `4` and `5`.
-   The contract is notified that a particular observation be made.
    Typically this would be done by one of the parties, or one of their
    wallets acting automatically.

This completes our discussion of the types that make up Marlowe
contracts.

## Extended Marlowe

Extended Marlowe adds templating functionality to Marlowe language, so
that constants need not be "hard wired" into Marlowe contracts, but can
be replaced by *parameters*. Objects in Extended Marlowe are called
*templates* or *contract templates*.

Specifically, Extended Marlowe extends the `Value` type with these
parameter values:

``` haskell
ConstantParam "string"
```

which can be used in forming more complex values just in the same way as
constants. Similarly the `Timeout` type is extended with these values:

``` haskell
TimeParam "string"
```

Extended Marlowe is not directly executable, it has to be translated to
core Marlowe before execution, deployment, or analysis, through the
process of *instantiation*. The purpose of Extended Marlowe is to allow
Marlowe contracts to be reusable in different situations without
cluttering the code that goes on-chain (core Marlowe). In the Marlowe Playground, templates need to be instantiated before being simulated.

## Transactions

As we noted earlier, the semantics of Marlowe consist in building
*transactions*, like this:

![transaction](/img/transaction.svg) 

A transaction is built from a series of steps, some of which consume an input value, and others
produce effects, or payments. In describing this we explained that a
transaction modified a contract (to its continuation) and the state, but
more precisely we have a function:

``` haskell
computeTransaction :: TransactionInput -> State -> Contract -> TransactionOutput
```

where the types are defined like this:

``` haskell
data TOR = TOR { txOutWarnings :: [TransactionWarning]
               , txOutPayments :: [Payment]
               , txOutState    :: State
               , txOutContract :: Contract }
            deriving (Eq,Ord,Show,Read)

data TransactionOutput =
   TransactionOutput TOR
 | Error TransactionError
deriving (Eq,Ord,Show,Read)

data TransactionInput = TransactionInput
      { txInterval :: TimeInterval
      , txInputs   :: [Input] }
   deriving (Eq,Ord,Show,Read)
```

The notation used here adds field names to the arguments of the
constructors, giving selectors for the data (as used above), as well as
making clearer the purpose of each field.

The `TransactionInput` type has two components: the `TimeInterval` in
which it can validly be added to the blockchain, and an ordered sequence
of `Input` values to be processed in that transaction.

A `TransactionOutput` value has four components: the last two are the
updated `State` and `Contract`, while the second gives a ordered
sequence of `Payments` produced by the transaction. The first component
contains a list of any warnings produced by processing the transaction.

## Time intervals

This is part of the architecture of Cardano/Plutus, which acknowledges
that it is not possible to predict precisely in which instant a
particular transaction will be processed. Transactions are therefore
given a *time interval* in which they are expected to be processed, and
this carries over to Marlowe: each step of a Marlowe contract is
processed in the context of a time interval.

``` haskell
type TimeInterval = (POSIXTime, POSIXTime)
```

How does this affect the processing of a Marlowe contract? Each step is
processed relative to a time interval, and the current time value needs
to lie within that interval.

The endpoints of the interval are accessible as the values
`TimeIntervalStart` and `TimeIntervalEnd` (as used above), and these can
be used in observations. Timeouts need to be processed *unambiguously*,
so that *all values in the time interval* have to either have exceeded
the timeout for it to take effect, or fall before the timeout, for
normal execution to take effect. In other words, the timeout value needs
to either be less or equal than `TimeIntervalStart` (in order for the
timeout to take effect) or be strictly greater than `TimeIntervalEnd`
(for normal execution to take place).

### Notes

The model makes a number of assumptions about the blockchain
infrastructure in which it is run.

-   It is assumed that cryptographic functions and operations are
    provided by a layer external to Marlowe, and so they need not be
    modelled explicitly.
-   Making a deposit is not something that a contract can perform;
    rather, it can request that a deposit is made, but that then has to
    be established externally: hence the input of (a collection of)
    deposits for each transaction.
-   The model manages the refund of funds back to the owner of a
    particular account when a contract reaches the point of `Close`.


[^1]: In fact we used `newtype` declarations rather than `data` types
    because they are more efficiently implemented.

[^2]: This may be modified in the future to allow values to be named by
    strings.
