# Box

Box runs personal infrastructure and automation workflows.

## Language

**Ledger workflow**:
An n8n workflow that turns receipt emails into Actual Budget transactions.
_Avoid_: Ledger app, budget workflow

**Source**:
A short label for the receipt branch that produced a Ledger transaction, such as BCA QRIS, GrabFood, or GoTagihan.
_Avoid_: Account, Gmail trigger

**Account key**:
A workflow-local key for the payment account used by a transaction, such as `bca` or `jago`.
_Avoid_: Source, Actual account ID

**Plain rupiah amount**:
A transaction amount expressed in rupiah before Actual Budget converts it to its internal integer format.
_Avoid_: Actual amount, cents, scaled amount
