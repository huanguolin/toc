# 类型体操之实现一个类C风格语言的解释器

TypeScript 是 JavaScript 的超集，她主要给 JavaScript 添加了静态类型检查，并且与之完全兼容。在运行时，类型完全擦除。正因为如此，TypeScript 类型系统极其强大，这样才能维持 JavaScript 动态性，做快速开发的同时，做到更多的类型提示与错误检查。

> 下面为了简单，将用 ts、js 这样的简称代替 TypeScript、JavaScript。

动态性与静态检查似乎是冲突的？但是 ts 团队和社区给出了要兼顾两者的一条路。就是在 ts 编译器无法做出推断时，让开发者告诉 ts 如何推断。告诉 ts 的这段类型描述（简单说，就是随着输入类型不同，输出类型应该是什么），和对应 js 代码逻辑是一致的（因为只考虑类型，往往会简单一些）。所以 ts 的类型系统，要强大到[图灵完备](https://github.com/microsoft/TypeScript/issues/14833)才能胜任。

ts 的类型系统是一门函数式编程语言。类型体操说的就是利用这门编程语言玩花样。我们今天要玩的就是，用它实现另一门语言（这门语言我取名叫[toc](https://github.com/huanguolin/toc)）的解释器(如果要体验这个解释器请到[toc](https://github.com/huanguolin/toc)仓库, 很容易找到入口😊)。但是我不是立即开始，我们先要热热身。所以，本文主要分为两个部分：
1. ts 的类型系统是怎样的函数式语言？
2. 如何实现 toc 解释器？

如果第一部分对你没有什么新奇的，可以直接跳到第二部分。

## 1. ts 的类型系统是怎样的函数式语言？
说到编程语言，我们会想到至少要包含变量、条件、循环、函数这些特性，否则没法用（当然我说的是正常的编程语言，可不是像 [Ook!](https://code.tutsplus.com/articles/10-most-bizarre-programming-languages-ever-created--net-2412) 这种）。不过在我谈变量、条件、循环、函数这些之前，我要说点更基础的东西。

### 1.1 类型与值

类型是描述值的集合，比如 `number` 代表了所有数字。`1` 是 `number` 的一个值。但 `1` 也可以是一个类型，它描述的集合种只有一个值罢了。ts 允许我们做这种精确类型描述。所以她还提供了联合类型（[union](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)）, 元组([tuple](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types))等。
```ts
type A = 1;

// union
type B = 'red' | 'green' | 'blue';

// tuple
type C = [B, number];
```
当然她也提供了全集和空集：`any` 和 `never`。
下面我们回归变量、条件、循环、函数吧。


### 1.2 变量
实际上 ts 的类型系统并没有提供变量，她只提供了常量，这很函数式。不过这就够用了，如果你熟悉其他函数式编程语言，你就知道了。
```ts
type A = 2;
type B = string | A; // string | 2
```
这就是全部吗？其实还有一种是局部常量，这个等说条件的时候讲。另外讲函数时，入参也是一种常量😼。

### 1.3 条件
```ts
type A = 2;
type B = A extends number ? true : false; // true
```
是不是很简单？

`A extends B ? C : D` 这个形式，表达的是 `A` 可以赋值给 `B`，则结果是 `C`，否则为 `D`。可赋值在 ts 中是个关键的东西。

#### 1.3.1 可赋值性
ts 采用的是结构型类型系统（[Structural Type System](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html#structural-type-system), 也被称之为[鸭子类型](https://en.wikipedia.org/wiki/Duck_typing)）。就是说，ts 认为你是什么类型是看你有什么东西，结构是不是符合某个类型定义的结构。只要符合某个类型定义的结构就可以，所以不必像 `java` 或者 `c#` 那样必须在定义是说什么类型才可以。
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
点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAwghsKBeKBvAsAKCjqEEBcUAFAGYD25AJkQM7ABOAlgHYDmAlMgHxQBu5JlQDcWAL6jMoSFAASAVxbAAIuTbI0WXHkIkK1Oo1ace-QSK24AFouBFiXJL3rN2kiVizToASVrxEFAUlVXUIAA9gCBYqWlgEKAB+KEZ5aCJSOAAbWghhKAB6ApSGNM9MLIhEAGNdAI0MbFx8Oz1KGigXY0deavIWWnJKgDostWIAAxaoABJUfSoxCY5xSUrEK1CGyxwW+wXDVxMnKD6BoYhR8amEuYWljgAaHagbJXseqAByOBYmAFtsl9npgPJgsOtXqEAExEYIqNQaTZqfJFKDkADWWFqgShKMKxUxWGRbGhGhxqOKEAYDHIDCAA)，在线体验。

回到 `A extends B ? C : D` ，只要 A 符合 B 的定义，或者说 A 类型是 B 类型的子集（当然，任何集合都是自身的子集），条件就成立，否则为不成立。这种形式下，还有一种可看作是模式匹配的语法。

#### 1.3.2 模式匹配
```ts
type A = Promise<string>;
type B = A extends Promise<infer C> ? C : never; // string

type T = [string, 1, null, A];
type R = T extends [string, ...infer Rest] ? Rest : never; // [1, null, A]
```
点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAglC8UAKAnA9gWwJYGcIB4dgUsA7AcwD4BuAWAChRIoAhBWKCAD2AlIBMcydNjz4yAMwgooAYUpQA-HKgAuKKQgA3adSgB6fVCIkKDBk2gAVdgG0TZcgBooARhekArgBtvLmAC6dIzg0ABK7DbcvAJC9sSOLgB0KZLSUGEQRAFKGVnAahraugZGtu4aPn6wAUA)，在线体验。

这种语法可以识别，`extends` 左边是不是符合右边的类型结构，如果符合，可以推断出其中的某个部分。

#### 1.3.3 局部常量
上面例子种的 `C` 和 `Rest` 就是局部常量。利用这个我可以随时在局部换个变量名字：
```ts
type T = [string, 1, null, undefined];
type R = T extends [string, ...infer Rest]
    ? Rest extends [1, ...infer Rest]
        ? Rest extends [null, infer Rest] // 旧名字，但是在新的作用域
            ? Rest extends infer Last // 换名字，无聊🥱，别担心，后面会用上的
                ? Last
                : never
            : never
        : never
    : never;
// undefined
```
点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAKlC8UDaBnYAnAlgOwOYBooBGQ7AVwBsLCzsATCAMxwjoF0BuAWAChRIoAJQSwoEAB7AI9FMjRY8hAHQqcjCOiEQ0bXlH1QA-FrRjJ0urKQkoKpWo0ngungbdGnZqTOTkqhB01BbWc9d3DjYNMJb0soQKgAGQBDNDDwjI8UtNdMjIAuKGwIADcNdLzC4rL0Crcq0vLc-Qaa7h4Aeg6oWgZmYrogA)，在线体验。

在 [4.7](https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#extends-constraints-on-infer-type-variables), [4.8](https://devblogs.microsoft.com/typescript/announcing-typescript-4-8/#infer-types-template-strings) 两个版本还对这个条件表达式有扩展和优化，后续会将到。


### 1.4 函数
不该讲循环了吗？额...其实 ts 类型系统中没有循环😓。不过别急，有替代品。我想你知道的，没错，就是递归！所以要先看下函数。

#### 1.4.1 泛型
在看函数之前，我们要先看泛型。ts 类型系统并没有明说“我们提供了可供类型编程的函数”。但她的泛型却提供了一样的能力。
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
点击[这里](https://www.typescriptlang.org/play?#code/GYVwdgxgLglg9mABMANgQylApmAPAFQD4AKNAJzIC5Fj9EAfRfAbQF0BKN96l1xAbwCwAKERjEKLFERksAZxAooPNogC8iNgG4R45HDI1J0gB6I4wROTLsBuveJiXiAQQpoAngDoYct2U9iE3ZbIVEHCNkFJXUZeUUoLwgECAxiVAxsMCCQnXCIgF9ELBQ5LDt8iPEohK8ABxA5AAscvKrEAvsxTsrZKBAyJBqlPJ6RZLA5OEkvFDgAc3T0TBxiZgBGABpEACZt5gBmbYAWVm2AVn3mADZtgHYzxAAOVg52LUQAek-NLd3to6IY4Xba3RB3bYvcYIKYzOaLDIrbLMADkaAARhAUfsUesdgdsZoUcdztdCSi7k8AJwo17bFEAEywwFpuS+P2YACIMRBOdtOXiDnzEJySddhZzKVSJUzgJy+EA)，在线体验。

泛型让我们更容易复用算法(且类型安全)。ts 类型系统中，借助泛型可以复用相同形式的类型声明。如 `Promise<T>`。还可用用作工具类型，官方就提供了多个 [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html), 如: `Required<Type>, Pick<Type, Keys>`。我们可以自己实现一些工具类型，和官方提供的一样，这些用起来就像函数。

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
点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBACgTgewLYEsDOEBqBDANgVwgB4AVAPigF4oSoIAPYCAOwBM1ZFUMAZFAa2IpmAMwhwomCgH5JUAFxRmEAG7iA3AFgAUDtCQaENMBiYAjFU7J0WPISLxrGIsbjCA5mTLqoAel9Qrh564NAkRiaYAEyWjty2BMRxNkQA5HCpUAA+UKnumTmpAEapXj7+uRnZufnVxak6jdr60ABiKHDGpHSMLOxQ+Mz8zAgA7swA2gC6ADRQrXi4RdgAxvyWg8NjzBTUtAxMbBwTwmISrXMAdNen4lBwEVNQsq0K84vLa1q6zaGGxq0LNR2p1gEQJukCjUofU5sx8EgiuIpt4-AFIXVaoUSiEDOEATFgR0uhMgsx3NMUeUAmSKVNcWEIq0AMyWEEkqlogZDEbjBn-YCtAAsbOJYOmc2wzBAqIqUpAQA)，在线体验。

这里泛型参数就是函数参数，通过 `extends` 来约束类型，还支持默认值。

#### 1.4.2 递归
取上面第一个例子，给 `PromiseValue` 传入 `Promise<Promise<number>>` 的话，结果是 `Promise<number>`。假如这个时候，还是想获得内部的类型，即 `number`。怎么办呢？那就该递归登场了。
```ts
type PromiseValue<T> = T extends PromiseLike<infer V> ? V : never;

type TestPV1 = PromiseValue<Promise<Promise<number>>>; // Promise<number>

type PromiseValueDeep<T> = T extends PromiseLike<infer V> ? PromiseValueDeep<V> : T;

type TestPVD1 = PromiseValueDeep<Promise<Promise<number>>>; // number
```
点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBACgTgewLYEsDOEBqBDANgVwgB4AVAPigF4oSoIAPYCAOwBM1ZFUMAZFAa2IpmAMwhwomCgH5JUAFxRmEAG7iA3AFgAUDtCQaENMBiYAjFU7J0WPISLxrGB1xtFm+JACNxZP+qgAekCrbmIPb18dPXBoRzCcAggAEQgIMFIKaloGJjYOeJs+QSJhMQkpKFlCjETCVPSiSsUSLV1tfWgSIxNMZItqGtskhoyhlydwzx84PzIA4KVp8SA)，在线体验。

#### 1.4.3 循环 <=> 递归
前面我们说了，ts 类型系统中并没有提供循环的原语。但是递归可以替代循环，它们是等价的。你没听错，递归和循环等价！二者可以相互转换。我们举个例子，将数字数组拼接成字符串：
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
点击[这里](https://www.typescriptlang.org/play?#code/GYVwdgxgLglg9mABAKzjMAKAhgJxwLkTBAFsAjAUxwG0BdASkIGcod0BzRAbwFgAoRIMQAbClEQ4KTEMPEBeRAHJFAbn5DEwODkQZR4gB6I4wRLhz1u6jUMnTZiANQKDagUIC+1wZKggcSHYyUG5efBAITHCiAHTCcOwYqOgY1ACMADSIAExZAMwM9CqIAPQlSmnZeYr8-FAAngAOFIgAUmhgADwAgniIFAZQFGAAJkxEpJQ0tFkASlLB-YPDY4gsbGCcCsoAfIhy3oi9OgNDo+PU6MBUiABiWTGPVzfzLLSHGgD8d0tnq8TkKgfGyCb6vcSnFbjAFTOjAkFfNodTrgrIAAwAJFxXsEPFjbh40Tt4QjBIQwBQAG5A9ykslEKk00mEHGyNwNZqIIYsfZI9CddJZXKIAo7YplCpVRRAA)，在线体验。

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
点击[这里](https://www.typescriptlang.org/play?#code/GYVwdgxgLglg9mABAKzjMAKAhgJxwLkTBAFsAjAUxwG0BdASkIGcod0BzRAbwFgAoRIMQAbClEQ4KTEMPEBeRAHJFAbn5DEwODkQZR4gB6I4wRLhz1u6jUMnTZiANQKDagUIC+1wZKggcSHYyUG5efBAITHCiAHTCcOwYqOgY1ACMADSIAExZAMwM9CqIAPQlSmnZeYr8-FAAngAOFIgAUmhgADwAgniIFAZQFGAAJkxEpJQ0tFkASlLB-YPDY4gsbGCcCsoAfIhy3oi9OgNDo+PU6MBUiABiS2erxORUWTHvVzfzLA8r489TOi0Q4aAD8bQ6nW+UCyAAMACRcb7BDyI24eWE7EFCQjI2RuBrNRBDH4KdroTrpLK5RAFHbFMoVKqKIA)，在线体验。

现在看起来是不是简洁了许多，二者转换的代码对比也更容易看清了。从循环映射为递归：
> 循环结束条件 -> 递归结束条件   
> 循环累计变量 result -> 递归函数累计参数 Result   
> 循环移动变量 x -> 递归函数变化的输入参数 Arr   

在纯函数编程语言中，就是没有提供循环，直接用递归来代替。但是大家都知道，递归会导致函数调用栈快速加深。到达一定程度，就会爆栈。那这个问题怎么解决呢？关键在尾递归优化。

#### 1.4.3 尾递归
