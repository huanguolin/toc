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
  - [2. 如何实现 Toc 解释器？](#2-如何实现-toc-解释器)
    - [2.1 四则运算以及大小比较](#21-四则运算以及大小比较)
    - [2.2 解释器](#22-解释器)
      - [2.2.1 Toc 的语法](#221-toc-的语法)
      - [2.2.2 词法分析](#222-词法分析)
        - [2.2.2.1 分词（ts版）](#2221-分词ts版)
        - [2.2.2.2 分词（type版）](#2222-分词type版)
      - [2.2.3 语法分析](#223-语法分析)
        - [2.2.3.1 递归下降](#2231-递归下降)
        - [2.2.3.2 完整的表达式语法分析(ts版本)](#2232-完整的表达式语法分析ts版本)
        - [2.2.3.3 完整的表达式语法分析(type版本)](#2233-完整的表达式语法分析type版本)
      - [2.2.4 执行](#224-执行)
        - [2.2.4.1 访问者模式与ts-Interpreter](#2241-访问者模式与ts-interpreter)
        - [2.2.4.2 type-Interpreter](#2242-type-interpreter)
      - [2.2.5 语句](#225-语句)
        - [2.2.5.1 表达式语句](#2251-表达式语句)
        - [2.2.5.2 环境](#2252-环境)
        - [2.2.5.3 var 语句](#2253-var-语句)
        - [2.2.5.4 变量表达式和赋值表达式](#2254-变量表达式和赋值表达式)
        - [2.2.5.5 作用域](#2255-作用域)
        - [2.2.5.6 block 语句](#2256-block-语句)
        - [2.2.5.7 if 语句](#2257-if-语句)
        - [2.2.5.8 for 语句](#2258-for-语句)
      - [2.2.6 函数](#226-函数)
        - [2.2.6.1 函数语句](#2261-函数语句)
        - [2.2.6.2 call 表达式](#2262-call-表达式)
      - [2.2.7 未尽事宜](#227-未尽事宜)
    - [3. 总结](#3-总结)

TypeScript 是 JavaScript 的超集，主要给 JavaScript 添加了静态类型检查，并且与之完全兼容。在运行时，类型完全擦除。正因为如此，TypeScript 类型系统极其强大，这样才能在维持 JavaScript 动态性，做快速开发的同时，做到更多的类型提示与错误检查。

> 下面为了简单，将用 ts、js 这样的简称代替 TypeScript、JavaScript。

动态性与静态检查似乎是冲突的？但是 ts 团队和社区给出了要兼顾两者的一条路。就是在 ts 编译器无法做出推断时，让开发者告诉 ts 如何推断。而告诉 ts 的这段类型描述（简单说，就是随着输入类型不同，输出类型应该是什么），和对应 js 代码逻辑是一致的（因为只考虑类型，往往会简单一些）。所以 ts 的类型系统，要强大到[图灵完备](https://github.com/microsoft/TypeScript/issues/14833)才能胜任。

ts 的类型系统是一门函数式编程语言。类型体操说的就是利用这门编程语言玩花样。我们今天要玩的，就是用它实现另一门语言（这门语言我取名叫[Toc](https://github.com/huanguolin/Toc)）的解释器(如果要体验这个解释器请到[Toc](https://github.com/huanguolin/Toc)仓库, 很容易找到入口😊)。`Toc` 语言是 `C` 风格语法，接近 `js`。动态类型，基础类型有数字、布尔、字符串和 `null`，支持变量，表达式，块语句，`if-else` 条件语句，`for` 循环语句，函数。且函数是一等公民，可以传入传出，支持闭包。更详细的语法，可以参见 [Toc Grammar Spec](https://github.com/huanguolin/toc/blob/master/docs/grammar.md)。

如果你对 ts 的类型系统还不是很了解，没关系。😊我们不是马上就动手实现它，先做点热身运动——来看看 ts 的类型系统提供了什么，有什么限制。所以，本文分为两个部分：
1. ts 的类型系统是怎样的函数式语言？
2. 如何实现 Toc 解释器？

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
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAglC8UCMBuAUGg9JqBXAdgJYD2+aokUAQglAOQBOEAJnVAD70DmTE+bnOgCMANrgh10WHMFxgREcuGgBhWgG0qAGij5cAWyEQGAXRRRsUdYxYDuvfh3qjxdHXsPGTQA)，在线体验。   


当然她也提供了全集和空集：`any` 和 `never`。
下面我们回归变量、条件、循环、函数吧。


### 1.2 变量
额，实际上 ts 的类型系统并没有提供变量，它只提供了常量，这很函数式。不过这就够用了，如果你熟悉其他函数式编程语言，你就知道了。
```ts
type A = 2;
type B = string | A; // string | 2
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAglC8UBMBuAUKSUBCCoGdgAnASwDsBzKAH1hSgHoGDjyrakg)，在线体验。   


这就是全部吗？额，这是全局常量。其实还有一种是局部常量，这个等说条件的时候讲。另外我说过有函数，函数的入参也是一种常量啊😼。

### 1.3 条件
```ts
type A = 2;
type B = A extends number ? true : false; // true
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAglC8UBMBuAUKSUBCDZQgA9gIA7AEwGcpSBXAWwCMIAnKAfimBdugC4oAMwCGAG0oQUUAPTSuPCEA)，在线体验。   


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
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAwghsKBeKBvAUFLUIIFxQAUAZgPakAmBAzsAE4CWAdgOYCUyAfFAG6kMUA3OgC+w0JCgAJAK5NgAEVItkaTNlzACJclSi1GrDkm58Bw7FAAWcrUWPcDzFsLHp0E6AElq8RCll5JRUIAA9gCCYKalgEKAB+KHoZaAJiOAAbaghBKAB6PKS6FPcMiEQAY3xY-zVLTW0yShp6ZwcoCtImalIygDoM5UIAA00oABJUJooRYbZRYTLEK2DVDHrqnWb9VqMuDq6e-sGWEbHJ6dm2ABp1LBt5bXaAcjgmBgBbTOfbt3Ql6zBABMBECimUqhWylyBSgpAA1ugqrUoS58oUEehUUDVMiYYUIHQ6KQ6AQAArEyB0UBQZ4PYDPKAMGIfZnUZxMphJcDQZ5+RkAIxkiDoEAAjjIGKKKJzuZJnmDgs8gA)，在线体验。   


回到 `A extends B ? C : D` ，只要 A 类型符合 B 类型的定义，或者说 A 类型是 B 类型的子集（当然，任何集合都是自身的子集），条件就成立，否则为不成立。这种形式下，还有一种可看作是模式匹配的语法。

#### 1.3.2 模式匹配
```ts
type A = Promise<string>;
type B = A extends Promise<infer C> ? C : never; // string

type T = [string, 1, null, A];
type R = T extends [string, ...infer Rest] ? Rest : never; // [1, null, A]
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAglC8UAKAnA9gWwJYGcIB4dgUsA7AcwD4BuAKFEigCEFYoIAPYCUgEx2TpsefGQBmEFFADClKAH4ZUAFxRSEAG6TqUAPS6oREhVr1w0ACqsA2kbLkANFACMT0gFcANp6cwAunQM0ABKrFac3HwCtsT2TgB0ieKSUMEQRH4KqenAKmqa2noG1q5qXj6wfkA)，在线体验。   


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
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAKlC8UDaBnYAnAlgOwOYBooBGQ7AVwBsLCzsATCAMxwjoF0BuAKFEigCUEsKBAAewCPRTI0WPIQB0SnIwjoBENGy5RdUAPwa0I8ZLrSkJKEoUq1R4Nr3ODDkxKnJyVQnfX9NRygAemCoQHPTQFgVQHVtQBh-wAp1QAbTQBC3QB15QApXQH31QGg5QGO5QAsI5MAeBUAN5UA0ZUAwuR0XGsMA4zEPcyg-KAAZAENjUKhAI2MY2MBfTUAD00ApAMA+DcBHXdjAaiVAUaNAYf1YwDgVQCN0wCx5dMAoOWTqmv3XTrQ9g5cALihsCAA3NRODi6vb9Hu9R5u753fn7h7aBmYVzoQA)，在线体验。   


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
> 点击[这里](https://www.typescriptlang.org/play?#code/GYVwdgxgLglg9mABMANgQylApmAPAFQD4AKNAJzIC5Fj9EAfRfAbQF0BKN96l1xAbwBQiEYhRYoiMlgDOIFFB5tEAXkRsA3MNHA4ZGuMkAPRHGCJyZdgO2jRMc8QCCFNAE8AdDBkuy74kbs1kJ2oaLScgqqUrLyUB4QCBAYxKgY2GABQVphIgC+iFgoMlg2uaERcR4ADiAyABZZObl5toitdtJQIGRIlQparYKJYDJw4h4ocADmqeiYOMTMAIwANIgATOvMAMzrACys6wCs28wAbOsA7EeIABysHOwaiAD0r+prm+t7iPsn60uiCu6wewwQYwmU1maQWmWYAHI0AAjCAI7YI5YbHbo9QI-bHc64hFXO4ATgRj3WCIAJlhgJTsm8PswAEQoiCs9asrE7LmIVkE8781mkskiunAVmsIA)，在线体验。   


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
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBACgTgewLYEsDOEBqBDANgVwgB4AVAPigF4oSoIAPYCAOwBM1ZFUMAZFAa2IpmAMwhwomCgH5JUAFxRmEAG7iA3AChNoSDQhpgMTAEYqnZOix5CReJYxFDcYQHMyZdVAD03qM7cdcGgSAyNMACZze25rAmIYqyIAcjhkqAAfKGTXdKzkgCNkjy9fbLTM7NzKwuTtIL0AMRQ4Q1I6RhZ2KHxmfmYEAHdmAG0AXQAaKEa8XALsAGN+c17+oeYKaloGJjYOEeExCUapgDpzw-EoODCxqFlGhWnZ+aWtBpCwxrNqZtbgIgjVJ5Kog2pTZj4JAFcRjTw+PzAmrVfJFD76QyNKK-FptEYBZiucZw0p+AlEsbo0KYgDM5j+eJJCJ6fQGwypXwALPTcQDxlNsMwQPCyoKQEA)，在线体验。   


这里泛型参数就是函数参数，通过 `extends` 可以约束类型，泛型参数也支持默认值。

如果给 `PromiseValue<T>` 传入 `Promise<Promise<number>>` 的话，结果是 `Promise<number>`。假如这个时候，还是想获得最里面的类型，即 `number`。怎么办呢？那就该递归登场了。

#### 1.4.2 递归
```ts
type PromiseValue<T> = T extends PromiseLike<infer V> ? V : never;

type TestPV1 = PromiseValue<Promise<Promise<number>>>; // Promise<number>

type PromiseValueDeep<T> = T extends PromiseLike<infer V> ? PromiseValueDeep<V> : T;

type TestPVD1 = PromiseValueDeep<Promise<Promise<number>>>; // number
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBACgTgewLYEsDOEBqBDANgVwgB4AVAPigF4oSoIAPYCAOwBM1ZFUMAZFAa2IpmAMwhwomCgH5JUAFxRmEAG7iA3AChNoSDQhpgMTAEYqnZOix5CReJYx2uVos3xIARuLI-1UAPT+FtzEbp7e2rrQ9iE4BBAAIhAQYKQU1LQMTGwcMVZ8gkTCYhJSULJ5GHGESSlEZYokWjrg0CQGRpgJZtSV1vG1qX1ODqHuXnA+ZH6BSuPiQA)，在线体验。   


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
> 点击[这里](https://www.typescriptlang.org/play?#code/GYVwdgxgLglg9mABAKzjMAKAhgJxwLkTBAFsAjAUxwG0BdASkIGcod0BzRAbwChF-EAGwpREOCkxCDRAXkQByeQG4+A4HByIMw0QA9EcYIlw563VQIHjJ0xAGo5ulZYC+FsSJA4k1qVBVuEAhMcMIAdIJw7Bio6BjUAIwANIgATCkAzAz0SogA9HkKCakZ8jw8UACeAA4UiABSaGAAPACCeIgUulAUYAAmTESklDS0KQBKEn6d3b0DiCxsYJxyigB8iDLu7ZpdPf2D1OjAVIgAYilhV8enkyy07pYA-Ocz+-PE5FSPlgIvd6I9nNBp8RnQfr9fi9GuhmgCUgADAAkXDufhcKLOLgRawhkIEhDAFAAbt98b9CSSyfjCGjpCoqrVED0WJsGk1mokUulEFk1rkCkUSvIgA)，在线体验。   


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
> 点击[这里](https://www.typescriptlang.org/play?#code/GYVwdgxgLglg9mABAKzjMAKAhgJxwLkTBAFsAjAUxwG0BdASkIGcod0BzRAbwChF-EAGwpREOCkxCDRAXkQByeQG4+A4HByIMw0QA9EcYIlw563VQIHjJ0xAGo5ulZYC+FsSJA4k1qVBVuEAhMcMIAdIJw7Bio6BjUAIwANIgATCkAzAz0SogA9HkKCakZ8jw8UACeAA4UiABSaGAAPACCeIgUulAUYAAmTESklDS0KQBKEn6d3b0DiCxsYJxyigB8iDLu7ZpdPf2D1OjAVIgAYjP788TkVClhD8enkyyXc4M3I3S07pYA-A0ms0XlAUgADAAkXBefhcULOLjBa1+AkIMOkKiqtUQPVecka6GaiRS6UQWTWuQKRRK8iAA)，在线体验。   


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
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAKgThCA5A9gE2gXigbwFBSFQBuAhgDYCuEAXFAHaUC2ARhHANwFHkQBmwOvESoMUAD4NK5clyJQ4ASwDmAC0GwEydNEmMZXAL5c8oSJsQAeAGpQIAD2AR6aAM5TW7ADRQAMncdnNwttMT1pcihsfXIfACUApxd3YVDdKRkojPIAPiz8eTIqWihrOR5+DV9ywiU1DTijEzNoAAUEAHk4DDh4UmJ2VwhLGESglK1RCDzMbkJRhyTg1MtFej52Up81jbg-bfXNuJy5+SgAfigAbWsfADoH9ogunr6BuCHLXxz7x87u9hvQbDY4AXVO8joV1BJgA9LCzvIAIx4eGIqAIwgAHVRmPkACYzgA2XFnBFYxE4tFEADMRAArIiAOyk+QU9GYql4ogAFnRAA4iABOUzgaDALRZFZIrynFb42XokKWGmKpVEGJq9XKnk5H4Qogrel6rXKomm+Sag3zLSWJkW9Erfn67U2qxCvV65piqBOVzALJPF6AuD9YGWCWIHIcDEIq4yqAKqCqqA8nz0nzmqD2qD8nxC0FAA)，在线体验。   


尾递归与非尾递归的区别就是函数返回时，是直接一个函数调用，还是函数调用夹在一个表达式中。
[尾递归优化](https://stackoverflow.com/questions/310974/what-is-tail-call-optimization)，是通过复用一个函数调用栈来避免爆栈。在 ts 中也是有这样的优化。你跳到上面的在线体验示例，会发现 `? [V, ...PreOrderTraverse<L>, ...PreOrderTraverse<R>]` 这一行，ts 有 error 提示：`Type instantiation is excessively deep and possibly infinite.(2589)`

为什么呢？就如提示所说：类型实例化的深度过大，可能是无限的。ts 需要在我们写代码时，进行实时代码提示和纠错。过于复杂的类型势必会拖累这个过程，造成不可接受的用户体验下降。所以 ts 不仅要避免爆栈，而且还要计算速度。早期版本对递归深度的限制是 50 层。在 [4.5](https://devblogs.microsoft.com/typescript/announcing-typescript-4-5/#tailrec-conditional) 时做了优化，提高到 100 层，如果是尾递归则提高到 1000 层。基于此，我们可以实现比以前更复杂的体操。

但是，最终，这里的限制比其他编程语言更苛刻，不允许我们做长时运算。意味着，基于它实现的循环只能循环很有限的次数😓，函数调用也必然不能太深……


#### 1.4.5 First-Class-Function
在看到上面的限制后，或许你感到有点遗憾（一切都是权衡，没有什么是完美的）。但是不得不告诉你，还有另外一件不幸的事。它没有函数式语言的标志性能力—— [First-Class-Function](https://en.wikipedia.org/wiki/First-class_function)。即没有办法传入/传出函数，无法实现高阶函数。不过好在，没有这个能力，并不会影响表达能力。只是麻烦很多😓。

简单来说，使用 `Function(argumentsironment1) => return + environment2` 的方式，可以表达对等的东西。

以上就是这门函数式编程语言的介绍。休息一下。我们就要开始编写解释器了😄。


## 2. 如何实现 Toc 解释器？

在实现解释器之前，我遇到的第一个麻烦事情是，如何实现四则运算？毕竟这些基本运算是一定要支持的啊！就仅仅支持正整数运算，就要一些技巧呢！是的，我们就只支持正整数运算。

### 2.1 四则运算以及大小比较
如果第一次面对这个问题，还真是有点摸不着头脑。就最简单，加法怎么实现啊？我似乎是 Google 后，找到答案的。
```ts
type A = [1, 2, 3];
type L1 = A['length']; // 3
type L2 = ['a', number]['length']; // 2
type L3 = []['length']; // 0
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAglC8UDaBGANFATBgzAXQG4AoUSKAGRQViQHIAbCAOwHNgALWwqAeh6hwlw0cpmp0AhrQxMArgFsARhABOeOo1YcuBXv0xCy5HOPUNmbTtz5QADEA)，在线体验。   


以上的例子代码，是否让你找到了实现加法的灵感？或许你已经想到了……没错，加法就是准备两个指定长度数组，然后合并，然后取合并数组的长度。

那么我需要一个生成指定长度数组的函数:
```ts
type InitArray<L extends number, A extends any[] = []> =
    A['length'] extends L
        ? A
        : InitArray<L, [...A, any]>;
type test_init_array_1 = InitArray<0>; // []
type test_init_array_2 = InitArray<3>; // [any, any, any]
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAkgdgS2AQQE6oIYgDwBkoQAewEcAJgM5RwCuAtgEYSoA0UyBxplUGcIAbQC6UALxRhAPjEAoKPPYCA5ABtSAc2AALJSKIlyVXHIWmA-OxOn5ALliIU6LHjYCAdB+Rs+IIZIDcMqCQUCQUwAD6CA4RGE4gEQCMYvZIaJg4AAwBUAD0uRJCQeDQYZHRSLHxEQBMKfBp8dgAzDn5Ej7e-F2+QA)，在线体验。   


现在可以实现加法了:
```ts
type Add<N1 extends number, N2 extends number> = [...InitArray<N1>, ...InitArray<N2>]['length'];
type test_add_1 = Add<1, 3>; // 4
type test_add_2 = Add<0, 10>; // 10
type test_add_3 = Add<19, 13>; // 32
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAkgdgS2AQQE6oIYgDwBkoQAewEcAJgM5RwCuAtgEYSoA0UyBxplUGcIAbQC6UALxRhAPjEAoKPPYCA5ABtSAc2AALJSKIlyVXHIWmA-OxOn5ALliIU6LHjYCAdB+Rs+IIZIDcMqCQUCQUwAD6CA4RGE4gEQCMYvZIaJg4AAwBUAD0uRJCQeDQYZHRSLHxEQBMKfBp8dgAzDn5Ej7e-F2+MsUhyGRk2AByyfrcVLSMzGwjdROG1PRMqNLi7h4NjhmjiZJsHm7b6c7zkkLKanCaOkKBwaUQ4bFDSSmDw4lsrf55BQAWfpPF4YN51cSfbCZNiJbJ-dpw4GhZ6RMFkCLND5DbCJACcsN+-ygzRqQA)，在线体验。   


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
type test_sub_1 = Sub<10, 3>; // 7
type test_sub_2 = Sub<18, 9>; // 9
type test_sub_3 = Sub<9, 13>; // 0
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAkgdgS2AQQE6oIYgDwBkoQAewEcAJgM5RwCuAtgEYSoA0UyBxplUGcIAbQC6UALxRhAPjEAoKPPYCA5ABtSAc2AALJSKIlyVXHIWmA-OxOn5ALliIU6LHjYCAdB+Rs+IIZIDcMqCQUCQUwAD6CA4RGE4gEQCMYvZIaJg4AAwBUAD0uRJCQeDQYZHRSLHxEQBMKfBp8dgAzDn5Ej7e-F2+MsUhAMo0DNhWUAByyfrcVLSMzCxj43XThtT0TKxjHKs8PsL1DunOk5Js7YDVEYDzioAOpjeAI35jAMKcBnv8B+LC5wWAhdF3j2k4mWrxmUCeyjUcE0OiK5kUqg02l0YzsOy4awE0QAZswoAAxNgeNw4vEAJQg4VBa32Qjh1nkFiGI0mbGWbAp4VcxKePT8Y1Mdky-jyBWuN0A8DqAOLlbv1SpTIhRhkkUszsIlMmxWiL2gB2OWhBURJUMWqq4bqgAcbAAnG0CjaDWVjcrmuaRja2IltaKoJkgA)，在线体验。   


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
type test_mul_1 = Mul<11, 3>; // 33
type test_mul_2 = Mul<8, 9>; // 72
type test_mul_3 = Mul<9, 0>; // 0
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAggJnAPAOQIxQgD2BAdnAZylwFcBbAIwgCcAaKZAJg2z0OPKuoD4oBeKAG0AdKICSuAJbAY1agEMQKVN3qjhE6bIVKm3ALqCA5ABs8Ac2AALI-oDcAKFCQoOAsAD68hB-QD4SKj0AMzcdlAA9BFQACxO4NBunt5wHsz+CIgADPSoWWGR0XnxLklePsH8sJmoAJy5oeFRUMGMDiXQmjJyiogAMiw4+ESklDT0MINsRPK4IIL6VQu8fA5Q67DGZriWNotYQ+x9axunAPywJ6frAFxQXdq9ffQiojD0syD6YR2uEO4eSRSZI9EC+KoPUHZArNBa-MpA6ReUFpCHAx5KRqFISfD5zPFfdrOaAAWRIJkQVwY6AO0w4YzoVKYU2G9K4tCpk1prNGXCqaHozUAy36AHPMqQBhFnsXk0KpBbGAQujAA6mSsA6toOFbUqVELJUi66053Znc9gG67rfVUw1QSUmohMK3mqAXGCO813MkUgUMRgTTLvamqapIcW5bg-Yl-AFkcnggSexCoeVY5rBYLw-6eGMmVHx8mIAAc9FqMOiAHY2pGytmPJU8xT6lB8k1olkgA)，在线体验。   


不过 `Add<A, N1>` 这里提示 `Type 'Add<A, N1>' does not satisfy the constraint 'number'.(2344)`。意思是它的结果不是永远都能得到 `number`, 所以不安全。这里应该是可能输出 `never` 或者 `any` 的情况，这很极端，我们一般使用一个类似断言的工具函数来处理这个问题：

```ts
type Safe<T, Type, Default extends Type = Type> = T extends Type ? T : Default;
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAyghgMwgHgCoBoqvBTARCBOAVwBtgoIAPYCAOwBMBnLHKAXlcgD4OtKa9Zl2gB+fgC4oBImWABuIA)，在线体验。   


`Safe<T, U, D>` 主要用来进一步确认 `T` 是 `U` 类型, 否则请取 `D` 类型。有了它，我们在修改一下：

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
            : Mul<N1, N2, Safe<Add<A, N1>, number>, Safe<Add<C, 1>, number>>; // 〈--- Safe here
type test_mul_1 = Mul<11, 3>; // 33
type test_mul_2 = Mul<8, 9>; // 72
type test_mul_3 = Mul<9, 0>; // 0
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAggJnAPAOQIxQgD2BAdnAZylwFcBbAIwgCcAaKZAJg2z0OPKuoD4oBeKAG0AdKICSuAJbAY1agEMQKVN3qjhE6bIVKm3ALqCA5ABs8Ac2AALI-oDcAKFCQoOAsAD68hB-QD4SKj0AMzcdlAA9BFQACxO4NBunt5wHsz+CIgADPSoWWGR0XnxLklePsH8sJmoAJy5oeFRUMGMDiXQAMryAGYQiAAq9AMJ9AAiED3yJCbALDj4RCMuAssQvKvzbEsJUAD8UANQAFxQE1MzwI4dUJoycoqIADJbixyUNPQwr+zyuCCCfRVQEbBxQcGwYxmXCWGxArALdhPMEQ1EHGAo1Hg053bSPJ70ESiGD0P4gfRhG5lSRSZIPEC+Kq4+nZArNQFUiDuDw06ReelpJm0vFKRqFIRk0n-KXk9rOaAAWRmiExDHQCO27y4tFVTB+RFIHzoqu+Grehq4VTQ9GagGW-QA55qqAML6rU0KpBcWAQujAA6mPsA6toODZq11ZVUHMOo056s3sSNY8ER1VRqAu2NEJjJhP7WBZhOnJUmZT0Jj0bp9RABSsllT0C00VRQcv9KtO3KN+s8NnRQAQDABaAdN3rQKw0CCc7lkGaMgSFxCoT1i5rBYITzxTkyC2fKgAc9Fq3agAHY2vLXFz19PKtui-UoPkmtEskA)，在线体验。   


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
type test_div_1 = Div<12, 3>; // 4
type test_div_2 = Div<8, 9>; // 0
type test_div_3 = Div<100, 33>; // 3
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAygrgIwDwCgrqgOQIxQgD2AgDsATAZymLgFsEIAnAGjQ0wCY9CSKrb7mrdAEEuRMpQCGxEAG0AulAC8UAJLEAlsGEMGkkEhwA+JlAD0ZqIGqIwPOKgB1M7gEb8hUAMJieUmQuVQFpiyhAQuiHZyNfDg8JN1kAcgAbEgBzYAALWPkXAH4oYTjE4hT0zIwoAC5cqN5ZDWIAM0YoADFTADp22oaGKAAlCHJgKq85eRLSjBz4ZBxTDlM+gdNZdtbXU2kQeSMXUoqABgBuc0tbO0B4HUA4uXsUUEgoIgGAfXJER9wVKaRsPdMAZiMjoEAOw3cDQB7AZ6vTgfRBfAAcpgAnADjlAkaC7hCoQhHr9fJ8kaZsP9AZY9ihMdAYJIGkgACqmelg0wAEQgdUkcHigwI4l4zLuKkFEHCwqGUBFUBy9PKUHZnO5wAOlNu0GEpFIhlwfM8fDojFmnF10WoBoYYr8K3UWh0egMxja7Rt2l0+kM7CM8nyyTSGRVavu-Uhkk1b18Gq12D+qMCABYqUGnqHSI8YblNUgflBvrHLN9E9iU3iI5nsESc6S0b92KqwWpNK77UgADISs0CUyiE28DY+FQKMUuPIJX3FCUtnYTXJT9AVF1290tpYrYTrGRbAP17G1LSPSRukDhlQLw9ZvN+TKBneN-eHtO+U-NquBWQbdcgD+ZROsjQAN1QUocHbfhDRcSIe0oDswNKbtuFNUDuhUGY0UAZb9ABzzFx3Eg-UBF8bNAhCOxAHVtFBLWAnCKVKHIqIwCoIPg3haPGaUqAgP9GkCQATNLsQBYOUAX4DAC45KBmPGCo4P5ShRJY9AclcWcxPlf9tSNUxPjXLBPTU2kICQSMkDWHMTFwxgjABQtg0eUh-2PJSAOwdgYzJKAE2vSzrL-B8VF-ADEXRC8KTcp4PJLbzlO+bNfhfSxfiAA)，在线体验。   


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
type test_lt_1 = Lt<1, 3>;
type test_lt_2 = Lt<3, 2>;
type test_lt_3 = Lt<3, 3>;
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAygrgIwDwCgrqgOQIxQgD2AgDsATAZymLgFsEIAnAGjQ0wCY9CSKrb7mrdAEEuRMpQCGxEAG0AulAC8UAJLEAlsGEMGkkEhwA+JlAD0ZqIGqIwPOKgB1M7gEb8hUAMJieUmQuVQFpiyhAQuiHZyNfDg8JN1kAcgAbEgBzYAALWPkXAH4oYTjE4hT0zIwoAC5cqN5ZDWIAM0YoADFTADp22oaGKAAlCHJgKq85eRLSjBz4ZBxTDlM+gdNZdtbXU2kQeSMXUoqABgBuc0tbO0B4HUA4uXsUUEgoIgGAfXJER9wVKaRsPdMAZiMjoEAOw3cDQB7AZ6vTgfRBfAAcpgAnADjlAkaC7hCoQhHr9fJ8kaZsP9AZY9ihMdB1FodHoDAAZIZ8OiMUyiAjiXgbHwqBThJQuPIJZJpDLMhk7Ca5KXoCo07S6fRIBlLFbCdYyLYHKn3fqQ2paR6SJUgN6+BV05V7VGBBS67GGyEm+mPGFqTSK+lIUlo2QbTUgQOZXUAUQAjkgNVAAEICoXMmPZKAAChjzNEOWADDg0AqdUk8XIEAAlC584XizrdQzgFHmdRWcxYw3+Ix46UI1HTHHmdnc7KoDkC0WIIOKhzuNEKeNZ0P7jmx3PxhV05zPFAZ8u58PK0vt7OKrWkJ9o9gTLA4THiUYAQ79Y94pD3lBj9g-nfbuCH0+3b5j78pjsJ+YJ6k8v74ioAEfgcQA)，在线体验。   


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
type test_div_1 = Div<12, 3>; // 4
type test_div_2 = Div<8, 9>; // 0
type test_div_3 = Div<100, 33>; // 3
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAygrgIwDwCgrqgOQIxQgD2AgDsATAZymLgFsEIAnAGjQ0wCY9CSKrb7mrdAEEuRMpQCGxEAG0AulAC8UAJLEAlsGEMGkkEhwA+JlAD0ZqIGqIwPOKgB1M7gEb8hUAMJieUmQuVQFpiyhAQuiHZyNfDg8JN1kAcgAbEgBzYAALWPkXAH4oYTjE4hT0zIwoAC5cqN5ZDWIAM0YoADFTADp22oaGKAAlCHJgKq85eRLSjBz4ZBxTDlM+gdNZdtbXU2kQeSMXUoqABgBuc0tbO0B4HUA4uXsUUEgoIgGAfXJER9wVKaRsPdMAZiMjoEAOw3cDQB7AZ6vTgfRBfAAcpgAnADjlAkaC7hCoQhHr9fJ8kaZsP9AZY9ihMdAYJIGkgACqmelg0wAEQgdUkcHigwI4l4zLuKkFEHCwqGUBFUBy9PKUHZnO5wAOlNu0GEpFIhlwfM8fDojFmnF10WoBoYYr8K3UWh0egMxja7Rt2l0+kM7CM8nyyTSGRVavu-Uhkk1b18Gq12D+qMCABYqUGnqHSI8YblNUgflBvrHLN9E9iU3iI5nsESc6S0b92KqwVAAKIARyQwlMACExS5RCbeO3slAABTtiWiHLABhwaAVTnxcgQACULhnkjnEBViYAMsBWxKzQIO3v+Iwu6Vm62O+Fe5QJ1OdhMoLP5-f0BUe9xohTxt-pfdJxAX3GCoR2vKAvx-CCcifACIIgiptyQT42xzExYDhdtiSMAFC2DR4eXDFQEOjKBSRwp58PTBDflMT0A3rbF8PxQid2okjsMTF07XdTcj3NUx335YYfBUBRTwwPIEl9YoJU3QCcmEQCKk4t0DE3JYVmQjYtjorFcNqLRHkkFSCLUTRXXtLM8z8TJA2xfSQ2M9NlIsqtAlkDZ1hkTzNjrO5WQ0AA3VBShwXiDxcSJQP3Q1uzCxoVBmNFAGW-QAc8xcdwouPboVGzQIQjsQB1bRQS1QtA8D0Bycq5Uij9eCq0ocmICAAsaQJABM0uxAFg5QBfgMALjkwMUqAEOQjgr1qm9-0Ahq3CmjAKn8oLErmNDkBGz1TBpOlIyQNYUNMaKLWw2zcNIQKTIWr52BjMkoATY6nlOgK018C7EXRKyKXuyFHpLFQLu+bNflcyxfiAA)，在线体验。   


Good job! 一切都如期而至！

上面实现了 `Lt`， 那么其他几个比较函数就不难了，这部分就留着读者你去试试吧。

在这一小节结束，我想说，实现四则运算和大小比较其实还有另外一种思路。我最早考虑加法的实现就只想到这个思路——用字符串来实现。

对于加法，就是按位(是个位，十位这样哦)查表加，含进位处理。结果还是一个数字字符串。

对于小于比较，先比较字符串长度，谁短谁小，长度一样，按位查表比较，从高位开始。

对于大小比较这个方案，是完全OK的。但是加法，从数字转字符串很容易。但是反过来，却什么好没办法。不过，[4.8](https://devblogs.microsoft.com/typescript/announcing-typescript-4-8/#infer-types-template-strings) 版本这个问题解决了。
```ts
type SN = '123' extends `${infer N extends number}` ? N : never; // 123
```

所以一切都很完美！你可能会问，这个方案听起来很复杂，和前面用数组实现的比起来，似乎没有任何优势。复杂是真的复杂，但优势是有的。我们前面说过，ts 类型运算是有递归深度限制的。数组的实现可以很快触碰到限制，而字符串的方案在很大的数上都没有触到限制。
```ts
type test_add_1 = Add<999, 999>; // 1998
type test_add_2 = Add<999, 1000>; // Type instantiation is excessively deep and possibly infinite.(2589)
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAggJnAPAOQIxQgD2BAdnAZylwFcBbAIwgCcAaKZAJg2z0OPKuoD4oBeKAG0AdKICSuAJbAY1agEMQKVN3qjhE6bIVKm3ALqCA5ABs8Ac2AALI-oDcAKFCQoOAsAD68hB-QD4SKj0AMzcdlAA9BFQACxO4NBunt5wHsz+CIgADPSoWWGR0XnxLklePsH8sJmoAJy5oeFRUMGMDiXQmjJyiogAMiw4+ESklDT0MINsRPK4IIL6VQu8fA5Q67DGZriWNotYQ+x9axunAPywJ6frAFxQXdq9ffQiojD0syD6YR2uEO4eSRSZI9EC+KoPUHZArNBa-MpA6ReUFpCHAx5KRqFISfD5zPFfdrORL-ZI+PzVJC1an0am1GFFakADnhpPKqXSlMQdNyWT5DKgABUElAge5ZsBJPJJQB7XCiohYADG-wIkgAbhATCAoHAIBAwFBZnAoGAZQQ1RRtaLcAAzRE4YQACkYAFYmbUAJRAA)，在线体验。   


如果你想体验字符串版本，可以直接去仓库 [Toc](https://github.com/huanguolin/Toc) 点击前往解释器。输入 `type Result = Toc<'99999 + 99999;'>` 来体验。因为 `Toc` 底层就是用的字符串版本。代码在[这里](https://github.com/huanguolin/Toc/tree/master/type-Toc/utils/math/fast)。

好了，现在，我们应该准备好开始实现解释器了。

### 2.2 解释器

我们的解释器主要分三步：词法分析，语法分析，执行。

![interpreter-3-steps](https://github.com/huanguolin/toc/blob/master/docs/imgs/interpreter-3-steps.png)

另外为了对比，也为了照顾想我一样非科班出身的人，我会讲两个版本的实现（个人感觉直接看一门熟悉的语言来实现解释器会更好接受一点）：
* 用 ts（你可以理解为用 js）实现的，在 [ts-Toc](https://github.com/huanguolin/Toc/tree/master/ts-Toc) 下。
* 用 ts 类型系统实现的，在 [type-Toc](https://github.com/huanguolin/Toc/tree/master/type-Toc) 下。

我在讲一个特性时，会先讲 ts 版，然后说 type 版。在实现 ts 版本时，不会考虑要“翻译”为 type 版，而放弃对它来说最自然的方法。这样做的目的，一是为了好理解（特别是非科班的同学）；二是为了对比，能看到在语言“贫瘠”的情况下，我们如何“绕”。

#### 2.2.1 Toc 的语法
在实现一门语言时，先要知道它的语法，`Toc` 的语法定义已经定义在 [Toc Grammar Spec](https://github.com/huanguolin/toc/blob/master/docs/grammar.md)。但是对于没有编译原理基础的人来说，对那些符号要表达什么还是很困惑的（比如我🤦）。我们在这里以表达式为引子，做一个简要的解释。

我们常常看到下面这样的表达式，这些都是我们熟悉，且被 `Toc` 支持的：
```js
// Toc 支持的表达式
1 + (10 - 2 * 3) < 4 == false
```

`Toc` 的表达式包含的要素：
* 字面量，即基础数据类型：数字，布尔，字符串和 `null`
* 一元表达式，即只有一个操作数的表达式：仅逻辑反 ！
* 二元表达式，即有两个操作数的表达式：有数学表达式(+, -, *, /, %)和逻辑表达式(&&, ||, ==, !=, >, >=, <, <=)
* 括号表达式，即用圆括号括起来的表达式：()

如果我们用语法定义来翻译上面这段话：
```sh
expression     → literal
               | unary
               | binary
               | grouping ;

literal        → NUMBER | STRING | "true" | "false" | "null" ;
unary          → "!" expression ;
binary         → expression operator expression ;
operator       → "&&" | "||" | "==" | "!=" | "<" | "<=" | ">" | ">="
               | "+" | "-" | "*" | "/" | "%" ;
grouping       → "(" expression ")" ;
```
其中，`NUMBER` 和 `STRING` 代表任何数字、字符串。带引号的都是终止符。当然 `literal` 也都是终止符。终止符是什么意思呢？就是它无法再继续展开成更基本的单位。上面的 `expression`, `unary`, `binary`, `grouping` 都是可以继续展开的，所以是非终止符。如何展开，就代表了相印的语法规则。

你可能注意到，上面的这段语法描述和 [Toc Grammar Spec](https://github.com/huanguolin/toc/blob/master/docs/grammar.md) 中的并不完全一样。不过这仅仅是形式的不同，语法含义是一样的。只是这里为了简单没有包含优先级的信息。 [Toc Grammar Spec](https://github.com/huanguolin/toc/blob/master/docs/grammar.md) 中的描述不仅包含了优先级信息，而且为了易于实现，做了一些调整。不过，所要表达语法规则是一致的。关于优先级的部分，我们在语法分析的部分会重点讲解。基于现在认识，我想你已经能看懂 [Toc Grammar Spec](https://github.com/huanguolin/toc/blob/master/docs/grammar.md) 中绝大数的规则了。可以开始词法分析啦😺。

#### 2.2.2 词法分析
词法分析的关键是分词——就是把输入的代码拆成一个一个有序的语法符号（token）。这里要处理的主要问题是，在哪里拆开？哪些字符要连到一起作为一个语法符号？我们取上面表达式的例子：
```js
1 + (10 - 2 * 3) < 4 == false
// 拆分成：
['1', '+', '(', '10', '-', '2', '*', '3', ')', '<', '4', '==', 'false']
```
做这个拆分可以用正则，也可以逐字符来分析。这里我选取后者，不仅是因为 ts 类型系统中没有正则，逐字符分拆的代码也很自然简单，且高效！

##### 2.2.2.1 分词（ts版）

上面的字符串数组一般不建议直接作为 `Tokens` 输出给语法分析器。常规的做法是定义一个 `Token` 的结构来描述。不仅仅包含原始的词素(`lexeme`)，还应该包含必要信息，比如：是字符串还是数字，是操作符还是关键字等。正常还要包含 `debug` 需要的行号、列号等信息。我们这里为了简单，只包含最主要的信息，没有 `debug` 信息。

要定义 `Token`，先要定义它有多少种类：
```ts
type TokenType =
    | 'identifier'
    | 'string'
    | 'number'
    | 'fun'
    | 'var'
    | 'for'
    | 'if'
    | 'else'
    | 'true'
    | 'false'
    | 'null'
    | '{'
    | '}'
    | ';'
    | ','
    | '='
    | '('
    | ')'
    | '+'
    | '-'
    | '/'
    | '*'
    | '<'
    | '>'
    | '<='
    | '>='
    | '=='
    | '!='
    | '&&'
    | '||'
    | '!'
    | 'EOF'; // 结束标志
```


下面是 `Token` 的定义：
```ts
class Token {
    type: TokenType; // 像操作符、关键字（包含 true, false, null 等）用这个可以直接区分。
    lexeme: string; // 放原始的词素字符串。
    literal: number | null; // 仅仅当是数字时，将数字字符串转成数字放这里。

    constructor(type: TokenType, lexeme: string, literal: number | null = null) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
    }
}
```


接下来我们来逐字符扫描，产生 `Token` 放到 `tokens` 数组。输入是 `source`, 我们用 `index` 来代表当前的扫描位置。`scan` 方法的核心是一个循环，`index` 不断后移并拿到一个字符。然后在 `switch` 中做决断，这个字符是一个什么语法标记？
```ts
class Scanner {
    private source: string;
    private index: number;
    private tokens: Token[];

    constructor(source: string) {
        this.source = source;
        this.index = 0;
        this.tokens = [];
    }

     scan(): Token[] {
        while (!this.isAtEnd()) {
            let c = this.advance(); // 返回当前字符，并将 index + 1
            switch (c) {
                case '{':
                case '}':
                case ',':
                case ';':
                case '(':
                case ')':
                case '*':
                case '/':
                case '+':
                case '-':
                    this.addToken(c, c); // 构造 Token 并添加到 tokens 数组
                    break;
                // ... 其他的决断
                default:
                    // ...
                    throw new ScanError("Unknown token at: " + c);
            }
        }
        this.addToken('EOF', ''); // 末尾添加终止 Token
        return this.tokens;
    }

    // 省略了工具函数
}
```

上面代码展示了扫描器的架子。`scan` 方法中展示了处理最简单的 `Token` 处理——单个字符便可确定的直接构造添加即可。现在我们来看麻烦一点的：
* 像 !=, ==, >=, <= 这样，必须要先看第二个字符是否匹配 =, 否则应该是 !, =, >, <
* 像 &&, || 这样，必须两个字符都匹配，仅仅匹配第一个字符的话直接报错（我们不支持位运算哦）

这段代码也不复杂：
```ts
// ...
switch (c) {
    // ...
    case '<':
    case '>':
        if (this.match('=')) { // match 返回当前位置是否匹配指定的字符，并将 index + 1
            c += '=';
        }
        this.addToken(c as TokenType, c);
        break;
    case '!':
        if (this.match('=')) {
            c += '=';
        }
        this.addToken(c as TokenType, c);
        break;
    case '=':
        if (this.match('=')) {
            const r = '==';
            this.addToken(r, r);
        } else {
            this.addToken(c, c);
        }
        break;
    case '&':
        if (this.match('&')) {
            const r = '&&';
            this.addToken(r, r);
            break;
        }
    case '|':
        if (this.match('|')) {
            const r = '||';
            this.addToken(r, r);
            break;
        }
        throw new ScanError("Unknown token at: " + c);
    // ...
}
// ...
```


对于空白字符，直接跳过即可：
```ts
// ...
switch (c) {
    // ...
    case '\u0020':
    case '\n':
    case '\t':
        break;
    // ...
}
// ...
```


当看到双引号时，认为是字符串，然后“陷入”一个局部循环，不断后移 `index`, 知道找到下一个双引号。不过要考虑转义和到了代码结尾也没找到的情况，编译器要能识别错误代码并报告，而不是奔溃！
```ts
class Scanner {
    // ...

    scan(): Token[] {
        // ...
        switch (c) {
            // ...
            case '"':
                this.addString();
                break;
            // ...
        }
        // ...
    }

    private addString() {
        let s = '';
        while (!this.isAtEnd() && this.current() !== '"') {
            if (this.current() === '\\') {
                this.advance();
                const c = this.advance();
                // https://en.wikipedia.org/wiki/Escape_character#:~:text=%5Bedit%5D-,JavaScript,-%5Bedit%5D
                if (ESCAPE_CHAR_MAP[c]) {
                    s += ESCAPE_CHAR_MAP[c];
                } else {
                    // \'
                    // \"
                    // \\
                    s += c;
                }
            } else {
                s += this.advance();
            }
        }

        if (this.isAtEnd()) {
            throw new ScanError('Unterminated string.');
        }

        // consume "
        this.advance();

        this.addToken('string', s);
    }

    //...
}

const ESCAPE_CHAR_MAP = {
    n: '\n',
    r: '\r',
    t: '\t',
    b: '\b',
    f: '\f',
    v: '\v',
    0: '\0',
} as const;
```


对于数字和标志符的处理比字符串要简单一些。如果当前字符是一个数字字符，则认为是数字 `Token`，然后找到数字末尾得到完整数字。如果当前字符是一个字母字符或者下划线字符，则认为是标志符 `Token`，然后找到标识符末尾得到完整的标志符。要注意的是标志符从第二个字符以后可以是数字。标志符在构造 `Token` 前，还要判断是不是关键字，是的话构造的就是关键字的 `Token` 了。
```ts
// ...
switch (c) {
    // ...
    default:
        if (this.isNumberChar(c)) {
            this.addNumber();
            break;
        } else if (this.isAlphaChar(c)) {
            this.addIdentifier();
            break;
        }
        throw new ScanError("Unknown token at: " + c);
}
// ...
```


以上就是 ts 版本的分词的全部了。是不是很简单😄。完整代码，请看 [ts-scanner](https://github.com/huanguolin/toc/blob/master/ts-toc/Scanner/index.ts).


##### 2.2.2.2 分词（type版）

现在该 type 版了。首先是 `Token` 的定义：
```ts
// TokenType 和 ts 版完全一致，在此省略。

interface Token {
    type: TokenType,
    lexeme: string,
    value: number | null,
}

// 方便构造 Token 的工具函数
interface BuildToken<
    Type extends TokenType,
    Lexeme extends string,
> extends Token {
    type: Type,
    lexeme: Lexeme,
    value: Eq<Type, 'number'> extends true ? Str2Num<Safe<Lexeme, NumStr>> : null, // Str2Num 怎么实现，在讲四则运算的末尾有提到
}

// EOF 直接定义出来方便用
type EOF = BuildToken<'EOF', ''>;
```


它也可以逐字符来分析。那么怎么取一个字符呢？
```ts
type FirstChar<T extends string> =
    T extends `${infer First}${infer Rest}`
        ? [First, Rest]
        : never;
type test_first_char_1 = FirstChar<'1 + 2'>; // ['1', ' + 2']
type test_first_char_2 = FirstChar<test_first_char_1[1]>; // [' ', '+ 2']
type test_first_char_3 = FirstChar<test_first_char_2[1]>; // ['+', ' 2']
type test_first_char_4 = FirstChar<test_first_char_3[1]>; // [' ', '2']
type test_first_char_5 = FirstChar<test_first_char_4[1]>; // ['2', '']
type test_first_char_6 = FirstChar<test_first_char_5[1]>; // never
```

以上就是逐字符取出的代码。和 ts 版中 `scan` 函数的循环取出比呢？有相似之处，又明显的不同。
相似是两者都是一个字符一个字符的取出来。差异是，ts 版中依靠的是 `index` 直接来取相应位置的字符，随着 `index` 值增加，而取的字符位置逐渐后移。类型系统中却没有一个机制可以直接取某个位置的字符。如果我们非要实现，也能利用上面逐字符取加上计数的办法达到类似的效果。但是效率很低，`index` 每后移一位，就要从头遍历一遍。

所以我们不要 `index` 后移的方案。就直接每次取一个字符来做“检测”。类型系统没有 `switch` 语句，只能用条件语句一个一个检查。还要把取剩下的字符串保留下来，下一个循环需要它。但是像 `!=` 这样的需要后看一位，又要再取一个……这做肯定是可以做出来的，但是想想代码写出来的样子，啊，很混乱😫……思路不清晰！

别急，我来重新梳理一下。一个一个取字符是没问题的。但是要让代码可读性好，可以把解析不同种类 `token` 的代码，按种类抽成一个一个的函数。那选用哪个函数还要做一个预判断？那不又是一堆的条件判断……额，或许我们不需要预判断。直接挨个尝试解析，解出来就进行下一个循环，否则就换下一个种类。

嗯，不错😄！那怎么知道能解析出来呢？当然是看返回值了。别忘了我们有模式匹配，如果返回值符合成功的结构，就解出来了，我们顺便从里面拿到 `Token` 和 `Rest` 字符串。`Token` 追加到结果数组中，`Rest` 用于下一个循环的入参。
```ts
// S 是 sourceCode, A 是存放结果的 array
type Scan<S extends string, A extends Token[] = []> =
    S extends ''
        ? Push<A, EOF> // 到结尾了
        : S extends `${infer Space extends SpaceChars}${infer Rest}`
            ? Scan<Rest, A> // 排除空白字符
            : ScanBody<S, A>; // 不是空白字符，就来尝试解析

type ScanBody<S extends string, A extends Token[] = []> =
    ScanNumber<S> extends ScanSuccess<infer T, infer R> // 尝试 number
        ? Scan<R, Push<A, T>>
        : ScanOperator<S> extends ScanSuccess<infer T, infer R> // 尝试操作符
            ? Scan<R, Push<A, T>>
            : ScanIdentifier<S> extends ScanSuccess<infer T, infer R> // 尝试标志符，同样含关键字
                ? Scan<R, Push<A, T>>
                : ScanString<S> extends ScanSuccess<infer T, infer R> // 尝试字符串
                    ? Scan<R, Push<A, T>>
                    : ScanError<`Unknown token at: ${S}`>; // 尝试完所有情况，也无法解析，则得到一个错误
```


上面就是大的架子。其中有些工具函数，`Push` 应该不用说了。重点是 `ScanSuccess` 和 `ScanError`。有它们才知道解析的结果如何。它们其实使用了更基础的结果包装函数，后面的语法分析和执行，都要用到。
```ts
// 全局结果包装🔧函数
type ErrorResult<E> = { type: 'Error', error: E };
type SuccessResult<R> = { type: 'Success', result: R };

// 用来代替 never 的，带一个名字参数。到后面你就知道，为什么不直接用 never 了……
type NoWay<Name extends string> = `[${Name}] impossible here!`;
```


再来看 `ScanSuccess` 和 `ScanError`：
```ts
export type ScanError<M extends string> = ErrorResult<`[ScanError]: ${M}`>;
export type ScanSuccess<T extends Token, R extends string> = SuccessResult<{ token: T, rest: R }>;
```


有个问题，不用这些结果包装函数可以吗？当然是可以的！但是会很啰嗦，还容易手误。更重要的是，用工具还有如下的优势：
```ts
// 这里 T 和 R 的类型是确定的，不需要进一步限定。因为 ScanSuccess 在定义时就限定了类型。
type test = ScanNumber<S> extends ScanSuccess<infer T, infer R>

// 不用工具函数，要用 extends 限定才行。
type test = ScanNumber<S> extends { token: T extends Token, rest: R extends string }
```


好了，回归正题。我们看看具体的解析函数，先是 `ScanNumber`，很简单：
```ts
type ScanNumber<S extends string, N extends string = ''> =
    S extends `${infer C extends NumChars}${infer R extends string}`
        ? ScanNumber<R, `${N}${C}`>
        : N extends ''
            ? ScanError<'Not match a number.'>
            : ScanSuccess<BuildToken<'number', N>, S>;
```


`ScanOperator` 要复杂一些，重点在模式匹配。要注意的是单字符的操作符放到最后，要优先匹配更长的：
```ts
type ScanOperator<S extends string> =
    S extends OpGteOrLte<infer C1, infer C2, infer R>
        ? ScanSuccess<BuildToken<`${C1}${C2}`, `${C1}${C2}`>, R>
        : S extends OpEqOrNot<infer C1, infer C2, infer R>
            ? ScanSuccess<BuildToken<`${C1}${C2}`, `${C1}${C2}`>, R>
            : S extends OpAnd<infer C1, infer C2, infer R>
                ? ScanSuccess<BuildToken<`${C1}${C2}`, `${C1}${C2}`>, R>
                : S extends OpOr<infer C1, infer C2, infer R>
                    ? ScanSuccess<BuildToken<`${C1}${C2}`, `${C1}${C2}`>, R>
                    : S extends `${infer C extends SingleOperators}${infer R extends string}`
                        ? ScanSuccess<BuildToken<Safe<C, SingleOperators>, C>, R>
                        : ScanError<'Not match an operator.'>;

type SingleOperators =
    | '{'
    | '}'
    | ','
    | ';'
    | '('
    | ')'
    | '+'
    | '-'
    | '/'
    | '*'
    | '%'
    | '<'
    | '>'
    | '!'
    | '=';

type OpGteOrLte<C1 extends '>' | '<', C2 extends '=', R extends string> = `${C1}${C2}${R}`;
type OpEqOrNot<C1 extends '=' | '!', C2 extends '=', R extends string> = `${C1}${C2}${R}`;
type OpAnd<C1 extends '&', C2 extends '&', R extends string> = `${C1}${C2}${R}`;
type OpOr<C1 extends '|', C2 extends '|', R extends string> = `${C1}${C2}${R}`;
```


`ScanIdentifier` 和 `ScanString` 也是类似的，就不再贴代码了，完整版请看 [type-Scanner](https://github.com/huanguolin/toc/blob/master/type-toc/scanner/index.d.ts)。

至此，我们的词法分析已经全部完成。是不是渐入佳境😊。接下来，就让我们“攀登”本次最高的“山峰”——语法分析！


#### 2.2.3 语法分析
为了你，也为了我，能平滑的完成这件事情，我们从搞定表达式开始。先看一个简单的四则运算：
```ts
10 - 2 * 3 + 1
// 按照优先级，对应的抽象语法树:
//     +
//    / \
//   -   1
//  /  \
// 10   *
//     / \
//    2   3
```


为什么是这样的树，而不是另外一个呢？是因为优先级高的要先运算，在语法树中，只有操作数都是叶子节点（此时它们都是字面量，无法继续展开为别的表达式）时，才能运算。运算时，从最深的运算符节点开始，先左后右，向树根靠拢：
```ts
//     +
//    / \
//   -   1
//  /  \
// 10   *
//     / \
//    2   3
// ========>
//     +
//    / \
//   -   1
//  /  \
// 10   6
// ========>
//     +
//    / \
//   4   1
// ========>
//     5
```


在构建这样的语法树之前，需要先定义语法树的节点。上面的表达式中包含了两种基础的表达式：
* 字面量表达式
* 二元表达式

此外我们还有一元表达式和分组表达式。所以我们先定义表达式类型和表达式的接口：
```ts
type ExprType =
    | 'group'
    | 'binary'
    | 'unary'
    | 'literal';

interface IExpr {
    type: ExprType;
}
```


下面，我们依次来定义字面量、一元、二元、分组表达式：
```ts
type ValueType =
    | string
    | number
    | boolean
    | null;

class LiteralExpr implements IExpr {
    type: ExprType = 'literal';
    value: ValueType;

    constructor(value: ValueType) {
        this.value = value;
    }
}

class UnaryExpr implements IExpr {
    type: ExprType = 'unary';
    operator: Token;
    expression: IExpr;

    constructor(operator: Token, expr: IExpr) {
        this.operator = operator;
        this.expression = expr;
    }
}

class BinaryExpr implements IExpr {
    type: ExprType = 'binary';
    left: IExpr;
    operator: Token;
    right: IExpr;

    constructor(left: IExpr, operator: Token, right: IExpr) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
}

class GroupExpr implements IExpr {
    type: ExprType = 'group';
    expression: IExpr;

    constructor(expr: IExpr) {
        this.expression = expr;
    }
}
```


现在回到 `10 - 2 * 3 + 1` 这个表达式，期望的语法树应该表示为：
```ts
const mulExpr = new BinaryExpr(
    new LiteralExpr(2),
    new Token('*', '*'),
    new LiteralExpr(3));

const minusExpr = new BinaryExpr(
    new LiteralExpr(10),
    new Token('-', '-'),
    mulExpr);

const addExpr = new BinaryExpr(
    minusExpr,
    new Token('+', '+'),
    new LiteralExpr(1));

// 最终输出的语法树：
const expression = addExpr;
```


可是我们要用代码来产生这个！`Parser` 的输入是 `Token` 数组，输出是一个表达式（就是语法树的根节点）。架子代码如下：
```ts
class Parser {
    private tokens: Token[];
    private index: number;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
        this.index = 0;
    }

    parse(): IExpr {
        return this.expression();
    }

    private expression(): IExpr {
        // TODO
    }
}
```

##### 2.2.3.1 递归下降

`expression` 函数怎么实现呢？这就是语法分析的关键了。学过编译原理的同学知道，语法分析有很多算法。但是手写语法分析，简单又实用，必须要掌握的，莫属[递归下降](https://en.wikipedia.org/wiki/Recursive_descent_parser)了。它是[自顶向下语法分析](https://en.wikipedia.org/wiki/Top-down_parsing)的一种。

为什么递归下降是自顶向下呢？因为递归下降从 `expression` 开始，逐步展开为更具体的表达式，直到无法展开为止。

我们配合例子，一步一步来，会更好理解递归下降。

假如只考虑四则运算，加上数字，只有三个优先级，从低到高排列：
1. 加性运算(additive)：+，-
2. 乘性运算(factor)：*, /
3. 字面量(literal): NUMBER

前面的例子，`10 - 2 * 3 + 1`, 如果用递归下降来考虑，可以看成：
```ts
10 - factor_1 + 1
// factor_1 = 2 * 3
```

如果是 `10 / 5 - 2 * 3 + 1`，就看成：
```ts
factor_1 - factor_2 + 1
// factor_1 = 10 / 5
// factor_2 = 2 * 3
```

或者：
```ts
factor_1 - factor_2 + factor_3
// factor_1 = 10 / 5
// factor_2 = 2 * 3
// factor_3 = 1
```

注意，这一步很关键，我们把问题抽象化了，变成只有一种优先级的运算。任何四则运算都可以抽象成这样，我们再看几个例子：
```ts
2 + 3
factor_1 + factor_2
// factor_1 = 2
// factor_2 = 3

2 * 3 / 4
factor_1
// factor_1 = 2 * 3 / 4

5
factor_1
// factor_1 = 5
```

所以我只需要考虑相同优先级的运算，直接从左到右即可。假设有 `factor_1 - factor_2 + factor_3`, 得到的代码树如下：
```ts
factor_1 - factor_2 + factor_3
//          +
//         / \
//         -   factor_3
//        / \
// factor_1  factor_2
```

注意相同优先级，从左到右计算，相当于说从左到右，优先级依次降低。所以最右边的运算是根。所以对于加性运算的递归下降代码如下：
```ts
class Parser {
    // ...
    private expression(): IExpr {
        return this.additive();
    }

    private additive(): BinaryExpr {
        let expr = this.factor();
        while (this.match('+', '-')) { // 匹配到 + 或者 -
            const left = expr;
            const operator = this.previous(); // 返回 + 或者 - 的 Token
            const right = this.factor();
            expr = new BinaryExpr(left, operator, right);
        }
        return expr;
    }

    private factor(): BinaryExpr {
        // TODO
    }

    private match(...tokenTypes: TokenType[]) {
        if (this.check(...tokenTypes)) {
            this.advance();
            return true;
        }
        return false;
    }

    private check(...tokenTypes: TokenType[]): boolean {
        if (this.isAtEnd()) {
            return false;
        }
        return tokenTypes.includes(this.current().type);
    }

    private isAtEnd() {
        return this.tokens[this.index].type === 'EOF';
    }

    private advance() {
        return this.tokens[this.index++];
    }

    private current() {
        return this.tokens[this.index];
    }

    private previous() {
        return this.tokens[this.index - 1];
    }
}
```

你可以把上面举的多个例子套进去看看。

同理，我们处理乘性运算也是一样：
```ts
2 * 3 / 4
literal_1 * literal_2 / literal_3
// literal_1 = 2
// literal_2 = 3
// literal_3 = 4

5
literal_1
// literal_1 = 5
```

代码和加性运算几乎一样：
```ts
class Parser {
    // ...
    private additive(): BinaryExpr {
        let expr = this.factor();
        while (this.match('+', '-')) { // 匹配到 + 或者 -
            const left = expr;
            const operator = this.previous(); // 返回 + 或者 - 的 Token
            const right = this.factor();
            expr = new BinaryExpr(left, operator, right);
        }
        return expr;
    }

    private factor(): BinaryExpr {
        let expr = this.literal();
        while (this.match('*', '/')) { // 匹配到 * 或者 /
            const left = expr;
            const operator = this.previous(); // 返回 * 或者 / 的 Token
            const right = this.literal();
            expr = new BinaryExpr(left, operator, right);
        }
        return expr;
    }

    private literal(): LiteralExpr() {
        // TODO
    }
    // ...
}
```

最后到只考虑数字的字面量就更简单了：
```ts
class Parser {
    // ...
    private literal(): LiteralExpr() {
        if (this.match('number')) {
            return new LiteralExpr(this.previous().literal as number);
        }

        throw new ParseError(`Expect expression, but got token: ${this.current().lexeme}.`);
    }
    // ...
}
```

如果你看懂了上面，你就看懂了递归下降。现在我们来总结递归下降算法是怎么做的：
1. 将表达式按照优先级从低到高排列；
2. 从最低的优先级开始解析，向最高优先级“下降”；
3. 解析某种优先级的运算时，只“看到”相同优先级的运算符，且操作数都是更高优先级的运算。
4. “下降”最终会落到无法继续实施表达式展开的字面量上。

上面我们实现了四则运算的递归下降代码，用语法定义来描述这个过程就是：
```shell
expression      → additive ;
additive        → factor ( ( "-" | "+" ) factor )* ;
factor          → literal ( ( "/" | "*" ) literal )* ;
literal         → STRING ;
```
> 现在去看 [Toc Grammar Spec](https://github.com/huanguolin/toc/blob/master/docs/grammar.md), 是不是能看懂更多了😂

##### 2.2.3.2 完整的表达式语法分析(ts版本)

现在，要实现完整的表达式语法分析，我们先将表达式按照优先级从低到高排列：
```ts
// 表达式按照优先级由低到高：
// logic or:    ||                  左结合
// logic and:   &&                  左结合
// equality:    == !=               左结合
// relation:    < > <= >=           左结合
// additive:    + -                 左结合
// factor:      * / %               左结合
// unary:       !                   右结合
// primary:     literal group
```

注意到吗？`primary: literal group`, `literal` 和 `group` 一个优先级？答案肯定的。而且这两个在一起了，原来叫 `literal` 的函数名字就必须要改了。我们来看看代码吧：
```ts
class Parser {
    // ...
    private factor(): BinaryExpr {
        let expr = this.primary();
        while (this.match('*', '/', '%')) { // 顺带加上对取余运算符的支持
            const left = expr;
            const operator = this.previous();
            const right = this.primary();
            expr = new BinaryExpr(left, operator, right);
        }
        return expr;
    }

    private primary(): LiteralExpr() {
        if (this.match('number')) {
            return new LiteralExpr(this.previous().literal as number);
        } else if (this.match('true', 'false', 'null')) {
            const type = this.previous().type;
            if (type === 'null') {
                return new LiteralExpr(null);
            }
            return new LiteralExpr(type === 'true');
        } else if (this.match('string')) {
            return new LiteralExpr(this.previous().lexeme);
        } else if (this.match('(')) {
            const expr = this.expression(); // 注意这里递归调用了 expression()
            this.consume(')', 'Expect ")" after expression.');
            return new GroupExpr(expr);
        }

        throw new ParseError(`Expect expression, but got token: ${this.current().lexeme}.`);
    }
    // ...
    private consume(tokenType: TokenType, message: string) {
        if (this.check(tokenType)) {
            this.advance();
            return;
        }
        throw new ParseError(message);
    }
    // ...
}
```


下面，逻辑运算，比较运算的代码和加法乘法完全一致，只需要按照优先级顺序编写即可，就不再赘述。最后只剩下一个一元运算符了。这个有点特殊，我们来看一下。

它特殊在那里呢？一元？额……注意它的结合性，和二元运算都不一样，它是右结合，举个例子：
```ts
!!false

// 等价于：
!(!false)

// 等价于：
!(!literal_1)
literal_1 = false

// 等价于：
!unary_1
unary_1 = !literal_1
literal_1 = false

// AST:
//  ! <- 左起第一个
//  |
//  ! <- 左起第二个
//  |
//  false
```

看到吗，`!` 后面还可以是一个 `!` 表达式，它在递归自己，这就是它与众不同的地方。代码如下：
```ts
class Parser {
    // ...
    private unary(): UnaryExpr {
        if (this.match('!')) {
            const operator = this.previous();
            const right = this.unary();
            return new UnaryExpr(operator, right);
        }
        return this.primary();
    }
    // ...
```


好了，以上就是 ts 版本的表达式语法分析，完整代码见 [ts-Parser-expression](https://github.com/huanguolin/toc/blob/0f32d4cecf0314e12cd1798293048c2a7e56bfe6/ts-toc/Parser/index.ts#L167)。

##### 2.2.3.3 完整的表达式语法分析(type版本)

参照 ts 版本，我们来实现 type 版的表达式语法分析。首先来定义 type 版的表达式类型。其中 `ExprType`, `IExpr` 和 `ValueType`， 二者是完全一致的。可直接看 ts 版的，这里省略。
```ts
// `ExprType`, `IExpr` 和 `ValueType` 的定义请直接参考 ts 版的。

interface LiteralExpr extends Expr {
    type: 'literal';
    value: ValueType;
}

interface BuildLiteralExpr<T extends ValueType> extends LiteralExpr {
    value: T
}

interface GroupExpr extends Expr {
    type: 'group';
    expression: Expr;
}

interface BuildGroupExpr<E extends Expr> extends GroupExpr {
    expression: E;
}

interface BinaryExpr extends Expr {
    type: 'binary';
    left: Expr;
    operator: Token;
    right: Expr;
}

interface BuildBinaryExpr<
    L extends Expr,
    Op extends Token,
    R extends Expr,
> extends BinaryExpr {
    left: L;
    operator: Op;
    right: R;
}

interface UnaryExpr extends Expr {
    type: 'unary';
    operator: Token;
    expression: Expr;
}

interface BuildUnaryExpr<
    Op extends Token,
    E extends Expr,
> extends UnaryExpr {
    operator: Op;
    expression: E;
}
```


type 版实现递归下降和 ts 是一致的。所以我们直接上手实现完整版：
```ts
// 表达式按照优先级由低到高：
// logic or:    ||                  左结合
// logic and:   &&                  左结合
// equality:    == !=               左结合
// relation:    < > <= >=           左结合
// additive:    + -                 左结合
// factor:      * / %               左结合
// unary:       !                   右结合
// primary:     literal group
```


我们先来看架子代码：
```ts
// 依然需要 result 包装工具函数。
type ParseExprError<M extends string> =
    ErrorResult<`[ParseExprError]: ${M}`>;
type ParseExprSuccess<
    R extends Expr,
    T extends Token[],
> = SuccessResult<{ expr: R, rest: T }>;

// Parser 的入口方法，它返回 AST.
type Parse<Tokens extends Token[]> = ParseExpr<Tokens>;

type ParseExpr<Tokens extends Token[]> = ParseLogicOr<Tokens>;

// ...
```


按顺序，首先实现 `ParseLogicOr`。我们把 ts 版本的代码贴在旁边来翻译：
```ts
// ts 版本代码，作为翻译对照。
class Parser {
    // ...

    private logicOr() {
        let expr: IExpr = this.logicAnd();
        while (this.match('||')) {
            const operator = this.previous();
            const right = this.logicAnd();
            expr = new BinaryExpr(expr, operator, right);
        }
        return expr;
    }

    // ...
}
```


翻译为 type 版本：
```ts
type ParseLogicOr<Tokens extends Token[], R = ParseLogicAnd<Tokens>> =
    R extends ParseExprSuccess<infer Left, infer Rest>
        ? ParseLogicOrBody<Left, Rest>
        : R; // error
type ParseLogicOrBody<Left extends Expr, Tokens extends Token[]> =
    Tokens extends Match<infer Op extends TokenLike<'||'>, infer Rest>
        ? ParseLogicAnd<Rest> extends ParseExprSuccess<infer Right, infer Rest>
            ? ParseLogicOrBody<BuildBinaryExpr<Left, Op, Right>, Rest>
            : ParseExprError<`Parse logic *or* of right fail: ${Rest[0]['lexeme']}`>
        : ParseExprSuccess<Left, Tokens>;
```

这里为了避免函数过长已经缩进过深，多出来一个辅助函数。另外将 `R = ParseLogicAnd<Tokens>` 利用函数默认参数是为了方便，函数内部产生局部常量要麻烦一些:
```ts
type ParseLogicOr<Tokens extends Token[]> =
    ParseLogicAnd<Tokens> extends infer R ?
        R extends ParseExprSuccess<infer Left, infer Rest>
            ? ParseLogicOrBody<Left, Rest>
            : R // error
        : NoWay<'ParseLogicAnd'>; // 这里用 NoWay 替代 never.
```

如果不用默认参数，缩进会深一些，因为多了一个无用的分支。这里 `NoWay` 替代 `never` 是为什么呢？如果你写的代码有问题，结果返回了一个 never ...... 当代码量大时，你不知道返回的 `never` 是哪里产生的！别问我是怎么知道的……我不想勾起那痛苦的调试回忆。

那我们为什么不不这样写呢？
```ts
type ParseLogicOr<Tokens extends Token[]> =
    ParseLogicAnd<Tokens> extends ParseExprSuccess<infer Left, infer Rest>
        ? ParseLogicOrBody<Left, Rest>
        : ParseExprError<'ParseLogicOr'>; // error

// 或者

type ParseLogicOr<Tokens extends Token[]> =
    ParseLogicAnd<Tokens> extends ParseExprSuccess<infer Left, infer Rest>
        ? ParseLogicOrBody<Left, Rest>
        : ParseLogicAnd<Tokens>; // error
```

第一个写法，外界无法得到底层的错误，这显然是不太好的。我们的解释器虽然没有提供详尽的错误信息（比如行号等），但是也不能说的太模糊。直接将底层的错误抛出，避免了错误信息越来越模糊。第二个逻辑上是OK的。但是直观上会让 ts 的编译器做更多的事。我不太确定 ts 的编译器有没有对这个情况做优化。如果有的话就是我多虑了。所以我还是保守的选择了函数默认参数或者局部常量的方式。

额，差点忘记了。还有工具函数：
```ts
type OpOrKeywordTokenType = Exclude<TokenType, 'number' | 'identifier' | 'EOF'>

type TokenLike<T extends OpOrKeywordTokenType | Partial<Token>> =
    T extends OpOrKeywordTokenType
        ? BuildToken<T, T>
        : T extends Partial<Token>
            ? Token & T
            : never;

type Match<T, R extends Token[]> = [T, ...R];
```


剩下的二元操作解析代码，我想我不用说了。我们直接来看 `unary` 和 `primary` 的代码吧：
```ts
type ParseUnary<Tokens extends Token[]> =
    Tokens extends Match<infer Op extends TokenLike<'!'>, infer Rest>
        ? ParseUnary<Rest> extends ParseExprSuccess<infer Expr, infer Rest>
            ? ParseExprSuccess<BuildUnaryExpr<Op, Expr>, Rest>
            : ParseExprError<`ParseUnary error after ${Op["lexeme"]}`>
        : ParsePrimary<Tokens>;

type ParsePrimary<Tokens extends Token[]> =
    Tokens extends Match<infer E extends Token, infer R>
        ? E extends { type: 'number', value: infer V extends number }
            ? ParseExprSuccess<BuildLiteralExpr<V>, R>
            : E extends { type: 'string', lexeme: infer V extends string }
                ? ParseExprSuccess<BuildLiteralExpr<V>, R>
                : E extends { type: infer B extends keyof Keywords }
                    ? ParseExprSuccess<BuildLiteralExpr<ToValue<B>>, R>
                    : E extends TokenLike<'('>
                        ? ParseExpr<R> extends ParseExprSuccess<infer G, infer RG>
                            ? RG extends Match<TokenLike<')'>, infer Rest>
                                ? ParseExprSuccess<BuildGroupExpr<G>, Rest>
                                : ParseExprError<`Group not match ')'.`>
                            : ParseExprError<`Parse Group expression fail.`>
                        : ParseExprError<`Unknown token type: ${E['type']}, lexeme: ${E['lexeme']}`>
        : ParseExprError<`ParsePrimary fail`>;

type ToValue<K extends keyof Keywords> = Safe<
    KeywordValueMapping[Safe<K, keyof KeywordValueMapping>],
    ValueType>;

type KeywordValueMapping = {
    true: true;
    false: false;
    null: null;
};
```

上面解析 `group` 的那段代码，你应该感受到了，语言特性贫瘠带来的代码冗长。这是没办法的事情。后面你会习惯的😂。

好了，以上就是我们语法分析表达式的全部了，完整的代码见 [type-ParseExpr](https://github.com/huanguolin/toc/blob/master/type-toc/parser/ParseExprHelper.d.ts#L13)。关于 `var` 语句, `if` 语句, `block` 语句, 函数, `for` 循环语句等特性，我们会在打通 `执行` 一关后，慢慢加上的。我们已经啃了语法分析最核心的部分了。后续或许代码会更多，核心“科技”却没多多少。


#### 2.2.4 执行
终于到最后一个阶段了。完成它，我们就能得到一个完整的解释器，虽然暂时只能支持表达式，但这已经做出了很大成果。

如你所料，这里并不难。不过我们还不能马上开始 ts 版的执行器。前面说过，ts 版要用最自然的方式。使用面向对象来操作 AST，是一个著名设计模式的经典应用场景。如果你知道 [如何修改C#的表达式树](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/expression-trees/how-to-modify-expression-trees#:~:text=You%20can%20use%20the%20ExpressionVisitor%20class%20to%20traverse%20an%20existing%20expression%20tree%20and%20to%20copy%20each%20node%20that%20it%20visits.)，或者你把玩过 [Roslyn](https://learn.microsoft.com/en-us/dotnet/csharp/roslyn-sdk/), 你一定见过像 [SymbolVisitor](https://learn.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.symbolvisitor?view=roslyn-dotnet-4.3.0) 类中的那些 `Visit` 开头的 `API`。没错，我说的就是访问者模式。使用它，这里才更“自然”，或者“对味”。

##### 2.2.4.1 访问者模式与ts-Interpreter

如果我们直接开始我们的执行器代码，我们可能写出如下的代码：
```ts
if (expr instanceof BinaryExpr) {
    // ...
} else if (expr instanceof UnaryExpr) {
    // ...
} else if // ...

// 或者

switch (expr.type) {
    case 'binary':
        // ...
    case 'unary':
        // ...
}

// 又或者我们直接将对应的操作添加在对应的类中：
class UnaryExpr implements IExpr {
    type: ExprType = 'unary';
    operator: Token;
    expression: IExpr;

    constructor(operator: Token, expr: IExpr) {
        this.operator = operator;
        this.expression = expr;
    }

    interpret() {
        // ...
    }
}
```

诚然，这样的代码是可以工作的。但都不够优雅或者灵活。我们的解释器只有三步：词法分析，语法分析，执行。假如我们未来增加了静态检查的部分。一般是增加一步，放在语法分析与执行之间。如果是使用上面前两种的做法，只需要新写一个类，但冗长的 `if-else` 或者 `switch` 语句又要来一遍？如果是最后一种写法，那我们不得不修改每个 `Expr` 类，为它新添加一个方法。或许你觉的这可以接受，但是让一类操作，分散在各个地方。特别是这种类有多达几十上百，甚至上千时，维护起来是很头疼的。

那我们来看看访问者模式是如何解决这些问题：

首先我们要新增一个接口，并给 `IExpr` 添加一个方法：
```ts
interface IExprVisitor<T> {
    visitBinaryExpr: (expr: BinaryExpr) => T;
    visitGroupExpr: (expr: GroupExpr) => T;
    visitUnaryExpr: (expr: UnaryExpr) => T;
    visitLiteralExpr: (expr: LiteralExpr) => T;
}

interface IExpr {
    type: ExprType;

    // 新增 accept 方法
    accept: <R>(visitor: IExprVisitor<R>) => R;
}
```


然后表达式类需要实现这些 `accept` 方法：
```ts
class LiteralExpr implements IExpr {
    // 其他代码省略……
    accept<R>(visitor: IExprVisitor<R>): R {
        return visitor.visitLiteralExpr(this);
    }
}

class UnaryExpr implements IExpr {
    // 其他代码省略……
    accept<R>(visitor: IExprVisitor<R>): R {
        return visitor.visitUnaryExpr(this);
    }
}

class BinaryExpr implements IExpr {
    // 其他代码省略……
    accept<R>(visitor: IExprVisitor<R>): R {
        return visitor.visitBinaryExpr(this);
    }
}

class GroupExpr implements IExpr {
    // 其他代码省略……
    accept<R>(visitor: IExprVisitor<R>): R {
        return visitor.visitGroupExpr(this);
    }
}
```

每个只需要调用与自己对应的那个方法即可。是不是很容易。

接下来我们就能实现 `Interpreter` 类了：
```ts
class Interpreter implements IExprVisitor<unknown> {

    interpret(expr: IExpr): ValueType {
        return expr.accept(this);
    }

    visitLiteralExpr(expr: LiteralExpr): ValueType {
        return expr.value;
    }

    visitGroupExpr(expr: GroupExpr): ValueType {
        return expr.expression.accept(this);
    }

    visitUnaryExpr(expr: UnaryExpr): boolean {
        const v = expr.expression.accept(this);
        if (expr.operator.type === '!') {
            return !v;
        }
        throw new RuntimeError('Unknown unary operator: ' + expr.operator.type);
    }

    visitBinaryExpr(expr: BinaryExpr): ValueType {
        // TODO
    }
}
```

简直不敢相信，现在，只要完成 `visitBinaryExpr` 函数，就完工了！

在完成它之前。我们来看看访问者模式是怎么做到的。我们看看如果我选择用 `switch` 来干这个事情：
```ts
class Interpreter {

    interpret(expr: IExpr): ValueType {
        return this.evalExpr(expr);
    }

    evalExpr(expr: IExpr): ValueType {
        switch (expr.type) {
            case 'literal': return this.evalLiteralExpr(expr as LiteralExpr);
            case 'group': return this.evalGroupExpr(expr as GroupExpr);
            case 'unary': return this.evalUnaryExpr(expr as UnaryExpr);
            case 'binary': return this.evalBinaryExpr(expr as BinaryExpr);
            default:
                throw new RuntimeError('Unknown expr type: ' + expr.type);
        }
    }

    evalLiteralExpr(expr: LiteralExpr): ValueType {
        return expr.value;
    }

    evalGroupExpr(expr: GroupExpr): ValueType {
        return this.evalExpr(expr.expression);
    }

    evalUnaryExpr(expr: UnaryExpr): boolean {
        const v = this.evalExpr(expr.expression);
        if (expr.operator.type === '!') {
            return !v;
        }
        throw new RuntimeError('Unknown unary operator: ' + expr.operator.type);
    }

    evalBinaryExpr(expr: BinaryExpr): ValueType {
        // TODO
    }
}
```


或许你会觉得这样写也很好啊，至少好理解。好理解的确是优点。但随着表达式种类增多，`switch` 的 `case` 会越来越长。假如现在要实现一个 `Resolve` 类，它能做静态检查（比如后面加了变量，这里可以检查变量在使用时有没有定义）。这样写的话 `switch` 代码会再来一遍。但是访问者模式就免去了这个部分。这样对比的话，访问者模式实现了特定的 `Expr` 类型会“自动”调用与之配对的方法。哈哈，自动？实际上是每个 `Expr` 类型的 `accept` 方法中调用了那个对应的方法。

我想你已经 `get` 了访问者模式的美妙，现在是时候来完成 `visitBinaryExpr` 方法了。
```ts
class Interpreter implements IExprVisitor<unknown> {
    // ...

    visitBinaryExpr(expr: BinaryExpr): ValueType {
        const operator = expr.operator;

        const leftValue = expr.left.accept(this);
        // && || 需要考虑短路
        if (operator.type == '&&') {
            return leftValue && expr.right.accept(this);
        } else if (operator.type == '||') {
            return leftValue || expr.right.accept(this);
        } else {
            // 不需要考虑短路的，可直接求出右值
            const rightValue = expr.right.accept(this);
            if (operator.type == '+') {
                if (this.isString(leftValue) && this.isString(rightValue)) {
                    return leftValue + rightValue;
                } else if (this.isNumber(leftValue) && this.isNumber(rightValue)) {
                    return leftValue + rightValue;
                }
                throw new RuntimeError('"+" operator only support both operand is string or number.');
            } else if (operator.type == '==') {
                return leftValue == rightValue;
            } else if (operator.type == '!=') {
                 return leftValue != rightValue;
            } else {
                // 纯数字运算
                if (this.isNumber(leftValue) && this.isNumber(rightValue)) {
                    return this.evalMath(operator.type, leftValue, rightValue);
                }
                throw new RuntimeError(`Required both operand is number for operator ${operator.type}: left=${leftValue}, right=${rightValue}`);
            }
        }
    }
}
```

上面特别要注意的是，`&&` 和 `||` 具有短路效果，不能先把右操作数求出来。目前你还感觉不到差异，有了变量和函数之后，就可以看到效果了。另外一个要注意的是，我们的 `+` 可以支持字符串连接和数字相加，要分别处理，但是不允许混合。完整的代码见 [ts-Interpreter](https://github.com/huanguolin/toc/blob/master/ts-toc/Interpreter/index.ts);

我们做完了吗？实际上还差一步，我们还没有把 `Scanner`, `Parser` 和 `Interpreter` 组合到一起。如果是 `node.js` 环境，可以写一个 `REPL`([Read–eval–print loop](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop))：
```ts
import { Interpreter } from './Interpreter';
import { Parser } from './Parser';
import { Scanner } from './Scanner';

const readline = require('readline');
const interpreter = new Interpreter();

main();

function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    process.stdout.write('> ');
    rl.on('line', function (line) {
        try {
            console.log('=', toc(line));
        } catch (e) {
            let errMsg = e;
            if (e instanceof Error) {
                errMsg = e.message;
            }
            console.error('Error: ', errMsg);
        }
        process.stdout.write('> ');
    });
}

function toc(source: string) {
    const scanner = new Scanner(source);
    const parser = new Parser(scanner.scan());
    return interpreter.interpret(parser.parse());
}
```


好了，我们得到了一个可以执行 `toc` 程序的程序。你可以输入一段代码，并查看输出了😄。

##### 2.2.4.2 type-Interpreter

接下来实现我们的 type 版本。但是这里没法实现访问者模式，甚至没有 `switch` 可用。我们只能用类似 `if-elseif` 一般的条件判断来实现：
```ts
type Interpret<E extends Expr> = InterpretExpr<E>;

type InterpretExpr<E extends Expr> =
    E extends LiteralExpr
        ? InterpretExprSuccess<E['value']>
        : E extends GroupExpr
            ? InterpretExpr<E['expression']>
            : E extends UnaryExpr
                ? EvalUnaryExpr<E>
                : E extends BinaryExpr
                    ? EvalBinaryExpr<E>
                    : RuntimeError<`Unknown expression type: ${E['type']}`>;

type RuntimeError<M extends string> = ErrorResult<`[RuntimeError]: ${M}`>;
type InterpretExprSuccess<Value extends ValueType > = SuccessResult<{ value: Value }>;
```

通过参考 ts 版本，实现 type 也不难。而且对于 `LiteralExpr` 和 `GroupExpr` 的执行，我们并没有另起函数，直接就返回结果了。现在只剩下 `UnaryExpr` 和 `BinaryExpr`。我们先看 `EvalUnaryExpr`:
```ts
type EvalUnaryExpr<
    E extends UnaryExpr,
    Op extends TokenType = E['operator']['type'],
    V = InterpretExpr<E['expression']>
> = Op extends '!'
    ? V extends InterpretExprSuccess<infer Val>
        ? InterpretExprSuccess<Inverse<Val>>
        : V // error
    : RuntimeError<`Unknown unary operator: ${Op}`>;

type Inverse<T> = IsFalse<T>;

// 判断真值，假值和 js 一致。
type IsFalse<T> =
    T extends false | null | undefined | 0 | ''
        ? true
        : T extends string
            ? TrimStart<T> extends ''
                ? true
                : false
            : false;
```


最后是 `EvalBinaryExpr`，它比较麻烦，但也只是按照操作符类型来调用具体的实现函数。
```ts
type EvalBinaryExpr<
    E extends BinaryExpr,
    Op extends TokenType = E['operator']['type'],
    LR = InterpretExpr<E['left']>,
    Right extends Expr = E['right'], // 不能直接求值 Right, 因为 && || 有短路的效果。
> =
    LR extends InterpretExprSuccess<infer LV>
        ? Op extends '==' | '!='
            ? EvalEquality<Op, LV, InterpretExpr<Right>>
            : Op extends '&&' | '||'
                ? EvalLogicAndOr<Op, LV, Right>
                : EvalRestBinaryExpr<Op, LV, InterpretExpr<Right>>
        : LR; // error


type EvalLogicAndOr<
    Op extends '&&' | '||',
    LV extends ValueType,
    Right extends Expr,
> = Op extends '&&'
    ? IsTrue<LV> extends true
        ? InterpretExpr<Right>
        : InterpretExprSuccess<LV>
    : Op extends '||'
        ? IsTrue<LV> extends true
            ? InterpretExprSuccess<LV>
            : InterpretExpr<Right>
        : RuntimeError<`EvalLogicAndOr fail when meet: ${Op}`>;


type EvalEquality<
    Op extends '==' | '!=',
    LV extends ValueType,
    RR,
> = RR extends InterpretExprSuccess<infer RV>
    ? Op extends '=='
        ? InterpretExprSuccess<Eq<LV, RV>>
        : Op extends '!='
            ? InterpretExprSuccess<Inverse<Eq<LV, RV>>>
            : RuntimeError<`EvalEquality fail when meet: ${Op}`>
    : RR; // error

type EvalRestBinaryExpr<
    Op extends TokenType,
    LV extends ValueType,
    RR,
> = RR extends InterpretExprSuccess<infer RV>
    ? Op extends '+'
        ? [LV, RV] extends IsNumbers<infer N1, infer N2>
            ? WrapBinaryResult<Add<N1, N2>>
            : [LV, RV] extends IsStrings<infer N1, infer N2>
                ? WrapBinaryResult<`${N1}${N2}`>
                : RuntimeError<'"+" operator only support both operand is string or number.'>
        : [LV, RV] extends IsNumbers<infer N1, infer N2>
            ? EvalMath<Op, N1, N2>
            : RuntimeError<`EvalRestBinaryExpr fail, Left or Right is not a number: left:${ExtractError<LV>}, right:${ExtractError<RR>}`>
    : RR; // error

type EvalMath<
    Op extends TokenType,
    N1 extends number,
    N2 extends number,
> = Op extends '-'
    ? WrapBinaryResult<Sub<N1, N2>>
    : Op extends '*'
        ? WrapBinaryResult<Mul<N1, N2>>
        : Op extends '/'
            ? WrapBinaryResult<Div<N1, N2>>
            : Op extends '%'
                ? WrapBinaryResult<Mod<N1, N2>>
                : Op extends '<'
                    ? WrapBinaryResult<Lt<N1, N2>>
                    : Op extends '>'
                        ? WrapBinaryResult<Gt<N1, N2>>
                        : Op extends '<='
                            ? WrapBinaryResult<Lte<N1, N2>>
                            : Op extends '>='
                                ? WrapBinaryResult<Gte<N1, N2>>
                                : RuntimeError<`Unknown binary operator: ${Op}`>;

type WrapBinaryResult<V> =
    V extends ValueType
        ? InterpretExprSuccess<V>
        : ExtractError<V>;

type ExtractError<E> =
    E extends { error: infer M extends string }
        ? M
        : Safe<E, string | number | boolean | null | undefined>;

type IsStrings<N1 extends string, N2 extends string> = [N1, N2];
type IsNumbers<N1 extends number, N2 extends number> = [N1, N2];
```


虽然很麻烦。但是我们还是做到了！现在把 `Scan`, `Parse` 和 `Interpret` 串起来就大功告成了! 但是并不是你想的那样串起来：
```ts
type Toc<Source extends string> =
    Scan<Source> extends infer Tokens
        ? Tokens extends Token[]
            ? Parse<Tokens> extends infer Ast
                ? Interpret<Ast> extends infer Value
                    ? Value
                    : NoWay<'Toc-Interprets'>
                : NoWay<'Toc-Parse'>
            : Tokens // error
        : NoWay<'Toc-Scan'>;
```

为什么不是 `type Toc<S extend string> = Interpret<Parse<Scan<S>>>` ? 因为错误无法展示出来。ts 中有异常机制，有错误抛出来外面可以捕获。这里没有异常，错误只能用函数返回值层层传递出去。

好了，我们最终还是得到一个完整的 [type-Interpreter](https://github.com/huanguolin/toc/blob/master/type-toc/interpreter/index.d.ts)。

现在终于从 0 到 1 了。过程或许艰难痛苦，但是结果甚是喜人——我们预期的都实现了。也验证了 ts 类型系统是图灵完备的。后面我们还会继续“攀登”一个一个的“小山峰”，你会看到在这个“贫瘠”的语言土壤下，也可以结出丰硕的“特性”果实。

#### 2.2.5 语句
##### 2.2.5.1 表达式语句
##### 2.2.5.2 环境
##### 2.2.5.3 var 语句
##### 2.2.5.4 变量表达式和赋值表达式
##### 2.2.5.5 作用域
##### 2.2.5.6 block 语句
##### 2.2.5.7 if 语句
##### 2.2.5.8 for 语句

#### 2.2.6 函数
##### 2.2.6.1 函数语句
##### 2.2.6.2 call 表达式

#### 2.2.7 未尽事宜
`return` 与 `break`

### 3. 总结