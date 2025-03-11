---
title: ACTUS and Marlowe
sidebar_position: 10
---

This tutorial gives an introduction to the general idea of the ACTUS
standards for the algorithmic representation of financial contracts,
plus examples implemented in Marlowe.

## ACTUS

The ACTUS Financial Research Foundation -- [https://www.actusfrf.org](https://www.actusfrf.org) -- has
created a standard for financial contracts, categorised by means of a
[taxonomy](https://www.actusfrf.org/taxonomy) and described in a
detailed [technical specification](https://www.actusfrf.org/techspecs).

The ACTUS standards build on the understanding that financial contracts
are legal agreements between two (or more) counterparties on the
exchange of future cash flows. Historically, such legal agreements are
described in natural language leading to ambiguity and artificial
diversity. As a response, the ACTUS standards define financial contracts
by means of a set of contractual terms and deterministic functions
mapping these terms onto future payment obligations. Thereby, it is
possible to describe the vast majority of financial instruments through
a set of little more than 30 Contract Types or modular templates,
respectively.

The ACTUS specifications provide a breadth of exercises for
implementation in Marlowe, and we illustrate an approach to this in the
following example.

## Simple Zero Coupon Bond Example

A zero-coupon bond is a debt security that does not pay interest (a
coupon) but is issued at a discount, rendering profit at maturity when
the bond is redeemed for its full face value.

For example, an `investor` can buy a bond that costs 1000 Lovelace with
15% discount. She pays 850 Lovelace to the bond issuer before *start
time*, here `1672531200` (2023-01-01 00:00:00 GMT).

One month later, after *maturity date*, time `1675209600` (2023-02-01
00:00:00 GMT) here, the investor can exchange the bond for its full
notional, i.e., 1000 Lovelace.

``` haskell
When [
  (Case
     (Deposit
        "investor"
        "investor" ada
        (Constant 850))
     (Pay
        "investor"
        (Party "issuer") ada
        (Constant 850)
        (When [
           (Case
              (Deposit
                 "investor"
                 "issuer" ada
                 (Constant 1000))
              (Pay
                 "investor"
                 (Party "investor") ada
                 (Constant 1000)
                 Close))
            ]
            1675209600
            Close)))
     ]
     1672531200
     Close
```

This contract has a significant drawback. Once the `investor` has
deposited the 850 Lovelace, it will be immediately paid to the `issuer`
(if the `investor` does not invest in time, the contract ends). After
that, two outcomes are possible

-   the `issuer` deposits 1000 Lovelace in the `investor`'s account,
    and that is then immediately paid to the `investor` in full;
-   if the `investor` doesn't make the deposit, then the contract is
    closed and all the money in the contract is refunded, but there is
    *no* money in the contract at this point, so the `investor` loses
    her money.

How can we avoid this problem of the `issuer` defaulting?

There are at least two ways to solve this: we could ask the `issuer` to
deposit the full amount before the contract begins, but that would
defeat the object of issuing the bond in the first place. More
realistically, we could ask a third party to be a guarantor of the deal.

> **Exercise**
>
> Give a variant of the `zeroCouponBond` contract in which it is
> necessary for the `issuer` to put the full value of the up before the
> bond is issued.

> **Exercise**
>
> Give a variant of the `zeroCouponBond` contract which also includes a
> `guarantor` who puts up the full payment up before the bond is issued,
> and who will pay that counterparty if the issuer defaults; if the
> issuer does make the payment in time, then the guarantor should
> recover their money.

## Guaranteed Coupon Bond Example

This more complex bond involves an `investor` who deposits 1000
Lovelace, which is immediately paid to the `issuer`. The `issuer` then
has to pay as interest 10 Lovelace every month. On maturity the investor
should receive back the interest plus the full value of the bond.

``` haskell
couponBondFor3Month12Percent =
    -- investor deposits 1000 Lovelace
    When [ Case (Deposit "investor" "investor" ada (Constant 1000))
        -- and pays it to the issuer
        (Pay "investor" (Party "issuer") ada (Constant 1000)
            -- after 1 month expect to receive 10 Lovelace interest
            (When [ Case (Deposit "investor" "issuer" ada (Constant 10))
                -- and pay it to the investor
                (Pay "investor" (Party "investor" ) ada (Constant 10)
                    -- same for 2nd month
                    (When [ Case (Deposit "investor" "issuer" ada (Constant 10))
                        (Pay "investor" (Party "investor" ) ada (Constant 10)
                            -- after maturity date investor
                            -- expects to receive notional + interest payment
                            (When [ Case (Deposit "investor" "issuer" ada (Constant 1010))
                                (Pay "investor" (Party "investor" ) ada (Constant 1010) Close)]
                            1680307200 -- 2023-04-01 00:00:00 GMT
                            Close))]
                    1677628800 -- 2023-03-01 00:00:00 GMT
                    Close))]
            1675209600 -- 2023-02-01 00:00:00 GMT
            Close))]
    1672531200 -- 2023-01-01 00:00:00 GMT
    Close
```

> **Exercise**
>
> Give a variant of the `zcouponBondFor3Month12Percent` contract which
> also includes a `guarantor` who puts up the full payment up before the
> bond is issued, and who will pay that counterparty if the issuer
> defaults; if the issuer does make the payment in time, then the
> guarantor should recover their money.

## ACTUS Contract Terms

In general, an ACTUS contract is specified by the ACTUS contract terms. The technical specification
of the ACTUS taxonomy defines all the parameters that are allowed in the ACTUS contract terms in a
[dictionary](https://github.com/actusfrf/actus-dictionary/blob/master/actus-dictionary-terms.json).
ACTUS contract terms fully describe a financial contract and, therefore, allow projected cashflows
to be generated. The projected cashflows are then used as a basis to generate Marlowe contracts
corresponding to ACTUS contract terms.

The ACTUS Principle At Maturity (PAM) contract is a loan with periodic interest payments on a fixed
schedule and a final payment of the principal.

Example ACTUS contract terms: one installment of interest, followed by the repayment of the principal.

``` json
{
 "contractType": "PAM",
 "contractID": "pam example",
 "statusDate": "2023-12-31T00:00:00",
 "contractDealDate": "2023-12-28T00:00:00",
 "currency": "ADA",
 "notionalPrincipal": "20",
 "initialExchangeDate": "2024-01-01T00:00:00",
 "maturityDate": "2025-01-01T00:00:00",
 "nominalInterestRate": "0.1",
 "cycleAnchorDateOfInterestPayment": "2025-01-01T00:00:00",
 "cycleOfInterestPayment": "P1YL0",
 "dayCountConvention": "30E360",
 "endOfMonthConvention": "SD",
 "premiumDiscountAtIED": "   0",
 "rateMultiplier": "1.0",
 "contractRole": "RPA"
}
```

The example produces the following projected cashflows:

| Contract Id | Event Type | Event Time | Amount | Currency |
| --- | --- | --- | --- | --- |
|PAM example|IED|2024-01-01 00:00:00:000|-20.0|₳|
|PAM example|IP|2025-01-01 00:00:00:000|2.0|₳|
|PAM example|MD|2025-01-01 00:00:00:000|20.0|₳|

The projected cashflows are translated into the following Marlowe contract:

``` haskell
When [
  (Case
     (Deposit
        (Role "party")
        (Role "party")
        (Token "" "")
        (Constant 20000000))
     (Pay
        (Role "party")
        (Party
           (Role "counterparty"))
        (Token "" "")
        (Constant 20000000)
        (When [
           (Case
              (Deposit
                 (Role "counterparty")
                 (Role "counterparty")
                 (Token "" "")
                 (Constant 2000000))
              (Pay
                 (Role "counterparty")
                 (Party
                    (Role "party"))
                 (Token "" "")
                 (Constant 2000000)
                 (When [
                    (Case
                       (Deposit
                          (Role "counterparty")
                          (Role "counterparty")
                          (Token "" "")
                          (Constant 20000000))
                       (Pay
                          (Role "counterparty")
                          (Party
                             (Role "party"))
                          (Token "" "")
                          (Constant 20000000) Close))] 1735689600000 Close)))] 1735689600000 Close)))] 1704067200000 Close
```

The ACTUS specification is implemented in a separate [repository](https://github.com/input-output-hk/actus-core).
