
import { Address, toNano, beginCell } from "ton";
import { Card } from "./Card";
import { useMakeGetCall } from "../hooks/useMakeGetCall";
import { useSendTxn } from "../hooks/useSendTxn";
import BN from "bn.js";
import { TransactionWatcher } from './TransactionWatcher';

export function Counter() {
  const counterAddr = "EQC-QTihJV_B4f8M2nynateMLynaRT_uwNYnnuyy87kam-G7";

  const { isIssuedTxn, txnState, sendTxn, markTxnEnded } = useSendTxn();
  const { data, isFetching } = useMakeGetCall(
    Address.parse(counterAddr),
    "counter",
    [],
    (s): string => {
      const newData = (s[0] as BN).toString();
      if (isIssuedTxn && newData !== data) {
        markTxnEnded();
      }
      return newData;
    },
    { refetchInterval: isIssuedTxn ? 2000 : undefined }
  );

  return (
    <Card title="Counter">
      <h3>{isFetching ? "Loading..." : data}</h3>
      <button
        onClick={async () => {
          await sendTxn(
            Address.parse(counterAddr),
            toNano(0.01),
            beginCell().storeUint(0x37491f2f, 32).storeUint(0, 64).endCell()
          );
        }}
      >
        Increment
      </button>
      <TransactionWatcher txnState={txnState} />
    </Card>
  );
}
