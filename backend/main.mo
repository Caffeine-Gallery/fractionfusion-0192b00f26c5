import Blob "mo:base/Blob";

import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Array "mo:base/Array";
import Random "mo:base/Random";
import Time "mo:base/Time";

actor {
  type Fraction = {
    numerator: Nat;
    denominator: Nat;
  };

  type Score = {
    value: Nat;
    timestamp: Int;
  };

  stable var highScores : [Score] = [];

  public func generateFraction() : async Fraction {
    let seed : Blob = await Random.blob();
    let generator = Random.Finite(seed);
    
    let denominator = switch (generator.range(Nat8.fromNat(9))) {
      case null { 2 };
      case (?value) { value + 2 }; // 2 to 11
    };
    
    let numerator = switch (generator.range(Nat8.fromNat(Nat.min(denominator - 1, 255)))) {
      case null { 1 };
      case (?value) { value + 1 }; // 1 to denominator-1
    };
    
    { numerator = numerator; denominator = denominator }
  };

  public func checkGuess(fraction: Fraction, guess: Float) : async Nat {
    let actualValue = Float.fromInt(fraction.numerator) / Float.fromInt(fraction.denominator);
    let difference = Float.abs(actualValue - guess);
    let score = Nat.max(100 - Int.abs(Float.toInt(difference * 1000)), 0);
    updateHighScores(score);
    score
  };

  private func updateHighScores(newScore: Nat) {
    let newScoreEntry = { value = newScore; timestamp = Time.now() };
    highScores := Array.sort(Array.append(highScores, [newScoreEntry]), func (a: Score, b: Score) : { #less; #equal; #greater } {
      if (a.value > b.value) { #less }
      else if (a.value < b.value) { #greater }
      else if (a.timestamp > b.timestamp) { #less }
      else if (a.timestamp < b.timestamp) { #greater }
      else { #equal }
    });
    if (highScores.size() > 10) {
      highScores := Array.tabulate(10, func (i: Nat) : Score { highScores[i] });
    };
  };

  public query func getHighScores() : async [Score] {
    highScores
  };
}
