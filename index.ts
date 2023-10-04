const _null = Symbol();
const _zero = Symbol();
const _true = Symbol();
const _false = Symbol();

type Null = typeof _null;

type True = typeof _true;
type False = typeof _false;

type Not<T> = T extends True ? False : T extends False ? True : Null;
type Or<P1, P2> = P1 extends True ? True : P2 extends True ? True : False;

type ASSERT<P1, P2> = P1 extends True // is p1 true
  ? P2 extends True // is p2 true
    ? True // then true
    : False // then unequal
  : P1 extends False // is p1 false
  ? P2 extends False // is p2 false
    ? True // then true
    : never // then p2 is neither True or false, bug
  : never; // then p1 is neither true or false, bug

// Tests for not
type Not1_test = Not<True>;
type Not2_test = Not<False>;
type Not3_test = Not<boolean>;

// Tests for Or op
type Or1_test = Or<False, True>;
type Or2_test = Or<False, False>;

type Successor<N> = [N];
type Zero = typeof _zero;
type One = Successor<Zero>;
type Two = Successor<One>;
type Three = Successor<Two>;
type Four = Successor<Three>;
type Five = Successor<Four>;
type Six = Successor<Five>;
type Seven = Successor<Six>;
type Eight = Successor<Seven>;
type Num = Zero | Successor<any>;

type Eq<N1, N2> = N1 extends Zero
  ? N2 extends Zero
    ? True // both are Zero. They are equal. Return true.
    : False // N1 is zero but N2 is not.
  : N1 extends Successor<infer n1> // N1 is not zero, but Successor
  ? N2 extends Successor<infer n2> // N2 is Successor
    ? Eq<n1, n2> // Both are successor, see if their predecessor is equal.
    : False // N1 is successor, but N2 is not Successor
  : False; // N1 is neither Zero, Nor Successor.

type Eq2<N1, N2> = N1 extends Successor<infer n1>
  ? N2 extends Successor<infer n2>
    ? Eq2<n1, n2> // both Successor, get the result of recursion.
    : False // N1 is Successor, N2 is not.
  : N1 extends Zero // Both are not successor. Check if both are zero
  ? N2 extends Zero
    ? True // Both are zero. Both equal. Return True
    : False // N1 is Zero but N2 is not.
  : False; // N1 is not Zero.

// test equality
type Eq1_test = Eq<Four, Four>;
type Eq2_test = Eq<Six, Four>;
type Eq3_test = Eq<Three, Five>;
type Eq4_test = Eq<Zero, One>;
type Eq5_test = Eq<Seven, Zero>;

// gives M - N if M >= N, 0 otherwise.
type AbsDif<M, N> = N extends Zero
  ? M // N is zero, return M
  : N extends Successor<infer n>
  ? M extends Successor<infer m> // N is not Zero but number
    ? AbsDif<m, n> // M and N are both number, go one level deep.
    : M extends Zero
    ? N // N is number, But M is zero. Return N
    : never // N is number, but M is neither zero nor Number
  : never; // N is neither Zero nor number

/// test one way minus
type AbsDiff1_test = AbsDif<Six, Four>;
type AbsDiff2_test = AbsDif<Zero, Four>;
type AbsDiff3_test = AbsDif<Seven, Zero>;
type AbsDiff4_test = AbsDif<Two, Two>;
type AbsDiff5_test = AbsDif<Five, One>;
type AbsDiff6_test = AbsDif<Eight, Four>;
type AbsDiff7_test = AbsDif<Four, Eight>;
type AbsDiff8_test = Eq<AbsDiff7_test, AbsDiff6_test>;

// H: Head, T: Tail
type List<H, T = Null> = [T, H];

type Every<pred extends False | True, list> = list extends List<
  infer h,
  infer t
> // is this a list ?
  ? h extends pred // is h equal to predicated ?
    ? t extends Null // have list ended?
      ? True // Every item is equal to pred
      : Every<pred, t> // List still goes on, check other items in the tail
    : False // h is not equal to predicate, the conjugation is false
  : never; // list is not a list. Error in input

// List and list operators
type List1 = List<True>;
type List2 = List<False>;
type List3 = List<Or<False, True>, List1>;
type List4 = List<Eq<AbsDif<Four, Three>, One>, List3>;
type Every1_test = Every<True, List1>;
type Every2_test = Every<True, List2>;
type Every3_test = Every<True, List3>;
type Every4_test = Every<True, List4>;
type Every5_test = Every<False, List4>;
type List5 = List<Every5_test, List2>;
type Every6_test = Every<False, List5>;

type Queen<X extends Num, Y extends Num> = [X, Y];

type Threatens<Q1, Q2> = Q1 extends Queen<infer q1x, infer q1y> // is q1 queen
  ? Q2 extends Queen<infer q2x, infer q2y> // is q2 queen
    ? Eq<q1x, q2x> extends True
      ? True
      : Eq<q1y, q2y> extends True
      ? True
      : Eq<AbsDif<q1x, q2x>, AbsDif<q1y, q2y>> extends True
      ? True
      : False
    : never // q2 is not queen
  : never; // q1 is not queen

// tests
type Threat1_test = Threatens<One, Two>;
type Threat2_test = Threatens<Queen<One, One>, Queen<Two, Two>>;
type Threat3_test = Threatens<Queen<One, Three>, Queen<One, Eight>>;
type Threat4_test = Threatens<Queen<Two, Four>, Queen<Five, Four>>;
/**
 *
 * 8oooooQoo
 * 7Qooooooo
 * 6oooooooo
 * 5ooQooooo
 * 4oQoooooo
 * 3ooooQooo
 * 2oooooooo
 * 1oooooooo
 *  12345678
 */
type Threat5_test = Threatens<Queen<Three, Five>, Queen<Six, Eight>>;
type Threat6_test = Threatens<Queen<Three, Five>, Queen<Five, Three>>;
type Threat7_test = Threatens<Queen<Three, Five>, Queen<One, Seven>>;
type Threat8_test = Threatens<Queen<Three, Five>, Queen<Two, Four>>;
type Threat9_test = Threatens<Queen<Six, Eight>, Queen<Three, Five>>;
type Threat10_test = Threatens<Queen<Five, Three>, Queen<Three, Five>>;
type Threat11_test = Threatens<Queen<One, Seven>, Queen<Three, Five>>;
type Threat12_test = Threatens<Queen<Two, Four>, Queen<Three, Five>>;

type MapThreaten<QueenList, CurrentQueen> = CurrentQueen extends Queen<any, any>
  ? QueenList extends List<infer QH, infer QT>
    ? List<Threatens<CurrentQueen, QH>, MapThreaten<QT, CurrentQueen>>
    : QueenList extends Null
    ? Null
    : never
  : never;

// test mapping
type QLAllTrue = List<
  Queen<Six, Eight>,
  List<Queen<Five, Three>, List<Queen<One, Seven>, List<Queen<Two, Four>>>>
>;
type QLWithFalse = List<Queen<One, One>, QLAllTrue>;
type ThreatQueenList1_test = ASSERT<
  Every<True, MapThreaten<QLAllTrue, Queen<Three, Five>>>,
  True
>;
type ThreatQueenList2_test = ASSERT<
  Every<True, MapThreaten<QLWithFalse, Queen<Three, Five>>>,
  False
>;

type ValidQueen<QueenList, CandidateQueen> = Every<
  False,
  MapThreaten<QueenList, CandidateQueen>
>;

type ValidQueenList<PlacedQueens, Candidates> = Candidates extends List<
  infer QH,
  infer QT
>
  ? ValidQueen<PlacedQueens, QH> extends True
    ? List<QH, ValidQueenList<PlacedQueens, QT>>
    : ValidQueenList<PlacedQueens, QT>
  : null;

type Range<To, From = Null> = To extends Successor<infer n>
  ? Range<n, List<To, From>>
  : List<Zero, From>;

// test
type Range1_test = Range<One>;
type Range3_test = Range<Three>;
type Range8_test = Range<Eight>;

type RowOfQueens<Cols, Row extends Num> = Cols extends List<
  infer col extends Num,
  infer cols_
>
  ? List<Queen<Row, col>, RowOfQueens<cols_, Row>>
  : Cols;

type N = Five;

type Next<row extends Num, placedQueens = Null> = ValidQueenList<
  placedQueens,
  RowOfQueens<Range<N>, row>
>;

type SolveNextRow<row, placedQueens> = Solve<
  Next<Successor<row>, placedQueens>,
  Successor<row>,
  placedQueens
>;

type Solve<candidates, row extends Num, placedQueens> = Eq<row, N> extends True
  ? candidates extends List<infer x, any>
    ? List<x, placedQueens>
    : Null
  : candidates extends List<infer x, infer xs>
  ? SolveNextRow<row, List<x, placedQueens>> extends Null
    ? Solve<xs, row, placedQueens>
    : SolveNextRow<row, List<x, placedQueens>>
  : Null;

type Solution = Solve<Next<Zero>, Zero, Null>;
//    ^ expanded from above
type SolutionExpanded = [
  List<
    Queen<Successor<Successor<Successor<Successor<typeof _zero>>>>, Two>,
    List<
      Queen<Successor<Successor<Successor<typeof _zero>>>, typeof _zero>,
      List<
        Queen<Successor<Successor<typeof _zero>>, Five>,
        List<
          Queen<Successor<typeof _zero>, Three>,
          List<Queen<typeof _zero, One>, typeof _null>
        >
      >
    >
  >,
  Queen<
    Successor<Successor<Successor<Successor<Successor<typeof _zero>>>>>,
    Four
  >,
];

// Answer: (0,1), (1,3), (2, 5), (3, 0), (4, 2), (5, 4)
