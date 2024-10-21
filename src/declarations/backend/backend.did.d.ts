import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Fraction { 'numerator' : bigint, 'denominator' : bigint }
export interface Score { 'value' : bigint, 'timestamp' : bigint }
export interface _SERVICE {
  'checkGuess' : ActorMethod<[Fraction, number], bigint>,
  'generateFraction' : ActorMethod<[], Fraction>,
  'getHighScores' : ActorMethod<[], Array<Score>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
