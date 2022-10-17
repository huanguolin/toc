# 类型体操之实现一个类C风格语言的解释器

- [类型体操之实现一个类C风格语言的解释器](#类型体操之实现一个类c风格语言的解释器)
  - [1. ts 的类型系统是怎样的函数式语言？](#1-ts-的类型系统是怎样的函数式语言)
    - [1.1 类型与值](#11-类型与值)
    - [1.2 变量](#12-变量)
    - [1.3 条件](#13-条件)
      - [1.3.1 可赋值性](#131-可赋值性)
      - [1.3.2 模式匹配](#132-模式匹配)
      - [1.3.3 局部常量](#133-局部常量)
    - [1.4 函数](#14-函数)
      - [1.4.1 泛型](#141-泛型)
      - [1.4.2 类型工具——函数](#142-类型工具函数)
      - [1.4.2 递归](#142-递归)
      - [1.4.3 循环 <=> 递归](#143-循环--递归)
      - [1.4.4 尾递归](#144-尾递归)
      - [1.4.5 First-Class-Function](#145-first-class-function)
  - [2. 如何实现 toc 解释器？](#2-如何实现-toc-解释器)
    - [2.1 四则运算以及大小比较](#21-四则运算以及大小比较)
    - [2.2 解释器](#22-解释器)
      - [2.2.1 toc 的语法](#221-toc-的语法)
      - [2.2.2 词法分析](#222-词法分析)
      - [2.2.3 表达式](#223-表达式)
      - [2.2.4 语句](#224-语句)

TypeScript 是 JavaScript 的超集，主要给 JavaScript 添加了静态类型检查，并且与之完全兼容。在运行时，类型完全擦除。正因为如此，TypeScript 类型系统极其强大，这样才能在维持 JavaScript 动态性，做快速开发的同时，做到更多的类型提示与错误检查。

> 下面为了简单，将用 ts、js 这样的简称代替 TypeScript、JavaScript。

动态性与静态检查似乎是冲突的？但是 ts 团队和社区给出了要兼顾两者的一条路。就是在 ts 编译器无法做出推断时，让开发者告诉 ts 如何推断。而告诉 ts 的这段类型描述（简单说，就是随着输入类型不同，输出类型应该是什么），和对应 js 代码逻辑是一致的（因为只考虑类型，往往会简单一些）。所以 ts 的类型系统，要强大到[图灵完备](https://github.com/microsoft/TypeScript/issues/14833)才能胜任。

ts 的类型系统是一门函数式编程语言。类型体操说的就是利用这门编程语言玩花样。我们今天要玩的，就是用它实现另一门语言（这门语言我取名叫[toc](https://github.com/huanguolin/toc)）的解释器(如果要体验这个解释器请到[toc](https://github.com/huanguolin/toc)仓库, 很容易找到入口😊)。但我们不是立即开始，先热热身。所以，本文主要分为两个部分：
1. ts 的类型系统是怎样的函数式语言？
2. 如何实现 toc 解释器？

如果第一部分对你没有什么新奇的，可以直接跳到第二部分。

## 1. ts 的类型系统是怎样的函数式语言？
说到编程语言，我们会想到至少要包含变量、条件、循环、函数这些特性，否则没法用（当然我说的是正常的编程语言，可不是像 [Ook!](https://code.tutsplus.com/articles/10-most-bizarre-programming-languages-ever-created--net-2412) 这种）。不过在我谈变量、条件、循环、函数这些之前，我要说点更基础的东西。

### 1.1 类型与值

类型是描述值的集合，比如 `number` 代表了所有数字。`1` 是 `number` 的一个值。但 `1` 也可以是一个类型，它描述的集合中只有一个值罢了。ts 允许我们做这种精确类型描述。所以它还提供了联合类型（[union](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)）, 元组([tuple](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types))等。
```ts
type A = 1;

// union
type B = 'red' | 'green' | 'blue';

// tuple
type C = [B, number]; // ['red' | 'green' | 'blue', number]
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAglC8UCMBuAsAKEwem1ArgHYCWA9oZqJFAEIJQDkAThACYNQA+jA5ixIQ7cGAIwA2+CA3RYMuKMHxgxESuGgBhegG0aAGiiF8AWxEQmAXRRR525myG9+gro3GSGBo6fMWgA)，在线体验。

当然她也提供了全集和空集：`any` 和 `never`。   
下面我们回归变量、条件、循环、函数吧。


### 1.2 变量
额，实际上 ts 的类型系统并没有提供变量，它只提供了常量，这很函数式。不过这就够用了，如果你熟悉其他函数式编程语言，你就知道了。
```ts
type A = 2;
type B = string | A; // string | 2
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAglC8UBMBuAsAKFJKAhBUAzsAE4CWAdgOZQA+sKUA9E0aZTfUkA)，在线体验。

这就是全部吗？额，这是全局常量。其实还有一种是局部常量，这个等说条件的时候讲。另外我说过有函数，函数的入参也是一种常量啊😼。

### 1.3 条件
```ts
type A = 2;
type B = A extends number ? true : false; // true
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAglC8UBMBuAsAKFJKAhBsUEAHsBAHYAmAzlOQK4C2ARhAE5QD8Uwb90ALigAzAIYAbahBRQA9LJ58IQA)，在线体验。

是不是很简单？

`A extends B ? C : D` 这个形式，表达的是 `A` 可以赋值给 `B`，则结果是 `C`，否则为 `D`。可赋值在 ts 中是个关键的东西，我下面就来讲讲。

#### 1.3.1 可赋值性
ts 采用的是结构型类型系统（[Structural Type System](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html#structural-type-system), 也被称之为[鸭子类型](https://en.wikipedia.org/wiki/Duck_typing)）。就是说，ts 认为你是什么类型是看你有什么东西，或者说结构是不是符合某个类型定义的结构。只要符合某个类型定义的结构就可以，不必像 `java` 或者 `c#` 那样，必须要在定义时说是某个类型才可以。
```ts
type Cat = {
    eat: (food: string) => void;
};
type HuntDog = {
    eat: (food: string) => void;
    hunt: () => string;
};

type IsCat = HuntDog extends Cat ? true : false; // true

let cat: Cat = {
    eat: (food: string) => console.log(`eat ${food}`)
};
let hDog = {
    eat: (food: string) => console.log(`eat ${food}`),
    hunt: () => 'animal',
};

let hDog2: HuntDog = hDog; // ok
cat = hDog; // ok
hDog2 = cat; // error: Property 'hunt' is missing in type 'Cat' but required in type 'HuntDog'
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAwghsKBeKBvAsAKCjqEEBcUAFAGYD25AJkQM7ABOAlgHYDmAlMgHxQBu5JlQDcWAL6jMoSFAASAVxbAAIuTbI0WXHkIkK1Oo1ace-QSK24AFouBFiXJL3rN2kiVizToASVrxEFAUlVXUIAA9gCBYqWlgEKAB+KEZ5aCJSOAAbWghhKAB6ApSGNM9MLIhEAGNdAI0MbFx8Oz1KGigXY0deavIWWnJKgDostWIAAxaoABJUfSoxCY5xSUrEK1CGyxwW+wXDVxMnKD6BoYhR8amEuYWljgAaHagbJXseqAByOBYmAFtsl9npgPJgsOtXqEAExEYIqNQaTZqfJFKDkADWWFqgShKMKxUxWGRbGhGhxqOKEAYDHIDCAA)，在线体验。

回到 `A extends B ? C : D` ，只要 A 类型符合 B 类型的定义，或者说 A 类型是 B 类型的子集（当然，任何集合都是自身的子集），条件就成立，否则为不成立。这种形式下，还有一种可看作是模式匹配的语法。

#### 1.3.2 模式匹配
```ts
type A = Promise<string>;
type B = A extends Promise<infer C> ? C : never; // string

type T = [string, 1, null, A];
type R = T extends [string, ...infer Rest] ? Rest : never; // [1, null, A]
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAglC8UAKAnA9gWwJYGcIB4dgUsA7AcwD4BuAWAChRIoAhBWKCAD2AlIBMcydNjz4yAMwgooAYUpQA-HKgAuKKQgA3adSgB6fVCIkKDBk2gAVdgG0TZcgBooARhekArgBtvLmAC6dIzg0ABK7DbcvAJC9sSOLgB0KZLSUGEQRAFKGVnAahraugZGtu4aPn6wAUA)，在线体验。

这种语法可以识别 `extends` 左边是不是符合右边的类型结构，如果符合，可以推断出其中的某个部分。

#### 1.3.3 局部常量
上面例子种的 `C` 和 `Rest` 就是局部常量。利用这个我可以随时在局部换个变量名字：
```ts
type T = [string, 1, null, undefined];
type R = T extends [string, ...infer Rest]
    ? Rest extends [1, ...infer Rest]
        ? Rest extends [null, infer Rest] // 旧名字，在新的作用域下代表的值变化了
            ? Rest extends infer Last // 换名字，好无聊🥱，别担心，后面会用上的
                ? Last
                : never
            : never
        : never
    : never;
// undefined
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAKlC8UDaBnYAnAlgOwOYBooBGQ7AVwBsLCzsATCAMxwjoF0BuAWAChRIoAJQSwoEAB7AI9FMjRY8hAHQqcjCOiEQ0bXlH1QA-FrRjJ0urKQkoKpWo0ngungbdGnZqTOTkqhB01BbWc9d3DjYNMJb0soQKgAGQBDNDDwjI8UtNdMjIAuKGwIADcNdLzC4rL0Crcq0vLc-Qaa7h4Aeg6oWgZmYrogA)，在线体验。

在 [4.7](https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#extends-constraints-on-infer-type-variables), [4.8](https://devblogs.microsoft.com/typescript/announcing-typescript-4-8/#infer-types-template-strings) 两个版本还对这个条件表达式有扩展和优化，后续会讲到。


### 1.4 函数
不该讲循环了吗？额...其实 ts 类型系统中没有循环😓。不过别急，有替代品。我想你能猜到的……
没错，就是递归！所以要先看下函数。

#### 1.4.1 泛型
在看函数之前，我们要先看泛型。ts 类型系统并没有明说“我们提供了可供类型编程的函数”。但它的泛型却提供了一样的能力。
```ts
function flatten<T>(arr: (T | T[])[]): T[] {
    let result: T[] = [];
    for (let x of arr) {
        if (Array.isArray(x)) {
            result = result.concat(flatten(x));
        } else {
            result.push(x);
        }
    }
    return result;
}

console.log(flatten([1, 2, [3, 4], 5, [[6, 7], 8]])); // [1, 2, 3, 4, 5, 6, 7, 8]
console.log(flatten(['abc', ['123', ['456', '789']], 'def'])); // ["abc", "123", "456", "789", "def"]
```
> 点击[这里](https://www.typescriptlang.org/play?#code/GYVwdgxgLglg9mABMANgQylApmAPAFQD4AKNAJzIC5Fj9EAfRfAbQF0BKN96l1xAbwCwAKERjEKLFERksAZxAooPNogC8iNgG4R45HDI1J0gB6I4wROTLsBuveJiXiAQQpoAngDoYct2U9iE3ZbIVEHCNkFJXUZeUUoLwgECAxiVAxsMCCQnXCIgF9ELBQ5LDt8iPEohK8ABxA5AAscvKrEAvsxTsrZKBAyJBqlPJ6RZLA5OEkvFDgAc3T0TBxiZgBGABpEACZt5gBmbYAWVm2AVn3mADZtgHYzxAAOVg52LUQAek-NLd3to6IY4Xba3RB3bYvcYIKYzOaLDIrbLMADkaAARhAUfsUesdgdsZoUcdztdCSi7k8AJwo17bFEAEywwFpuS+P2YACIMRBOdtOXiDnzEJySddhZzKVSJUzgJy+EA)，在线体验。

这是常规用法——泛型让我们更容易复用算法(且类型安全)。ts 类型系统中，借助泛型可以复用相同形式的类型声明。如 `Promise<T>`。还可用作工具类型，官方就提供了多个 [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html), 如: `Required<Type>, Pick<Type, Keys>`。我们也可以自己实现一些工具类型，用起来就像函数。

#### 1.4.2 类型工具——函数
```ts
type PromiseValue<T> = T extends PromiseLike<infer V> ? V : never;

type TestPV1 = PromiseValue<Promise<string>>; // string
type TestPV2 = PromiseValue<Promise<'r' | 'g' | 'b'>>; // 'r' | 'g' | 'b'


type First<T extends unknown[], Fallback = unknown> = T extends [infer F, ...infer rest] ? F : Fallback;

type TestF1 = First<['r' | 'g' | 'b', number]>; // 'r' | 'g' | 'b'
type TestF2 = First<[string[]]>; // string[]
type TestF3 = First<[]>; // unknown
type TestF4 = First<[], any>; // any
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBACgTgewLYEsDOEBqBDANgVwgB4AVAPigF4oSoIAPYCAOwBM1ZFUMAZFAa2IpmAMwhwomCgH5JUAFxRmEAG7iA3AFgAUDtCQaENMBiYAjFU7J0WPISLxrGIsbjCA5mTLqoAel9Qrh564NAkRiaYAEyWjty2BMRxNkQA5HCpUAA+UKnumTmpAEapXj7+uRnZufnVxak6jdr60ABiKHDGpHSMLOxQ+Mz8zAgA7swA2gC6ADRQrXi4RdgAxvyWg8NjzBTUtAxMbBwTwmISrXMAdNen4lBwEVNQsq0K84vLa1q6zaGGxq0LNR2p1gEQJukCjUofU5sx8EgiuIpt4-AFIXVaoUSiEDOEATFgR0uhMgsx3NMUeUAmSKVNcWEIq0AMyWEEkqlogZDEbjBn-YCtAAsbOJYOmc2wzBAqIqUpAQA)，在线体验。

这里泛型参数就是函数参数，通过 `extends` 可以约束类型，泛型参数也支持默认值。

如果给 `PromiseValue<T>` 传入 `Promise<Promise<number>>` 的话，结果是 `Promise<number>`。假如这个时候，还是想获得最里面的类型，即 `number`。怎么办呢？那就该递归登场了。

#### 1.4.2 递归
```ts
type PromiseValue<T> = T extends PromiseLike<infer V> ? V : never;

type TestPV1 = PromiseValue<Promise<Promise<number>>>; // Promise<number>

type PromiseValueDeep<T> = T extends PromiseLike<infer V> ? PromiseValueDeep<V> : T;

type TestPVD1 = PromiseValueDeep<Promise<Promise<number>>>; // number
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBACgTgewLYEsDOEBqBDANgVwgB4AVAPigF4oSoIAPYCAOwBM1ZFUMAZFAa2IpmAMwhwomCgH5JUAFxRmEAG7iA3AFgAUDtCQaENMBiYAjFU7J0WPISLxrGB1xtFm+JACNxZP+qgAekCrbmIPb18dPXBoRzCcAggAEQgIMFIKaloGJjYOeJs+QSJhMQkpKFlCjETCVPSiSsUSLV1tfWgSIxNMZItqGtskhoyhlydwzx84PzIA4KVp8SA)，在线体验。

有了递归，就可以讲循环了😄！

#### 1.4.3 循环 <=> 递归
前面说了，ts 类型系统中并没有提供循环的原语。但是递归可以替代循环，它们是等价的。你没听错，递归和循环等价！二者可以相互转换。我们举个例子，将数字数组拼接成字符串：
```ts
function join(arr: number[]): string {
    let result = '';
    for (let x of arr) {
        result += x;
    }
    return result;
}
console.log(join([1, 2, 3])); // '123'

type Join<Arr extends number[], Result extends string = ''> =
    Arr extends [infer F, ...infer Rest]
        ? F extends number
            ? Rest extends number[]
                ? Join<Rest, `${Result}${F}`>
                : never
            : never
        : Result;
type test = Join<[1, 2, 3]>; // '123'
```
> 点击[这里](https://www.typescriptlang.org/play?#code/GYVwdgxgLglg9mABAKzjMAKAhgJxwLkTBAFsAjAUxwG0BdASkIGcod0BzRAbwFgAoRIMQAbClEQ4KTEMPEBeRAHJFAbn5DEwODkQZR4gB6I4wRLhz1u6jUMnTZiANQKDagUIC+1wZKggcSHYyUG5efBAITHCiAHTCcOwYqOgY1ACMADSIAExZAMwM9CqIAPQlSmnZeYr8-FAAngAOFIgAUmhgADwAgniIFAZQFGAAJkxEpJQ0tFkASlLB-YPDY4gsbGCcCsoAfIhy3oi9OgNDo+PU6MBUiABiWTGPVzfzLLSHGgD8d0tnq8TkKgfGyCb6vcSnFbjAFTOjAkFfNodTrgrIAAwAJFxXsEPFjbh40Tt4QjBIQwBQAG5A9ykslEKk00mEHGyNwNZqIIYsfZI9CddJZXKIAo7YplCpVRRAA)，在线体验。

上面的用循环实现的代码，用递归也同样能做到。只不过我们的类型版 `Join` 看起来有点啰嗦（多了两个判断😔）。不过，在 [4.7](https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#extends-constraints-on-infer-type-variables) 版本有改进这里的语法。所以可以改成：
```ts
function join(arr: number[]): string {
    let result = '';
    for (let x of arr) {
        result += x;
    }
    return result;
}
console.log(join([1, 2, 3])); // '123'

type Join<Arr extends number[], Result extends string = ''> =
    Arr extends [infer F extends number, ...infer Rest extends number[]]
        ? Join<Rest, `${Result}${F}`>
        : Result;
type test = Join<[1, 2, 3]>; // '123'
```
> 点击[这里](https://www.typescriptlang.org/play?#code/GYVwdgxgLglg9mABAKzjMAKAhgJxwLkTBAFsAjAUxwG0BdASkIGcod0BzRAbwFgAoRIMQAbClEQ4KTEMPEBeRAHJFAbn5DEwODkQZR4gB6I4wRLhz1u6jUMnTZiANQKDagUIC+1wZKggcSHYyUG5efBAITHCiAHTCcOwYqOgY1ACMADSIAExZAMwM9CqIAPQlSmnZeYr8-FAAngAOFIgAUmhgADwAgniIFAZQFGAAJkxEpJQ0tFkASlLB-YPDY4gsbGCcCsoAfIhy3oi9OgNDo+PU6MBUiABiS2erxORUWTHvVzfzLA8r489TOi0Q4aAD8bQ6nW+UCyAAMACRcb7BDyI24eWE7EFCQjI2RuBrNRBDH4KdroTrpLK5RAFHbFMoVKqKIA)，在线体验。

现在看起来是不是简洁了许多，二者转换的代码对比也更容易看清了。从循环映射为递归：
> 循环结束条件 -> 递归结束条件   
> 循环累计变量 result -> 递归函数"累计"参数 Result   
> 循环移动变量 x -> 递归函数"移动"参数 Arr   

在纯函数编程语言中，是没有循环的，只能用递归来代替。但是大家都知道，递归会导致函数调用栈快速加深。到达一定深度，就会爆栈。那这个问题怎么解决呢？

答案是尾递归优化。

> 为什么纯函数编程语言中没有循环？难道是因为有递归可用，就不必多搞一套东西？   
> 额，或者我问你，没有变量如何实现循环？   
> ……   
> 😄我想你知道了，做不到！   
> 没有变量无法保存状态，所以函数式编程语言选择用函数参数来“保存”。

#### 1.4.4 尾递归
我们上面写的递归都是尾递归，现在我们来一个不是的：
```ts
type TreeNode = {
    value: number;
    left: TreeNode | null;
    right: TreeNode | null;
};

type Tree<V extends number, L extends TreeNode | null = null, R extends TreeNode | null = null> = {
    value: V;
    left: L;
    right: R;
};

type PreOrderTraverse<T extends TreeNode> =
    T extends Tree<infer V, infer L, infer R>
        ? [V, ...PreOrderTraverse<L>, ...PreOrderTraverse<R>]
        : [];

//         1
//       /   \
//      2     6
//     / \      \
//    3   5      7
//     \        /  \
//      4       8   9
type tree = Tree<1,
    Tree<2,
        Tree<3,
            null,
            Tree<4>>,
        Tree<5>>,
    Tree<6,
        null,
        Tree<7,
            Tree<8>,
            Tree<9>>>>;

type test = PreOrderTraverse<tree>; // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAKgThCA5A9gE2gXigbwLABQUxUAbgIYA2ArhAFxQB21AtgEYRwDchJUlEAGbAG8RKgxQAPk2qVKPIiTgBLAOYALEbATJ00Gc3mKAvosKhIOxAB4AalAgAPYBEZoAzrPacANFAAZRxc3T2s9SUM5SihsI0p-ACVg13cvMQiDWXlY7MoAPlz8JWIKGnooO0U+AWEGAOrldS0GRNNzAktoAAUEAHk4DDh4clJODwgbGBTQ9N0JCELMXhJp51SwjJsVRkFOSv8dvbhAw939xPyVvmIAfigAbTt-ADo33ogBoZGxuAmbAL5V7vfqDTg-caTS4AXWuNwYD2hHQA9MibnwAIyEVHoqBo4gAHWx+L4ACYbgA2Yk3NEE9FEgg4kgAZhIAFZ0QB2al8Om4-EMpl8AAsuIAHCQAJwWcDQYC6XJbDG+OFbUkqko3LbMjW4m7xXV61a6GzC-JAuF8LZs82G4hbCl2-XRJ1Wk2c124rZii2avVbSXm80dLpQVweYC5D5fcFwUaQmzyxD5Lh4tEPZVQdVQHVQYX+Nn+R1QD1QMX+SXQoA)，在线体验。

尾递归与非尾递归的区别就是函数返回时，是直接一个函数调用，还是函数调用夹在一个表达式中。
[尾递归优化](https://stackoverflow.com/questions/310974/what-is-tail-call-optimization)，是通过复用一个函数调用栈来避免爆栈。在 ts 中也是有这样的优化。你跳到上面的在线体验示例，会发现 `? [V, ...PreOrderTraverse<L>, ...PreOrderTraverse<R>]` 这一行，ts 有 error 提示：`Type instantiation is excessively deep and possibly infinite.(2589)`

为什么呢？就如提示所说：类型实例化的深度过大，可能是无限的。ts 需要在我们写代码时，进行实时代码提示和纠错。过于复杂的类型势必会拖累这个过程，造成不可接受的用户体验下降。所以 ts 不仅要避免爆栈，而且还要计算速度。早期版本对递归深度的限制是 50 层。在 [4.5](https://devblogs.microsoft.com/typescript/announcing-typescript-4-5/#tailrec-conditional) 时做了优化，提高到 100 层，如果是尾递归则提高到 1000 层。基于此，我们可以实现比以前更复杂的体操。

但是，最终，这里的限制比其他编程语言更苛刻，不允许我们做长时运算。意味着，基于它实现的循环只能循环很有限的次数😓，函数调用也必然不能太深……


#### 1.4.5 First-Class-Function
在看到上面的限制后，或许你感到有点遗憾（一切都是权衡，没有什么是完美的）。但是不得不告诉你，还有另外一件不幸的事。它没有函数式语言的标志性能力—— [First-Class-Function](https://en.wikipedia.org/wiki/First-class_function)。即没有办法传入/传出函数，无法实现高阶函数。不过好在，没有这个能力，并不会影响表达能力。只是麻烦很多😓。

简单来说，使用 `Function(arguments, environment1) => return + environment2` 的方式，可以表达对等的东西。

以上就是这门函数式编程语言的介绍。休息一下。我们就要开始编写解释器了😄。


## 2. 如何实现 toc 解释器？

在实现解释器之前，我遇到的第一个麻烦事情是，如何实现四则运算？毕竟这些基本运算是一定要支持的啊！就仅仅支持正整数运算，就要一些技巧呢！是的，我们就只支持正整数运算。

### 2.1 四则运算以及大小比较
如果第一次面对这个问题，还真是有点摸不着头脑。就最简单，加法怎么实现啊？我似乎是 Google 后，找到答案的。
```ts
type A = [1, 2, 3];
type L1 = A['length']; // 3
type L2 = ['a', number]['length']; // 2
type L3 = []['length']; // 0
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAglC8UDaBGANFATBgzAXQG4BYAKFEigBkUFYkByAGwgDsBzYAC3sKgHo+UHKXLRKmWgwCG9DCwCuAWwBGEAE54Gzdlx4F+gzCPBickzU1YduvAVAAMQA)，在线体验。

以上的例子代码，是否让你找到了实现加法的灵感？或许你已经想到了……没错，加法就是准备两个指定长度数组，然后合并，然后取合并数组的长度。先实现生成指定长度数组的函数，然后实现加法！

```ts
type InitArray<L extends number, A extends any[] = []> =
    A['length'] extends L
        ? A
        : InitArray<L, [...A, any]>;
type Add<N1 extends number, N2 extends number> = [...InitArray<N1>, ...InitArray<N2>]['length'];
type test1 = Add<1, 3>; // 4
type test2 = Add<0, 10>; // 10
type test3 = Add<19, 13>; // 32
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAkgdgS2AQQE6oIYgDwBkoQAewEcAJgM5RwCuAtgEYSoA0UyBxplUGcIAbQC6UALxRhAPjEBYAFBRF7AQHIANqQDmwABYqRREuSq55S81AD87MxcUAuWIhToseNgIB035Gz4ghSQBueVBIdjIybAA5AEZOIx5aRmY2aIAmBO4qZKZUaXEvb3gkNEwcOMk2b08Sl3KY9MkhVQ04bT0hELkw6BIKYHjxZEjsWLYAZmDQ8D6IAczh0YAGNljl6Z7ZqH7gCbEIqNiATjWpoKA)，在线体验。

实现了加法，减法也是手到擒来。还是两个数组，被减数数组每次减少一个元素，减少减数次，在取被减数数组长度即可。

```ts
type Sub<
    N1 extends number,
    N2 extends number,
    A extends any[] = InitArray<N1>, // 被减数数组
    C extends any[] = [], // 计数数组
> = N2 extends C['length']
    ? A['length']
    : A extends [infer F, ...infer Rest extends any[]]
        ? Sub<N1, N2, Rest, [...C, any]>
        : 0; // 被减数小于减数
type test1 = Sub<10, 3>; // 7
type test2 = Sub<18, 9>; // 9
type test3 = Sub<9, 13>; // 0
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAkgdgS2AQQE6oIYgDwBkoQAewEcAJgM5RwCuAtgEYSoA0UyBxplUGcIAbQC6UALxRhAPjEBYAFBRF7AQHIANqQDmwABYqRREuSq55S81AD87MxcUAuWIhToseNgIB035Gz4ghSQBueXlQSHYyMmwAOQBGTiMeWkZmNhiAJkTuKhSmVGlxL294JDRMHHjJNm9PUpcK2IzJIVUNOG09IRC5MPBoAGUaBmxbRXjs42p6fJYxqEzJ5Jm0+Y5DHN5+YTEnMtdKuOqoAHoTqEBqiMB5xUAHUxvAEb95gGElqn8doqE2M6hAQui7x5yQoLLIbKZPNpaXT6ebWZCQjrQoTzRzrLhTAQIOAAM2YUAAYjVvFjcagoAAlCAUYCvLaCITIhR2KxQIYjeLpDJsSnUjy1J5+fiBebmRwABiCp3O1xugHgdQBxcrc+hESNSEuI2dg4mK2ABmYJSqAAdmV0FVwCyGuGWoAHGwAJwGn7201Qc263aa+1sOL6yU-MVAA)，在线体验。

😄，nice！
有了加法，乘法也很容易，`A * B` 等同于 `B` 个 `A` 相加，不过要注意 0 乘以任何数 都得 0:

```ts
type Mul<
    N1 extends number,
    N2 extends number,
    A extends number = N1, // 结果
    C extends number = 1, // 计数数字
> = N1 extends 0
    ? 0
    : N2 extends 0
        ? 0
        : C extends N2
            ? A
            : Mul<N1, N2, Add<A, N1>, Add<C, 1>>;
type test1 = Mul<11, 3>; // 33
type test2 = Mul<8, 9>; // 72
type test3 = Mul<9, 0>; // 0
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAkgdgS2AQQE6oIYgDwBkoQAewEcAJgM5RwCuAtgEYSoA0UyBxplUGcIAbQC6UALxRhAPjEBYAFBRF7AQHIANqQDmwABYqRREuSq55S81AD87MxcUAuWIhToseNgIB035Gz4ghSQBueXlQSHYyMmwAOQBGTiMeWkZmNhiAJkTuKhSmVGlxL294JDRMHHjJNm9PUpcK2IzJIVUNOG09IRC5MPBoAGUaBmxbRXjs42p6fJYxqEzJ5Jm0+Y5DHN5+YTEnMtdKuOqoAHoTqEBqiMB5xUAHUxvAEb95gGElqn8doqE2M6hAQui7x5yQoLLIbKZPNpaXT6ebWZCQjrQoTzRzrLhTAQIOAAM2YUAAYjVvFjcagoAAlCAUYCvLaCITIhR2KxQIYjeLpDJsSnUjy1J5+fiBebmRwABiCp3O1xugHgdQBxcrdQnJwtAALI0NSjJnjBJg5apVjzRb63IrI069i0vJ48QcqVQQDLfoAc82e1vNuzi33O-xugHVteTAiamqBi2GhlEg2lhy3mawx5lQRwvEOZEXMuHpuyODVa+2ZNjIKLYXwLI6F4sCqBHYJ9CIkakJcS57BxL1QADMwQdHY7degDeAWWbmuwAA42ABObs-ADsGX7UEHHd2LcnbDFM-OYqAA)，在线体验。

不过 `Add<A, N1>` 这里提示 `Type 'Add<A, N1>' does not satisfy the constraint 'number'.(2344)`。意思是它的结果不是永远都能得到 `number`, 所以不安全。这里应该是可能输出 `never` 或者 `any` 的情况，这很极端，我们一般使用一个类似断言的工具函数来处理这个问题：

```ts
type Safe<T, Type, Default extends Type = Type> = T extends Type ? T : Default;

type Mul<
    N1 extends number,
    N2 extends number,
    A extends number = N1, // 结果
    C extends number = 1, // 计数数字
> = N1 extends 0
    ? 0
    : N2 extends 0
        ? 0
        : C extends N2
            ? A
            : Mul<N1, N2, Safe<Add<A, N1>, number>, Safe<Add<C, 1>, number>>;
type test1 = Mul<11, 3>; // 33
type test2 = Mul<8, 9>; // 72
type test3 = Mul<9, 0>; // 0
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAkgdgS2AQQE6oIYgDwBkoQAewEcAJgM5RwCuAtgEYSoA0UyBxplUGcIAbQC6UALxRhAPjEBYAFBRF7AQHIANqQDmwABYqRREuSq55S81AD87MxcUAuWIhToseNgIB035Gz4ghSQBueXlQSHYyMmwAOQBGTiMeWkZmNhiAJkTuKhSmVGlxL294JDRMHHjJNm9PUpcK2IzJIVUNOG09IRC5MPBoAGUaBmxbRXjs42p6fJYxqEzJ5Jm0+Y5DHN5+YTEnMtdKuOqoAHoTqEBqiMB5xUAHUxvAEb95gGElqn8doqE2M6hAQui7x5yQoLLIbKZPNpaXT6ebWZCQjrQoTzRzrLhTAQIOAAM2YUAAYjVvFjcagoAAlCAUYCvLaCITIhR2KxQIYjeLpDJsSnUjy1J5+fiBebmRwABiCp3O1xugHgdQBxcrdQnJwoMMLjsAAVNia-psAAiEGxGBoahpYJ4uoi4itEGBmtptpZDschuNpuAPT6EQAsqbRkzxgkLbkVqx5osQ9NUuHA+xaXk8eIOVKoIBlv0AOebPBNh3Zxb7nf43QDq2vJgRMo2LYVAq3HHJH0Txa8yWc3mY4XlHMiLmXCe3ZHH61LF8yC2AN1RBsMgotP0kc2ImCuPJ9PZwKoAvo-lJMFvdASNSEuIh9g4qOAMzBVMXi-7qCH4BZE-+gAcbAAnNefgB2DL3x8L12U8PzYMVv3OMUgA)，在线体验。

接下来该除法了。思路是类似的，直接看代码：
```ts
type Div<
    N1 extends number,
    N2 extends number,
    A extends number = N1, // 结果
    C extends number = 0, // 计数数字
> = N1 extends 0
    ? 0
    : N2 extends 0
        ? never // 除数不能为 0
        : A extends 0
            ? C
            : Div<N1, N2, Sub<A, N2>, Safe<Add<C, 1>, number>>;
type test1 = Div<12, 3>; // 4
type test2 = Div<8, 9>; // 0
type test3 = Div<100, 33>; // 3
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAkgdgS2AQQE6oIYgDwBkoQAewEcAJgM5RwCuAtgEYSoA0UyBxplUGcIAbQC6UALxRhAPjEBYAFBRF7AQHIANqQDmwABYqRREuSq55S81AD87MxcUAuWIhToseNgIB035Gz4ghSQBueXlQSHYyMmwAOQBGTiMeWkZmNhiAJkTuKhSmVGlxL294JDRMHHjJNm9PUpcK2IzJIVUNOG09IRC5MPBoAGUaBmxbRXjs42p6fJYxqEzJ5Jm0+Y5DHN5+YTEnMtdKuOqoAHoTqEBqiMB5xUAHUxvAEb95gGElqn8doqE2M6hAQui7x5yQoLLIbKZPNpaXT6ebWZCQjrQoTzRzrLhTAQIOAAM2YUAAYjVvFjcagoAAlCAUYCvLaCITIhR2KxQIYjeLpDJsSnUjy1J5+fiBebmRwABiCp3O1xugHgdQBxcrdQnJwoMMLjsAAVNia-psAAiEGxGBoahpYJ4uoi4itEGBmtptpZDschuNpuAPT6EQAsqbRkzxgkLbkVqx5osQ9NUuHA+xaXk8eIOVKoIBlv0AOebPBNh3Zxb7nf43QDq2vJgRMo2LYVAq3HHJH0Txa8yWc3mY4XlHMiLmXCe3ZHH61LF8yC2AN1RBsMgotP0kc2ImCuPJ9PZwKoAvo-lJMFlaqoPqEAA3APmCuN0MxuZxhtJK+zNY5mO7FM-TPZqNL3Zigt-O6lkCr7BpeNbVm2DggrSEEWNYcAQMeeI-IAJmk3IAsHKAL8BgBccmBcaivGlb9rBUBPER+FHqeKaZOOwxziCxwThqM7RBuW5LruPQHiQ1IJOIFHYHEXJQAAzMEqYACzetA3HAFkfEntgAAcbAAJxiT8tZcVSwDCbs-FxGKv4iaJko-MJQA)，在线体验。

跑起来看看，啊！`test2`, `test3` 的值怎么是 `1` 和 `4`， 不是我们期待的 `0` 和 `3`。原因在于像，`8 / 9` 这种情况，我们无法分辨出 `8 - 9` 和 `8 - 8` 这样的区别。如果能分辨大小就好办了。

怎么比较大小呢？说实话，我第一次想这个问题，真的是一点思路也没有😓。还好我 Google 到了。方法就是同时对两个数字减 1，谁先到 0，谁就小。相等的情况比较好处理。下面来看实现：

```ts
type Eq<A, B> =
    A extends B
    ? (B extends A ? true : false)
    : false;

type Lt<A extends number, B extends number> =
    Eq<A, B> extends true
        ? false
        : A extends 0
            ? true
            : B extends 0
                ? false
                : Lt<Sub<A, 1>, Sub<B, 1>>;
type test1 = Lt<1, 3>;
type test2 = Lt<3, 2>;
type test3 = Lt<3, 3>;
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAkgdgS2AQQE6oIYgDwBkoQAewEcAJgM5RwCuAtgEYSoA0UyBxplUGcIAbQC6UALxRhAPjEBYAFBRF7AQHIANqQDmwABYqRREuSq55S81AD87MxcUAuWIhToseNgIB035Gz4ghSQBueXlQSHYyMmwAOQBGTiMeWkZmNhiAJkTuKhSmVGlxL294JDRMHHjJNm9PUpcK2IzJIVUNOG09IRC5MPBoAGUaBmxbRXjs42p6fJYxqEzJ5Jm0+Y5DHN5+YTEnMtdKuOqoAHoTqEBqiMB5xUAHUxvAEb95gGElqn8doqE2M6hAQui7x5yQoLLIbKZPNpaXT6ebWZCQjrQoTzRzrLhTAQIOAAM2YUAAYjVvFjcagoAAlCAUYCvLaCITIhR2KxQIYjeLpDJsSnUjy1J5+fiBebmRwABiCp3O1xugHgdQBxcrdQnJwoMMLjsAAVNia-psAAiEGxGBoahpYJ4uoi4itEGBmtptpZDschuNpuAPT6EQAsqbRkzxgkLbkVqx5osQ9NUuHA+xaXk8eIOVKoIBlv0AOebPBNh3Zxb7nf43QDq2vJgRMo2LYVAq3HHJH0Txa8yWc3mY4XlHMiLmXCe3ZHH61LF8yC2AN1RBsMgotP0kc2ImCuPJ9PZwKoAvo-lJMFlaqoABRACOc6gACFCmtaefqwAKc+0jjWYCoGjQRzGtQUCAAShRUBfj+Xoqv0UC4MA045jGbCPlGS5XnGJ5npetKvu+-YskBECYaitJti2igvm+OFxi2jhwY2VAEYR5jWNhmHkeBkFsmeW6seebBHHuoERCQ1IJOIEHYKOADMPEHvxwBZEJkGiWwzQ9JJVLAKJuzCfJUDiUEQA)，在线体验。

接下来我们把除法搞对：

```ts
type Div<
    N1 extends number,
    N2 extends number,
    A extends number = N1, // 结果
    C extends number = 0, // 计数数字
> = N1 extends 0
    ? 0
    : N2 extends 0
        ? never // 除数不能为 0
        : Lt<A, N2> extends true
            ? C
            : Div<N1, N2, Sub<A, N2>, Safe<Add<C, 1>, number>>;
type test1 = Div<12, 3>; // 4
type test2 = Div<8, 9>; // 0
type test3 = Div<100, 33>; // 3
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAkgdgS2AQQE6oIYgDwBkoQAewEcAJgM5RwCuAtgEYSoA0UyBxplUGcIAbQC6UALxRhAPjEBYAFBRF7AQHIANqQDmwABYqRREuSq55S81AD87MxcUAuWIhToseNgIB035Gz4ghSQBueXlQSHYyMmwAOQBGTiMeWkZmNhiAJkTuKhSmVGlxL294JDRMHHjJNm9PUpcK2IzJIVUNOG09IRC5MPBoAGUaBmxbRXjs42p6fJYxqEzJ5Jm0+Y5DHN5+YTEnMtdKuOqoAHoTqEBqiMB5xUAHUxvAEb95gGElqn8doqE2M6hAQui7x5yQoLLIbKZPNpaXT6ebWZCQjrQoTzRzrLhTAQIOAAM2YUAAYjVvFjcagoAAlCAUYCvLaCITIhR2KxQIYjeLpDJsSnUjy1J5+fiBebmRwABiCp3O1xugHgdQBxcrdQnJwoMMLjsAAVNia-psAAiEGxGBoahpYJ4uoi4itEGBmtptpZDschuNpuAPT6EQAsqbRkzxgkLbkVqx5osQ9NUuHA+xaXk8eIOVKoIBlv0AOebPBNh3Zxb7nf43QDq2vJgRMo2LYVAq3HHJH0Txa8yWc3mY4XlHMiLmXCe3ZHH61LF8yC2AN1RBsMgotP0kc2ImCuPJ9PZwKoAvo-lJMFlaqoABRACOc6gACFCmtaefqwAKc+0jjWYCoGjQRzGtQUCAAShRUBfj+Xoqv0UC4MA045jGbCPlGS5XnGJ5npetKvu+-YskBECYaitJti2igvm+OFxi2jhwY2VAEYR5jWNhmHkeBkFsmeW6seebBHHuvSgRE+oIAAbgG5gVlR26rHGDZJKGMHXvBubJqOPyZtmCkxrsYoFn8dylkCuxiTJNbVjR9aguJNF0dQECCXiPyACZpNyALBygC-AYAXHLGWRSiOBBZ6ZNIUboaRtFEVATyMd5UACcJKaZOOwx+c0K4ajO0QbluCE8QeJDUgk4jRdgcRclAADMwSpgALN60A5cAWT5UJ2AABxsAAnOVPy1tlVLACVuwFXEYpaaVZWSj8JVAA)，在线体验。

Good job! 一切都如期而至！

上面实现了 `Lt`， 那么其他几个比较函数就不难了，这部分就留着读者你去试试吧。

在这一小节结束，我想说，实现四则运算和大小比较其实还有另外一种思路。我最早考虑加法的实现就只想到这个思路——用字符串来实现。

对于加法，就是按位(是个位，十位这样哦)查表加，含进位处理。结果还是一个数字字符串。

对于小于比较，先比较字符串长度，谁短谁小，长度一样，按位查表比较，从高位开始。

对于大小比较这个方案，是完全OK的。但是加法，从数字转字符串很容易。但是反过来，却什么好没办法。不过，[4.8](https://devblogs.microsoft.com/typescript/announcing-typescript-4-8/#infer-types-template-strings) 版本这个问题解决了。
```ts
type SN = '123' extends `${infer N extends number}` ? N : never; // 123
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAygclAvFA5ARgEwGYVQgD2AgDsATAZygAMASAbwEtiAzCAJygQKLMuIFcAtgCN2AXypQA-JygAuKMQgA3dgG4oAek1RMWIA)，在线体验。

所以一切都很完美！你可能会问，这个方案听起来很复杂，和前面用数组实现的比起来，似乎没有任何优势。复杂是真的复杂，但优势是有的。我们前面说过，ts 类型运算是有递归深度限制的。数组的实现可以很快触碰到限制，而字符串的方案在很大的数上都没有触到限制。
```ts
type test1 = Add<999, 999>; // 1998
type test2 = Add<999, 1000>; // Type instantiation is excessively deep and possibly infinite.(2589) 
```
点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAkgdgS2AQQE6oIYgDwBkoQAewEcAJgM5RwCuAtgEYSoA0UyBxplUGcIAbQC6UALxRhAPjEBYAFBRF7AQHIANqQDmwABYqRREuSq55S81AD87MxcUAuWIhToseNgIB035Gz4ghSQBueXlQSHYyMmwAOQBGTiMeWkZmNhiAJkTuKhSmVGlxL294JDRMHHjJNm9PUpcK2IzJIVUNOG09IRC5MPBoEgpgBPFkKOwATim2KYngvojB4CzR8dm2OIAGbeCgA)，在线体验。

如果你想体验字符串版本，可以直接去仓库 [toc](https://github.com/huanguolin/toc) 点击前往解释器。输入 `type Result = Toc<'99999 + 99999;'>` 来体验。因为 `toc` 底层就是用的字符串版本。代码在[这里](https://github.com/huanguolin/toc/tree/master/type-toc/utils/math/fast)。

好了，现在，我们应该准备好开始实现解释器了。

### 2.2 解释器

这可是个大工程。我们一步一步来。但总的分三步：词法分析，语法分析，执行。另外为了对比，也为了照顾想我一样非计算机专业出身的人（我个人感觉直接看一门熟悉的语言来实现解释器会更好接受一点），我会讲两个版本的实现：
* 用 ts（你可以理解为用 js）实现的，在 [ts-toc](https://github.com/huanguolin/toc/tree/master/ts-toc) 下。
* 用 ts 类型系统实现的，在 [type-toc](https://github.com/huanguolin/toc/tree/master/type-toc) 下。

我在讲一个特性时，回先讲 ts 版，然后说 type 版。

#### 2.2.1 toc 的语法

#### 2.2.2 词法分析

#### 2.2.3 表达式


#### 2.2.4 语句