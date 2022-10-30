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
      - [1.4.3 递归](#143-递归)
      - [1.4.4 循环 <=> 递归](#144-循环--递归)
      - [1.4.5 尾递归](#145-尾递归)
      - [1.4.6 First-Class-Function](#146-first-class-function)
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
        - [2.2.5.2 var 语句](#2252-var-语句)
        - [2.2.5.3 环境](#2253-环境)
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
  - [4. 参考](#4-参考)

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

#### 1.4.3 递归
```ts
type PromiseValue<T> = T extends PromiseLike<infer V> ? V : never;

type TestPV1 = PromiseValue<Promise<Promise<number>>>; // Promise<number>

type PromiseValueDeep<T> = T extends PromiseLike<infer V> ? PromiseValueDeep<V> : T;

type TestPVD1 = PromiseValueDeep<Promise<Promise<number>>>; // number
```
> 点击[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBACgTgewLYEsDOEBqBDANgVwgB4AVAPigF4oSoIAPYCAOwBM1ZFUMAZFAa2IpmAMwhwomCgH5JUAFxRmEAG7iA3AChNoSDQhpgMTAEYqnZOix5CReJYx2uVos3xIARuLI-1UAPT+FtzEbp7e2rrQ9iE4BBAAIhAQYKQU1LQMTGwcMVZ8gkTCYhJSULJ5GHGESSlEZYokWjrg0CQGRpgJZtSV1vG1qX1ODqHuXnA+ZH6BSuPiQA)，在线体验。   


有了递归，就可以讲循环了😄！

#### 1.4.4 循环 <=> 递归
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

#### 1.4.5 尾递归
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
[尾递归优化](https://stackoverflow.com/questions/310974/what-is-tail-call-optimization)，是通过复用一个函数调用栈来避免爆栈。在 ts 中也是有这样的优化。你跳到上面的在线体验示例，会发现 `? [V, ...PreOrderTraverse<L>, ...PreOrderTraverse<R>]` 这一行，ts 有 error 提示：

`Type instantiation is excessively deep and possibly infinite.(2589)`

为什么呢？就如提示所说：类型实例化的深度过大，可能是无限的。ts 需要在我们写代码时，进行实时代码提示和纠错。过于复杂的类型势必会拖累这个过程，造成不可接受的用户体验下降。所以 ts 不仅要避免爆栈，而且还要计算速度。早期版本对递归深度的限制是 50 层。在 [4.5](https://devblogs.microsoft.com/typescript/announcing-typescript-4-5/#tailrec-conditional) 时做了优化，提高到 100 层，如果是尾递归则提高到 1000 层。基于此，我们可以实现比以前更复杂的体操。

但是，最终，这里的限制比其他编程语言更苛刻，不允许我们做长时运算。意味着，基于它实现的循环只能循环很有限的次数😓，函数调用也必然不能太深……


#### 1.4.6 First-Class-Function
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


不过 `Add<A, N1>` 这里提示:

`Type 'Add<A, N1>' does not satisfy the constraint 'number'.(2344)`。

意思是它的结果不是永远都能得到 `number`, 所以不安全。这里应该是可能输出 `never` 或者 `any` 的情况，这很极端，我们一般使用一个类似断言的工具函数来处理这个问题：

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
我们有了表达式，但还没有语句。现在可以搭建支持语句的“世界”了。这里有变量声明语句，条件语句，循环语句，块语句，当然还有表达式语句。我们用不支持变量和循环的语言可以打造支持变量和循环的语言！
我们的词法分析已经包含了整个语言所需的词素。后续的特性添加只需从语法分析开始。我们先来看看语句的语法表述:
```shell
# declarations
declaration    → funDecl
               | varDecl
               | statement ;

funDecl        → "fun" function ;
varDecl        → "var" IDENTIFIER ( "=" expression )? ";" ;

function       → IDENTIFIER "(" parameters? ")" block ;
parameters     → IDENTIFIER ( "," IDENTIFIER )* ;


# statements
statement      → exprStmt
               | forStmt
               | ifStmt
               | block ;

exprStmt       → expression ";" ;
forStmt        → "for" "(" ( varDecl | exprStmt | ";" )
                           expression? ";"
                           expression? ")" statement ;
ifStmt         → "if" "(" expression ")" statement
                 ( "else" statement )? ;
block          → "{" declaration* "}" ;
```
额，为什么最上面是 `declaration`?
难到不都是语句吗?
都划到 `statement` 下不行吗？像下面这样：
```shell
# statements
statement      → funDecl
               | varDecl
               | exprStmt
               | forStmt
               | ifStmt
               | block ;

funDecl        → "fun" function ;
varDecl        → "var" IDENTIFIER ( "=" expression )? ";" ;

function       → IDENTIFIER "(" parameters? ")" block ;
parameters     → IDENTIFIER ( "," IDENTIFIER )* ;

exprStmt       → expression ";" ;
forStmt        → "for" "(" ( varDecl | exprStmt | ";" )
                           expression? ";"
                           expression? ")" statement ;
ifStmt         → "if" "(" expression ")" statement
                 ( "else" statement )? ;
block          → "{" statement* "}" ;

```

我先回答第二个问题，的确，他们都是语句。
然后回答第三个问题，作为语言设计者，我可以允许自己认为可行的语法方案。如果我想都划到 `statement` 下，那当然也可以。可是这里我不想，回答了我为什么不想，也就回答了第一个问题。
这两种所允许的语法是不太一样的。如果都统一到 `statement` 下，它就允许下面的写法：
```ts
if (x > 10) var a = 0;
```

这回造成什么问题呢？`a` 定义与否只有在运行时才能得知，如果 `x > 10` 的条件成立，则 `a` 定义了，否则是为定义。这样在这个语句之后，让使用变量 `a` 变得很困难。这种问题同样存在于 `for` 与 `fun` 的组合：
```ts
for (; false ;) fun test() {}
```

所以我拒绝这种让人困惑不已的语法。我们选取有 `declaration` 的那一套语法规则。它将能产生变量（函数名也是变量哟）划为 `declaration`，然后可以递归下降到 `statement`。`if`, `for` 等语句下的从句只能是 `statement`。`block` 语句内部可以是 `declaration`。

好了，搞清楚这些问题，我们对处理语句进行支持了。先从最简单的语句——表达式语句开始。

##### 2.2.5.1 表达式语句

类似表达式，我们需要先定义语句的类型。
```ts
type StmtType =
    | 'fun'
    | 'var'
    | 'if'
    | 'for'
    | 'block'
    | 'expression';

interface IStmt {
    type: StmtType;
    accept: <R>(visitor: IStmtVisitor<R>) => R;
}

interface IStmtVisitor<T> {
    visitFunStmt: (stmt: FunStmt) => T;
    visitVarStmt: (stmt: VarStmt) => T;
    visitIfStmt: (stmt: IfStmt) => T;
    visitForStmt: (stmt: ForStmt) => T;
    visitBlockStmt: (stmt: BlockStmt) => T;
    visitExprStmt: (stmt: ExprStmt) => T;
}
```

这次我们要一并把执行阶段需要的访问者模式的接口等都准备好。接着是定义 `ExprStmt`:
```ts
class ExprStmt implements IStmt {
    type: 'expression' = 'expression';
    expression: IExpr;

    constructor(expr: IExpr) {
        this.expression = expr;
    }

    accept<R>(visitor: IStmtVisitor<R>): R {
        return visitor.visitExprStmt(this);
    }
}
```


然后，我们要修改 `parse` 函数了：
```ts
class Parser {
    // ...

    parse(): IStmt[] {
        const stmts: IStmt[] = [];
        while (!this.isAtEnd()) {
            stmts.push(this.statement());
        }
        return stmts;
    }

    private statement(): IStmt {
        // TODO
    }

    // ...
}
```

`parse` 函数的输出从表达式变成了语句的数组。`statement` 函数在一个一个解析语句。那我们加入表达式语句：

```ts
class Parser {
    // ...

    private statement(): IStmt {
        return this.expressionStatement();
    }

    private expressionStatement() {
        const expr = this.expression();
        this.consume(';', 'Expect ";" after expression.');
        return new ExprStmt(expr);
    }

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

😄很简单吧！

我们再来看 type 版。先从语句定义开始，`StmtType` 完全一致，其他的如下：
```ts
interface Stmt {
    type: StmtType;
}

interface ExprStmt extends Stmt {
    type: 'expression';
    expression: Expr;
}

interface BuildExprStmt<E extends Expr> extends ExprStmt {
    expression: E;
}
```


同样的要修改 `Parse` 函数：
```ts
type Parse<Tokens extends Token[], Stmts extends Stmt[] = []> =
    Tokens extends [EOF]
        ? Stmts
        : ParseStmt<Tokens> extends infer Result
            ? Result extends ParseStmtSuccess<infer R, infer Rest>
                ? Parse<Rest, Push<Stmts, R>>
                : Result // error
            : NoWay<'Parse'>;

type ParseStmtError<M extends string> =
    ErrorResult<`[ParseStmtError]: ${M}`>;
type ParseStmtSuccess<R extends Stmt, T extends Token[]> =
    SuccessResult<{ stmt: R, rest: T }>;
```


`ParseStmt` 和 `ParseExprStmt` 也同样简单：
```ts
type ParseStmt<Tokens extends Token[]> = ParseExprStmt<Tokens>;

type ParseExprStmt<Tokens extends Token[], R = ParseExpr<Tokens>> =
    R extends ParseExprSuccess<infer Expr, infer Rest>
        ? Rest extends Match<TokenLike<';'>, infer Rest>
            ? ParseStmtSuccess<BuildExprStmt<Expr>, Rest>
            : ParseStmtError<'Expect ";" after expression.'>
        : R; // error
```

以上我们完成了表达式语句的语法分析部分，这是一个简单愉快的开始。接下来要让它能执行起来。

说起执行，有一个问题，语句是没有值的。对于表达式，我们执行的结果是一个值。对于语句往往是其他副作用（比如修改变量，操作IO等），并不会像表达式一样得到一个值作为结果。当然这只是通常意义的语句效果。在我们这里，情况特殊，我们想要语句像表达式一样，最终会得到一个值的结果。为什么要这样呢？主要是考虑到 ts type 中并没有什么能操作 IO 这样能带来副作用的能力。我们无法通过类似 `console.log` 的方式“看”到程序执行带来的“变量”等的变化。可以观察程序执行效果的唯一的方式是返回值。
* 表达式语句的返回值是表达式的值；
* 多个语句的值是最后一个语句的值；
* var 语句的值是变量的值；
* if 语句的值是其为真对应语句的值，没有对应语句或者空语句时值为 `null`;
* for 语句的值是其循环块对应语句最后一次执行的值；
* 块语句的值是其内部最后一个语句的值，空块的值是 `null`；
* 空语句的值是 `null`;
* 函数定义语句的值是函数；
* 函数执行的返回值是最后执行语句的值（是的，没有 `return` 也有返回值）。

现在我们开始实现执行。首先需要调整 `interpret` 函数，它的入参从表达式变成了语句数组。`Interpreter` 类还要实现 `IStmtVisitor<unknown>` 接口。
```ts
class Interpreter implements IExprVisitor<unknown>,
                             IStmtVisitor<unknown> {
    // ...

    interpret(stmts: IStmt[]): ValueType {
        let lastResult: ValueType = null;
        for (const stmt of stmts) {
            lastResult = stmt.accept(this);
        }
        return lastResult;
    }

    // ...
}
```


对 `visitExprStmt` 函数的实现，异常简单😄：
```ts
class Interpreter implements IExprVisitor<unknown>,
                             IStmtVisitor<unknown> {
    // ...

    visitExprStmt(stmt: ExprStmt): ValueType {
        return stmt.expression.accept(this);
    }

    // ...
}
```

这就搞定了？😄没错！

那么，type 版会有这么简单吗？我们来看看：
```ts
type Interpret<
    Stmts extends Stmt[],
    LastResult extends ValueType | null = null,
> = Stmts extends [infer S extends Stmt, ...infer Rest extends Stmt[]]
        ? InterpretStmt<S> extends infer R
            ? R extends InterpretStmtSuccess<infer Result>
                ? Interpret<Rest, Result>
                : R // error
            : NoWay<'Interpret'>
        : LastResult;

type InterpretStmtError<M extends string> =
    ErrorResult<`[InterpretStmtError]: ${M}`>;
type InterpretStmtSuccess<Value extends ValueType> =
    SuccessResult<{ value: Value }>;
```

这套路和 `Parse` 一样。`InterpretStmt` 和 `InterpretExprStmt` 也是一样的简单：

```ts
type InterpretStmt<S extends Stmt> =
    S extends ExprStmt
        ? InterpretExprStmt<S>
        : InterpretStmtError<`Unsupported statement type: ${S['type']}`>;

type InterpretExprStmt<
    S extends ExprStmt,
    R = InterpretExpr<S['expression']>
> =
    R extends InterpretExprSuccess<infer V>
        ? InterpretStmtSuccess<V>
        : R; // error
```

😄大功告成！


##### 2.2.5.2 var 语句

现在我们来支持很关键的特性——变量。首先是声明变量的语句。先看语句类型定义：
```ts
class VarStmt implements IStmt {
    type: 'var' = 'var';
    name: Token;
    initializer: IExpr | null;

    constructor(token: Token, initializer: IExpr | null) {
        this.name = token;
        this.initializer = initializer;
    }

    accept<R>(visitor: IStmtVisitor<R>): R {
        return visitor.visitVarStmt(this);
    }
}
```

`var` 属于 `declaration`，所以又要修改 `parse` 了。另外语法分析时，和表达式那边有优先级不同。这里要进入变量表达式的解析函数，需要前看是否是 `var` 关键字，如果是的话必然是变量声明。
```ts
class Parser {
    // ...

    parse(): IStmt[] {
        const stmts: IStmt[] = [];
        while (!this.isAtEnd()) {
            stmts.push(this.declaration()); // <-- 变动
        }
        return stmts;
    }

    private declaration() {
        if (this.match('var')) {
            return this.varDeclaration();
        }

        return this.statement();
    }

    private varDeclaration() {
        // TODO
    }

    // ...
}
```


再看 `varDeclaration`的具体实现。声明变量时，初始化是可选的。只有“看”到 `=` 后，才会解析初始化表达式：
```ts
class Parser {
    // ...

    private varDeclaration() {
        this.consume('identifier', `Expect var name.`);
        const name = this.previous();
        let initializer = null;
        if (this.match('=')) {
            initializer = this.expression();
        }
        this.consume(';', `Expect ';' after var declaration.`);
        return new VarStmt(name, initializer);
    }

    // ...
}
```


有了表达式的历练，现在这些看起来都很简单，对吧😂。

再来看 type 版的语法分析, 还是先定义语句类型：
```ts
interface VarStmt extends Stmt {
    type: 'var';
    name: Identifier;
    initializer: Expr | null;
}

interface BuildVarStmt<N extends Identifier, E extends Expr | null> extends VarStmt {
    name: N;
    initializer: E;
}
```

接下来是 `ParseStmt` 和 `ParseVarStmt` 函数：
```ts
type Parse<Tokens extends Token[], Stmts extends Stmt[] = []> =
    Tokens extends [EOF]
        ? Stmts
        : ParseDecl<Tokens> extends infer Result // <-- 变动
            ? Result extends ParseStmtSuccess<infer R, infer Rest>
                ? Parse<Rest, Push<Stmts, R>>
                : Result // error
            : NoWay<'Parse'>;

type ParseDecl<Tokens extends Token[]> =
    Tokens extends Match<TokenLike<'var'>, infer Rest>
        ? ParseVarStmt<Rest>
        : ParseStmt<Tokens>;

type ParseVarStmt<Tokens extends Token[]> =
    Tokens extends Match<infer VarName extends Identifier, infer Rest>
        ? Rest extends Match<TokenLike<';'>, infer Rest>
            ? ParseStmtSuccess<BuildVarStmt<VarName, null>, Rest>
            : Rest extends Match<TokenLike<'='>, infer Rest>
                ? ParseExpr<Rest> extends ParseExprSuccess<infer Exp, infer Rest>
                    ? Rest extends Match<TokenLike<';'>, infer Rest>
                        ? ParseStmtSuccess<BuildVarStmt<VarName, Exp>, Rest>
                        : ParseStmtError<'Expect ";" after var initializer expression.'>
                    : ParseStmtError<'Parse var initializer expression failed.'>
                : ParseStmtError<'Expect ";" or "=" after var name.'>
        : ParseStmtError<'Expect var name.'>;
```

`ParseVarStmt` 看起来很麻烦，但是它是按照 ts 版翻译过来的。由于 type 系统的语法糖少，写起来有些啰嗦。不过，还是能完成任务的。

我们完成了语法分析。该实现执行了。试想一下 `var a = 1; a + 2;`, 这个结果我们都知道是 3，因为 a 代表的值是 1。但表达式在执行时，是如何知道 a 代表的值是 1 呢？这就需要保存这个映射关系，然后表达式执行的时候，就能查到了。那么保存这个映射关系的就是环境。

##### 2.2.5.3 环境

环境可以存储当前变量对应的值。另外为了方便使用，我们建一个新类 `Environment`，并提供方便变量定义，查询以及赋值的接口。内部用 `Map` 来做存储。需要注意的是，定义变量时，如果已经存在就要提示已经定义的错误；查询时，没找到变量，要提示未定义的错误；赋值也是考虑未定义错误。
```ts
class Environment {
    private store: Map<string, ValueType>;

    constructor() {
        this.store = new Map<string, ValueType>();
    }

    define(name: Token, value: ValueType) {
        if (this.store.has(name.lexeme)) {
            throw new RuntimeError(`Variable '${name.lexeme}' is already defined.`);
        }

        this.store.set(name.lexeme, value);
    }

    get(name: Token): ValueType {
        let v = this.store.get(name.lexeme);

        if (v === undefined) {
            throw new RuntimeError(`Undefined variable '${name.lexeme}'.`);
        }

        return v;
    }

    assign(name: Token, value: ValueType) {
        if (this.store.has(name.lexeme)) {
            this.store.set(name.lexeme, value);
            return;
        }

        throw new RuntimeError(`Undefined variable '${name.lexeme}'.`);
    }
}
```


哈哈，ts 版本的 `Environment` 很容易实现。type 版本呢？

首先，没有变量，意味着没法修改。这样我们只能返回一个新的 `Environment`。存储我们用对象, `set` 时就是替换对象属性，并返回新对象。替换对象属性的代码如下：
```ts
type ReplaceObjProp<O extends {}, K extends string, V extends unknown> = Omit<O, K> & { [Key in K]: V };
```

掌握这个方法后，可以很方便的实现一个 `Map` 供 type 版的 `Environment`使用：
```ts
// 为了避免和 js 原生的 Map 重名，取名为 TocMap
type TocMap = { [key: string]: ValueType };

type MapSet<
    M extends TocMap,
    K extends string,
    V extends ValueType,
> = Omit<M, K> & { [Key in K]: V };

type MapGet<
    M extends TocMap,
    K extends string,
> = M[K];

type MapHas<
    M extends TocMap,
    K extends string,
> = K extends keyof M ? true : false;
```

接下来，实现 `Environment` 就容易了：
```ts
interface Environment {
    store: TocMap;
}

interface BuildEnv<
    Initializer extends TocMap = {},
> extends Environment {
    store: Initializer;
}

type EnvDefine<
    Env extends Environment,
    Key extends string,
    Value extends ValueType,
    Store extends TocMap = Env['store']
> = MapHas<Store, Key> extends true
    ? RuntimeError<`Variable '${Key}' already defined.`>
    : BuildEnv<MapSet<Store, Key, Value>>;

type EnvGet<
    Env extends Environment,
    Key extends string,
    Store extends TocMap = Env['store'],
> = MapHas<Store, Key> extends true
    ? MapGet<Store, Key>
    : RuntimeError<`Undefined variable '${Key}'.`>;

type EnvAssign<
    Env extends Environment,
    Key extends string,
    Value extends ValueType,
    Store extends TocMap = Env['store'],
> = MapHas<Store, Key> extends true
    ? BuildEnv<MapSet<Store, Key, Value>>
    : RuntimeError<`Undefined variable '${Key}'.`>;
```


type 版的 `Environment` 也准备好了。我们现在回头来实现 `var` 语句的执行部分，先是 ts 版。

解释器初始化时，就默认产生了一个环境。所以对 `Interpreter` 类做一点调整：
```ts
class Interpreter implements IExprVisitor<unknown>, IStmtVisitor<unknown> {
    private environment: Environment;

    constructor() {
        this.environment = new Environment();
    }
    // ...
}
```


接下来就是实现 `visitVarStmt` 了，要注意的是，`Toc` 对没有初始化的变量一律给 `null` 作为默认初始值：
```ts
class Interpreter implements IExprVisitor<unknown>, IStmtVisitor<unknown> {
    // ...

    visitVarStmt(stmt: VarStmt): ValueType {
        let initializer = null;
        if (stmt.initializer) {
            initializer = stmt.initializer.accept(this);
        }
        this.environment.define(stmt.name, initializer);
        return initializer;
    }

    // ...
}
```

😄很顺利！

再来实现 type 版。同样初始要有一个环境：
```ts
type Interpret<
    Stmts extends Stmt[],
    Env extends Environment = BuildEnv<{}>, // 添加 Env 入参
    LastResult extends ValueType | null = null,
> = Stmts extends [infer S extends Stmt, ...infer Rest extends Stmt[]]
        ? InterpretStmt<S, Env> extends infer R // InterpretStmt 也要携带参数 Env 😂
            ? R extends InterpretStmtSuccess<infer Result, infer Env> // 还要从结果中把 Env 取出来 🤦‍
                ? Interpret<Rest, Env, Result> // 携带参数 Env
                : R // error
            : NoWay<'Interpret'>
        : LastResult;
```

相信你感受到了，加 Env 不是那么容易的。我们要修改很多地方 😂。为什么呢？因为没有变量！我们无法修改全局，或者能访问的某个局部变量。所以一旦有修改 Env 的情况时，必须返回一个新的 Env。这样的话，某个函数怎么知道，它拿到的是最新的 Env 呢？🤷 只能在每个需要的函数上加一个入参 Env, 在调用它时传给它最新的 Env。😂在这里，我真的很想念变量啊！没办法，我们还要继续前行。我们只能绕。现在来总结一下，要加 Env, 要做哪些事情呢？简单来说就是：

**需要 Env 的函数，必须有 Env 的入参，返回值也必须包含 Env。**

到底我们需要修改多少函数呢？—— 可以说是 `Interpret` 相关的几乎所有函数😂。这里我们先贴一下关于 `Result` 的工具函数：
```ts
type InterpretStmtSuccess<Value extends ValueType, Env extends Environment> = SuccessResult<{ value: Value, env: Env }>;
type InterpretExprSuccess<Value extends ValueType, Env extends Environment> = SuccessResult<{ value: Value, env: Env }>;
```


然后是 `InterpretStmt` 和 `InterpretExpr`:
```ts
type InterpretStmt<S extends Stmt, Env extends Environment> =
    S extends ExprStmt
        ? InterpretExprStmt<S, Env>
        : InterpretStmtError<`Unsupported statement type: ${S['type']}`>;

type InterpretExpr<E extends Expr, Env extends Environment> =
    E extends LiteralExpr
        ? InterpretExprSuccess<E['value'], Env>
        : E extends GroupExpr
            ? InterpretExpr<E['expression'], Env>
            : E extends UnaryExpr
                ? EvalUnaryExpr<E, Env>
                : E extends BinaryExpr
                    ? EvalBinaryExpr<E, Env>
                    : RuntimeError<`Unknown expression type: ${E['type']}`>;
```


`InterpretExprStmt`:
```ts
type InterpretExprStmt<
    S extends ExprStmt,
    Env extends Environment,
    R = InterpretExpr<S['expression'], Env>
> =
    R extends InterpretExprSuccess<infer V, infer Env>
        ? InterpretStmtSuccess<V, Env>
        : R; // error
```


参考以上，其他函数的修改你应该不会有问题了。接下来我们就来完成 type 版的 `VarStmt` 执行函数：
```ts
type InterpretVarStmt<
    S extends VarStmt,
    Env extends Environment,
    Initializer = S['initializer']
> = Initializer extends Expr
    ? InterpretExpr<Initializer, Env> extends infer EV
        ? EV extends InterpretExprSuccess<infer V, infer Env>
            ? WrapVarStmtResult<V, EnvDefine<Env, S['name']['lexeme'], V>>
            : EV // error
        : NoWay<'InterpretVarStmt'>
    : WrapVarStmtResult<null, EnvDefine<Env, S['name']['lexeme'], null>>;

type WrapVarStmtResult<V extends ValueType, Env> = Env extends Environment
    ? InterpretStmtSuccess<V, Env>
    : Env; // error
```


当然别忘记了，`InterpretStmt` 要修改一下，调用 `InterpretVarStmt`:
```ts
type InterpretStmt<S extends Stmt, Env extends Environment> =
    S extends VarStmt
        ? InterpretVarStmt<S, Env>
        : S extends ExprStmt
            ? InterpretExprStmt<S, Env>
            : InterpretStmtError<`Unsupported statement type: ${S['type']}`>;
```

终于完成了声明变量的执行代码了😀。可是现在我们还不能跑起来耍耍，因为没有使用变量的地方，我们看不到效果，除非 debug。对于 ts 版还好说，type 版是没法 debug 的。所以接下来我们就来完成对变量赋值以及表达式中引用变量的支持。


##### 2.2.5.4 变量表达式和赋值表达式

前面我们做表达式的语法分析时，有一个优先级列表。现在我们加入这两种新的表达式：
```ts
// 表达式按照优先级由低到高：
// assign:      =                   右结合            <-- 新增
// logic or:    ||                  左结合
// logic and:   &&                  左结合
// equality:    == !=               左结合
// relation:    < > <= >=           左结合
// additive:    + -                 左结合
// factor:      * / %               左结合
// unary:       !                   右结合
// primary:     literal group identifier             <-- 新增 identifier
```


有了它我们直接按照之前套路来就可以了。我们先来看变量表达式。哈，变量表达式就是表达式是一个变量。举例 `var a = 2; a;`, 这里第二个语句的表达式就是一个变量表达式。

先定义类型：
```ts
type ExprType =
    | 'group'
    | 'binary'
    | 'unary'
    | 'literal'
    | 'assign' // <-- 新增
    | 'variable'; // <-- 新增

interface IExprVisitor<T> {
    // ...
    visitAssignExpr: (expr: AssignExpr) => T; // <-- 新增
    visitVariableExpr: (expr: VariableExpr) => T; // <-- 新增
}

class VariableExpr implements IExpr {
    type: ExprType = 'variable';
    name: Token;

    constructor(name: Token) {
        this.name = name;
    }

    accept<R>(visitor: IExprVisitor<R>): R {
        return visitor.visitVariableExpr(this);
    }
}
```


同步定义 type 版：
```ts
// ExprType 和 ts 版一样

interface VariableExpr extends Expr {
    type: 'variable';
    name: Identifier;
}

interface BuildVariableExpr<T extends Identifier> extends VariableExpr {
    name: T;
}
```


接下来是语法分析，先 ts 版：
```ts
class Parser {
    // ...

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
        // 新增开始
        } else if (this.match('identifier')) {
            return new VariableExpr(this.previous());
        // 新增结束
        } else if (this.match('(')) {
            const expr = this.expression(); // 注意这里递归调用了 expression()
            this.consume(')', 'Expect ")" after expression.');
            return new GroupExpr(expr);
        }

        throw new ParseError(`Expect expression, but got token: ${this.current().lexeme}.`);
    }

    // ...
}
```


type 版：
```ts
type ParsePrimary<Tokens extends Token[]> =
    Tokens extends Match<infer E extends Token, infer R>
        ? E extends { type: 'number', value: infer V extends number }
            ? ParseExprSuccess<BuildLiteralExpr<V>, R>
            : E extends { type: 'string', lexeme: infer V extends string }
                ? ParseExprSuccess<BuildLiteralExpr<V>, R>
                : E extends { type: infer B extends keyof Keywords }
                    ? ParseExprSuccess<BuildLiteralExpr<ToValue<B>>, R>
                    // 新增开始
                    : E extends Identifier
                        ? ParseExprSuccess<BuildVariableExpr<E>, R>
                    // 新增结束
                        : E extends TokenLike<'('>
                            ? ParseExpr<R> extends ParseExprSuccess<infer G, infer RG>
                                ? RG extends Match<TokenLike<')'>, infer Rest>
                                    ? ParseExprSuccess<BuildGroupExpr<G>, Rest>
                                    : ParseExprError<`Group not match ')'.`>
                                : ParseExprError<`Parse Group expression fail.`>
                            : ParseExprError<`Unknown token type: ${E['type']}, lexeme: ${E['lexeme']}`>
        : ParseExprError<`ParsePrimary fail`>;
```


好了，现在来支持赋值表达式。先定义类型，
ts 版本：
```ts
class AssignExpr implements IExpr {
    type: ExprType = 'assign';
    varName: Token;
    right: IExpr;

    constructor(varName: Token, right: IExpr) {
        this.varName = varName;
        this.right = right;
    }

    accept<R>(visitor: IExprVisitor<R>): R {
        return visitor.visitAssignExpr(this);
    }
}
```

type 版本：
```ts
interface AssignExpr extends Expr {
    type: 'assign';
    varName: Token;
    right: Expr;
}

interface BuildAssignExpr<N extends Identifier, E extends Expr> extends AssignExpr {
    varName: N;
    right: E;
}
```


下面进行语法分析。它的优先级最低，所以表达式起始就调用它，它再调用逻辑或函数。它的结合性是右结合，和逻辑反 `!` 一样，所以可以直接抄代码😀：
```ts
class Parser {
    // ...

    private expression(): IExpr {
        return this.assign();
    }

    private assign(): IExpr {
        const left = this.logicOr();
        if (this.match('=')) {
            const right = this.assign();

            if (left instanceof VariableExpr) {
                return new AssignExpr(left.name, right);
            }

            throw new ParseError('Invalid assignment target.');
        }
        return left;
    }

    // ...
}
```


同理，type 版的代码：
```ts
type ParseExpr<Tokens extends Token[]> = ParseAssign<Tokens>;

type ParseAssign<Tokens extends Token[], R = ParseLogicOr<Tokens>> =
    R extends ParseExprSuccess<infer Left, infer Rest>
        ? ParseAssignBody<Left, Rest>
        : R; // error

type ParseAssignBody<Left extends Expr, Tokens extends Token[]> =
Tokens extends Match<TokenLike<'='>, infer Rest>
    ? ParseAssign<Rest> extends ParseExprSuccess<infer Right, infer Rest>
        ? Left extends VariableExpr
            ? ParseExprSuccess<BuildAssignExpr<Left['name'], Right>, Rest>
            : ParseExprError<`Invalid assignment target: ${Left['type']}}`>
        : ParseExprError<`Parse right of assign variable fail: ${Rest[0]['lexeme']}`>
    : ParseExprSuccess<Left, Tokens>;
```


哈！现在可以开始"耍"(玩)变量了😀。


##### 2.2.5.5 作用域

我们下一个要实现的是块语句。它有一个重要的特点就是变量覆盖。什么意思呢？请看下面的例子：
```ts
var a = 1;
{
    var a = "abc";
    a; // "abc"

    {
        var a = false;
        a; // false

        a = 6;
        a; // 6
    }

    a; // "abc"
}
a; // 1
```

上面的代码大家已经司空见惯了。变量覆盖就是子作用域的变量屏蔽了父作用域的同名变量。那怎么实现这个效果呢？每个语句块都是一个新的作用域，作用域的实现其实就是环境。

只不过当前，我们的 `Environment` 没有父子嵌套的情况。现在我们就来支持它，只需要添加一个指向父环境的变量即可。最外面的环境的父环境为 `null`, 这里我把指向父环境的变量命名为 `outer`（我把父环境称为外部环境而已😀）:
```ts
class Environment {
    private store: Map<string, ValueType>;
    private outer: Environment | null;

    constructor(env: Environment | null) {
        this.store = new Map<string, ValueType>();
        this.outer = env;
    }

    // ...
}
```


同时，对外提供的 api 都要做一些调整。但 `define` 不用，因为定义只用关注当前作用域。`get` 在当前作用域找不到，就向外环境找。`assign` 也是一样：
```ts
class Environment {
    // ...

    get(name: Token): ValueType {
        let v = this.store.get(name.lexeme);
        // 新增开始
        if (v === undefined && this.outer) {
            v = this.outer.get(name);
        }
        // 新增结束

        if (v === undefined) {
            throw new RuntimeError(`Undefined variable '${name.lexeme}'.`);
        }

        return v;
    }

    assign(name: Token, value: ValueType) {
        if (this.store.has(name.lexeme)) {
            this.store.set(name.lexeme, value);
            return;
        }

        // 新增开始
        if (this.outer) {
            this.outer.assign(name, value);
            return;
        }
        // 新增结束

        throw new RuntimeError(`Undefined variable '${name.lexeme}'.`);
    }
}
```


type 版， 也是一样。先添加指向外围环境的常量：
```ts
interface Environment {
    store: TocMap;
    outer: Environment | null; // <-- 新增
}

export interface BuildEnv<
    Initializer extends TocMap = {},
    Outer extends Environment | null = null, // <-- 新增
> extends Environment {
    store: Initializer;
    outer: Outer; // <-- 新增
}
```


再修改 `EnvGet` 和 `EnvAssign` 的实现：
```ts
type EnvGet<
    Env extends Environment,
    Key extends string,
    Store extends TocMap = Env['store'],
    Outer = Env['outer'],
> = MapHas<Store, Key> extends true
    ? MapGet<Store, Key>
    // 新增开始
    : Outer extends Environment
        ? EnvGet<Outer, Key>
    // 新增结束
        : RuntimeError<`Undefined variable '${Key}'.`>;

type EnvAssign<
    Env extends Environment,
    Key extends string,
    Value extends ValueType,
    Store extends TocMap = Env['store'],
    Outer extends Environment | null = Env['outer'],
> = MapHas<Store, Key> extends true
    ? BuildEnv<MapSet<Store, Key, Value>, Outer>
    // 新增开始
    : Outer extends Environment
        ? EnvAssign<Outer, Key, Value> extends infer NewOuter
            ? NewOuter extends Environment
                ? BuildEnv<Store, NewOuter>
                : NewOuter // error
            : NoWay<'EnvAssign'>
    // 新增结束
        : RuntimeError<`Undefined variable '${Key}'.`>;
```


最后别忘了，创建修改初始 `Environment` 时，需要传一个 `outer` 参数，由于是最外层，所以直接给 `null` 值。


##### 2.2.5.6 block 语句

现在我们可以开始实现块语句的语法分析了。首先来定义类型, ts 版：
```ts
class BlockStmt implements IStmt {
    type: 'block' = 'block';
    stmts: IStmt[];

    constructor(stmts: IStmt[]) {
        this.stmts = stmts;
    }

    accept<R>(visitor: IStmtVisitor<R>): R {
        return visitor.visitBlockStmt(this);
    }
}
```


type 版：
```ts
interface BlockStmt extends Stmt {
    type: 'block';
    stmts: Stmt[];
}

interface BuildBlockStmt<Stmts extends Stmt[]> extends BlockStmt {
    stmts: Stmts;
}
```


现在来看语法分析代码。ts 版：
```ts
class Parser {
    // ...

    private statement(): IStmt {
        // 新增开始
        if (this.match('{')) {
            return this.blockStatement();
        }
        // 新增结束

        return this.expressionStatement();
    }

    private blockStatement(): BlockStmt {
        const stmts: IStmt[] = [];
        while(!this.isAtEnd() && !this.match('}')) {
            stmts.push(this.declaration());
        }

        if (this.previous().type !== '}') {
            throw new ParseError('Expect "}" end the block.');
        }

        return new BlockStmt(stmts);
    }

    // ...
}
```


type 版：
```ts
type ParseStmt<Tokens extends Token[]> =
    // 新增开始
    Tokens extends Match<TokenLike<'{'>, infer Rest>
        ? ParseBlockStmt<Rest>
        // 新增结束
        : ParseExprStmt<Tokens>;

type ParseBlockStmt<
    Tokens extends Token[],
    Stmts extends Stmt[] = [],
> = Tokens extends [EOF]
    ? ParseStmtError<'Expect "}" close block statement.'>
    : Tokens extends Match<TokenLike<'}'>, infer Rest>
        ? ParseStmtSuccess<BuildBlockStmt<Stmts>, Rest>
        : ParseBlockStmtBody<ParseDecl<Tokens>, Stmts>;

type ParseBlockStmtBody<SR, Stmts extends Stmt[]> =
    SR extends ParseStmtSuccess<infer S, infer R>
        ? ParseBlockStmt<R, Push<Stmts, S>>
        : SR; // error
```


语法分析搞定。再来写执行阶段。对于 ts 版，就是实现 `visitBlockStmt`。在执行块内语句之前，要产生一个新环境，执行完之后，还要恢复到之前的环境。
```ts
class Interpreter implements IExprVisitor<unknown>, IStmtVisitor<unknown> {
    // ...

    visitBlockStmt(blockStmt: BlockStmt): ValueType {
        const previousEnv = this.environment;

        try {
            this.environment = new Environment(previousEnv);

            let lastResult: ValueType = null;
            for (const stmt of blockStmt.stmts) {
                lastResult = stmt.accept(this);
            }
            return lastResult;
        } finally {
            this.environment = previousEnv;
        }
    }

    // ...
}
```


下面该 type 版。看这里如何保证执行块语句用新环境，执行完后用旧环境。这里又个陷阱。你不能按照 ts 版本的代码来翻译。二者从语言层面有重大差异，这里没有变量，无法修改已有的环境。举个例子，在块语句中修改了外部环境的某个变量，那么块语句执行完后，虽然恢复到之前的环境。但对于 ts 版本来说，恢复的环境和原来还完全一样吗？当然不一样了，里面的那个变量的值变了。所以说恢复，仅仅是引用恢复。那么对于 type 版，该怎么处理呢？按照这个例子，修改外部环境后，type 版中的 `Env` 要新生成一个，`outer` 指向的外部环境也是新生成的，它包含了变量的新值。所以在执行完块语句后，要“恢复”的外部环境就是 `Env['outer']`。
```ts
type InterpretStmt<S extends Stmt, Env extends Environment> =
    S extends VarStmt
        ? InterpretVarStmt<S, Env>
        : S extends ExprStmt
            ? InterpretExprStmt<S, Env>
            : S extends BlockStmt
                ? InterpretBlockStmt<S['stmts'], BuildEnv<{}, Env>>
                : InterpretStmtError<`Unsupported statement type: ${S['type']}`>;

type InterpretBlockStmt<
    Stmts extends Stmt[],
    NewEnv extends Environment,
    LastResult extends ValueType = null
> = Stmts extends [infer S extends Stmt, ...infer Rest extends Stmt[]]
    ? InterpretBlockStmtBody<InterpretStmt<S, NewEnv>, Rest>
    : InterpretStmtSuccess<LastResult, Safe<NewEnv['outer'], Environment>>;

type InterpretBlockStmtBody<
    RV,
    Rest extends Stmt[],
> =
    RV extends InterpretStmtSuccess<infer V, infer NewEnv>
        ? InterpretBlockStmt<Rest, NewEnv, V>
        : RV; // error
```


啊！我们完成块语句了。着前进了一大步，后续的 `if` 语句，`for` 语句，还有函数都需要它。

##### 2.2.5.7 if 语句

说到对条件控制的支持，我们目前的 `Toc` 就已经有了。没错，就是逻辑与和逻辑或。通过它们的短路能力，你已经可以实现类似 `if-else` 语句的能力了。但是我想你在实现 type 版的 `Toc` 时，已经深深感觉到，缺“糖”的语法写起来有多么啰嗦和枯燥。所以我们还是要实现 `if` 语句。

还是一样，先定义语句的类型：
```ts
class IfStmt implements IStmt {
    type: 'if' = 'if';
    condition: IExpr;
    ifClause: IStmt;
    elseClause: IStmt | null;

    constructor(
        cond: IExpr,
        ifClause: IStmt,
        elseClause: IStmt | null = null) {
        this.condition = cond;
        this.ifClause = ifClause;
        this.elseClause = elseClause;
    }

    accept<R>(visitor: IStmtVisitor<R>): R {
        return visitor.visitIfStmt(this);
    }
}
```


type 版本：
```ts
interface IfStmt extends Stmt {
    type: 'if';
    condition: Expr;
    ifClause: Stmt;
    elseClause: Stmt | null;
}

interface BuildIfStmt<
    Condition extends Expr,
    IfClause extends Stmt,
    ElseClause extends Stmt | null = null
> extends IfStmt {
    condition: Condition;
    ifClause: IfClause;
    elseClause: ElseClause;
}
```


现在开始语法分析。
```ts
class Parser {
    // ...

    private statement(): IStmt {
        if (this.match('{')) {
            return this.blockStatement();
        // 新增开始
        } else if (this.match('if')) {
            return this.ifStatement();
        // 新增结束
        }

        return this.expressionStatement();
    }

    private ifStatement(): IfStmt {
        this.consume('(', 'Expect "(" before if condition.');
        const condition = this.expression();
        this.consume(')', 'Expect ")" after if condition.');
        const ifClause = this.statement();
        let elseClause = null;
        if (this.match('else')) {
            elseClause = this.statement();
        }
        return new IfStmt(condition, ifClause, elseClause);
    }

    // ...
}
```

不知道你有没有意识到一个问题。就是 `if-else` 配对问题。比如代码：
```ts
var a = 1;
if (a > 1) if (a == 1) a = 0; else a = 10;
a; // ?
```

你认为 `a` 值因该是什么呢？我们列出两种结果对应的配对：
```ts
// a = 1 对应如下：
if (a > 1) {
    if (a == 1) {
        a = 0;
    } else {
        a = 10;
    }
}

// a = 10 对应如下：
if (a > 1) {
    if (a == 1) {
        a = 0;
    }
} else {
    a = 10;
}
```

哪个是对的呢？哦，我们是语言设计者，或许应该说，我们要哪个？我的答案是和常见的语言一致。也就是采取第一种。常见的语言都是采用，将 `else` 与最接近 `if` 配对。这样的话，我们的代码就不用修改了，它已经是如此！

好了，该实现 type 版了：
```ts
type ParseStmt<Tokens extends Token[]> =
    Tokens extends Match<TokenLike<'{'>, infer Rest>
        ? ParseBlockStmt<Rest>
        // 新增开始
        : Tokens extends Match<TokenLike<'if'>, infer Rest>
            ? ParseIfStmt<Rest>
        // 新增结束
            : ParseExprStmt<Tokens>;

type ParseIfStmt<
    Tokens extends Token[],
> = Tokens extends Match<TokenLike<'('>, infer Rest>
    ? ParseExpr<Rest> extends infer ER
        ? ER extends ParseExprSuccess<infer Condition, infer Rest>
            ? Rest extends Match<TokenLike<')'>, infer Rest>
                ? ParseStmt<Rest> extends infer IfSR
                    ? IfSR extends ParseStmtSuccess<infer IfClause, infer Rest>
                        ? Rest extends Match<TokenLike<'else'>, infer Rest>
                            ? ParseStmt<Rest> extends infer ElseSR
                                ? ElseSR extends ParseStmtSuccess<infer ElseClause, infer Rest>
                                    ? ParseStmtSuccess<BuildIfStmt<Condition, IfClause, ElseClause>, Rest>
                                    : ElseSR // error
                                : NoWay<'ParseIfStmt-ParseStmt-else'>
                            : ParseStmtSuccess<BuildIfStmt<Condition, IfClause, null>, Rest>
                        : IfSR // error
                    : NoWay<'ParseIfStmt-ParseStmt-if'>
                : ParseStmtError<'Expect ")" after if condition.'>
            : ER // error
        : NoWay<'ParseIfStmt-ParseExpr'>
    : ParseStmtError<'Expect "(" before if condition.'>;
```

`ParseIfStmt` 看起来是目前 type 版中最复杂的函数了。主要原因是，语法细节一旦增多，在 type 下描述起来就啰嗦。后面的 `for` 和 `fun` 更是如此。

现在来看执行阶段。ts 版仍然是实现对应的“访问”函数：
```ts
class Interpreter {
    // ...

    visitIfStmt(stmt: IfStmt): ValueType {
        const cond = stmt.condition.accept(this);
        if (cond) {
            return stmt.ifClause.accept(this);
        } else if (stmt.elseClause) {
            return stmt.elseClause.accept(this);
        }
        return null;
    }

    // ...
}
```

很简洁吧。

现在看看 type 版：
```ts
type InterpretStmt<S extends Stmt, Env extends Environment> =
    S extends VarStmt
        ? InterpretVarStmt<S, Env>
        : S extends ExprStmt
            ? InterpretExprStmt<S, Env>
            : S extends BlockStmt
                ? InterpretBlockStmt<S['stmts'], BuildEnv<{}, Env>>
                : S extends IfStmt
                    ? InterpretIfStmt<S, Env>
                    : InterpretStmtError<`Unsupported statement type: ${S['type']}`>;


type InterpretIfStmt<
    S extends IfStmt,
    Env extends Environment,
> = InterpretExpr<S['condition'], Env> extends infer CR
    ? CR extends InterpretExprSuccess<infer C, infer Env>
        ? IsTrue<C> extends true
            ? InterpretStmt<S['ifClause'], Env>
            : S['elseClause'] extends Stmt
                ? InterpretStmt<S['elseClause'], Env>
                : InterpretStmtSuccess<null, Env>
        : CR // error
    : NoWay<'InterpretIfStmt'>;
```

还好，type 版也算简洁。


##### 2.2.5.8 for 语句

`for` 语句有着比 `if` 语句更多语法细节。这意味着，它在语法分析时会更麻烦一些。我们先来看看类型定义：
```ts
class ForStmt implements IStmt {
    type: 'for' = 'for';
    initializer: IStmt | null;
    condition: IExpr | null;
    increment: IExpr | null;
    body: IStmt;

    constructor(
        initializer: IStmt | null,
        condition: IExpr | null,
        increment: IExpr | null,
        body: IStmt) {
        this.initializer = initializer;
        this.condition = condition;
        this.increment = increment;
        this.body = body;
    }

    accept<R>(visitor: IStmtVisitor<R>): R {
        return visitor.visitForStmt(this);
    }
}
```


type 版：
```ts
interface ForStmt extends Stmt {
    type: 'for';
    initializer: Stmt | null;
    condition: Expr | null;
    increment: Expr | null;
    body: Stmt;
}

interface BuildForStmt<
    Initializer extends Stmt | null,
    Condition extends Expr | null,
    Increment extends Expr | null,
    Body extends Stmt,
> extends ForStmt {
    initializer: Initializer;
    condition: Condition;
    increment: Increment;
    body: Body;
}
```


接下来是语法分析：
```ts
class Parser {
    // ...

    private statement(): IStmt {
        if (this.match('{')) {
            return this.blockStatement();
        } else if (this.match('if')) {
            return this.ifStatement();
        // 新增开始
        } else if (this.match('for')) {
            return this.forStatement();
        // 新增结束
        }
        return this.expressionStatement();
    }

    private forStatement() {
        this.consume('(', 'Expect "(" after for keyword.');

        let initializer: IStmt | null;
        if (this.match(';')) {
            initializer = null;
        } else if (this.match('var')) {
            initializer = this.varDeclaration();
        } else {
            initializer = this.expressionStatement();
        }

        let condition: IExpr | null;
        if (this.match(';')) {
            condition = null;
        } else {
            condition = this.expression();
            this.consume(';', 'Expect ";" after for condition.');
        }

        let increment: IExpr | null;
        if (this.match(')')) {
            increment = null;
        } else {
            increment = this.expression();
            this.consume(')', 'Expect ")" after for increment.');
        }

        const body = this.statement();
        return new ForStmt(initializer, condition, increment, body);
    }

    // ...
}
```


我们可以看到，这个比 `if` 语句要长一些。可以预见 type 版本会比较长。好在这里比较好拆分为更小的函数，这样看起来不至于很“爆炸”：
```ts
type ParseStmt<Tokens extends Token[]> =
    Tokens extends Match<TokenLike<'{'>, infer Rest>
        ? ParseBlockStmt<Rest>
        : Tokens extends Match<TokenLike<'if'>, infer Rest>
            ? ParseIfStmt<Rest>
            // 新增开始
            : Tokens extends Match<TokenLike<'for'>, infer Rest>
                ? ParseForStmt<Rest>
                // 新增结束
                : ParseExprStmt<Tokens>;


type ParseForStmt<
    Tokens extends Token[],
> = Tokens extends Match<TokenLike<'('>, infer Rest>
    ? Rest extends Match<TokenLike<';'>, infer Rest>
        ? ParseForStmtFromCondition<Rest, null>
        : Rest extends Match<TokenLike<'var'>, infer Rest>
            ? ParseForStmtFromInitializerResult<ParseVarStmt<Rest>>
            : ParseForStmtFromInitializerResult<ParseExprStmt<Rest>>
    : ParseStmtError<'Expect "(" after for keyword.'>;

type ParseForStmtFromInitializerResult<IR> =
    IR extends ParseStmtSuccess<infer Initializer, infer Rest>
        ? ParseForStmtFromCondition<Rest, Initializer>
        : IR; // error

type ParseForStmtFromCondition<
    Tokens extends Token[],
    Initializer extends Stmt | null,
> = Tokens extends Match<TokenLike<';'>, infer Rest>
    ? ParseForStmtFromIncrement<Rest, Initializer, null>
    : ParseExpr<Tokens> extends infer CR
        ? CR extends ParseExprSuccess<infer Condition, infer Rest>
            ? Rest extends Match<TokenLike<';'>, infer Rest>
                ? ParseForStmtFromIncrement<Rest, Initializer, Condition>
                : ParseStmtError<'Expect ";" after for condition.'>
            : CR // error
        : NoWay<'ParseForStmtFromCondition'>

type ParseForStmtFromIncrement<
    Tokens extends Token[],
    Initializer extends Stmt | null,
    Condition extends Expr | null,
> = Tokens extends Match<TokenLike<')'>, infer Rest>
    ? ParseForStmtFromBody<Rest, Initializer, Condition, null>
    : ParseExpr<Tokens> extends infer IR
        ? IR extends ParseExprSuccess<infer Increment, infer Rest>
            ? Rest extends Match<TokenLike<')'>, infer Rest>
                ? ParseForStmtFromBody<Rest, Initializer, Condition, Increment>
                : ParseStmtError<'Expect ")" after for increment.'>
            : IR // error
        : NoWay<'ParseForStmtFromIncrement'>;

type ParseForStmtFromBody<
    Tokens extends Token[],
    Initializer extends Stmt | null,
    Condition extends Expr | null,
    Increment extends Expr | null,
    BR = ParseStmt<Tokens>,
> = BR extends ParseStmtSuccess<infer Body, infer Rest>
    ? ParseStmtSuccess<BuildForStmt<Initializer, Condition, Increment, Body>, Rest>
    : BR; // error
```


现在开始编写执行代码：
```ts
class Interpreter implements IExprVisitor<unknown>, IStmtVisitor<unknown> {
    // ...

    visitForStmt(stmt: ForStmt): ValueType {
        const previousEnv = this.environment;
        this.environment = new Environment(this.environment);

        if (stmt.initializer) {
            stmt.initializer.accept(this);
        }

        let conditionResult: ValueType = true;
        if (stmt.condition) {
            conditionResult = stmt.condition.accept(this);
        }

        let result: ValueType = null;
        while (conditionResult) {
            result = stmt.body.accept(this);
            if (stmt.increment) {
                stmt.increment.accept(this);
            }
            if (stmt.condition) {
                conditionResult = stmt.condition.accept(this);
            }
        }

        this.environment = previousEnv;
        return result;
    }

    // ...
}
```

`for` 语句有类似 `block` 语句需要新建环境的问题。所以在 type 版本中，要注意这方面的正确处理：
```ts
type InterpretStmt<S extends Stmt, Env extends Environment> =
    S extends VarStmt
        ? InterpretVarStmt<S, Env>
        : S extends ExprStmt
            ? InterpretExprStmt<S, Env>
            : S extends BlockStmt
                ? InterpretBlockStmt<S['stmts'], BuildEnv<{}, Env>>
                : S extends IfStmt
                    ? InterpretIfStmt<S, Env>
                    // 新增开始
                    : S extends ForStmt
                        ? InterpretForStmt<S, BuildEnv<{}, Env>>
                        // 新增结束
                        : InterpretStmtError<`Unsupported statement type: ${S['type']}`>;

type InterpretForStmt<
    S extends ForStmt,
    NewEnv extends Environment,
> = S['initializer'] extends Stmt
    ? InterpretStmt<S['initializer'], NewEnv> extends infer IR
        ? IR extends InterpretStmtSuccess<infer IV, infer NewEnv>
            ? InterpretForStmtFromCondition<S, NewEnv>
            : IR // error
        : NoWay<'InterpretForStmt'>
    : InterpretForStmtFromCondition<S, NewEnv>;

type InterpretForStmtFromCondition<
    S extends ForStmt,
    NewEnv extends Environment,
    BV extends ValueType = null,
> = S['condition'] extends Expr
    ? InterpretExpr<S['condition'], NewEnv> extends infer CR
        ? CR extends InterpretExprSuccess<infer CV, infer NewEnv>
            ? InterpretForStmtFromConditionValue<S, NewEnv, CV, BV>
            : CR // error
        : NoWay<'InterpretForStmtFromCondition-InterpretExpr'>
    : InterpretForStmtFromConditionValue<S, NewEnv, true, BV>;

type InterpretForStmtFromConditionValue<
    S extends ForStmt,
    NewEnv extends Environment,
    CV extends ValueType,
    BV extends ValueType = null,
> = IsTrue<CV> extends true
    ?  InterpretStmt<S['body'], NewEnv> extends infer BR
        ? BR extends InterpretStmtSuccess<infer BV, infer NewEnv>
            ? S['increment'] extends Expr
                ? InterpretExpr<S['increment'], NewEnv> extends infer IR
                    ? IR extends InterpretExprSuccess<infer IV, infer NewEnv>
                        ? InterpretForStmtFromCondition<S, NewEnv, BV>
                        : IR // error
                    : NoWay<'InterpretForStmtFromConditionValue-Increment'>
                : InterpretForStmtFromCondition<S, NewEnv, BV>
            : BR // error
        : NoWay<'InterpretForStmtFromConditionValue-Body'>
    : InterpretStmtSuccess<BV, Safe<NewEnv['outer'], Environment>>;
```

哈！我们艰难的完成 `for` 语句。至此我们的 `Toc` 解释器已经[图灵完备](https://en.wikipedia.org/wiki/Turing_completeness)了。拥有了分支和循环，我们的 `Toc` 程序从理论上就可求解任何[可计算问题](https://en.wikipedia.org/wiki/Computable_function)。现实的情况是，`ts-toc` 的确可以。但 `type-toc` 却不行。为什么呢？我在前面讲类型系统中的递归时，提到过，类型系统中的递归是有最大深度限制的。这意味者一个比较耗时的计算问题，是无法在这种有限的“时间”下完成的。现在你可以去试试，`type-toc` 写的 `for` 循环能循环多少次？我自己编写了一个简单的测试，如下：
```ts
type Result = Toc<`
    var x = 0;
    var i = 1;
    for (; i < 5; i=i+1)
        x = x + i;
`>
```


当我把 `i < 5` 改为 `i < 6` 就会提示：

`Type instantiation is excessively deep and possibly infinite.ts(2589)`

😂确实很遗憾！不过我们至少验证了我们的想法——ts 的类型系统是可以实现解释器的。或许在未来，随着 ts 编译器的不断改善，这种限制会逐渐减小。或者作为的读者的你，有什么好的优化方法能改善当前的局面，也请随时告诉我，我很想知道😊！

好了，我们休整后，就向本次的终点——函数出发。


#### 2.2.6 函数

在此之前，虽然可以顺利编写程序，但却没办法复用代码。软件工程的核心之一就是 [Don't repeat yourself](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)。我把 `Toc` 的函数设计成 [First-Class-Function](https://en.wikipedia.org/wiki/First-class_function)，希望它有较强的抽象和表达能力。

##### 2.2.6.1 函数语句

和前面一样，我们先来定义函数语句类型：
```ts
class FunStmt implements IStmt {
    type: 'fun' = 'fun';
    name: Token;
    parameters: Token[];
    body: BlockStmt;

    constructor(name: Token, parameters: Token[], body: BlockStmt) {
        this.name = name;
        this.parameters = parameters;
        this.body = body;
    }

    accept<R>(visitor: IStmtVisitor<R>): R {
        return visitor.visitFunStmt(this);
    }
}
```


type 版：
```ts
interface FunStmt extends Stmt {
    type: 'fun';
    name: Token;
    parameters: Token[];
    body: BlockStmt;
}

interface BuildFunStmt<
    Name extends Identifier,
    Parameters extends Identifier[],
    Body extends BlockStmt,
> extends FunStmt {
    name: Name;
    parameters: Parameters;
    body: Body;
}
```


接下来是语法分析：
```ts
class Parser {
    // ...

    private declaration() {
        if (this.match('var')) {
            return this.varDeclaration();
        } else if (this.match('fun')) {
            return this.funDeclaration();
        }

        return this.statement();
    }

    private funDeclaration() {
        this.consume('identifier', `Expect function name.`);
        const name = this.previous();
        this.consume('(', `Expect '(' after function name.`);
        let params: Token[] = [];
        if (!this.match(')')) {
            params = this.parameters();
            this.consume(')', `Expect ')' after function parameters.`);
        }
        this.consume('{', `Expect '{' before function body.`);
        const body = this.blockStatement();
        return new FunStmt(name, params, body);
    }

    private parameters(): Token[] {
        const params: Token[] = [];
        do {
            this.consume('identifier', 'Expect parameter name.');
            params.push(this.previous());
        } while(this.match(','))
        return params;
    }

    // ...
}
```


type 版，由于函数的语法复杂一点，所以这里代码就要长不少：
```ts
type ParseDecl<Tokens extends Token[]> =
    Tokens extends Match<TokenLike<'var'>, infer Rest>
        ? ParseVarStmt<Rest>
        // 新增开始
        : Tokens extends Match<TokenLike<'fun'>, infer Rest>
            ? ParseFunStmt<Rest>
            // 新增结束
            : ParseStmt<Tokens>;


type ParseFunStmt<
    Tokens extends Token[],
> = Tokens extends Match<infer Name extends Identifier, infer Rest>
    ? ParseFunParams<Rest> extends infer PR
        ? PR extends Match<infer Params extends Identifier[], infer Rest>
            ? Rest extends Match<TokenLike<'{'>, infer Rest>
                ? ParseBlockStmt<Rest> extends infer BR
                    ? BR extends ParseStmtSuccess<infer Body extends BlockStmt, infer Rest>
                        ? ParseStmtSuccess<BuildFunStmt<Name, Params, Body>, Rest>
                        : BR // error
                    : NoWay<'ParseFunStmt-ParseBlockStmt'>
                : PR // error
            : ParseStmtError<`Expect '{' before function body.`>
        : NoWay<'ParseFunStmt-ParseFunParams'>
    : ParseStmtError<`Expect function name, but got: ${Tokens[0]['type']}`>;

type ParseFunParams<
    Tokens extends Token[],
> = Tokens extends Match<TokenLike<'('>, infer Rest>
    ? Rest extends Match<TokenLike<')'>, infer Rest>
        ? [[], ...Rest]
        : ParseFunParamsCore<Rest> extends infer PR
            ? PR extends Match<infer Params extends Identifier[], infer Rest>
                ? Rest extends Match<TokenLike<')'>, infer Rest>
                    ? [Params, ...Rest]
                    : ParseStmtError<`Expect ')', but got: ${Rest[0]['type']}`>
                : PR // error
            : NoWay<'ParseFunParams-ParseFunParamsCore'>
    : ParseStmtError<`Expect '(', but got: ${Tokens[0]['type']}`>;

type ParseFunParamsCore<
    Tokens extends Token[],
    Params extends Identifier[] = [],
> = Tokens extends Match<infer P extends Identifier, infer Rest>
    ? Rest extends Match<TokenLike<','>, infer Rest>
        ? ParseFunParamsCore<Rest, Push<Params, P>>
        : [Push<Params, P>, ...Rest]
    : ParseStmtError<`Expect param name, but got: ${Tokens[0]['type']}`>;
```


该执行阶段了。前面的表达式计算或者其他语句执行，最终的结果都是基础数据类型。现在声明一个函数，那么赋给函数名这个变量的，将不再是一个基础类型了，而是一个函数对象。这个函数对象包含什么呢？首先，必然包含了 `FunStmt`， 因为 `FunStmt` 记录了函数的参数、函数体，没有这些信息就无法在函数调用时执行。这样就够了吗？我们的函数支持闭包，请看下面的例子：
```ts
var inc3;
{
    var n = 3;
    fun inc(x) {
        x + n;
    }
    inc3 = inc;
}

inc3(2);
```

`inc3(2)` 执行的结果是5, 它其实是调用的 `inc` 函数，`inc` 函数记住了它所处环境中变量 `n` 的值，或者说 `inc` 函数记住了它的环境。所以函数对象还应该包含一个函数所处的环境。

```ts
class FunObject {
    private declaration: FunStmt;
    private environment: Environment;

    constructor(declaration: FunStmt, env: Environment) {
        this.declaration = declaration;
        this.environment = env;
    }
}
```


type 版：
```ts
type FunObject = {
    declaration: FunStmt;
    environment: Environment;
};

export type BuildFunObj<
    D extends FunStmt,
    E extends Environment,
> = {
    declaration: D,
    environment: E,
};
```


`FunObject` 已经定义出来了。但是还有个问题，我们刚说这个对象要赋给变量，那么我们需要修改 `ValueType` 了，就是说变量的值类型增加了，表达式中也可以包含函数对象类型来运算了：
```ts
type ValueType =
    | FunObject
    | string
    | number
    | boolean
    | null;
```

这样和 `literal` 有关的两个地方需要修改，下面只列举 ts 版：
```ts
class LiteralExpr implements IExpr {
    type: ExprType = 'literal';
    value: Exclude<ValueType, FunObject>; // 修改

    constructor(value: Exclude<ValueType, FunObject>) { // 修改
        this.value = value;
    }
}

class Interpreter implements IExprVisitor<unknown>, IStmtVisitor<unknown> {
    // ...

    visitLiteralExpr(expr: LiteralExpr): Exclude<ValueType, FunObject> { // 修改
        return expr.value;
    }

    // ...
}
```


好了，现在我们来实现 `visitFunStmt` 函数：
```ts
class Interpreter implements IExprVisitor<unknown>, IStmtVisitor<unknown> {
    // ...

    visitFunStmt(stmt: FunStmt): FunObject {
        const funObj = new FunObject(stmt, this.environment);
        this.environment.define(stmt.name, funObj);
        return funObj;
    }

    // ...
}
```

是不是很简单！在来看 type 版：

```ts
type InterpretStmt<S extends Stmt, Env extends Environment> =
    S extends VarStmt
        ? InterpretVarStmt<S, Env>
        : S extends ExprStmt
            ? InterpretExprStmt<S, Env>
            : S extends BlockStmt
                ? InterpretBlockStmt<S['stmts'], BuildEnv<{}, Env>>
                : S extends IfStmt
                    ? InterpretIfStmt<S, Env>
                    // 新增开始
                    : S extends FunStmt
                        ? InterpretFunStmt<S, Env>
                        // 新增结束
                        : S extends ForStmt
                            ? InterpretForStmt<S, BuildEnv<{}, Env>>
                            : InterpretStmtError<`Unsupported statement type: ${S['type']}`>;

type InterpretFunStmt<
    S extends FunStmt,
    Env extends Environment,
    F extends FunObject = BuildFunObj<S, Env>,
> = EnvDefine<Env, S['name']['lexeme'], F> extends infer NewEnv
    ? NewEnv extends Environment
        ? InterpretStmtSuccess<F, NewEnv>
        : NewEnv // error
    : NoWay<'InterpretFunStmt'>;
```

也很简单对不对！

不过还有个问题，请看下面的代码：
```ts
fun a() {}
a; // 这里输出什么呢？
```

你或许说输出函数对象呀！是的没错。但是给人“看”这个对象恐怕不太好，需要显示成一个便于人阅读的形式。所以要添加一个 `toString` 的函数，用来显示这是一个函数，包含它的名字和参数名列表。
```ts
class FunObject {
    // ...

    toString() {
        const { name, parameters } = this.declaration;
        const params = parameters.map(t => t.lexeme).join(', ');
        return `<fun ${name.lexeme}(${params})>`;
    }
}
```

这样以后， ts-toc 输出到控制台时，就会自动调用 `toString` 方法。

再来看看 type 版，也是添加一个 `toString` 方法：
```ts
type FunObjToString<
    F extends FunObject,
    D extends FunStmt = F['declaration']
> = `<fun ${GetFunName<F>}(${ParamsToString<D['parameters']>})>`;

type GetFunName<F extends FunObject> = F['declaration']['name']['lexeme'];

type ParamsToString<
    Params extends Token[],
    Result extends string = '',
> = Params extends [infer T extends Token, ...infer R extends Token[]]
    ? ParamsToString<R, Combine<Result, T['lexeme']>>
    : Result;
type Combine<
    A extends string,
    B extends string,
> = A extends ''
    ? B
    : `${A}, ${B}`;
```

这里要注意的是，type-toc 并不会自动调用这个函数，所以我们要修改 `Toc` 函数：
```ts
type Toc<Source extends string> =
    Scan<Source> extends infer Tokens
        ? Tokens extends Token[]
            ? Parse<Tokens> extends infer Stmts
                ? Stmts extends Stmt[]
                    // 修改开始
                    ? Interpret<Stmts> extends infer Value
                        ? Value extends FunObject
                            ? FunObjToString<Value>
                            : Value
                        : NoWay<'Toc-Interprets'>
                        // 修改结束
                    : Stmts // error
                : NoWay<'Toc-Parse'>
            : Tokens // error
        : NoWay<'Toc-Scan'>;
```


好了，以上我们就完成了函数的声明语句。现在还差最后一步——函数调用。函数调用是一个表达式，接下来就来处理它。


##### 2.2.6.2 call 表达式

要支持函数表达式，首先要加入这个类型：
```ts
type ExprType =
    // ...
    | 'call'; // <-- 新增
```


函数调用时，主要有被调用者和函数参数（当然可空）。依此我们定义表达式类型：
```ts
class CallExpr implements IExpr {
    type: ExprType = 'call';
    callee: IExpr;
    args: IExpr[];

    constructor(callee: IExpr, args: IExpr[]) {
        this.callee = callee;
        this.args = args;
    }

    accept<R>(visitor: IExprVisitor<R>): R {
        return visitor.visitCallExpr(this);
    }
}
```


type 版：
```ts
interface CallExpr extends Expr {
    type: 'call';
    callee: Expr;
    arguments: Expr[];
}

interface BuildCallExpr<Callee extends Expr, Args extends Expr[]> extends CallExpr {
    callee: Callee;
    arguments: Args;
}
```


接下来我们把函数调用加入到表达式优先级列表中：
```ts
// 表达式按照优先级由低到高：
// logic or:    ||                  左结合
// logic and:   &&                  左结合
// equality:    == !=               左结合
// relation:    < > <= >=           左结合
// additive:    + -                 左结合
// factor:      * / %               左结合
// unary:       !                   右结合
// call:        primary(arg?)       左结合        〈=== 新增
// primary:     literal group
```


有了它，我就可以开始写语法分析的套路代码：
```ts
class Parser {
    // ...

    private unary(): IExpr {
        if (this.match('!')) {
            const operator = this.previous();
            const expr = this.unary(); // 右结合
            return new UnaryExpr(operator, expr);
        }
        return this.call(); // 替换一行
    }

    private call(): IExpr {
        let expr = this.primary();
        while (this.match('(')) {
            let args: IExpr[] = [];
            if (!this.match(')')) {
                args = this.arguments();
                this.consume(')', 'Expect ")" end fun call.');
            }
            expr = new CallExpr(expr, args);
        }
        return expr;
    }

    private arguments(): IExpr[] {
        const args: IExpr[] = [];
        do {
            args.push(this.expression());
        } while(this.match(','));
        return args;
    }

    // ...
}
```


下面是 type 版：
```ts
type ParseCall<Tokens extends Token[], CR = ParsePrimary<Tokens>> =
    CR extends ParseExprSuccess<infer Callee, infer Rest>
        ? Rest extends Match<TokenLike<'('>, infer Rest>
            ? Rest extends Match<TokenLike<')'>, infer Rest>
                ? ParseCall<Rest, ParseExprSuccess<BuildCallExpr<Callee, []>, Rest>>
                : ParseArgs<Rest> extends infer AR
                    ? AR extends ParseArgsSuccess<infer Args, infer Rest>
                        ? Rest extends Match<TokenLike<')'>, infer Rest>
                            ? ParseCall<Rest, ParseExprSuccess<BuildCallExpr<Callee, Args>, Rest>>
                            : ParseExprError<'Expect ")" after call.'>
                        : AR // error
                    : NoWay<'ParseCall-ParseArgs'>
            : CR // not match more '('
        : CR; // error

type ParseArgsSuccess<R extends Expr[], T extends Token[]> = SuccessResult<{ args: R, rest: T }>;
type ParseArgs<Tokens extends Token[], Args extends Expr[] = []> =
    ParseExpr<Tokens> extends infer AE
        ? AE extends ParseExprSuccess<infer Arg, infer Rest>
            ? Rest extends Match<TokenLike<','>, infer Rest>
                ? ParseArgs<Rest, Push<Args, Arg>>
                : ParseArgsSuccess<Push<Args, Arg>, Rest>
            : AE // error
        : NoWay<'ParseArgs-ParseExpr'>;
```


下面该处理执行了。`call` 表达式执行时，先要对参数进行求值，因为参数也是表达式。参数求值的过程中，环境是 `call` 表达式所处的环境。函数体执行的时候，新建了一个环境。要注意的是，这个新建环境的外部环境不是 `call` 表达式所处的环境，而是函数对象生成时所处的环境。这个环境存储在函数对象中。另外实参与形参的绑定，就是在新环境中。即按照形参列表来定义变量，变量的值是实参的值。函数体执行完成之后，环境要回到 `call` 表达式所处的环境。

函数体执行的代码和块语句执行的代码高度相似，所以抽出一个 `executeBlock` 函数来复用：
```ts
class Interpreter implements IExprVisitor<unknown>, IStmtVisitor<unknown> {
    // ...

    visitBlockStmt(blockStmt: BlockStmt): ValueType {
        const result = this.executeBlock(blockStmt, new Environment(this.environment));
        return result;
    }

    executeBlock(blockStmt: BlockStmt, env: Environment): ValueType {
        const previousEnv = this.environment;

        try {
            this.environment = env;

            let lastResult: ValueType = null;
            for (const stmt of blockStmt.stmts) {
                lastResult = stmt.accept(this);
            }
            return lastResult;
        } finally {
            this.environment = previousEnv;
        }
    }

    // ...
}
```


另外我们把函数执行的核心代码抽一个函数 `execute`， 放到 `FunObject` 中去，这样 `visitFunStmt` 就很简单了：
```ts
class Interpreter implements IExprVisitor<unknown>, IStmtVisitor<unknown> {
    // ...

    visitCallExpr(expr: CallExpr): ValueType {
        const callee = expr.callee.accept(this);

        // 只有函数对象才能被调用
        if (callee instanceof FunObject) {
            return callee.execute(expr.args, this);
        }

        throw new RuntimeError(`Callee must be a 'FunObject', but got: ${callee}(${typeof callee})`);
    }

    // ...
}
```


最后我们看看 `execute` 的实现：
```ts
class FunObject {
    // ...

    execute(args: IExpr[], interpreter: Interpreter): ValueType {
        if (args.length !== this.declaration.parameters.length) {
            throw new RuntimeError('Arguments length not match parameters.');
        }

        const env = new Environment(this.environment);
        const parameters = this.declaration.parameters;
        for (let i = 0; i < args.length; i++) {
            const argValue = args[i].accept(interpreter);
            const param = parameters[i];
            env.define(param, argValue);
        }

        return interpreter.executeBlock(this.declaration.body, env);
    }

    // ...
}
```


以上，ts-toc 就完成了。

下面来看 type 版, 先要修改 `InterpretExpr`:
```ts
type InterpretExpr<E extends Expr, Env extends Environment> =
                        // ...
                        : E extends AssignExpr
                            ? EvalAssignExpr<E, Env>
                            // 新增开始
                            : E extends CallExpr
                                ? EvalCallExpr<E, Env>
                                // 新增结束
                                : RuntimeError<`Unknown expression type: ${E['type']}`>;

```

`EvalCallExpr` 函数的实现并不容易，特别是环境的处理：
```ts
type EvalCallExpr<
    E extends CallExpr,
    Env extends Environment,
    CV = InterpretExpr<E['callee'], Env>
> = CV extends InterpretExprSuccess<infer Callee, infer Env>
    ? Callee extends FunObject
        ? GetParamsLength<Callee> extends E['arguments']['length']
            ? InjectArgsToEnv<GetParams<Callee>, E['arguments'], Env, BuildEnv<{}, Callee['environment']>> extends infer EE
                ? EE extends InjectArgsToEnvSuccess<infer CallerEnv, infer FunScopeEnv>
                    ? InterpretBlockStmt<GetBodyStmts<Callee>, FunScopeEnv> extends infer BR
                        ? BR extends InterpretStmtSuccess<infer BV, infer Env>
                            ? InterpretStmtSuccess<BV, CallerEnv> // 函数body执行完要回到CallerEnv
                            : BR // error
                        : NoWay<'EvalCallExpr-InterpretBlockStmt'>
                    : EE // error
                : NoWay<'EvalCallExpr-InjectArgsToEnv'>
            : RuntimeError<'Arguments length not match parameters.'>
        : RuntimeError<`Callee must be a 'FunObject', but got: ${Safe<Callee, Exclude<ValueType, FunObject>>}`>
    : CV; // error

type GetParams<Callee extends FunObject> = Callee['declaration']['parameters'];
type GetParamsLength<Callee extends FunObject> = GetParams<Callee>['length'];
type GetBodyStmts<Callee extends FunObject> = Callee['declaration']['body']['stmts'];
```

其中要注意的不仅有注释写的 "函数body执行完要回到CallerEnv"。还要注意到最终要返回的 `CallerEnv` 是从哪里来的？它是从 `InjectArgsToEnv` 函数执行的结果中拿到的。为什么呢？前面说过，type 中没有变量，我们不能像 ts 版中，保留一个引用就可以了。环境在发生变化后，总是产生一个新的值。函数的实参是在 `InjectArgsToEnv` 中求值的，求值过程中有可能修改 `CallerEnv`，所以要返回它。为什么有可能修改 `CallerEnv`？因为实参中的表达式有可能包含赋值表达式。`InjectArgsToEnv` 返回的另一个环境是 `FunScopeEnv`，这个正是函数体执行需要的环境，它里面包含了形参变量对应的值（实参）。
```ts

type InjectArgsToEnv<
    Params extends Token[],
    Args extends Expr[],
    CallerEnv extends Environment,
    FunScopeEnv extends Environment,
> = Params extends [infer P1 extends TokenLike<{ type: 'identifier'}>, ...infer RestParams extends Token[]]
        ? Args extends [infer A1 extends Expr, ...infer RestArgs extends Expr[]]
            ? InterpretExpr<A1, CallerEnv> extends infer PV
                ? PV extends InterpretExprSuccess<infer V, infer CallerEnv>
                    ? EnvDefine<FunScopeEnv, P1['lexeme'], V> extends infer FunScopeEnv
                        ? FunScopeEnv extends Environment
                            ? InjectArgsToEnv<RestParams, RestArgs, CallerEnv, FunScopeEnv>
                            : FunScopeEnv // error
                        : NoWay<'InjectArgsToEnv-EnvDefine'>
                    : PV // error
                : NoWay<'InjectArgsToEnv-InterpretExpr'>
            : RuntimeError<'No way here, params and args must match here!'>
        : InjectArgsToEnvSuccess<CallerEnv, FunScopeEnv>;
type InjectArgsToEnvSuccess<
    CallerEnv extends Environment,
    FunScopeEnv extends Environment,
> = SuccessResult<{ callerEnv: CallerEnv, funScopeEnv: FunScopeEnv }>;
```


以上我们完成了函数调用！但是如果你用下面的代码去检验，却发现无法得到期待的结果：
```ts
fun fib(n) {
    if (n >= 2) {
        fib(n - 1) + fib(n - 2);
    } else {
        1;
    }
}

fib(3);
```

它并不是提示： `Type instantiation is excessively deep and possibly infinite.`

它的输出是： `[RuntimeError]: Undefined variable 'fib'."`

🤔❓怎么会这样？如果你多次实验，你会发现，我们实现的 `type-toc` 无法支持函数递归！！问题出在哪里呢？

问题出在 `FunScopeEnv` 上，它里面没有包含 `fib` 变量。所以递归的时候找不到自己。为什么会不包含自己呢？我们回到函数声明的执行函数：
```ts
type InterpretFunStmt<
    S extends FunStmt,
    Env extends Environment,
    F extends FunObject = BuildFunObj<S, Env>, // <--这里构建了 FunObject, 这里的 Env 没有包含函数对应的变量
> = EnvDefine<Env, S['name']['lexeme'], F> extends infer NewEnv // <--这里用构建好的 FunObject 产生了新的环境
    ? NewEnv extends Environment
        ? InterpretStmtSuccess<F, NewEnv>
        : NewEnv // error
    : NoWay<'InterpretFunStmt'>;
```

通过上面的代码，你会发现这个问题似乎无解：构建函数需要一个包含该函数的 Env 。没有变量的确是做不到的。这就是为什么相同的代码，`ts-toc` 没有这个问题。说到这里，`ts-toc` 和 `type-toc` 在这里有较大的差异，不仅仅是 `type-toc` 无法递归。请看下面的代码：
```ts
var a = 1;
fun test() { a + b; }
var b = 10;
test();
```

这段代码，`ts-toc` 执行的结果是 11；而 `type-toc` 报错说 `[RuntimeError]: Undefined variable 'b'."`。从这个行为来看也不能说谁对谁错，关键取决于语言设计者希望是哪个结果。类似上面的代码在 `js` 中会得到和 `ts-toc` 一样的[结果](https://www.typescriptlang.org/play?#code/DYUwLgBAhhC8EEYDcAoAZgVwHYGMwEsB7LCMEAZzAAoBKCAbwgCdwMmSYBqCAIyQgC+KUJB5xEABlQ5i5QqAB0wQgHMqZSrRpIgA)；但在 `C#` 中却是类似 `type-toc` 的[结果](https://dotnetfiddle.net/TAPdr5)。

我在这里更倾向于 `type-toc` 的行为。因为这样的代码更好理解和维护。但我不打算处理 `ts-toc` 在这里的不一致😂。我们还是回到 `type-toc` 无法递归的问题上。真的就实现不了递归了吗？

其实，我们可以在执行这边下功夫。执行函数体的时候，`FunScopeEnv` "注入"了函数的参数变量。我们在这个时候注入函数变量不行吗？当然是可以的。我们只需要将下面这句

```ts
? InjectArgsToEnv<GetParams<Callee>, E['arguments'], Env, BuildEnv<{}, Callee['environment']>> extends infer EE
```


替换为
```ts
? InjectArgsToEnv<GetParams<Callee>, E['arguments'], Env, BuildEnv<{ [k in GetFunName<Callee>]: Callee }, Callee['environment']>> extends infer EE
```


关键就是：
```ts
BuildEnv<{ [k in GetFunName<Callee>]: Callee }, Callee['environment']>
```


在构建函数体执行环境时，直接将函数的变量绑定进去。

的确，这样就实现了递归。可是改成这样以后，写很多简单且不递归的函数都会出现 `Type instantiation is excessively deep and possibly infinite.`，更别说递归的函数了。去掉递归支持后这些简单不递归的函数又都能正常执行了。我尝试了多种修改来支持递归，得到的效果一样。所以最后在 `toc` 仓库的[代码](https://github.com/huanguolin/toc/blob/9acb2e989a861620346d19d4b0f1779000ff0ccf/type-toc/interpreter/InterpretExpr.d.ts#L42)中，我把支持递归的代码注释掉了。如果你知道怎么解决这个问题，请务必告诉我，或者直接提 `pr`。

好了，虽然有些许遗憾，但我们最终完成了这个艰难的任务。我们用 TypeScript 的类型系统成功实现了一个 Toc 语言的解释器！这个类型体操终于谢幕，谢谢！

#### 2.2.7 未尽事宜

到最后，我们不仅有递归无法良好支持的遗憾。还有一些其他的未尽事宜。比如，函数没有 `return` 语句的支持，循环也不支持 `break`。如果要让这个语言更完善，这是一定要支持的。否则无法提前结束函数，或者循环，只能靠条件分支来绕，会很痛苦。它们是可以实现的，就是麻烦，需要像环境一样到处都带着，还要在一些关键路径去判断。

另外对错误的支持也很粗略，连行号信息也没有，程序长一点，就不好找到错误了。还有一个就是，没有复合数据类型，没有对象（或者至少有个 `struct`），数组这些现代语言的必须品。不过作为一次尝试，以现在的结果可以说明问题就可以。若真的要自己实现一个可玩的语言，应该不要选择 TypeScript 的类型系统 😂。

好了，如果你感兴趣去实现这些，欢迎提 `pr`。


## 3. 总结

最后，我们来总结一下。
首先我们围绕着 TypeScript 的类型系统是一门函数式语言，讨论了它提供的语言特性：

* 没有变量，有全局常量和局部常量。
* 有条件分支，还有模式匹配。
* 有函数，泛型参数就是函数入参，函数参数还支持限定类型和默认值。但函数不是 [First-Class-Function](https://en.wikipedia.org/wiki/First-class_function)。
* 没有循环，但可以通过函数的递归实现等价的效果。

接着我们围绕用 TypeScript 的类型系统实现 `Toc` 语言的解释器：
* 首先讨论了用 TypeScript 的类型系统怎么实现四则算术运算和比较运算。
* 接着实现解释器，按照词法分析、语法分析、执行三个阶段展开。为了方便理解，每次先用 TypeScript 来实现，之后再“翻译”为类型系统的实现。语法分析阶段，介绍了递归下降算法。执行阶段介绍了访问者模式。在实现中，我们掌握了表达式和语句的语法分析方法，作用域如何实现，函数以及闭包的实现方法。通过两种“语言”的对比实现，也了解到型系统作为语言来用时的不足。

好了，以上就是我要说的全部内容。希望你能喜欢。

> 由于自身的认知有限，以及时间上的仓促，其中还有很多的不足，甚至错误。欢迎大家讨论指正。


## 4. 参考

1. [*Crafting Interpreters*](http://craftinginterpreters.com)
2. [TypeScript 类型体操天花板，用类型运算写一个 Lisp 解释器](https://zhuanlan.zhihu.com/p/427309936?utm_campaign=shareopn&utm_medium=social&utm_oi=639544332005281792&utm_psn=1549037572080553985&utm_source=wechat_session)
3. [Implementing Arithmetic Within TypeScript’s Type System](https://itnext.io/implementing-arithmetic-within-typescripts-type-system-a1ef140a6f6f)
4. [How to Troubleshoot Types?](https://www.reddit.com/r/typescript/comments/sglwk6/how_to_troubleshoot_types/)
