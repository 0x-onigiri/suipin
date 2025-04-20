import { Transaction, TransactionResult } from '@mysten/sui/transactions'

export const PickerModule
= {
  createPicker: (
    tx: Transaction,
    packageId: string,
    title: string,
    imageBlobId: string,
  ): TransactionResult => {
    return tx.moveCall({
      target: `${packageId}::picker::create_picker`,
      arguments: [
        tx.pure.string(title),
        tx.pure.string(imageBlobId),
      ],
    })
  },
  join: (
    tx: Transaction,
    packageId: string,
    pickerId: string,
    name: string,
  ): TransactionResult => {
    return tx.moveCall({
      target: `${packageId}::picker::join`,
      arguments: [
        tx.object(pickerId),
        tx.pure.string(name),
      ],
    })
  },
  doPicker: (
    tx: Transaction,
    packageId: string,
    pickerOwnerCapId: string,
    pickerId: string,
  ): TransactionResult => {
    return tx.moveCall({
      target: `${packageId}::picker::do`,
      arguments: [
        tx.object(pickerOwnerCapId),
        tx.object(pickerId),
        tx.object('0x8'),
      ],
    })
  },
}
