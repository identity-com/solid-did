import {
  makeKeypair,
  UpdateInstructionRequest,
  UpdateRequest,
} from '../lib/util';
import { SolTransaction } from '../lib/solana/transaction';
import { Connection, TransactionInstruction } from '@solana/web3.js';
import { DecentralizedIdentifier, SolData } from '../lib/solana/sol-data';

/**
 * Updates a SOL DID on Solana.
 * @param request
 */
export const update = async (request: UpdateRequest): Promise<void> => {
  const id = DecentralizedIdentifier.parse(request.identifier);
  const payer = makeKeypair(request.payer);
  const owner = request.owner ? makeKeypair(request.owner) : undefined;
  const cluster = id.clusterType;
  const connection = new Connection(cluster.solanaUrl(), 'recent');
  await SolTransaction.updateDID(
    connection,
    cluster,
    payer,
    id.pubkey.toPublicKey(),
    SolData.parse(request.document),
    request.mergeBehaviour || 'Append',
    owner
  );
};

export const createUpdateInstruction = async ({
  identifier,
  authority,
  document,
  mergeBehaviour,
}: UpdateInstructionRequest): Promise<TransactionInstruction> => {
  const id = DecentralizedIdentifier.parse(identifier);
  const cluster = id.clusterType;
  const connection = new Connection(cluster.solanaUrl(), 'recent');
  return SolTransaction.updateDIDInstruction(
    connection,
    cluster,
    id.pubkey.toPublicKey(),
    authority,
    SolData.parse(document),
    mergeBehaviour || 'Append'
  );
};
